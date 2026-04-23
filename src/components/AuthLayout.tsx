import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import authImage from "../assets/auth-ride.png";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        background:
          "linear-gradient(135deg, #0f1020 0%, #171a35 45%, #1e1b4b 100%)",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: 4,
        }}
      >
        <Box
          component="img"
          src={authImage}
          alt="Ride app illustration"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 6,
            boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(15,16,32,0.08) 0%, rgba(15,16,32,0.28) 100%)",
            borderRadius: 6,
            m: 4,
            pointerEvents: "none",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Stack
          spacing={0.5}
          sx={{
            width: "100%",
            maxWidth: 520,
            mb: 3,
          }}
        >
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              color: "white",
              fontSize: { xs: "2.4rem", sm: "3.25rem" },
              lineHeight: 1,
              letterSpacing: -1.2,
            }}
          >
            Ride App
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.78)",
              fontWeight: 500,
              maxWidth: 360,
            }}
          >
            Fast rides, simple booking.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 520,
            p: { xs: 3, sm: 4.5 },
            borderRadius: 5,
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mb: 1,
              fontSize: { xs: "2rem", sm: "2.5rem" },
              color: "#111827",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "#6b7280",
            }}
          >
            {subtitle}
          </Typography>

          {children}
        </Paper>
      </Box>
    </Box>
  );
}
