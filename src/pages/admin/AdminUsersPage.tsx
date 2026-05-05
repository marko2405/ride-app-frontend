import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getAdminUsers,
  toggleAdminUserStatus,
  type AdminUserResponse,
} from "../../api/admin/admin";
import { getApiErrorMessage } from "../../utils/apiError";
import { formatDateTime } from "../../utils/rideFormatters";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toggleError, setToggleError] = useState("");
  const [userToToggle, setUserToToggle] = useState<AdminUserResponse | null>(
    null,
  );
  const [toggling, setToggling] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminUsers();
      setUsers(response);
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const handleToggleStatus = async () => {
    if (!userToToggle) {
      return;
    }

    try {
      setToggling(true);
      setToggleError("");
      await toggleAdminUserStatus(userToToggle.id);
      await loadUsers();
      setUserToToggle(null);
    } catch (toggleRequestError) {
      setToggleError(getApiErrorMessage(toggleRequestError));
    } finally {
      setToggling(false);
    }
  };

  const userToggleAction = userToToggle?.enabled ? "disable" : "enable";

  if (loading) {
    return (
      <Stack alignItems="center" py={10}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={800}>
          Users
        </Typography>
        <Typography color="text.secondary">
          View passenger and account records.
        </Typography>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void loadUsers()}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!error && users.length === 0 && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography fontWeight={700}>No users found.</Typography>
          </CardContent>
        </Card>
      )}

      {users.length > 0 && (
        <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 880 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                        "&:hover": { bgcolor: "rgba(37, 99, 235, 0.03)" },
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight={700}>
                          {user.firstName} {user.lastName}
                        </Typography>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.enabled ? "Enabled" : "Disabled"}
                          color={user.enabled ? "success" : "default"}
                          variant={user.enabled ? "filled" : "outlined"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button
                          color={user.enabled ? "error" : "success"}
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setToggleError("");
                            setUserToToggle(user);
                          }}
                        >
                          {user.enabled ? "Disable" : "Enable"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={!!userToToggle}
        onClose={() => (toggling ? undefined : setUserToToggle(null))}
      >
        <DialogTitle>
          {userToggleAction === "disable" ? "Disable user" : "Enable user"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <DialogContentText>
              {userToggleAction === "disable"
                ? "Are you sure you want to disable this user?"
                : "Are you sure you want to enable this user?"}
            </DialogContentText>
            {toggleError && <Alert severity="error">{toggleError}</Alert>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={toggling} onClick={() => setUserToToggle(null)}>
            Cancel
          </Button>
          <Button
            color={userToggleAction === "disable" ? "error" : "success"}
            variant="contained"
            disabled={toggling}
            onClick={() => void handleToggleStatus()}
          >
            {toggling
              ? "Saving..."
              : userToggleAction === "disable"
                ? "Disable"
                : "Enable"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
