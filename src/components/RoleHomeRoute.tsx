import { CircularProgress, Stack } from "@mui/material";
import { Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import { useUser } from "../context/UserContext";

export default function RoleHomeRoute() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <HomePage />;
}
