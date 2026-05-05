import { CircularProgress, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useUser } from "../context/UserContext";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
