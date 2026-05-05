import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import NumbersRoundedIcon from "@mui/icons-material/NumbersRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import PasswordField from "../../components/PasswordInput";
import {
  registerUser,
  type RegisterRequest,
  type VehicleClass,
} from "../../api/auth/auth";
import { useUser } from "../../context/UserContext";
import { saveAuthData } from "../../utils/auth";
import { getApiErrorMessage } from "../../utils/apiError";

const vehicleClassOptions: Array<{ label: string; value: VehicleClass }> = [
  { label: "Economic", value: "ECONOMIC" },
  { label: "Business", value: "BUSINESS" },
  { label: "Comfort", value: "COMFORT" },
];

const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.25,
    backgroundColor: "rgba(255,255,255,0.46)",
    "& fieldset": {
      borderColor: "rgba(17,24,39,0.15)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(17,24,39,0.25)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e3b505",
      borderWidth: 2,
    },
  },
  "& .MuiInputBase-input": {
    py: 1.05,
  },
};

const iconSx = { color: "rgba(17,24,39,0.48)", fontSize: 20 };

const toOptionalString = (value?: string | null) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : null;
};

const buildRegisterPayload = (data: RegisterRequest): RegisterRequest => {
  const basePayload = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    username: data.username.trim(),
    password: data.password,
    role: data.role,
  };

  if (data.role !== "DRIVER") {
    return basePayload;
  }

  return {
    ...basePayload,
    licenseNumber: toOptionalString(data.licenseNumber),
    yearsOfExperience: data.yearsOfExperience ?? null,
    vehicleClass: data.vehicleClass,
    carBrand: data.carBrand?.trim() ?? "",
    carModel: data.carModel?.trim() ?? "",
    carColor: data.carColor?.trim() ?? "",
    plateNumber: data.plateNumber?.trim() ?? "",
    seats: data.seats,
  };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuthenticatedUser, refreshUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    resetField,
    clearErrors,
  } = useForm<RegisterRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      role: "USER",
      licenseNumber: "",
      yearsOfExperience: null,
      vehicleClass: "ECONOMIC",
      carBrand: "",
      carModel: "",
      carColor: "",
      plateNumber: "",
      seats: undefined,
    },
  });

  const selectedRole = watch("role");
  const isDriverRegistration = selectedRole === "DRIVER";

  useEffect(() => {
    if (isDriverRegistration) {
      return;
    }

    resetField("licenseNumber", { defaultValue: "" });
    resetField("yearsOfExperience", { defaultValue: null });
    resetField("vehicleClass", { defaultValue: "ECONOMIC" });
    resetField("carBrand", { defaultValue: "" });
    resetField("carModel", { defaultValue: "" });
    resetField("carColor", { defaultValue: "" });
    resetField("plateNumber", { defaultValue: "" });
    resetField("seats", { defaultValue: undefined });
    clearErrors([
      "licenseNumber",
      "yearsOfExperience",
      "vehicleClass",
      "carBrand",
      "carModel",
      "carColor",
      "plateNumber",
      "seats",
    ]);
  }, [clearErrors, isDriverRegistration, resetField]);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const response = await registerUser(buildRegisterPayload(data));
      saveAuthData(response);
      setAuthenticatedUser(response);
      void refreshUser();
      navigate("/");
    } catch (error) {
      setError("root", {
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <AuthLayout
      title="Register"
      subtitle="Create your account"
      contentMaxWidth={isDriverRegistration ? 680 : 520}
      dense={isDriverRegistration}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={isDriverRegistration ? 1.35 : 2.25}>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

          <Grid container spacing={isDriverRegistration ? 1.1 : 1.75}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First name"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("firstName", {
                  required: "First name is required.",
                  minLength: {
                    value: 2,
                    message: "First name must be at least 2 characters long.",
                  },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Last name"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("lastName", {
                  required: "Last name is required.",
                  minLength: {
                    value: 2,
                    message: "Last name must be at least 2 characters long.",
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email address.",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Username"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("username", {
                  required: "Username is required.",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters long.",
                  },
                })}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <PasswordField
                label="Password"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long.",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Role"
                fullWidth
                size={isDriverRegistration ? "small" : "medium"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeRoundedIcon sx={iconSx} />
                    </InputAdornment>
                  ),
                }}
                sx={authFieldSx}
                {...register("role", {
                  required: "Role is required.",
                })}
                error={!!errors.role}
                helperText={errors.role?.message}
              >
                <MenuItem value="USER">Passenger</MenuItem>
                <MenuItem value="DRIVER">Driver</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {isDriverRegistration && (
            <Stack spacing={1.1}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Driver Information
                </Typography>
                <Divider sx={{ mt: 0.45 }} />
              </Box>

              <Grid container spacing={1.1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="License number"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("licenseNumber")}
                    error={!!errors.licenseNumber}
                    helperText={errors.licenseNumber?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Years of experience"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 0 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("yearsOfExperience", {
                      setValueAs: (value) =>
                        value === "" || value === null ? null : Number(value),
                      min: {
                        value: 0,
                        message: "Years of experience cannot be negative.",
                      },
                    })}
                    error={!!errors.yearsOfExperience}
                    helperText={errors.yearsOfExperience?.message}
                  />
                </Grid>
              </Grid>

              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Vehicle Information
                </Typography>
                <Divider sx={{ mt: 0.45 }} />
              </Box>

              <Grid container spacing={1.1}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Vehicle class"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCarRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("vehicleClass", {
                      validate: (value) =>
                        selectedRole !== "DRIVER" ||
                        !!value ||
                        "Vehicle class is required.",
                    })}
                    error={!!errors.vehicleClass}
                    helperText={errors.vehicleClass?.message}
                  >
                    {vehicleClassOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Seats"
                    type="number"
                    fullWidth
                    size="small"
                    inputProps={{ min: 1 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EventSeatRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("seats", {
                      setValueAs: (value) =>
                        value === "" || value === null
                          ? undefined
                          : Number(value),
                      validate: (value) => {
                        if (selectedRole !== "DRIVER") {
                          return true;
                        }

                        if (value === undefined || Number.isNaN(value)) {
                          return "Seats are required.";
                        }

                        return value > 0 || "Seats must be greater than 0.";
                      },
                    })}
                    error={!!errors.seats}
                    helperText={errors.seats?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Car brand"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCarRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("carBrand", {
                      validate: (value) =>
                        selectedRole !== "DRIVER" ||
                        !!value?.trim() ||
                        "Car brand is required.",
                    })}
                    error={!!errors.carBrand}
                    helperText={errors.carBrand?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Car model"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DirectionsCarRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("carModel", {
                      validate: (value) =>
                        selectedRole !== "DRIVER" ||
                        !!value?.trim() ||
                        "Car model is required.",
                    })}
                    error={!!errors.carModel}
                    helperText={errors.carModel?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Car color"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaletteRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("carColor", {
                      validate: (value) =>
                        selectedRole !== "DRIVER" ||
                        !!value?.trim() ||
                        "Car color is required.",
                    })}
                    error={!!errors.carColor}
                    helperText={errors.carColor?.message}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Plate number"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NumbersRoundedIcon sx={iconSx} />
                        </InputAdornment>
                      ),
                    }}
                    sx={authFieldSx}
                    {...register("plateNumber", {
                      validate: (value) =>
                        selectedRole !== "DRIVER" ||
                        !!value?.trim() ||
                        "Plate number is required.",
                    })}
                    error={!!errors.plateNumber}
                    helperText={errors.plateNumber?.message}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{
              py: isDriverRegistration ? 1.05 : 1.45,
              borderRadius: 999,
              mt: 0.25,
              color: "#111827",
              background: "linear-gradient(90deg, #e8b900 0%, #d99d00 100%)",
              boxShadow: "0 16px 34px rgba(181, 125, 0, 0.24)",
            }}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>

          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            textAlign="center"
            color="#111827"
            sx={{ "& span": { color: "#d99d00", fontWeight: 700 } }}
          >
            Already have an account? <span>Login</span>
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
