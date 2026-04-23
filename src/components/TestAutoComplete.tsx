import { APIProvider } from "@vis.gl/react-google-maps";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import LocationInput from "./LocationInput";

export default function TestAutocomplete() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Test Google Autocomplete
        </Typography>

        <LocationInput
          label="Pickup"
          value={pickup}
          onChange={setPickup}
          onPlaceSelect={(data) => {
            setPickup(data.address);
            console.log("Pickup:", data);
          }}
        />

        <LocationInput
          label="Dropoff"
          value={dropoff}
          onChange={setDropoff}
          onPlaceSelect={(data) => {
            setDropoff(data.address);
            console.log("Dropoff:", data);
          }}
        />

        <Box>
          <Typography variant="body2" color="text.secondary">
            Pickup: {pickup || "-"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dropoff: {dropoff || "-"}
          </Typography>
        </Box>
      </Stack>
    </APIProvider>
  );
}
