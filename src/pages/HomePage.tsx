import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" mb={2}>
          Home Page
        </Typography>

        <Typography variant="body1" mb={4}>
          You are logged in successfully.
        </Typography>

        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
