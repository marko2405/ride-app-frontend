import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import LocalTaxiRoundedIcon from "@mui/icons-material/LocalTaxiRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
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

  const menuItems = [
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
      label: "Driver My Rides",
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
  ].filter((item) => item.visible);

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
    user?.role === "USER" ? "Passenger" : user?.role === "DRIVER" ? "Driver" : user?.role;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 30%), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
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
            borderRight: "1px solid rgba(148, 163, 184, 0.18)",
            background:
              "linear-gradient(180deg, #0f172a 0%, #172554 45%, #1e1b4b 100%)",
            color: "white",
            p: 2,
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Toolbar sx={{ px: 1, minHeight: 88, alignItems: "flex-end" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src={logoImage}
                alt="Ride App logo"
                sx={{
                  width: 42,
                  height: 42,
                  objectFit: "contain",
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.08)",
                  p: 0.5,
                  flexShrink: 0,
                }}
              />
              <Stack spacing={0.5}>
                <Typography variant="h5" fontWeight={800}>
                  Ride
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.72)" }}
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
                  color: "white",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.16)",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.12)",
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
                    bgcolor: "rgba(255,255,255,0.16)",
                    width: 44,
                    height: 44,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {initials}
                </Avatar>

                <Stack spacing={0.2} sx={{ minWidth: 0 }}>
                  <Typography fontWeight={700} sx={{ color: "white" }} noWrap>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.92)" }}
                    noWrap
                  >
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(255,255,255,0.82)", letterSpacing: 0.3 }}
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
                  color: "white",
                  borderColor: "rgba(255,255,255,0.22)",
                  justifyContent: "flex-start",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.4)",
                    bgcolor: "rgba(255,255,255,0.06)",
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
