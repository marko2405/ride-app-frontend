import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getUserRatingSummary } from "../services/rating.service";
import type { UserRatingSummaryResponse } from "../types/rating.types";
import { formatAverageRating } from "../utils/ratingFormatters";
import { getApiErrorMessage } from "../../../utils/apiError";

type UserRatingSummaryCardProps = {
  userId: number;
};

export default function UserRatingSummaryCard({
  userId,
}: UserRatingSummaryCardProps) {
  const [summary, setSummary] = useState<UserRatingSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserRatingSummary(userId);
      setSummary(response);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const totalRatings = summary?.totalRatings ?? 0;

  return (
    <Card sx={{ borderRadius: 1, height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.25}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              Average rating
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ratings received from completed rides.
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
                <Button color="inherit" size="small" onClick={() => void loadSummary()}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {!loading && !error && summary && (
            <Stack spacing={2.25}>
              <Stack spacing={0.75}>
                <Stack direction="row" spacing={1.5} alignItems="baseline">
                  <Typography variant="h3" fontWeight={800}>
                    {formatAverageRating(summary.averageRating)}
                  </Typography>
                  <Typography color="text.secondary">/ 5</Typography>
                </Stack>
                <Rating value={summary.averageRating} precision={0.1} readOnly />
                <Typography variant="body2" color="text.secondary">
                  {totalRatings} {totalRatings === 1 ? "rating" : "ratings"} total
                </Typography>
              </Stack>

              <Stack spacing={1.2}>
                {[5, 4, 3, 2, 1].map((score) => {
                  const count = summary.breakdown[String(score)] ?? 0;
                  const percent = totalRatings > 0 ? (count / totalRatings) * 100 : 0;

                  return (
                    <Stack
                      key={score}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        sx={{ width: 28, fontWeight: 700 }}
                      >
                        {score}★
                      </Typography>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={percent}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ width: 28, textAlign: "right" }}
                      >
                        {count}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
