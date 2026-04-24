import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { AxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDriverRides, getMyRides } from "../api/rides/rides";
import RideStatusChip from "../components/rides/RideStatusChip";
import { useUser } from "../context/UserContext";
import UserRatingSummaryCard from "../modules/ratings/components/UserRatingSummaryCard";
import type { RideResponse } from "../types/ride";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatMoney,
  formatRating,
  formatVehicleClass,
} from "../utils/rideFormatters";

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

const activeStatusRank: Record<string, number> = {
  IN_PROGRESS: 0,
  ACCEPTED: 1,
  REQUESTED: 2,
};

type StatPanelProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
};

function StatPanel({ label, value, icon, accent }: StatPanelProps) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        height: "100%",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.05)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.25}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              backgroundColor: alpha(accent, 0.1),
              color: accent,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();
  const ridesPath = user?.role === "DRIVER" ? "/driver/rides" : "/rides";
  const [rides, setRides] = useState<RideResponse[]>([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [ridesError, setRidesError] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const loadRides = async () => {
      try {
        setRidesLoading(true);
        setRidesError("");
        const response =
          user.role === "DRIVER" ? await getMyDriverRides() : await getMyRides();
        setRides(response);
      } catch (loadError) {
        setRidesError(getErrorMessage(loadError, "Failed to load ride activity."));
      } finally {
        setRidesLoading(false);
      }
    };

    void loadRides();
  }, [user]);

  const currentRide = useMemo(() => {
    return rides
      .filter((ride) => ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(ride.status))
      .sort((first, second) => {
        const statusDiff =
          activeStatusRank[first.status] - activeStatusRank[second.status];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        return (
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
        );
      })[0];
  }, [rides]);

  const completedRidesCount = useMemo(() => {
    return rides.filter((ride) => ride.status === "COMPLETED").length;
  }, [rides]);

  const latestRideCounterparty = useMemo(() => {
    if (!currentRide) {
      return user?.role === "DRIVER"
        ? "No passenger assigned"
        : "Waiting for driver";
    }

    if (user?.role === "DRIVER") {
      return currentRide.passengerInfo.fullName;
    }

    return currentRide.driverInfo?.fullName ?? "Waiting for driver";
  }, [currentRide, user?.role]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={3.5}>
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #0f766e 100%)",
          color: "white",
          boxShadow: "0 26px 58px rgba(15, 23, 42, 0.16)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={1.5}>
                <Typography variant="overline" sx={{ opacity: 0.74, letterSpacing: 1.6 }}>
                  {user?.role === "DRIVER" ? "Driver Dashboard" : "Passenger Dashboard"}
                </Typography>
                <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 760 }}>
                  {user?.role === "DRIVER"
                    ? `Welcome back, ${user?.firstName}. Keep an eye on assigned trips and incoming requests.`
                    : `Welcome back, ${user?.firstName}. Your next trip and account activity are all in one place.`}
                </Typography>
                <Typography sx={{ maxWidth: 720, opacity: 0.84 }}>
                  {user?.role === "DRIVER"
                    ? "See your current ride, check passenger details when available, and move quickly between assigned and available requests."
                    : "Check your current trip, review recent ride activity, and jump back into booking whenever you need a ride."}
                </Typography>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() =>
                    navigate(user?.role === "DRIVER" ? "/driver/rides/available" : "/rides/new")
                  }
                  sx={{ py: 1.4 }}
                >
                  {user?.role === "DRIVER" ? "View available rides" : "Book a ride"}
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: "white", borderColor: "rgba(255,255,255,0.35)", py: 1.4 }}
                  onClick={() => navigate(ridesPath)}
                >
                  Open my rides
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label="Current ride"
            value={currentRide ? `#${currentRide.id}` : "No active ride"}
            icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
            accent="#2563eb"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label={user?.role === "DRIVER" ? "Current passenger" : "Current driver"}
            value={latestRideCounterparty}
            icon={<StarRoundedIcon fontSize="small" />}
            accent="#7c3aed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label="Completed rides"
            value={`${completedRidesCount}`}
            icon={<ScheduleRoundedIcon fontSize="small" />}
            accent="#0f766e"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label="Account role"
            value={user?.role ?? "-"}
            icon={<PaymentsRoundedIcon fontSize="small" />}
            accent="#ea580c"
          />
        </Grid>
      </Grid>

      {ridesError && <Alert severity="error">{ridesError}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Stack spacing={2.75} sx={{ height: "100%" }}>
                <Stack spacing={0.75}>
                  <Typography variant="h6" fontWeight={800}>
                    Current ride overview
                  </Typography>
                  <Typography color="text.secondary">
                    The most relevant active ride is shown here when one exists.
                  </Typography>
                </Stack>

                {ridesLoading ? (
                  <Stack direction="row" spacing={1.5} alignItems="center" py={4}>
                    <CircularProgress size={22} />
                    <Typography color="text.secondary">
                      Loading your ride activity...
                    </Typography>
                  </Stack>
                ) : currentRide ? (
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Typography variant="h4" fontWeight={800}>
                            Ride #{currentRide.id}
                          </Typography>
                          <RideStatusChip status={currentRide.status} />
                        </Stack>
                        <Typography color="text.secondary">
                          {user?.role === "DRIVER"
                            ? `Passenger: ${currentRide.passengerInfo.fullName}`
                            : currentRide.driverInfo
                              ? `Driver: ${currentRide.driverInfo.fullName}`
                              : "Driver has not been assigned yet."}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Vehicle class
                            </Typography>
                            <Typography fontWeight={700}>
                              {formatVehicleClass(currentRide.vehicleClass)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Total price
                            </Typography>
                            <Typography fontWeight={700}>
                              {formatMoney(currentRide.totalPrice, currentRide.currency)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Distance
                            </Typography>
                            <Typography fontWeight={700}>
                              {formatDistance(currentRide.distanceMeters)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                              Duration
                            </Typography>
                            <Typography fontWeight={700}>
                              {formatDuration(currentRide.durationSeconds)}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="body2" color="text.secondary">
                              Scheduled for
                            </Typography>
                            <Typography fontWeight={700}>
                              {formatDateTime(currentRide.scheduledFor)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                      <Box
                        sx={{
                          height: "100%",
                          p: 2.5,
                          borderRadius: 4,
                          background:
                            "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(255,255,255,1) 100%)",
                          border: "1px solid rgba(148, 163, 184, 0.14)",
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Typography fontWeight={800}>
                            {user?.role === "DRIVER" ? "Passenger snapshot" : "Driver snapshot"}
                          </Typography>
                          <Typography color="text.secondary">
                            {user?.role === "DRIVER"
                              ? formatRating(
                                  currentRide.passengerInfo.averageRating,
                                  currentRide.passengerInfo.totalRatings,
                                )
                              : currentRide.driverInfo
                                ? formatRating(
                                    currentRide.driverInfo.averageRating,
                                    currentRide.driverInfo.totalRatings,
                                  )
                                : "No driver details yet"}
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={() => navigate(`/rides/${currentRide.id}`)}
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                          >
                            View details
                          </Button>
                        </Stack>
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Stack spacing={1.5}>
                    <Typography color="text.secondary">
                      {user?.role === "DRIVER"
                        ? "You do not have an active assigned ride right now."
                        : "You do not have an active ride right now."}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate(user?.role === "DRIVER" ? "/driver/rides/available" : "/rides/new")
                      }
                      sx={{ alignSelf: "flex-start" }}
                    >
                      {user?.role === "DRIVER" ? "View available rides" : "Book a ride"}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          {user && <UserRatingSummaryCard userId={user.id} />}
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>
                  Account snapshot
                </Typography>
                <Typography color="text.secondary">
                  Basic account information currently available in the app.
                </Typography>
                <Stack spacing={1.25}>
                  {[
                    {
                      label: "Name",
                      value: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
                    },
                    { label: "Email", value: user?.email ?? "-" },
                    { label: "Username", value: user?.username ?? "-" },
                    { label: "Role", value: user?.role ?? "-" },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(248, 250, 252, 0.95)",
                        border: "1px solid rgba(148, 163, 184, 0.14)",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography fontWeight={700}>{item.value}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 2,
              height: "100%",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>
                  Quick actions
                </Typography>
                <Typography color="text.secondary">
                  Jump directly to the area you are most likely to need next.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button variant="contained" onClick={() => navigate(ridesPath)}>
                    Open my rides
                  </Button>
                  <Button variant="outlined" onClick={() => navigate("/profile")}>
                    Open profile
                  </Button>
                  <Button variant="text" onClick={() => navigate("/ratings")}>
                    View ratings
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
