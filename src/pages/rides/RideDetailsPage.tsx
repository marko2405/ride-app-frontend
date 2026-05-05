import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  acceptRide,
  cancelRide,
  completeRide,
  getRideById,
  startRide,
} from "../../api/rides/rides";
import RideStatusChip from "../../components/rides/RideStatusChip";
import { useUser } from "../../context/UserContext";
import RideRatingsCard from "../../modules/ratings/components/RideRatingsCard";
import type {
  RidePersonInfo,
  RideResponse,
  RideVehicleInfo,
} from "../../types/ride";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatMoney,
  formatRating,
  formatRideAddress,
  formatVehicleClass,
} from "../../utils/rideFormatters";

type MetricCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
};

function MetricCard({ icon, label, value, accent }: MetricCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        height: "100%",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.05)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              backgroundColor: alpha(accent, 0.1),
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0.75} sx={{ minWidth: 0, pt: 0.35 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {value}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

type SummaryRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function SummaryRow({ icon, label, value }: SummaryRowProps) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          backgroundColor: "rgba(250, 204, 21, 0.14)",
          color: "#b8860b",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.25}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={700}>{value}</Typography>
      </Stack>
    </Stack>
  );
}

type PersonCardProps = {
  title: string;
  person: RidePersonInfo;
  tone: "passenger" | "driver";
};

