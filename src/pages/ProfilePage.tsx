import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkHistoryRoundedIcon from "@mui/icons-material/WorkHistoryRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useState } from "react";
import {
  getMyDriverProfile,
  updateMyDriverProfile,
  updateMyProfile,
  type DriverProfileResponse,
  type UpdateDriverProfileRequest,
  type UpdateUserProfileRequest,
} from "../api/profile/profile";
import { useUser } from "../context/UserContext";
import { formatRating } from "../utils/rideFormatters";

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
        borderRadius: 2,
        height: "100%",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.05)",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={1.25}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              backgroundColor: alpha(accent, 0.1),
              color: accent,
            }}
          >
            {icon}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            {value}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const { user, setUser, refreshUser, loading: userLoading } = useUser();
  const [driverDetails, setDriverDetails] =
    useState<DriverProfileResponse | null>(null);
  const [loadingDriverDetails, setLoadingDriverDetails] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingDriverProfile, setSavingDriverProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileForm, setProfileForm] = useState<UpdateUserProfileRequest>({
    firstName: "",
    lastName: "",
    username: "",
  });

  const [driverForm, setDriverForm] = useState<UpdateDriverProfileRequest>({
    licenseNumber: "",
    yearsOfExperience: null,
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    });
  }, [user]);

  useEffect(() => {
    const loadDriverProfile = async () => {
      if (!user || user.role !== "DRIVER") {
        setDriverDetails(null);
        setDriverForm({
          licenseNumber: "",
          yearsOfExperience: null,
        });
        return;
      }

      try {
        setLoadingDriverDetails(true);
        setError("");
        const driverData = await getMyDriverProfile();
        setDriverDetails(driverData);
        setDriverForm({
          licenseNumber: driverData.licenseNumber ?? "",
          yearsOfExperience: driverData.yearsOfExperience ?? null,
        });
      } catch {
        setError("Failed to load driver profile data.");
      } finally {
        setLoadingDriverDetails(false);
      }
    };

    void loadDriverProfile();
  }, [user]);

  const handleProfileChange = (
    field: keyof UpdateUserProfileRequest,
    value: string,
  ) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDriverChange = (
    field: keyof UpdateDriverProfileRequest,
    value: string | number | null,
  ) => {
    setDriverForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const updated = await updateMyProfile(profileForm);
      setUser(updated);

      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveDriverProfile = async () => {
    try {
      setSavingDriverProfile(true);
      setError("");
      setSuccess("");

      const updated = await updateMyDriverProfile(driverForm);
      setDriverDetails(updated);

      setSuccess("Driver profile updated successfully.");
    } catch {
      setError("Failed to update driver profile.");
    } finally {
      setSavingDriverProfile(false);
    }
  };

  if (userLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">Profile is not available right now.</Alert>
        <Button variant="outlined" onClick={() => void refreshUser()}>
          Retry
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 48%, #0f766e 100%)",
          color: "white",
          boxShadow: "0 24px 54px rgba(15, 23, 42, 0.14)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Stack spacing={1.25}>
            <Typography variant="overline" sx={{ opacity: 0.75, letterSpacing: 1.5 }}>
              {user.role === "DRIVER" ? "Driver profile" : "Account profile"}
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography sx={{ opacity: 0.84, maxWidth: 760 }}>
              Update only the details that matter here. Read-only account facts stay
              visible, while editable fields are kept focused and simple.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Account email"
            value={user.email}
            icon={<MailOutlineRoundedIcon fontSize="small" />}
            accent="#2563eb"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Username"
            value={user.username}
            icon={<PersonRoundedIcon fontSize="small" />}
            accent="#7c3aed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Role"
            value={user.role}
            icon={<BadgeRoundedIcon fontSize="small" />}
            accent="#0f766e"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Account status"
            value={user.enabled ? "Enabled" : "Disabled"}
            icon={<StarRoundedIcon fontSize="small" />}
            accent="#ea580c"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} alignItems="stretch">
        <Grid size={{ xs: 12, lg: user.role === "DRIVER" ? 7 : 12 }}>
          <Card
            sx={{
              borderRadius: 2,
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={3}>
                <Stack spacing={0.75}>
                  <Typography variant="h6" fontWeight={800}>
                    Account details
                  </Typography>
                  <Typography color="text.secondary">
                    Edit only the fields that can actually be changed for your account.
                  </Typography>
                </Stack>

                <Divider />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="First name"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Last name"
                      value={profileForm.lastName}
                      onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Username"
                      value={profileForm.username}
                      onChange={(e) => handleProfileChange("username", e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Email" value={user.email} fullWidth disabled />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  sx={{ alignSelf: "flex-start" }}
                >
                  {savingProfile ? "Saving..." : "Save account details"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {user.role === "DRIVER" && (
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card
              sx={{
                borderRadius: 2,
                height: "100%",
                border: "1px solid rgba(148, 163, 184, 0.16)",
                boxShadow: "0 18px 38px rgba(15, 23, 42, 0.06)",
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
                {loadingDriverDetails ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={30} />
                  </Box>
                ) : (
                  <Stack spacing={3} sx={{ height: "100%" }}>
                    <Stack spacing={0.75}>
                      <Typography variant="h6" fontWeight={800}>
                        Driver profile
                      </Typography>
                      <Typography color="text.secondary">
                        Keep only your active driver credentials current.
                      </Typography>
                    </Stack>

                    <Divider />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="License number"
                          value={driverForm.licenseNumber}
                          onChange={(e) =>
                            handleDriverChange("licenseNumber", e.target.value)
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          label="Years of experience"
                          type="number"
                          value={driverForm.yearsOfExperience ?? ""}
                          onChange={(e) =>
                            handleDriverChange(
                              "yearsOfExperience",
                              e.target.value === "" ? null : Number(e.target.value),
                            )
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <StatCard
                          label="Rating"
                          value={formatRating(
                            driverDetails?.averageRating ?? 0,
                            driverDetails?.totalRatings ?? 0,
                          )}
                          icon={<StarRoundedIcon fontSize="small" />}
                          accent="#f59e0b"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <StatCard
                          label="Driver status"
                          value={driverDetails?.active ? "Active" : "Inactive"}
                          icon={<WorkHistoryRoundedIcon fontSize="small" />}
                          accent="#0f766e"
                        />
                      </Grid>
                    </Grid>

                    <Button
                      variant="contained"
                      onClick={handleSaveDriverProfile}
                      disabled={savingDriverProfile || loadingDriverDetails}
                      sx={{ alignSelf: "flex-start", mt: "auto" }}
                    >
                      {savingDriverProfile ? "Saving..." : "Save driver details"}
                    </Button>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
