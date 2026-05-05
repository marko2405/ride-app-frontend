import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import authImage from "../assets/auth-ride.png";
import logoImage from "../assets/logo.png";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  contentMaxWidth?: number;
  dense?: boolean;
};

export default function AuthLayout({
  title,
  subtitle,
  children,
  contentMaxWidth = 520,
  dense = false,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(0, 1.12fr) minmax(420px, 0.88fr)",
        },
        background:
          "radial-gradient(circle at 78% 16%, rgba(255,255,255,0.42), transparent 22%), linear-gradient(135deg, #f9d95b 0%, #f0bf18 52%, #d99b05 100%)",
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          p: { md: 3, lg: 4 },
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
            borderRadius: { md: 6, lg: 8 },
            boxShadow: "0 28px 40px rgba(76, 50, 4, 0.28)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(80,53,4,0.18) 0%, rgba(63,43,7,0.28) 100%)",
            borderRadius: { md: 6, lg: 8 },
            m: { md: 3, lg: 4 },
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
          p: { xs: 2.5, sm: 4, md: 4.5, lg: 5.5 },
          minWidth: 0,
        }}
      >
        <Stack
          spacing={dense ? 0.6 : 1}
          sx={{
            width: "100%",
            maxWidth: contentMaxWidth,
            mb: dense ? 2 : 3.25,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Stack
            direction="row"
            spacing={1.6}
            alignItems="center"
            justifyContent="center"
            sx={{ minWidth: 0, width: "100%" }}
          >
            <Box
              sx={{
                width: dense ? 58 : { xs: 66, sm: 78 },
                height: dense ? 58 : { xs: 66, sm: 78 },
                borderRadius: 3,
                display: "grid",
                placeItems: "center",
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.26), rgba(184,134,11,0.12))",
                boxShadow:
                  "inset 0 0 0 1px rgba(58,42,6,0.08), 0 14px 28px rgba(99,64,2,0.12)",
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logoImage}
                alt="Ride App logo"
                sx={{
                  width: dense ? 50 : { xs: 56, sm: 68 },
                  height: dense ? 50 : { xs: 56, sm: 68 },
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{
                color: "#111827",
                fontSize: dense
                  ? { xs: "2rem", sm: "2.35rem" }
                  : { xs: "2.55rem", sm: "3.35rem" },
                lineHeight: 1,
                letterSpacing: 0,
                whiteSpace: "nowrap",
              }}
            >
              Ride App
            </Typography>
          </Stack>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(17,24,39,0.72)",
              fontWeight: 500,
              maxWidth: 360,
              fontSize: dense ? "1.03rem" : "1.25rem",
            }}
          >
            Fast rides, simple booking.
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: contentMaxWidth,
            p: dense ? { xs: 2.5, sm: 3 } : { xs: 3, sm: 4.25 },
            borderRadius: { xs: 4, sm: 6 },
            background:
              "linear-gradient(145deg, rgba(255,253,247,0.96) 0%, rgba(255,250,238,0.92) 100%)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.36)",
            boxShadow: "0 24px 70px rgba(92, 61, 5, 0.18)",
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              mb: 0.75,
              fontSize: dense
                ? { xs: "1.8rem", sm: "2.15rem" }
                : { xs: "2rem", sm: "2.5rem" },
              color: "#111827",
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: dense ? 2 : 4,
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
