import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyDriverRides } from "../../api/rides/rides";
import RideStatusChip from "../../components/rides/RideStatusChip";
import RidesTableToolbar from "../../components/rides/RidesTableToolbar";
import { useUser } from "../../context/UserContext";
import type { RideResponse, RideStatus } from "../../types/ride";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  formatDateTime,
  formatDistance,
  formatDuration,
  formatMoney,
  formatRating,
  formatRideAddress,
  formatVehicleClass,
} from "../../utils/rideFormatters";

export default function DriverMyRidesPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [rides, setRides] = useState<RideResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RideStatus | "ALL">("ALL");

  const loadRides = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getMyDriverRides();
      setRides(response);
    } catch (error) {
      setError(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRides();
  }, []);

  const filteredRides = rides.filter((ride) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch === "" ||
      String(ride.id).includes(normalizedSearch) ||
      ride.vehicleClass.toLowerCase().includes(normalizedSearch) ||
      formatRideAddress(ride.pickupAddress)
        .toLowerCase()
        .includes(normalizedSearch) ||
      formatRideAddress(ride.dropoffAddress)
        .toLowerCase()
        .includes(normalizedSearch) ||
      ride.passengerInfo.fullName.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "ALL" || ride.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (user?.role !== "DRIVER") {
    return (
      <Alert severity="info">This page is available only to drivers.</Alert>
    );
  }

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Stack spacing={1}>
        <Button
          variant="text"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate("/")}
          sx={{ alignSelf: "flex-start" }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight={700}>
          My rides
        </Typography>
        <Typography color="text.secondary">
          Manage rides assigned to you and open ride details for status updates.
        </Typography>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadRides()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && rides.length === 0 && (
        <Card
          sx={{
            borderRadius: 1,
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 100%)",
            boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1.75} alignItems="flex-start">
              <Typography variant="h6" fontWeight={700}>
                You don&apos;t have any assigned rides yet.
              </Typography>
              <Typography color="text.secondary">
                Accept an available request and it will appear here instantly.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/driver/rides/available")}
              >
                View available rides
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {rides.length > 0 && (
        <Card
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            boxShadow: "0 24px 48px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                px: { xs: 2.5, md: 3.5 },
                py: 2.5,
                borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
                background:
                  "linear-gradient(90deg, rgba(15,23,42,0.02) 0%, rgba(37,99,235,0.06) 100%)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Typography variant="h6" fontWeight={700}>
                  Assigned rides
                </Typography>
                <Chip
                  label={`${rides.length} ${rides.length === 1 ? "ride" : "rides"}`}
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start", fontWeight: 600, borderRadius: 1 }}
                />
              </Stack>
            </Box>

            <RidesTableToolbar
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              statusValue={statusFilter}
              onStatusChange={setStatusFilter}
            />

            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1240 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Ride</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Passenger</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Distance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Scheduled</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRides.map((ride) => (
                    <TableRow
                      key={ride.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": {
                          backgroundColor: "rgba(37, 99, 235, 0.03)",
                        },
                      }}
                    >
                      <TableCell>
                        <Stack spacing={0.35}>
                          <Typography fontWeight={700}>#{ride.id}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created {formatDateTime(ride.createdAt)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280 }}>
                        <Stack spacing={0.35}>
                          <Typography variant="body2" fontWeight={700}>
                            Pickup: {formatRideAddress(ride.pickupAddress)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Dropoff: {formatRideAddress(ride.dropoffAddress)}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={0.35}>
                          <Typography fontWeight={600}>
                            {ride.passengerInfo.fullName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatRating(
                              ride.passengerInfo.averageRating,
                              ride.passengerInfo.totalRatings,
                            )}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <RideStatusChip status={ride.status} />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {formatVehicleClass(ride.vehicleClass)}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDistance(ride.distanceMeters)}</TableCell>
                      <TableCell>{formatDuration(ride.durationSeconds)}</TableCell>
                      <TableCell>{formatDateTime(ride.scheduledFor)}</TableCell>
                      <TableCell>
                        <Typography fontWeight={700} color="primary.main">
                          {formatMoney(ride.totalPrice, ride.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="text"
                          onClick={() => navigate(`/rides/${ride.id}`)}
                        >
                          View details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredRides.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} sx={{ py: 5, textAlign: "center" }}>
                        <Stack spacing={0.75} alignItems="center">
                          <Typography fontWeight={700}>No rides match these filters.</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Try a different search term or reset the current filters.
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