function PersonPanel({ title, person, tone }: PersonCardProps) {
  const initials = person.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const accent = tone === "passenger" ? "#d4a017" : "#b8860b";

  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: 4,
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(accent, 0.09)} 0%, rgba(255,255,255,0.96) 100%)`,
        border: "1px solid rgba(148, 163, 184, 0.14)",
      }}
    >
      <Stack spacing={1.75}>
        <Typography variant="subtitle2" fontWeight={800}>
          {title}
        </Typography>

        <Stack direction="row" spacing={1.75} alignItems="center">
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: alpha(accent, 0.12),
              color: accent,
              fontWeight: 800,
              fontSize: 19,
              flexShrink: 0,
            }}
          >
            {initials || <PersonRoundedIcon />}
          </Avatar>
          <Stack spacing={0.45} sx={{ minWidth: 0 }}>
            <Typography variant="h6" fontWeight={800} noWrap>
              {person.fullName}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: 19 }} />
              <Typography color="text.secondary" fontWeight={600}>
                {formatRating(person.averageRating, person.totalRatings)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

function VehicleCard({ vehicle }: { vehicle: RideVehicleInfo }) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        height: "100%",
        border: "1px solid rgba(148, 163, 184, 0.18)",
        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" fontWeight={800}>
            Vehicle
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
                label="Class"
                value={formatVehicleClass(vehicle.vehicleClass)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
                label="Brand"
                value={vehicle.carBrand}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
                label="Model"
                value={vehicle.carModel}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<InfoRoundedIcon fontSize="small" />}
                label="Color"
                value={vehicle.carColor}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<InfoRoundedIcon fontSize="small" />}
                label="Plate number"
                value={vehicle.plateNumber}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <SummaryRow
                icon={<PersonRoundedIcon fontSize="small" />}
                label="Seats"
                value={`${vehicle.seats}`}
              />
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
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
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    void loadRide();
  }, [loadRide]);

  const isDriver = user?.role === "DRIVER";
  const isAssignedDriver =
    isDriver && !!ride && ride.driverId !== null && ride.driverId === user.id;
  const isRequestedPreviewForDriver =
    isDriver && !!ride && ride.status === "REQUESTED" && ride.driverId === null;

  const availableActions = useMemo(() => {
    if (!ride || !isDriver) {
      return [];
    }

    const actions: Array<{
      key: "accept" | "start" | "complete" | "cancel";
      label: string;
      variant: "contained" | "outlined";
    }> = [];

    if (ride.status === "REQUESTED") {
      actions.push({
        key: "accept",
        label: "Accept Ride",
        variant: "contained",
      });
    }

    if (ride.status === "ACCEPTED" && isAssignedDriver) {
      actions.push({ key: "start", label: "Start Ride", variant: "contained" });
    }

    if (ride.status === "IN_PROGRESS" && isAssignedDriver) {
      actions.push({
        key: "complete",
        label: "Complete Ride",
        variant: "contained",
      });
    }

    if (
      ride.status !== "COMPLETED" &&
      ride.status !== "CANCELLED" &&
      isAssignedDriver
    ) {
      actions.push({
        key: "cancel",
        label: "Cancel Ride",
        variant: "outlined",
      });
    }

    return actions;
  }, [isAssignedDriver, isDriver, ride]);

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
    } catch (actionError) {
      setError(getApiErrorMessage(actionError));
    } finally {
      setActionLoading(null);
    }
  };

  const backPath =
    isDriver && ride?.status === "REQUESTED" && !isAssignedDriver
      ? "/driver/rides/available"
      : isDriver
        ? "/driver/rides"
        : "/rides";

  const headlineMessage = useMemo(() => {
    if (!ride) {
      return "";
    }

    if (isRequestedPreviewForDriver) {
      return "Review the rider and trip summary before deciding whether to accept the request.";
    }

    if (!isDriver && (!ride.driverInfo || !ride.vehicleInfo)) {
      return "Driver and vehicle details will appear here as soon as the ride is assigned.";
    }

    if (ride.status === "COMPLETED") {
      return "This trip is completed. You can review the final summary and ratings below.";
    }

    return "A compact overview of the trip, people involved, and the current ride state.";
  }, [isDriver, isRequestedPreviewForDriver, ride]);

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
      <Card
        sx={{
          borderRadius: 6,
          overflow: "hidden",
          border: "1px solid rgba(184, 134, 11, 0.18)",
          background:
            "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
          color: "#3a2a06",
          boxShadow: "0 26px 60px rgba(180, 138, 9, 0.16)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <IconButton
                    onClick={() => navigate(backPath)}
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: "rgba(255,255,255,0.32)",
                    }}
                  >
                    <ArrowBackRoundedIcon />
                  </IconButton>
                  <Typography variant="h4" fontWeight={800}>
                    Ride Details
                  </Typography>
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.25}
                  useFlexGap
                  flexWrap="wrap"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <RideStatusChip status={ride.status} />
                  <Typography
                    sx={{ color: "rgba(58,42,6,0.82)" }}
                    fontWeight={600}
                  >
                    Ride ID: #{ride.id}
                  </Typography>
                  <Typography
                    sx={{ color: "rgba(58,42,6,0.82)" }}
                    fontWeight={600}
                  >
                    Requested: {formatDateTime(ride.createdAt)}
                  </Typography>
                </Stack>

                <Typography sx={{ maxWidth: 720, color: "rgba(58,42,6,0.84)" }}>
                  {headlineMessage}
                </Typography>
              </Stack>

              {isDriver && availableActions.length > 0 && (
                <Stack
                  direction={{ xs: "column", sm: "row", md: "column", xl: "row" }}
                  spacing={1.25}
                  sx={{
                    alignSelf: { xs: "stretch", md: "flex-start" },
                    alignItems: { xs: "stretch", sm: "flex-start" },
                  }}
                >
                  {availableActions.map((action) => {
                    const isCancel = action.key === "cancel";

                    return (
                      <Button
                        key={action.key}
                        variant="contained"
                        size="large"
                        disabled={actionLoading !== null}
                        onClick={() => void handleDriverAction(action.key)}
                        sx={{
                          minWidth: 180,
                          py: 1.25,
                          px: 2.5,
                          borderRadius: 999,
                          background: isCancel
                            ? "rgba(239, 68, 68, 0.16)"
                            : "rgba(255,255,255,0.28)",
                          color: isCancel ? "#7f1d1d" : "#3a2a06",
                          border: isCancel
                            ? "1px solid rgba(185, 28, 28, 0.28)"
                            : "1px solid rgba(58,42,6,0.12)",
                          boxShadow: isCancel
                            ? "0 12px 22px rgba(185, 28, 28, 0.12)"
                            : "0 14px 24px rgba(180, 138, 9, 0.12)",
                          "&:hover": {
                            background: isCancel
                              ? "rgba(239, 68, 68, 0.24)"
                              : "rgba(255,255,255,0.38)",
                          },
                          "&.Mui-disabled": {
                            background: isCancel
                              ? "rgba(239, 68, 68, 0.1)"
                              : "rgba(255,255,255,0.18)",
                            color: isCancel
                              ? "rgba(127, 29, 29, 0.46)"
                              : "rgba(58,42,6,0.46)",
                          },
                        }}
                      >
                        {actionLoading === action.key
                          ? "Please wait..."
                          : action.label}
                      </Button>
                    );
                  })}
                </Stack>
              )}
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                  icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
                  label="Vehicle class"
                  value={formatVehicleClass(ride.vehicleClass)}
                  accent="#b8860b"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                  icon={<PaymentsRoundedIcon fontSize="small" />}
                  label="Total price"
                  value={formatMoney(ride.totalPrice, ride.currency)}
                  accent="#d4a017"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                  icon={<RouteRoundedIcon fontSize="small" />}
                  label="Distance"
                  value={formatDistance(ride.distanceMeters)}
                  accent="#c19a08"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <MetricCard
                  icon={<AccessTimeRoundedIcon fontSize="small" />}
                  label="Duration"
                  value={formatDuration(ride.durationSeconds)}
                  accent="#a67c00"
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card
            sx={{
              borderRadius: 5,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 3.5 }, height: "100%" }}>
              <Stack spacing={2.5}>
                <Typography variant="h5" fontWeight={800}>
                  Ride Summary
                </Typography>
                <Divider />
                <Stack spacing={2}>
                  <SummaryRow
                    icon={<CalendarMonthRoundedIcon fontSize="small" />}
                    label="Scheduled for"
                    value={formatDateTime(ride.scheduledFor)}
                  />
                  <SummaryRow
                    icon={<CalendarMonthRoundedIcon fontSize="small" />}
                    label="Requested"
                    value={formatDateTime(ride.createdAt)}
                  />
                  <SummaryRow
                    icon={<AccessTimeRoundedIcon fontSize="small" />}
                    label="Last updated"
                    value={formatDateTime(ride.updatedAt)}
                  />
                  <SummaryRow
                    icon={<RouteRoundedIcon fontSize="small" />}
                    label="Pickup"
                    value={formatRideAddress(ride.pickupAddress)}
                  />
                  <SummaryRow
                    icon={<RouteRoundedIcon fontSize="small" />}
                    label="Dropoff"
                    value={formatRideAddress(ride.dropoffAddress)}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <Card
            sx={{
              borderRadius: 5,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 3.5 }, height: "100%" }}>
              <Stack spacing={2.5} sx={{ height: "100%" }}>
                <Typography variant="h5" fontWeight={800}>
                  Trip Context
                </Typography>
                <Divider />
                <Grid container spacing={2}>
                  {ride.passengerInfo && (
                    <Grid size={{ xs: 12, md: ride.driverInfo ? 6 : 12 }}>
                      <PersonPanel
                        title="Passenger"
                        person={ride.passengerInfo}
                        tone="passenger"
                      />
                    </Grid>
                  )}

                  {!isRequestedPreviewForDriver && ride.driverInfo && (
                    <Grid size={{ xs: 12, md: ride.passengerInfo ? 6 : 12 }}>
                      <PersonPanel
                        title="Driver"
                        person={ride.driverInfo}
                        tone="driver"
                      />
                    </Grid>
                  )}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2.25,
                        borderRadius: 4,
                        background:
                          "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
                        color: "#3a2a06",
                      }}
                    >
                      <SummaryRow
                        icon={
                          <DirectionsCarFilledRoundedIcon fontSize="small" />
                        }
                        label="Ride type"
                        value={`${formatVehicleClass(ride.vehicleClass)} trip`}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2.25,
                        borderRadius: 4,
                        background:
                          "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
                        color: "#3a2a06",
                      }}
                    >
                      <SummaryRow
                        icon={<InfoRoundedIcon fontSize="small" />}
                        label="Current state"
                        value={
                          isRequestedPreviewForDriver
                            ? "Waiting for a driver to accept the request."
                            : ride.driverInfo
                              ? "Driver has been assigned to this trip."
                              : "The trip is pending assignment."
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12 }}></Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {!isRequestedPreviewForDriver && ride.vehicleInfo && (
          <Grid size={{ xs: 12 }}>
            <VehicleCard vehicle={ride.vehicleInfo} />
          </Grid>
        )}

        {!isRequestedPreviewForDriver &&
          (!ride.driverInfo || !ride.vehicleInfo) &&
          !isDriver && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info">Driver not assigned yet.</Alert>
            </Grid>
          )}

        {ride.status === "COMPLETED" && (
          <Grid size={{ xs: 12 }}>
            <RideRatingsCard
              ride={ride}
              currentUser={user}
              onRatingCreated={loadRide}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
