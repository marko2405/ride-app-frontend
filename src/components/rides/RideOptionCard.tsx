import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import businessCar from "../../assets/bussiness.jpeg";
import comfortCar from "../../assets/comfort.jpeg";
import economicCar from "../../assets/economic.jpeg";
import type { RideOptionResponse } from "../../types/ride";
import { formatPrice } from "../../utils/rideFormatters";

type RideOptionCardProps = {
  option: RideOptionResponse;
  currency: string;
  selected: boolean;
  onSelect: (vehicleClass: RideOptionResponse["vehicleClass"]) => void;
};

const vehicleImageMap = {
  ECONOMIC: economicCar,
  BUSINESS: businessCar,
  COMFORT: comfortCar,
} as const;

const vehicleImageSizingMap = {
  ECONOMIC: { width: "78%", maxHeight: 100 },
  BUSINESS: { width: "64%", maxHeight: 104 },
  COMFORT: { width: "76%", maxHeight: 102 },
} as const;

export default function RideOptionCard({
  option,
  currency,
  selected,
  onSelect,
}: RideOptionCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: selected ? "2px solid" : "1px solid",
        borderColor: selected ? "primary.main" : "divider",
        boxShadow: selected ? "0 18px 36px rgba(29, 78, 216, 0.16)" : 0,
        transition: "all 0.2s ease",
        height: "100%",
      }}
    >
      <CardActionArea onClick={() => onSelect(option.vehicleClass)}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                height: 132,
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
              }}
            >
              <Box
                component="img"
                src={vehicleImageMap[option.vehicleClass]}
                alt={`${option.vehicleClass} vehicle class`}
                sx={{
                  width: vehicleImageSizingMap[option.vehicleClass].width,
                  maxHeight:
                    vehicleImageSizingMap[option.vehicleClass].maxHeight,
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={700}>
                {option.vehicleClass}
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={800}>
                {formatPrice(option.totalPrice, currency)}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Base price</Typography>
              <Typography fontWeight={600}>
                {formatPrice(option.basePrice, currency)}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography color="text.secondary">Distance price</Typography>
              <Typography fontWeight={600}>
                {formatPrice(option.distancePrice, currency)}
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
