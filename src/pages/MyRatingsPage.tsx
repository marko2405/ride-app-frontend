import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Alert, Button, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import UserRatingSummaryCard from "../modules/ratings/components/UserRatingSummaryCard";
import UserRatingsList from "../modules/ratings/components/UserRatingsList";

export default function MyRatingsPage() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return <Alert severity="info">User profile is not available.</Alert>;
  }

  return (
    <Stack spacing={3.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack spacing={1}>
          <Button
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/")}
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight={700}>
            My ratings
          </Typography>
          <Typography color="text.secondary">
            Review your received ratings and open the related ride details.
          </Typography>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <UserRatingSummaryCard userId={user.id} />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <UserRatingsList userId={user.id} />
        </Grid>
      </Grid>
    </Stack>
  );
}
