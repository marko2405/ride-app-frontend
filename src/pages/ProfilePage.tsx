import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
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
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Profile
        </Typography>
        <Typography color="text.secondary">
          Manage your account details and keep your rider or driver information
          up to date.
        </Typography>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card sx={{ borderRadius: 5 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Account details
            </Typography>

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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Username"
                  value={profileForm.username}
                  onChange={(e) => handleProfileChange("username", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Email" value={user.email} fullWidth disabled />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Role" value={user.role} fullWidth disabled />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Enabled"
                  value={String(user.enabled)}
                  fullWidth
                  disabled
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handleSaveProfile}
              disabled={savingProfile}
              sx={{ alignSelf: "flex-start" }}
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {user.role === "DRIVER" && (
        <Card sx={{ borderRadius: 5 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              <Typography variant="h6" fontWeight={700}>
                Driver details
              </Typography>

              {loadingDriverDetails ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="License number"
                      value={driverForm.licenseNumber}
                      onChange={(e) =>
                        handleDriverChange("licenseNumber", e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
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
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Average rating"
                      value={driverDetails?.averageRating ?? ""}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Total ratings"
                      value={driverDetails?.totalRatings ?? ""}
                      fullWidth
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Active"
                      value={String(driverDetails?.active ?? false)}
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              )}

              <Button
                variant="contained"
                onClick={handleSaveDriverProfile}
                disabled={savingDriverProfile || loadingDriverDetails}
                sx={{ alignSelf: "flex-start" }}
              >
                {savingDriverProfile ? "Saving..." : "Save driver profile"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
