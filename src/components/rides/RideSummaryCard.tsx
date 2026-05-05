import {
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import type { RideQuoteResponse, RideResponse } from "../../types/ride";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatMoney,
  formatVehicleClass,
} from "../../utils/rideFormatters";
import RideStatusChip from "./RideStatusChip";

type RideSummaryCardProps = {
  ride?: RideResponse;
  quote?: RideQuoteResponse;
  title?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  selectedVehicleClass?: string | null;
  scheduledFor?: string | null;
  showStatus?: boolean;
  showCreated?: boolean;
};

type SummaryItemProps = {
  label: string;
  value: string | number;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  );
}

export default function RideSummaryCard({
  ride,
  quote,
  title = "Ride summary",
  pickupAddress,
  dropoffAddress,
  selectedVehicleClass,
  scheduledFor,
  showStatus = true,
  showCreated = true,
}: RideSummaryCardProps) {
  const distanceMeters = ride?.distanceMeters ?? quote?.distanceMeters;
  const durationSeconds = ride?.durationSeconds ?? quote?.durationSeconds;
  const currency = ride?.currency ?? quote?.currency ?? "RSD";

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
          >
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
            {ride && showStatus && <RideStatusChip status={ride.status} />}
          </Stack>

          <Divider />

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryItem
                label="Pickup"
                value={
                  pickupAddress ?? (ride ? "Pickup shared after dispatch" : "-")
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryItem
                label="Dropoff"
                value={
                  dropoffAddress ??
                  (ride ? "Dropoff shared after dispatch" : "-")
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryItem
                label="Vehicle class"
                value={
                  ride?.vehicleClass
                    ? formatVehicleClass(ride.vehicleClass)
                    : (selectedVehicleClass ?? "-")
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <SummaryItem
                label="Scheduled for"
                value={formatDateTime(
                  ride?.scheduledFor ?? scheduledFor ?? null,
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SummaryItem
                label="Distance"
                value={
                  distanceMeters !== undefined
                    ? formatDistance(distanceMeters)
                    : "-"
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SummaryItem
                label="Duration"
                value={
                  durationSeconds !== undefined
                    ? formatDuration(durationSeconds)
                    : "-"
                }
              />
            </Grid>
            {ride && (
              <Grid size={{ xs: 12, md: 4 }}>
                <SummaryItem
                  label="Total price"
                  value={formatMoney(ride.totalPrice, currency)}
                />
              </Grid>
            )}
            {ride && showCreated && (
              <Grid size={{ xs: 12, md: 4 }}>
                <SummaryItem
                  label="Created"
                  value={formatDateTime(ride.createdAt)}
                />
              </Grid>
            )}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
