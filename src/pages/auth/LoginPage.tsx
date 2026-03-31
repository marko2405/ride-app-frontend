import { Alert, Button, Link, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import AuthLayout from "../../components/AuthLayout";
import PasswordInput from "../../components/PasswordInput";
import { login, type LoginRequest } from "../../api/auth/auth";
import { saveAuthData } from "../../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data);
      saveAuthData(response);
      navigate("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;

      setError("root", {
        message: axiosError.response?.data?.message || "Login failed.",
      });
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2.5}>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}

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

          <PasswordInput
            label="Password"
            fullWidth
            {...register("password", {
              required: "Password is required.",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
            sx={{ py: 1.4, borderRadius: 2 }}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            textAlign="center"
          >
            Don't have an account? Register
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
