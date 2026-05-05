import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
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
import { getUserRatingSummary } from "../modules/ratings/services/rating.service";
import type { UserRatingSummaryResponse } from "../modules/ratings/types/rating.types";
import type { RidePersonInfo, RideResponse } from "../types/ride";
import { getApiErrorMessage } from "../utils/apiError";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatMoney,
  formatRating,
  formatVehicleClass,
} from "../utils/rideFormatters";

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
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 42,
              height: 42,
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
          <Stack spacing={0.75} sx={{ minWidth: 0, pt: 0.25 }}>
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

type CounterpartySnapshotProps = {
  title: string;
  person: RidePersonInfo | null;
  emptyText: string;
  onViewDetails: () => void;
};

function CounterpartySnapshot({
  title,
  person,
  emptyText,
  onViewDetails,
}: CounterpartySnapshotProps) {
  const [summary, setSummary] = useState<UserRatingSummaryResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!person) {
      setSummary(null);
      return;
    }

    const loadSummary = async () => {
      try {
        setLoading(true);
        const response = await getUserRatingSummary(person.id);
        setSummary(response);
      } catch {
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, [person]);

  const totalRatings = summary?.totalRatings ?? person?.totalRatings ?? 0;

  return (
    <Box
      sx={{
        height: "100%",
        p: 2.5,
        borderRadius: 4,
        background:
          "linear-gradient(135deg, rgba(250,204,21,0.16) 0%, rgba(255,253,247,1) 100%)",
        border: "1px solid rgba(212, 160, 23, 0.16)",
      }}
    >
      <Stack spacing={1.7}>
        <Typography fontWeight={800}>{title}</Typography>

        {person ? (
          <>
            <Stack spacing={0.4}>
              <Typography variant="h6" fontWeight={800}>
                {person.fullName}
              </Typography>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <StarRoundedIcon sx={{ color: "#f59e0b", fontSize: 19 }} />
                <Typography color="text.secondary" fontWeight={600}>
                  {formatRating(person.averageRating, person.totalRatings)}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={0.8}>
              {[5, 4, 3, 2, 1].map((score) => {
                const count = summary?.breakdown[String(score)] ?? 0;
                const percent =
                  totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                return (
                  <Stack
                    key={score}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{ width: 24, fontWeight: 800, color: "#8a6708" }}
                    >
                      {score}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={loading ? 0 : percent}
                      sx={{
                        flex: 1,
                        height: 7,
                        borderRadius: 999,
                        bgcolor: "rgba(212, 160, 23, 0.14)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 999,
                          bgcolor: "#d4a017",
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ width: 24, textAlign: "right", fontWeight: 700 }}
                    >
                      {loading ? "-" : count}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>
          </>
        ) : (
          <Typography color="text.secondary">{emptyText}</Typography>
        )}

        <Button
          variant="contained"
          onClick={onViewDetails}
          sx={{ alignSelf: "flex-start", mt: 0.5 }}
        >
          View details
        </Button>
      </Stack>
    </Box>
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
          user.role === "DRIVER"
            ? await getMyDriverRides()
            : await getMyRides();
        setRides(response);
      } catch (loadError) {
        setRidesError(getApiErrorMessage(loadError));
      } finally {
        setRidesLoading(false);
      }
    };

    void loadRides();
  }, [user]);

  const currentRide = useMemo(() => {
    return rides
      .filter((ride) =>
        ["REQUESTED", "ACCEPTED", "IN_PROGRESS"].includes(ride.status),
      )
      .sort((first, second) => {
        const statusDiff =
          activeStatusRank[first.status] - activeStatusRank[second.status];

        if (statusDiff !== 0) {
          return statusDiff;
        }

        return (
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime()
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
            "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
          color: "#3a2a06",
          boxShadow: "0 22px 44px rgba(180, 138, 9, 0.16)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="overline"
                  sx={{ opacity: 0.74, letterSpacing: 1.6 }}
                >
                  {user?.role === "DRIVER"
                    ? "Driver Dashboard"
                    : "Passenger Dashboard"}
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  sx={{ maxWidth: 760 }}
                >
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
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() =>
                    navigate(
                      user?.role === "DRIVER"
                        ? "/driver/rides/available"
                        : "/rides/new",
                    )
                  }
                  sx={{
                    py: 1.55,
                    background:
                      "linear-gradient(135deg, #f8e58f 0%, #e9b807 100%)",
                    color: "#3a2a06",
                    boxShadow: "0 12px 22px rgba(250, 204, 21, 0.18)",
                  }}
                >
                  {user?.role === "DRIVER"
                    ? "View available rides"
                    : "Book a ride"}
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: "#3a2a06",
                    borderColor: "rgba(58,42,6,0.22)",
                    py: 1.4,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    "&:hover": {
                      borderColor: "rgba(58,42,6,0.34)",
                      backgroundColor: "rgba(255,255,255,0.28)",
                    },
                  }}
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
            accent="#d4a017"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label={
              user?.role === "DRIVER" ? "Current passenger" : "Current driver"
            }
            value={latestRideCounterparty}
            icon={<StarRoundedIcon fontSize="small" />}
            accent="#b8860b"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label="Completed rides"
            value={`${completedRidesCount}`}
            icon={<ScheduleRoundedIcon fontSize="small" />}
            accent="#8a6708"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatPanel
            label="Account role"
            value={user?.role ?? "-"}
            icon={<PaymentsRoundedIcon fontSize="small" />}
            accent="#c99500"
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
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    py={4}
                  >
                    <CircularProgress size={22} />
                    <Typography color="text.secondary">
                      Loading your ride activity...
                    </Typography>
                  </Stack>
                ) : currentRide ? (
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
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
                              {formatMoney(
                                currentRide.totalPrice,
                                currentRide.currency,
                              )}
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
                      <CounterpartySnapshot
                        title={
                          user?.role === "DRIVER"
                            ? "Passenger snapshot"
                            : "Driver snapshot"
                        }
                        person={
                          user?.role === "DRIVER"
                            ? currentRide.passengerInfo
                            : currentRide.driverInfo
                        }
                        emptyText="No driver details yet"
                        onViewDetails={() =>
                          navigate(`/rides/${currentRide.id}`)
                        }
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Stack spacing={1.5}>
                    <Typography color="text.secondary">
                      {user?.role === "DRIVER"
                        ? "You do not have an active assigned ride right now."
                        : "You do not have an active ride right now."}
                    </Typography>
                    <Typography color="text.secondary">
                      Use the main action at the top of the dashboard to
                      continue.
                    </Typography>
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
                  Account information
                </Typography>
                <Grid container spacing={1.25}>
                  {[
                    {
                      label: "Name",
                      value:
                        `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
                      icon: <PersonRoundedIcon fontSize="small" />,
                    },
                    {
                      label: "Email",
                      value: user?.email ?? "-",
                      icon: <MailOutlineRoundedIcon fontSize="small" />,
                    },
                    {
                      label: "Username",
                      value: user?.username ?? "-",
                      icon: <AlternateEmailRoundedIcon fontSize="small" />,
                    },
                    {
                      label: "Role",
                      value: user?.role ?? "-",
                      icon: <BadgeRoundedIcon fontSize="small" />,
                    },
                  ].map((item) => (
                    <Grid key={item.label} size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          height: "100%",
                          px: 2,
                          py: 1.65,
                          borderRadius: 2,
                          border: "1px solid rgba(212, 160, 23, 0.14)",
                          background:
                            "linear-gradient(180deg, rgba(255,252,244,1) 0%, rgba(255,247,221,1) 100%)",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="flex-start"
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2.5,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "rgba(212, 160, 23, 0.1)",
                              color: "#b8860b",
                              flexShrink: 0,
                            }}
                          >
                            {item.icon}
                          </Box>
                          <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight={700}
                            >
                              {item.label}
                            </Typography>
                            <Typography fontWeight={800} noWrap>
                              {item.value || "-"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
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
                <Stack spacing={1.25}>
                  {[
                    {
                      title: "Rides",
                      description:
                        "Open your ride history and current trip state.",
                      icon: <DirectionsCarFilledRoundedIcon fontSize="small" />,
                      label: "Open my rides",
                      variant: "contained" as const,
                      onClick: () => navigate(ridesPath),
                    },
                    {
                      title: "Profile",
                      description: "Review account and driver profile details.",
                      icon: <PersonRoundedIcon fontSize="small" />,
                      label: "Open profile",
                      variant: "outlined" as const,
                      onClick: () => navigate("/profile"),
                    },
                    {
                      title: "Ratings",
                      description: "See received ratings and ride feedback.",
                      icon: <StarRoundedIcon fontSize="small" />,
                      label: "View ratings",
                      variant: "text" as const,
                      onClick: () => navigate("/ratings"),
                    },
                  ].map((action) => (
                    <Box
                      key={action.title}
                      sx={{
                        px: 2,
                        py: 1.45,
                        borderRadius: 2,
                        border: "1px solid rgba(212, 160, 23, 0.14)",
                        background:
                          "linear-gradient(180deg, rgba(255,252,244,1) 0%, rgba(255,247,221,0.82) 100%)",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          spacing={1.25}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: 2.5,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "rgba(212, 160, 23, 0.1)",
                              color: "#b8860b",
                              flexShrink: 0,
                            }}
                          >
                            {action.icon}
                          </Box>
                          <Stack spacing={0.25}>
                            <Typography fontWeight={800}>
                              {action.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {action.description}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Button
                          variant={action.variant}
                          onClick={action.onClick}
                          sx={{
                            alignSelf: { xs: "flex-start", sm: "center" },
                            whiteSpace: "nowrap",
                          }}
                        >
                          {action.label}
                        </Button>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
