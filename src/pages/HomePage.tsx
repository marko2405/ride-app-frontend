import { AxiosError } from "axios";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDriverRides, getMyRides } from "../api/rides/rides";
import RideStatusChip from "../components/rides/RideStatusChip";
import { useUser } from "../context/UserContext";
import UserRatingSummaryCard from "../modules/ratings/components/UserRatingSummaryCard";
import type { RideResponse } from "../types/ride";
import { formatDateTime, formatPrice } from "../utils/rideFormatters";

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

const activeStatusRank: Record<string, number> = {
  IN_PROGRESS: 0,
  ACCEPTED: 1,
  REQUESTED: 2,
};

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
      } catch (error) {
        setRidesError(getErrorMessage(error, "Failed to load current ride."));
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
          borderRadius: 6,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #312e81 100%)",
          color: "white",
          boxShadow: "0 25px 60px rgba(15, 23, 42, 0.18)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Stack spacing={2.5}>
            <Typography variant="overline" sx={{ opacity: 0.72, letterSpacing: 1.6 }}>
              {user?.role === "DRIVER" ? "Driver Dashboard" : "Passenger Dashboard"}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ maxWidth: 700 }}>
              {user?.role === "DRIVER"
                ? `Welcome back, ${user?.firstName}. Stay on top of assigned rides and driver details.`
                : `Welcome back, ${user?.firstName}. Book a ride in a few taps and keep every trip in one place.`}
            </Typography>
            <Typography sx={{ maxWidth: 680, opacity: 0.8 }}>
              {user?.role === "DRIVER"
                ? "Use your workspace to monitor ride history and keep your driver profile current."
                : "Search locations with Google autocomplete, compare ride classes instantly, and confirm rides with the existing backend flow."}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {user?.role === "DRIVER" ? (
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate("/driver/rides/available")}
                >
                  View available rides
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate("/rides/new")}
                >
                  Book a ride
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{ color: "white", borderColor: "rgba(255,255,255,0.38)" }}
                onClick={() => navigate(ridesPath)}
              >
                Open my rides
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 1 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2.5}
          >
            <Stack spacing={1.25}>
              <Typography variant="h6" fontWeight={700}>
                Current ride
              </Typography>
              {ridesLoading && (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography color="text.secondary">
                    Loading your latest ride activity...
                  </Typography>
                </Stack>
              )}
              {!ridesLoading && ridesError && (
                <Alert severity="error">{ridesError}</Alert>
              )}
              {!ridesLoading && !ridesError && currentRide && (
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography variant="h5" fontWeight={800}>
                      Ride #{currentRide.id}
                    </Typography>
                    <RideStatusChip status={currentRide.status} />
                  </Stack>
                  <Typography color="text.secondary">
                    Scheduled for {formatDateTime(currentRide.scheduledFor)} ·{" "}
                    {formatPrice(currentRide.totalPrice, currentRide.currency)}
                  </Typography>
                </Stack>
              )}
              {!ridesLoading && !ridesError && !currentRide && (
                <Typography color="text.secondary">
                  {user?.role === "DRIVER"
                    ? "You do not have an active assigned ride right now."
                    : "You do not have an active ride right now."}
                </Typography>
              )}
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              {currentRide ? (
                <Button
                  variant="contained"
                  onClick={() => navigate(`/rides/${currentRide.id}`)}
                >
                  View details
                </Button>
              ) : user?.role === "DRIVER" ? (
                <Button
                  variant="contained"
                  onClick={() => navigate("/driver/rides/available")}
                >
                  View available rides
                </Button>
              ) : (
                <Button variant="contained" onClick={() => navigate("/rides/new")}>
                  Book a ride
                </Button>
              )}
              <Button variant="outlined" onClick={() => navigate(ridesPath)}>
                Open my rides
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1.75}>
                <Typography variant="h6" fontWeight={700}>
                  Account snapshot
                </Typography>
                <Typography>
                  <strong>Name:</strong> {user?.firstName} {user?.lastName}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                <Typography>
                  <strong>Username:</strong> {user?.username}
                </Typography>
                <Typography>
                  <strong>Role:</strong> {user?.role}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          {user && <UserRatingSummaryCard userId={user.id} />}
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1.75}>
                <Typography variant="h6" fontWeight={700}>
                  Booking flow
                </Typography>
                <Typography color="text.secondary">
                  Google Places autocomplete now handles location search and
                  resolves coordinates automatically before quote requests.
                </Typography>
                <Button variant="text" onClick={() => navigate("/ratings")}>
                  View all ratings
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 5, height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={1.75}>
                <Typography variant="h6" fontWeight={700}>
                  Ride history
                </Typography>
                <Typography color="text.secondary">
                  Visit My Rides to review statuses, prices, schedule times, and
                  detailed backend responses for each trip.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
