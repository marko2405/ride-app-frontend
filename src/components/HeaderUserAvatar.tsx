import { Avatar, Tooltip, Stack, Typography, Box } from "@mui/material";
import { useUser } from "../context/UserContext";

export default function HeaderUserAvatar() {
  const { user } = useUser();

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`;

  return (
    <Tooltip
      arrow
      placement="bottom-end"
      title={
        <Box>
          <Stack spacing={0.5}>
            <Typography fontWeight={600}>
              {user.firstName} {user.lastName}
            </Typography>

            <Typography variant="body2">{user.email}</Typography>

            <Typography variant="caption">Role: {user.role}</Typography>
          </Stack>
        </Box>
      }
    >
      <Avatar
        sx={{
          bgcolor: "primary.main",
          cursor: "pointer",
          width: 36,
          height: 36,
          fontWeight: 600,
        }}
      >
        {initials}
      </Avatar>
    </Tooltip>
  );
}
