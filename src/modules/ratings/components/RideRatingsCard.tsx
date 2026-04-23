import { AxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getRideRatings } from "../services/rating.service";
import type {
  RideRatingResponse,
  RideRatingsForRideResponse,
} from "../types/rating.types";
import {
  formatRatingDate,
  formatRatingType,
} from "../utils/ratingFormatters";
import RatingForm from "./RatingForm";
import type { CurrentUser } from "../../../context/UserContext";
import type { RideResponse } from "../../../types/ride";

const emptyRatings: RideRatingsForRideResponse = {
  passengerToDriverRating: null,
  driverToPassengerRating: null,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

type RatingRowProps = {
  label: string;
  rating: RideRatingResponse | null;
};

function RatingRow({ label, rating }: RatingRowProps) {
  if (!rating) {
    return (
      <Box
        sx={{
          border: "1px dashed rgba(15, 23, 42, 0.16)",
          borderRadius: 1,
          p: 2,
        }}
      >
        <Stack spacing={0.5}>
          <Typography fontWeight={700}>{label}</Typography>
          <Typography variant="body2" color="text.secondary">
            No rating submitted yet.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: "1px solid rgba(15, 23, 42, 0.1)",
        borderRadius: 1,
        p: 2,
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
        >
          <Stack spacing={0.5}>
            <Typography fontWeight={700}>{label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatRatingType(rating.ratingType)}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {formatRatingDate(rating.createdAt)}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Rating value={rating.score} readOnly />
          <Typography fontWeight={700}>{rating.score}/5</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

type RideRatingsCardProps = {
  ride: RideResponse;
  currentUser: CurrentUser | null;
};

export default function RideRatingsCard({
  ride,
  currentUser,
}: RideRatingsCardProps) {
  const [ratings, setRatings] =
    useState<RideRatingsForRideResponse>(emptyRatings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRatings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getRideRatings(ride.id);
      setRatings(response);
    } catch (error) {
      setError(getErrorMessage(error, "Failed to load ride ratings."));
    } finally {
      setLoading(false);
    }
  }, [ride.id]);

  useEffect(() => {
    void loadRatings();
  }, [loadRatings]);

  const canShowRatingForm = useMemo(() => {
    if (!currentUser || ride.status !== "COMPLETED") {
      return false;
    }

    if (
      currentUser.id === ride.passengerId &&
      !ratings.passengerToDriverRating
    ) {
      return true;
    }

    return (
      currentUser.id === ride.driverId && !ratings.driverToPassengerRating
    );
  }, [
    currentUser,
    ratings.driverToPassengerRating,
    ratings.passengerToDriverRating,
    ride.driverId,
    ride.passengerId,
    ride.status,
  ]);

  const handleCreated = () => {
    setSuccess("Your rating was submitted successfully.");
    void loadRatings();
  };

  return (
    <Card sx={{ borderRadius: 1 }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Stack spacing={0.75}>
            <Typography variant="h6" fontWeight={700}>
              Ride ratings
            </Typography>
            <Typography color="text.secondary">
              Ratings become available after a completed ride.
            </Typography>
          </Stack>

          {loading && (
            <Stack alignItems="center" py={4}>
              <CircularProgress />
            </Stack>
          )}

          {!loading && error && (
            <Alert
              severity="error"
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => void loadRatings()}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {success && <Alert severity="success">{success}</Alert>}

              <Stack spacing={2}>
                <RatingRow
                  label="Passenger to driver"
                  rating={ratings.passengerToDriverRating}
                />
                <RatingRow
                  label="Driver to passenger"
                  rating={ratings.driverToPassengerRating}
                />
              </Stack>

              <Divider />

              {canShowRatingForm ? (
                <RatingForm rideId={ride.id} onCreated={handleCreated} />
              ) : (
                <Alert severity={ride.status === "COMPLETED" ? "info" : "warning"}>
                  {ride.status === "COMPLETED"
                    ? "There is no rating action available for your account on this ride."
                    : "This ride must be completed before ratings can be submitted."}
                </Alert>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
