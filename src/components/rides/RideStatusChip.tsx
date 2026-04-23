import { Chip } from "@mui/material";
import type { RideStatus } from "../../types/ride";

type RideStatusChipProps = {
  status: RideStatus;
};

const statusColorMap: Record<
  RideStatus,
  "default" | "primary" | "secondary" | "success" | "error" | "warning"
> = {
  REQUESTED: "warning",
  ACCEPTED: "primary",
  IN_PROGRESS: "secondary",
  COMPLETED: "success",
  CANCELLED: "error",
};

export default function RideStatusChip({ status }: RideStatusChipProps) {
  return (
    <Chip
      label={status.replace("_", " ")}
      color={statusColorMap[status]}
      size="small"
      sx={{ fontWeight: 700 }}
    />
  );
}
