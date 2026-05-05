import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { UserProvider } from "./context/UserContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e3b505",
      dark: "#c89200",
      light: "#f6d75d",
      contrastText: "#2f2200",
    },
    secondary: {
      main: "#b8860b",
      contrastText: "#2f2200",
    },
    background: {
      default: "#fff9ea",
      paper: "#fffdf7",
    },
    text: {
      primary: "#3a2a06",
      secondary: "#7c5d10",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily:
      '"Segoe UI", "Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 700,
          paddingInline: 18,
        },
        containedPrimary: {
          boxShadow: "0 12px 28px rgba(227, 181, 5, 0.26)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 20px 45px rgba(143, 102, 8, 0.08)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
