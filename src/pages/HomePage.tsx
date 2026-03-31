import {
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useUser } from "../context/UserContext";

export default function HomePage() {
  const { user, loading, error } = useUser();

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Dashboard
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">Logged in user</Typography>
            <Typography>
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {user?.email}
            </Typography>
            <Typography>
              <strong>Username:</strong> {user?.username}
            </Typography>
            <Typography>
              <strong>Role:</strong> {user?.role}
            </Typography>
            <Typography>
              <strong>Enabled:</strong> {String(user?.enabled)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
