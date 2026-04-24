import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../../components/AuthLayout";
import PasswordField from "../../components/PasswordInput";
import {
  registerUser,
  type RegisterRequest,
  type VehicleClass,
} from "../../api/auth/auth";
import { useUser } from "../../context/UserContext";
import { saveAuthData } from "../../utils/auth";

const vehicleClassOptions: Array<{ label: string; value: VehicleClass }> = [
  { label: "Economic", value: "ECONOMIC" },
  { label: "Business", value: "BUSINESS" },
  { label: "Comfort", value: "COMFORT" },
];

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
      const axiosError = error as AxiosError<{ message?: string }>;

      setError("root", {
        message: axiosError.response?.data?.message || "Registration failed.",
      });
    }
  };

  return (
    <AuthLayout
      title="Register"
      subtitle="Create your account"
      contentMaxWidth={isDriverRegistration ? 760 : 520}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.25}>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

          <Grid container spacing={1.75}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="First name"
                fullWidth
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
            <Stack spacing={1.75}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Driver Information
                </Typography>
                <Divider sx={{ mt: 0.75 }} />
              </Box>

              <Grid container spacing={1.75}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="License number"
                    fullWidth
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
                    inputProps={{ min: 0 }}
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
                <Divider sx={{ mt: 0.75 }} />
              </Box>

              <Grid container spacing={1.75}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    label="Vehicle class"
                    fullWidth
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
                    inputProps={{ min: 1 }}
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
            sx={{ py: 1.4, borderRadius: 2 }}
          >
            {isSubmitting ? "Creating account..." : "Register"}
          </Button>

          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            textAlign="center"
          >
            Already have an account? Login
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
