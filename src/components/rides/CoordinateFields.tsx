import { Grid, TextField } from "@mui/material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

export type RideBookingFormValues = {
  pickupLat: string;
  pickupLng: string;
  dropoffLat: string;
  dropoffLng: string;
  scheduledFor: string;
};

type CoordinateFieldsProps = {
  register: UseFormRegister<RideBookingFormValues>;
  errors: FieldErrors<RideBookingFormValues>;
  disabled?: boolean;
};

const coordinateValidation = (label: string) => ({
  required: `${label} is required.`,
  validate: (value: string) => {
    if (value.trim() === "") {
      return `${label} is required.`;
    }

    return !Number.isNaN(Number(value)) || `${label} must be a valid number.`;
  },
});

export default function CoordinateFields({
  register,
  errors,
  disabled = false,
}: CoordinateFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Pickup latitude"
          fullWidth
          disabled={disabled}
          {...register("pickupLat", coordinateValidation("Pickup latitude"))}
          error={!!errors.pickupLat}
          helperText={errors.pickupLat?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Pickup longitude"
          fullWidth
          disabled={disabled}
          {...register("pickupLng", coordinateValidation("Pickup longitude"))}
          error={!!errors.pickupLng}
          helperText={errors.pickupLng?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Dropoff latitude"
          fullWidth
          disabled={disabled}
          {...register("dropoffLat", coordinateValidation("Dropoff latitude"))}
          error={!!errors.dropoffLat}
          helperText={errors.dropoffLat?.message}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Dropoff longitude"
          fullWidth
          disabled={disabled}
          {...register("dropoffLng", coordinateValidation("Dropoff longitude"))}
          error={!!errors.dropoffLng}
          helperText={errors.dropoffLng?.message}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          label="Scheduled for"
          type="datetime-local"
          fullWidth
          disabled={disabled}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          {...register("scheduledFor")}
          error={!!errors.scheduledFor}
          helperText={
            errors.scheduledFor?.message ??
            "Leave empty if the ride should start immediately."
          }
        />
      </Grid>
    </Grid>
  );
}
