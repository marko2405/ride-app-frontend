import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png";
import { useUser } from "../context/UserContext";
import { clearAuthStorage } from "../utils/auth";

const drawerWidth = 272;

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const isAdmin = user?.role === "ADMIN";

  const menuItems = (
    isAdmin
      ? [
          {
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: <SpaceDashboardRoundedIcon />,
            visible: true,
          },
          {
            label: "Users",
            path: "/admin/users",
            icon: <GroupsRoundedIcon />,
            visible: true,
          },
          {
            label: "Drivers",
            path: "/admin/drivers",
            icon: <DirectionsCarFilledRoundedIcon />,
            visible: true,
          },
        ]
      : [
          {
            label: "Dashboard",
            path: "/",
            icon: <SpaceDashboardRoundedIcon />,
            visible: true,
          },
          {
            label: "Book Ride",
            path: "/rides/new",
            icon: <LocalTaxiRoundedIcon />,
            visible: user?.role !== "DRIVER",
          },
          {
            label: "My Rides",
            path: "/rides",
            icon: <LocalTaxiRoundedIcon />,
            visible: user?.role !== "DRIVER",
          },
          {
            label: "Available Rides",
            path: "/driver/rides/available",
            icon: <LocalTaxiRoundedIcon />,
            visible: user?.role === "DRIVER",
          },
          {
            label: "My Rides",
            path: "/driver/rides",
            icon: <LocalTaxiRoundedIcon />,
            visible: user?.role === "DRIVER",
          },
          {
            label: "Profile",
            path: "/profile",
            icon: <PersonRoundedIcon />,
            visible: true,
          },
          {
            label: "My Ratings",
            path: "/ratings",
            icon: <StarRoundedIcon />,
            visible: true,
          },
        ]
  ).filter((item) => item.visible);

  const handleLogout = () => {
    clearAuthStorage();
    setUser(null);
    navigate("/login");
  };

  const isMenuItemSelected = (path: string) => {
    if (path === "/rides") {
      return (
        location.pathname === "/rides" ||
        (user?.role !== "DRIVER" && /^\/rides\/\d+$/.test(location.pathname))
      );
    }

    if (path === "/driver/rides") {
      return (
        location.pathname === "/driver/rides" ||
        (user?.role === "DRIVER" && /^\/rides\/\d+$/.test(location.pathname))
      );
    }

    return location.pathname === path;
  };

  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;
  const roleLabel =
    user?.role === "USER"
      ? "Passenger"
      : user?.role === "DRIVER"
        ? "Driver"
        : user?.role === "ADMIN"
          ? "Admin"
          : user?.role;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(245, 198, 27, 0.14), transparent 26%), linear-gradient(180deg, #fffdf7 0%, #fff8e2 100%)",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid rgba(184, 134, 11, 0.16)",
            background:
              "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
            color: "#3a2a06",
            p: 2,
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Toolbar sx={{ px: 0.75, minHeight: 104, alignItems: "flex-end" }}>
            <Stack direction="row" spacing={1.4} alignItems="center">
              <Box
                component="img"
                src={logoImage}
                alt="Ride App logo"
                sx={{
                  width: 70,
                  height: 70,
                  objectFit: "contain",
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  boxShadow: "inset 0 0 0 1px rgba(58,42,6,0.08)",
                  p: 0.15,
                  flexShrink: 0,
                }}
              />
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={800}>
                  Ride
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(58,42,6,0.72)" }}
                >
                  Clean booking flow for everyday rides
                </Typography>
              </Stack>
            </Stack>
          </Toolbar>

          <List sx={{ mt: 3, px: 0.5 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={isMenuItemSelected(item.path)}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 3,
                  mb: 0.75,
                  color: "#3a2a06",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.4)",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(255,255,255,0.5)",
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.28)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Box sx={{ mt: "auto", px: 0.5, pt: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.42)",
                    width: 44,
                    height: 44,
                    fontWeight: 700,
                    color: "#3a2a06",
                  }}
                >
                  {initials}
                </Avatar>

                <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                  <Typography fontWeight={700} sx={{ color: "#3a2a06" }} noWrap>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(58,42,6,0.86)" }}
                    noWrap
                  >
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(58,42,6,0.72)", letterSpacing: 0.3 }}
                  >
                    {roleLabel}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 999,
                  color: "#3a2a06",
                  borderColor: "rgba(58,42,6,0.18)",
                  justifyContent: "flex-start",
                  "&:hover": {
                    borderColor: "rgba(58,42,6,0.28)",
                    bgcolor: "rgba(255,255,255,0.22)",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          maxWidth: "100%",
        }}
      >
        <Box sx={{ width: "100%", pt: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
