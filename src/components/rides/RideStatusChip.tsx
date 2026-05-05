import { Chip } from "@mui/material";
import type { RideStatus } from "../../types/ride";
import { formatRideStatus } from "../../utils/rideFormatters";

type RideStatusChipProps = {
  status: RideStatus;
};

const statusColorMap: Record<
  RideStatus,
  "default" | "primary" | "secondary" | "success" | "error" | "warning"
> = {
  REQUESTED: "warning",
  ACCEPTED: "warning",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "error",
};

export default function RideStatusChip({ status }: RideStatusChipProps) {
  return (
    <Chip
      label={formatRideStatus(status)}
      color={statusColorMap[status]}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
