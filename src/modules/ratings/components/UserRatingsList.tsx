import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRatings } from "../services/rating.service";
import type { RideRatingResponse } from "../types/rating.types";
import {
  formatRatingDate,
  formatRatingType,
} from "../utils/ratingFormatters";
import { getApiErrorMessage } from "../../../utils/apiError";

type UserRatingsListProps = {
  userId: number;
};

export default function UserRatingsList({ userId }: UserRatingsListProps) {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RideRatingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRatings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserRatings(userId);
      setRatings(response);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadRatings();
  }, [loadRatings]);

  const sortedRatings = useMemo(() => {
    return [...ratings].sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    );
  }, [ratings]);

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Card sx={{ borderRadius: 1, overflow: "hidden" }}>
      <CardContent sx={{ p: 0 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{
            px: { xs: 2.5, md: 3.5 },
            py: 2.5,
            borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
            background:
              "linear-gradient(90deg, rgba(15,23,42,0.02) 0%, rgba(37,99,235,0.06) 100%)",
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              Received ratings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Newest ratings are shown first.
            </Typography>
          </Stack>
          <Chip
            label={`${ratings.length} ${ratings.length === 1 ? "rating" : "ratings"}`}
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start", fontWeight: 600, borderRadius: 1 }}
          />
        </Stack>

        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => void loadRatings()}>
                Retry
              </Button>
            }
            sx={{ m: 3 }}
          >
            {error}
          </Alert>
        )}

        {!error && sortedRatings.length === 0 && (
          <Stack spacing={0.75} alignItems="center" sx={{ px: 3, py: 6 }}>
            <Typography variant="h6" fontWeight={700}>
              You don&apos;t have any ratings yet.
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Completed ride ratings you receive will appear here.
            </Typography>
          </Stack>
        )}

        {!error && sortedRatings.length > 0 && (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 760 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ride</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRatings.map((rating) => (
                  <TableRow
                    key={rating.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.03)",
                      },
                    }}
                  >
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Rating value={rating.score} readOnly size="small" />
                        <Typography fontWeight={700}>{rating.score}/5</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{formatRatingType(rating.ratingType)}</TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>#{rating.rideId}</Typography>
                    </TableCell>
                    <TableCell>{formatRatingDate(rating.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        onClick={() => navigate(`/rides/${rating.rideId}`)}
                      >
                        View ride
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}
