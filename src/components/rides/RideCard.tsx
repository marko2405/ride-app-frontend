import {
  Box,
  Button,
  CardActionArea,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { RideResponse } from "../../types/ride";
import {
  formatDateTime,
  formatDistanceKm,
  formatDuration,
  formatPrice,
} from "../../utils/rideFormatters";
import RideStatusChip from "./RideStatusChip";

type RideCardProps = {
  ride: RideResponse;
  actionLabel?: string;
  actionLoading?: boolean;
  actionDisabled?: boolean;
  onAction?: (ride: RideResponse) => void;
  onOpen?: (rideId: number) => void;
};

export default function RideCard({
  ride,
  actionLabel,
  actionLoading = false,
  actionDisabled = false,
  onAction,
  onOpen,
}: RideCardProps) {
  const content = (
    <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={700}>
              Ride #{ride.id}
            </Typography>
            <Typography color="text.secondary">{ride.vehicleClass}</Typography>
          </Stack>
          <RideStatusChip status={ride.status} />
        </Stack>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Total price
            </Typography>
            <Typography fontWeight={700} color="primary.main">
              {formatPrice(ride.totalPrice, ride.currency)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Scheduled for
            </Typography>
            <Typography fontWeight={600}>
              {formatDateTime(ride.scheduledFor)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Distance
            </Typography>
            <Typography fontWeight={600}>
              {formatDistanceKm(ride.distanceMeters)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Duration
            </Typography>
            <Typography fontWeight={600}>
              {formatDuration(ride.durationSeconds)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              Created at
            </Typography>
            <Typography fontWeight={600}>
              {formatDateTime(ride.createdAt)}
            </Typography>
          </Grid>
        </Grid>

        {(onAction || onOpen) && (
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            {onAction && actionLabel && (
              <Button
                variant="contained"
                disabled={actionDisabled || actionLoading}
                onClick={(event) => {
                  event.stopPropagation();
                  onAction(ride);
                }}
              >
                {actionLoading ? "Please wait..." : actionLabel}
              </Button>
            )}
            {onOpen && (
              <Button
                variant="text"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen(ride.id);
                }}
              >
                View details
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "rgba(15, 23, 42, 0.08)",
        backgroundColor: "rgba(255,255,255,0.9)",
        height: "100%",
        boxShadow: "none",
      }}
    >
      {onOpen ? (
        <CardActionArea onClick={() => onOpen(ride.id)}>
          {content}
        </CardActionArea>
      ) : (
        content
      )}
    </Box>
  );
}
