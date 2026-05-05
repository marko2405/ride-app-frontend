import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminDashboard,
  type AdminDashboardResponse,
} from "../../api/admin/admin";
import { getApiErrorMessage } from "../../utils/apiError";

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const formatRevenue = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
};

function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.05)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(accent, 0.1),
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Stack spacing={0.75} sx={{ minWidth: 0, pt: 0.25 }}>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={800}>
              {value}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

type BreakdownCardProps = {
  title: string;
  total: number;
  items: Array<{ label: string; value: number; color: string }>;
};

function BreakdownCard({ title, total, items }: BreakdownCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
        <Stack spacing={2.25}>
          <Stack spacing={0.4}>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
            <Typography color="text.secondary">
              {formatNumber(total)} total rides
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            {items.map((item) => {
              const percent = total > 0 ? (item.value / total) * 100 : 0;

              return (
                <Stack key={item.label} spacing={0.75}>
                  <Stack direction="row" justifyContent="space-between" spacing={2}>
                    <Typography fontWeight={700}>{item.label}</Typography>
                    <Typography color="text.secondary" fontWeight={700}>
                      {formatNumber(item.value)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{
                      height: 9,
                      borderRadius: 999,
                      bgcolor: alpha(item.color, 0.12),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 999,
                        bgcolor: item.color,
                      },
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminDashboard();
      setDashboard(response);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const rideStatusItems = useMemo(() => {
    if (!dashboard) return [];

    return [
      { label: "Requested", value: dashboard.requestedRides, color: "#d4a017" },
      { label: "Accepted", value: dashboard.acceptedRides, color: "#2563eb" },
      {
        label: "In progress",
        value: dashboard.inProgressRides,
        color: "#16a34a",
      },
      { label: "Completed", value: dashboard.completedRides, color: "#059669" },
      { label: "Cancelled", value: dashboard.cancelledRides, color: "#dc2626" },
    ];
  }, [dashboard]);

  const vehicleClassItems = useMemo(() => {
    if (!dashboard) return [];

    return [
      { label: "Economic", value: dashboard.economicRides, color: "#d4a017" },
      { label: "Business", value: dashboard.businessRides, color: "#7c3aed" },
      { label: "Comfort", value: dashboard.comfortRides, color: "#0891b2" },
    ];
  }, [dashboard]);

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
          Admin dashboard
        </Typography>
        <Typography color="text.secondary">
          Monitor platform activity, ride volume, and revenue.
        </Typography>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadDashboard()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {dashboard && (
        <>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Total Users"
                value={formatNumber(dashboard.totalUsers)}
                icon={<GroupsRoundedIcon fontSize="small" />}
                accent="#d4a017"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Passengers"
                value={formatNumber(dashboard.totalPassengers)}
                icon={<PersonRoundedIcon fontSize="small" />}
                accent="#b8860b"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Drivers"
                value={formatNumber(dashboard.totalDrivers)}
                icon={<DirectionsCarFilledRoundedIcon fontSize="small" />}
                accent="#8a6708"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Active Drivers"
                value={formatNumber(dashboard.activeDrivers)}
                icon={<VerifiedRoundedIcon fontSize="small" />}
                accent="#16a34a"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Total Rides"
                value={formatNumber(dashboard.totalRides)}
                icon={<LocalTaxiRoundedIcon fontSize="small" />}
                accent="#2563eb"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Completed Rides"
                value={formatNumber(dashboard.completedRides)}
                icon={<AssignmentTurnedInRoundedIcon fontSize="small" />}
                accent="#059669"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Cancelled Rides"
                value={formatNumber(dashboard.cancelledRides)}
                icon={<CancelRoundedIcon fontSize="small" />}
                accent="#dc2626"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                label="Total Revenue"
                value={formatRevenue(dashboard.totalRevenue)}
                icon={<PaymentsRoundedIcon fontSize="small" />}
                accent="#c99500"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <BreakdownCard
                title="Rides by status"
                total={dashboard.totalRides}
                items={rideStatusItems}
              />
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <BreakdownCard
                title="Rides by vehicle class"
                total={
                  dashboard.economicRides +
                  dashboard.businessRides +
                  dashboard.comfortRides
                }
                items={vehicleClassItems}
              />
            </Grid>
          </Grid>
        </>
      )}
    </Stack>
  );
}
