import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { Alert, Button, InputAdornment, Link, Stack, TextField } from "@mui/material";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import PasswordInput from "../../components/PasswordInput";
import { login, type LoginRequest } from "../../api/auth/auth";
import { useUser } from "../../context/UserContext";
import { saveAuthData } from "../../utils/auth";

const authFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.44)",
    "& fieldset": {
      borderColor: "rgba(17,24,39,0.16)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(17,24,39,0.26)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#e3b505",
      borderWidth: 2,
    },
  },
  "& .MuiInputBase-input": {
    py: 1.65,
  },
};

const getLoginErrorMessage = (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    return "Incorrect email or password.";
  }

  return "Something went wrong. Please try again.";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthenticatedUser, refreshUser } = useUser();

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
      setAuthenticatedUser(response);
      void refreshUser();
      navigate(response.role === "ADMIN" ? "/admin/dashboard" : "/");
    } catch (error) {
      setError("root", {
        message: getLoginErrorMessage(error),
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailRoundedIcon sx={{ color: "rgba(17,24,39,0.48)" }} />
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

          <PasswordInput
            label="Password"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ color: "rgba(17,24,39,0.48)" }} />
                </InputAdornment>
              ),
            }}
            sx={authFieldSx}
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
            sx={{
              py: 1.55,
              borderRadius: 999,
              mt: 0.5,
              color: "#111827",
              background: "linear-gradient(90deg, #e8b900 0%, #d99d00 100%)",
              boxShadow: "0 16px 34px rgba(181, 125, 0, 0.26)",
            }}
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>

          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            textAlign="center"
            color="#111827"
            sx={{ "& span": { color: "#d99d00", fontWeight: 700 } }}
          >
            Don&apos;t have an account? <span>Register</span>
          </Link>
        </Stack>
      </form>
    </AuthLayout>
  );
}
