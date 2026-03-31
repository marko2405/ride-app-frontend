import { Alert, Button, Link, MenuItem, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../../components/AuthLayout";
import PasswordField from "../../components/PasswordInput";
import { registerUser, type RegisterRequest } from "../../api/auth/auth";
import { saveAuthData } from "../../utils/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterRequest>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      role: "USER",
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const response = await registerUser(data);
      saveAuthData(response);
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      setError("root", {
        message: axiosError.response?.data?.message || "Registration failed.",
      });
    }
  };

  return (
    <AuthLayout title="Register" subtitle="Create your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

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

          <TextField
            select
            label="Role"
            fullWidth
            defaultValue="USER"
            {...register("role", {
              required: "Role is required.",
            })}
            error={!!errors.role}
            helperText={errors.role?.message}
          >
            <MenuItem value="USER">Passenger</MenuItem>
            <MenuItem value="DRIVER">Driver</MenuItem>
          </TextField>

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
