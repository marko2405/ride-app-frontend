import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
import {
  getAdminDrivers,
  toggleAdminDriverStatus,
  type AdminDriverResponse,
} from "../../api/admin/admin";
import { getApiErrorMessage } from "../../utils/apiError";

const formatVehicleClass = (vehicleClass: string) => {
  return vehicleClass
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatCar = (driver: AdminDriverResponse) => {
  return [driver.carBrand, driver.carModel, driver.carColor]
    .filter(Boolean)
    .join(" ") || "-";
};

const isDriverEnabled = (driver: AdminDriverResponse) => {
  return driver.active || driver.enabled;
};

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<AdminDriverResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleError, setToggleError] = useState("");
  const [driverToToggle, setDriverToToggle] =
    useState<AdminDriverResponse | null>(null);
  const [toggling, setToggling] = useState(false);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminDrivers();
      setDrivers(response);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDrivers();
  }, []);

  const handleToggleStatus = async () => {
    if (!driverToToggle) {
      return;
    }

    try {
      setToggling(true);
      setToggleError("");
      await toggleAdminDriverStatus(driverToToggle.userId);
      await loadDrivers();
      setDriverToToggle(null);
    } catch (toggleRequestError) {
      setToggleError(getApiErrorMessage(toggleRequestError));
    } finally {
      setToggling(false);
    }
  };

  const driverToggleAction =
    driverToToggle && isDriverEnabled(driverToToggle) ? "disable" : "enable";

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
        <Typography variant="h4" fontWeight={800}>
          Drivers
        </Typography>
        <Typography color="text.secondary">
          View driver profiles, vehicle details, and ratings.
        </Typography>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadDrivers()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && drivers.length === 0 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography fontWeight={700}>No drivers found.</Typography>
          </CardContent>
        </Card>
      )}

      {drivers.length > 0 && (
        <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 1120 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vehicle Class</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Ratings</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Car</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Plate Number</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drivers.map((driver) => (
                    <TableRow
                      key={driver.userId}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: "rgba(37, 99, 235, 0.03)" },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={700}>
                          {driver.firstName} {driver.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{formatVehicleClass(driver.vehicleClass)}</TableCell>
                      <TableCell>
                        <Chip
                          label={isDriverEnabled(driver) ? "Active" : "Disabled"}
                          color={isDriverEnabled(driver) ? "success" : "default"}
                          variant={isDriverEnabled(driver) ? "filled" : "outlined"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>{driver.averageRating.toFixed(1)}/5</TableCell>
                      <TableCell>{driver.totalRatings}</TableCell>
                      <TableCell>{formatCar(driver)}</TableCell>
                      <TableCell>{driver.plateNumber ?? "-"}</TableCell>
                      <TableCell align="right">
                        <Button
                          color={isDriverEnabled(driver) ? "error" : "success"}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setToggleError("");
                            setDriverToToggle(driver);
                          }}
                        >
                          {isDriverEnabled(driver) ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!driverToToggle}
        onClose={() => (toggling ? undefined : setDriverToToggle(null))}
      >
        <DialogTitle>
          {driverToggleAction === "disable" ? "Disable driver" : "Enable driver"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {driverToggleAction === "disable"
                ? "Are you sure you want to disable this driver?"
                : "Are you sure you want to enable this driver?"}
            </DialogContentText>
            {toggleError && <Alert severity="error">{toggleError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={toggling} onClick={() => setDriverToToggle(null)}>
            Cancel
          </Button>
          <Button
            color={driverToggleAction === "disable" ? "error" : "success"}
            variant="contained"
            disabled={toggling}
            onClick={() => void handleToggleStatus()}
          >
            {toggling
              ? "Saving..."
              : driverToggleAction === "disable"
                ? "Disable"
                : "Enable"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
