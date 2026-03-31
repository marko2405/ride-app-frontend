import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
  type UserProfileResponse,
} from "../api/profile/profile";
import { useUser } from "../context/UserContext";

export default function ProfilePage() {
  const { user, setUser } = useUser();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [driverProfile, setDriverProfile] =
    useState<DriverProfileResponse | null>(null);

  const [loading, setLoading] = useState(true);
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
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          setProfile(null);
          return;
        }

        setProfile(user);
        setProfileForm({
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        });

        if (user.role === "DRIVER") {
          const driverData = await getMyDriverProfile();
          setDriverProfile(driverData);
          setDriverForm({
            licenseNumber: driverData.licenseNumber ?? "",
            yearsOfExperience: driverData.yearsOfExperience ?? null,
          });
        } else {
          setDriverProfile(null);
          setDriverForm({
            licenseNumber: "",
            yearsOfExperience: null,
          });
        }
      } catch {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

      setProfile(updated);
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
      setDriverProfile(updated);

      setSuccess("Driver profile updated successfully.");
    } catch {
      setError("Failed to update driver profile.");
    } finally {
      setSavingDriverProfile(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Profile
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <Card>
        <CardContent>
          <Stack spacing={2.5}>
            <Typography variant="h6">Basic information</Typography>

            <TextField
              label="First name"
              value={profileForm.firstName}
              onChange={(e) => handleProfileChange("firstName", e.target.value)}
              fullWidth
            />

            <TextField
              label="Last name"
              value={profileForm.lastName}
              onChange={(e) => handleProfileChange("lastName", e.target.value)}
              fullWidth
            />

            <TextField
              label="Username"
              value={profileForm.username}
              onChange={(e) => handleProfileChange("username", e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              value={profile?.email ?? ""}
              fullWidth
              disabled
            />

            <TextField
              label="Role"
              value={profile?.role ?? ""}
              fullWidth
              disabled
            />

            <Button
              variant="contained"
              onClick={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {user?.role === "DRIVER" && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Typography variant="h6">Driver profile</Typography>

              <TextField
                label="License number"
                value={driverForm.licenseNumber}
                onChange={(e) =>
                  handleDriverChange("licenseNumber", e.target.value)
                }
                fullWidth
              />

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

              <TextField
                label="Average rating"
                value={driverProfile?.averageRating ?? ""}
                fullWidth
                disabled
              />

              <TextField
                label="Total ratings"
                value={driverProfile?.totalRatings ?? ""}
                fullWidth
                disabled
              />

              <TextField
                label="Active"
                value={String(driverProfile?.active ?? false)}
                fullWidth
                disabled
              />

              <Button
                variant="contained"
                onClick={handleSaveDriverProfile}
                disabled={savingDriverProfile}
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
