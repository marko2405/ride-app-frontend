import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { RideStatus } from "../../types/ride";

type RidesTableToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  statusValue: RideStatus | "ALL";
  onStatusChange: (value: RideStatus | "ALL") => void;
};

const statusOptions: Array<{ value: RideStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "REQUESTED", label: "Requested" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function RidesTableToolbar({
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
}: RidesTableToolbarProps) {
  const hasActiveFilters = searchValue.trim() !== "" || statusValue !== "ALL";

  return (
    <Box
      sx={{
        px: { xs: 2.5, md: 3.5 },
        py: 2,
        borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "rgba(248, 250, 252, 0.9)",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListRoundedIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Filters
            </Typography>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <TextField
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by ride ID or vehicle"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
          />

          <TextField
            select
            value={statusValue}
            onChange={(event) =>
              onStatusChange(event.target.value as RideStatus | "ALL")
            }
            size="small"
            sx={{ minWidth: { xs: "100%", md: 220 }, "& .MuiOutlinedInput-root": { borderRadius: 1 } }}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            onClick={() => {
              onSearchChange("");
              onStatusChange("ALL");
            }}
            disabled={!hasActiveFilters}
            sx={{ borderRadius: 1, minWidth: { md: 120 } }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
