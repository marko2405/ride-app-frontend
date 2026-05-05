import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Alert, Box, Button, Rating, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { createRideRating } from "../services/rating.service";
import type { RideRatingResponse } from "../types/rating.types";
import { getApiErrorMessage } from "../../../utils/apiError";

type RatingFormProps = {
  rideId: number;
  onCreated: (rating: RideRatingResponse) => void;
};

export default function RatingForm({ rideId, onCreated }: RatingFormProps) {
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!score) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      const rating = await createRideRating(rideId, { score });
      setSuccess("Your rating was submitted successfully.");
      setScore(null);
      onCreated(rating);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        border: "1px solid rgba(15, 23, 42, 0.1)",
        borderRadius: 1,
        p: { xs: 2, sm: 2.5 },
        bgcolor: "rgba(248, 250, 252, 0.72)",
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={0.5}>
          <Typography fontWeight={700}>Rate this ride</Typography>
          <Typography variant="body2" color="text.secondary">
            Choose a score from 1 to 5.
          </Typography>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Rating
            value={score}
            max={5}
            precision={1}
            icon={<StarRoundedIcon fontSize="inherit" />}
            emptyIcon={<StarRoundedIcon fontSize="inherit" />}
            disabled={submitting}
            onChange={(_, value) => setScore(value)}
          />
          <Button
            variant="contained"
            disabled={!score || submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? "Submitting..." : "Submit rating"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
