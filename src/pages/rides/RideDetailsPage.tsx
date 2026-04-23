import { AxiosError } from "axios";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  acceptRide,
  cancelRide,
  completeRide,
  getRideById,
  startRide,
} from "../../api/rides/rides";
import RideSummaryCard from "../../components/rides/RideSummaryCard";
import { useUser } from "../../context/UserContext";
import RideRatingsCard from "../../modules/ratings/components/RideRatingsCard";
import type { RideResponse } from "../../types/ride";
import {
  formatCoordinate,
  formatDateTime,
  formatDistanceKm,
  formatDuration,
  formatPrice,
} from "../../utils/rideFormatters";

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

type DetailRowProps = {
  label: string;
  value: string | number;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  );
}

export default function RideDetailsPage() {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const { user } = useUser();
  const [ride, setRide] = useState<RideResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<null | string>(null);

  const loadRide = useCallback(async () => {
    if (!rideId || Number.isNaN(Number(rideId))) {
      setError("Ride id is invalid.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getRideById(Number(rideId));
      setRide(response);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load ride details."));
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    void loadRide();
  }, [loadRide]);

  const isAssignedDriver =
    user?.role === "DRIVER" && !!ride && ride.driverId === user.id;

  const availableActions = useMemo(() => {
    if (!ride || user?.role !== "DRIVER") {
      return [];
    }

    const actions: Array<{
      key: "accept" | "start" | "complete" | "cancel";
      label: string;
      variant: "contained" | "outlined";
    }> = [];

    if (ride.status === "REQUESTED") {
      actions.push({ key: "accept", label: "Accept ride", variant: "contained" });
    }

    if (ride.status === "ACCEPTED" && isAssignedDriver) {
      actions.push({ key: "start", label: "Start ride", variant: "contained" });
    }

    if (ride.status === "IN_PROGRESS" && isAssignedDriver) {
      actions.push({
        key: "complete",
        label: "Complete ride",
        variant: "contained",
      });
    }

    if (
      ride.status !== "COMPLETED" &&
      ride.status !== "CANCELLED" &&
      isAssignedDriver
    ) {
      actions.push({ key: "cancel", label: "Cancel ride", variant: "outlined" });
    }

    return actions;
  }, [isAssignedDriver, ride, user?.role]);

  const handleDriverAction = async (
    action: "accept" | "start" | "complete" | "cancel",
  ) => {
    if (!ride) {
      return;
    }

    const actionMap = {
      accept: acceptRide,
      start: startRide,
      complete: completeRide,
      cancel: cancelRide,
    };

    const successMap = {
      accept: `Ride #${ride.id} was accepted successfully.`,
      start: `Ride #${ride.id} is now in progress.`,
      complete: `Ride #${ride.id} was completed successfully.`,
      cancel: `Ride #${ride.id} was cancelled successfully.`,
    };

    try {
      setActionLoading(action);
      setError("");
      setSuccess("");
      const updatedRide = await actionMap[action](ride.id);
      setRide(updatedRide);
      setSuccess(successMap[action]);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to update ride status."));
    } finally {
      setActionLoading(null);
    }
  };

  const backPath = user?.role === "DRIVER" ? "/driver/rides" : "/rides";

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error && !ride) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error}</Alert>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => void loadRide()}>
            Retry
          </Button>
          <Button variant="text" onClick={() => navigate(backPath)}>
            Back to rides
          </Button>
        </Stack>
      </Stack>
    );
  }

  if (!ride) {
    return (
      <Alert severity="info">
        Ride details are not available at the moment.
      </Alert>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            Ride #{ride.id}
          </Typography>
          <Typography color="text.secondary">
            Full booking data returned by the backend for this ride request.
          </Typography>
        </Stack>
        <Button variant="outlined" onClick={() => navigate(backPath)}>
          Back to rides
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <RideSummaryCard ride={ride} />

      <RideRatingsCard ride={ride} currentUser={user} />

      {user?.role === "DRIVER" && availableActions.length > 0 && (
        <Card sx={{ borderRadius: 5 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Typography variant="h6" fontWeight={700}>
                Driver actions
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {availableActions.map((action) => (
                  <Button
                    key={action.key}
                    variant={action.variant}
                    disabled={actionLoading !== null}
                    onClick={() => void handleDriverAction(action.key)}
                  >
                    {actionLoading === action.key ? "Please wait..." : action.label}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      <Card sx={{ borderRadius: 5 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Full details
            </Typography>

            <Divider />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <DetailRow
                  label="Pickup coordinates"
                  value={`${formatCoordinate(ride.pickupLat)}, ${formatCoordinate(ride.pickupLng)}`}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DetailRow
                  label="Dropoff coordinates"
                  value={`${formatCoordinate(ride.dropoffLat)}, ${formatCoordinate(ride.dropoffLng)}`}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow label="Vehicle class" value={ride.vehicleClass} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow label="Status" value={ride.status} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Scheduled for"
                  value={formatDateTime(ride.scheduledFor)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Distance"
                  value={formatDistanceKm(ride.distanceMeters)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Duration"
                  value={formatDuration(ride.durationSeconds)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Base price"
                  value={formatPrice(ride.basePrice, ride.currency)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Distance price"
                  value={formatPrice(ride.distancePrice, ride.currency)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Total price"
                  value={formatPrice(ride.totalPrice, ride.currency)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow label="Currency" value={ride.currency} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow label="Passenger id" value={ride.passengerId} />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <DetailRow
                  label="Driver id"
                  value={ride.driverId ?? "Not assigned"}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DetailRow
                  label="Created at"
                  value={formatDateTime(ride.createdAt)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <DetailRow
                  label="Updated at"
                  value={formatDateTime(ride.updatedAt)}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
