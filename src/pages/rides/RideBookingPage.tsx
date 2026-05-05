import { APIProvider } from "@vis.gl/react-google-maps";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createRide, getRideQuote } from "../../api/rides/rides";
import LocationInput, {
  type PlaceSelection,
} from "../../components/LocationInput";
import RideOptionCard from "../../components/rides/RideOptionCard";
import RideSummaryCard from "../../components/rides/RideSummaryCard";
import { useUser } from "../../context/UserContext";
import type {
  CreateRideRequest,
  RideQuoteRequest,
  RideQuoteResponse,
  RideResponse,
  VehicleClass,
} from "../../types/ride";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  formatDistanceKm,
  formatDuration,
  toScheduledForValue,
} from "../../utils/rideFormatters";

type RideBookingFormValues = {
  pickupAddress: string;
  pickupLat: string;
  pickupLng: string;
  dropoffAddress: string;
  dropoffLat: string;
  dropoffLng: string;
  scheduledFor: string;
};

const defaultValues: RideBookingFormValues = {
  pickupAddress: "",
  pickupLat: "",
  pickupLng: "",
  dropoffAddress: "",
  dropoffLat: "",
  dropoffLng: "",
  scheduledFor: "",
};

const mapToQuotePayload = (
  values: RideBookingFormValues,
): RideQuoteRequest => ({
  pickupLat: Number(values.pickupLat),
  pickupLng: Number(values.pickupLng),
  dropoffLat: Number(values.dropoffLat),
  dropoffLng: Number(values.dropoffLng),
});

const mapToCreatePayload = (
  values: RideBookingFormValues,
  vehicleClass: VehicleClass,
): CreateRideRequest => ({
  ...mapToQuotePayload(values),
  pickupAddress: values.pickupAddress.trim(),
  dropoffAddress: values.dropoffAddress.trim(),
  vehicleClass,
  scheduledFor: toScheduledForValue(values.scheduledFor),
});

const padTimePart = (value: number) => String(value).padStart(2, "0");

const getTodayDateValue = () => {
  const now = new Date();
  return `${now.getFullYear()}-${padTimePart(now.getMonth() + 1)}-${padTimePart(
    now.getDate(),
  )}`;
};

const parseScheduledValue = (value: string) => {
  const [date = "", time = ""] = value.split("T");
  const [hour = "12", minute = "00"] = time.split(":");

  return {
    date,
    hour: hour || "12",
    minute: minute || "00",
  };
};

const formatScheduledDisplayValue = (value: string) => {
  if (!value) {
    return "";
  }

  const { date, hour, minute } = parseScheduledValue(value);
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}. ${hour}:${minute}`;
};

type ScheduledRidePickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function ScheduledRidePicker({
  value,
  onChange,
  disabled = false,
}: ScheduledRidePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const parsedValue = parseScheduledValue(value);
  const [draftDate, setDraftDate] = useState(parsedValue.date);
  const [draftHour, setDraftHour] = useState(parsedValue.hour);
  const [draftMinute, setDraftMinute] = useState(parsedValue.minute);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    const nextValue = parseScheduledValue(value);
    setDraftDate(nextValue.date || getTodayDateValue());
    setDraftHour(nextValue.hour);
    setDraftMinute(nextValue.minute);

    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleApply = () => {
    if (draftDate) {
      onChange(`${draftDate}T${draftHour}:${draftMinute}`);
    }

    handleClose();
  };

  const handleClear = () => {
    onChange("");
    handleClose();
  };

  return (
    <Box>
      <TextField
        label="Scheduled ride"
        value={formatScheduledDisplayValue(value)}
        placeholder="Select pickup date and time"
        onClick={handleOpen}
        disabled={disabled}
        fullWidth
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <CalendarMonthRoundedIcon
                sx={{ color: "primary.main", fontSize: 20 }}
              />
            </InputAdornment>
          ),
        }}
        sx={{
          cursor: "pointer",
          "& .MuiOutlinedInput-root": {
            cursor: "pointer",
            borderRadius: 1,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
            "& fieldset": {
              borderColor: "rgba(15, 23, 42, 0.12)",
            },
            "&:hover": {
              boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
            },
            "&.Mui-focused": {
              boxShadow: "0 18px 34px rgba(37, 99, 235, 0.16)",
            },
          },
          "& input": {
            cursor: "pointer",
          },
          "& .MuiInputLabel-root": {
            fontWeight: 600,
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            width: { xs: "calc(100vw - 32px)", sm: 420 },
            borderRadius: 3,
            boxShadow: "0 22px 52px rgba(15, 23, 42, 0.18)",
          },
        }}
      >
        <Stack spacing={2} sx={{ p: 2.5 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeRoundedIcon sx={{ color: "primary.main" }} />
            <Typography fontWeight={800}>Choose schedule</Typography>
          </Stack>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Date"
                type="date"
                value={draftDate}
                onChange={(event) => setDraftDate(event.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                label="Hour"
                value={draftHour}
                onChange={(event) => setDraftHour(event.target.value)}
                fullWidth
              >
                {Array.from({ length: 24 }, (_, hour) => padTimePart(hour)).map(
                  (hour) => (
                    <MenuItem key={hour} value={hour}>
                      {hour}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                select
                label="Minute"
                value={draftMinute}
                onChange={(event) => setDraftMinute(event.target.value)}
                fullWidth
              >
                {Array.from({ length: 60 }, (_, minute) =>
                  padTimePart(minute),
                ).map((minute) => (
                  <MenuItem key={minute} value={minute}>
                    {minute}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1.25} justifyContent="flex-end">
            <Button variant="text" onClick={handleClear}>
              Clear
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={!draftDate}
            >
              Done
            </Button>
          </Stack>
        </Stack>
      </Popover>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        Leave empty if you want the ride to start immediately.
      </Typography>
    </Box>
  );
}

function BookingContent() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [quote, setQuote] = useState<RideQuoteResponse | null>(null);
  const [selectedVehicleClass, setSelectedVehicleClass] =
    useState<VehicleClass | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [createError, setCreateError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createdRide, setCreatedRide] = useState<RideResponse | null>(null);
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [isCreatingRide, setIsCreatingRide] = useState(false);
  const previousSignatureRef = useRef(JSON.stringify(defaultValues));

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<RideBookingFormValues>({
    defaultValues,
  });

  const watchedValues = watch();
  const currentSignature = JSON.stringify(watchedValues);

  useEffect(() => {
    if (previousSignatureRef.current === currentSignature) {
      return;
    }

    previousSignatureRef.current = currentSignature;

    if (!quote) {
      return;
    }

    setQuote(null);
    setSelectedVehicleClass(null);
    setCreateError("");
    setSuccessMessage("");
    setCreatedRide(null);
  }, [currentSignature, quote]);

  const clearLocationCoordinates = (prefix: "pickup" | "dropoff") => {
    setValue(`${prefix}Lat`, "", { shouldDirty: true });
    setValue(`${prefix}Lng`, "", { shouldDirty: true });
  };

  const handlePlaceSelect = (
    prefix: "pickup" | "dropoff",
    place: PlaceSelection,
  ) => {
    setValue(`${prefix}Address`, place.address, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`${prefix}Lat`, String(place.lat), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`${prefix}Lng`, String(place.lng), {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(`${prefix}Address`);
  };

  const validateSelectedLocations = (values: RideBookingFormValues) => {
    let valid = true;

    if (
      !values.pickupAddress.trim() ||
      !values.pickupLat ||
      !values.pickupLng
    ) {
      setError("pickupAddress", {
        message: "Choose the pickup point from Google suggestions.",
      });
      valid = false;
    }

    if (
      !values.dropoffAddress.trim() ||
      !values.dropoffLat ||
      !values.dropoffLng
    ) {
      setError("dropoffAddress", {
        message: "Choose the dropoff point from Google suggestions.",
      });
      valid = false;
    }

    return valid;
  };

  const onGetQuote = async (values: RideBookingFormValues) => {
    if (!validateSelectedLocations(values)) {
      return;
    }

    try {
      setIsFetchingQuote(true);
      setQuoteError("");
      setCreateError("");
      setSuccessMessage("");
      setCreatedRide(null);
      setSelectedVehicleClass(null);

      const response = await getRideQuote(mapToQuotePayload(values));
      setQuote(response);
    } catch (error) {
      setQuote(null);
      setQuoteError(getApiErrorMessage(error));
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleConfirmRide = async () => {
    if (!selectedVehicleClass) {
      setCreateError("Please select a vehicle class before confirming.");
      return;
    }

    if (!validateSelectedLocations(watchedValues)) {
      return;
    }

    try {
      setIsCreatingRide(true);
      setCreateError("");
      setSuccessMessage("");

      const payload = mapToCreatePayload(watchedValues, selectedVehicleClass);
      const response = await createRide(payload);

      setCreatedRide(response);
      setSuccessMessage(`Ride #${response.id} has been created successfully.`);
      navigate(`/rides/${response.id}`);
    } catch (error) {
      setCreateError(getApiErrorMessage(error));
    } finally {
      setIsCreatingRide(false);
    }
  };

  if (user?.role === "DRIVER") {
    return (
      <Stack spacing={3.5}>
        <Card sx={{ borderRadius: 5 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={1.5}>
              <Typography variant="h4" fontWeight={700}>
                Ride booking
              </Typography>
              <Typography color="text.secondary">
                Driver accounts cannot create or schedule passenger rides.
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Open your existing rides to track ride states and booking history.
        </Alert>

        <Button
          variant="contained"
          onClick={() => navigate("/rides")}
          sx={{ alignSelf: "flex-start" }}
        >
          Go to my rides
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3.5}>
      <Button
        variant="text"
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate("/")}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>
      <Card
        sx={{
          borderRadius: 6,
          overflow: "hidden",
          background:
            "linear-gradient(180deg, #f7d85d 0%, #efc437 48%, #dfa610 100%)",
          color: "#3a2a06",
          boxShadow: "0 22px 44px rgba(180, 138, 9, 0.16)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={1}>
            <Typography variant="h4" fontWeight={800}>
              Book a ride
            </Typography>
            <Typography sx={{ maxWidth: 760, opacity: 0.84 }}>
              Search pickup and dropoff locations, review the route quote, and
              then confirm the ride.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Card
        sx={{
          borderRadius: 5,
          maxWidth: 980,
          width: "100%",
          mx: "auto",
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(255,250,235,0.98) 100%)",
          boxShadow: "0 22px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Stack
            spacing={3.5}
            component="form"
            onSubmit={handleSubmit(onGetQuote)}
          >
            <Stack spacing={0.75}>
              <Typography variant="h6" fontWeight={700}>
                Route details
              </Typography>
              <Typography color="text.secondary">
                Choose both points from Google suggestions so the app can fetch
                the exact coordinates automatically.
              </Typography>
            </Stack>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="pickupAddress"
                  control={control}
                  rules={{ required: "Pickup location is required." }}
                  render={({ field }) => (
                    <LocationInput
                      label="Pickup location"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        clearLocationCoordinates("pickup");
                      }}
                      onPlaceSelect={(place) => {
                        handlePlaceSelect("pickup", place);
                      }}
                      error={!!errors.pickupAddress}
                      helperText={
                        errors.pickupAddress?.message ??
                        "Pick a place from the Google suggestions."
                      }
                      placeholder="Search pickup address"
                      disabled={isFetchingQuote || isCreatingRide}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="dropoffAddress"
                  control={control}
                  rules={{ required: "Dropoff location is required." }}
                  render={({ field }) => (
                    <LocationInput
                      label="Dropoff location"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        clearLocationCoordinates("dropoff");
                      }}
                      onPlaceSelect={(place) => {
                        handlePlaceSelect("dropoff", place);
                      }}
                      error={!!errors.dropoffAddress}
                      helperText={
                        errors.dropoffAddress?.message ??
                        "Pick a place from the Google suggestions."
                      }
                      placeholder="Search dropoff address"
                      disabled={isFetchingQuote || isCreatingRide}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="scheduledFor"
                  control={control}
                  render={({ field }) => (
                    <ScheduledRidePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isFetchingQuote || isCreatingRide}
                    />
                  )}
                />
              </Grid>
            </Grid>

            {quoteError && <Alert severity="error">{quoteError}</Alert>}
            {createError && <Alert severity="error">{createError}</Alert>}
            {successMessage && (
              <Alert severity="success">{successMessage}</Alert>
            )}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isFetchingQuote || isCreatingRide}
              >
                {isFetchingQuote ? "Finding..." : "Find Ride Options"}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                disabled={isFetchingQuote || isCreatingRide}
                onClick={() => {
                  reset(defaultValues);
                  previousSignatureRef.current = JSON.stringify(defaultValues);
                  setQuote(null);
                  setSelectedVehicleClass(null);
                  setQuoteError("");
                  setCreateError("");
                  setSuccessMessage("");
                  setCreatedRide(null);
                }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {isFetchingQuote && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {quote && (
        <Stack spacing={3.5}>
          <RideSummaryCard
            quote={quote}
            title="Ride overview"
            pickupAddress={watchedValues.pickupAddress}
            dropoffAddress={watchedValues.dropoffAddress}
            selectedVehicleClass={selectedVehicleClass}
            scheduledFor={toScheduledForValue(watchedValues.scheduledFor)}
          />

          <Card sx={{ borderRadius: 5 }}>
            <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
              <Stack spacing={3.5}>
                <Stack spacing={1}>
                  <Typography variant="h5" fontWeight={700}>
                    Choose your ride
                  </Typography>
                  <Typography color="text.secondary">
                    {formatDistanceKm(quote.distanceMeters)} •{" "}
                    {formatDuration(quote.durationSeconds)} • {quote.currency}
                  </Typography>
                </Stack>

                <Grid container spacing={2.5}>
                  {quote.options.map((option) => (
                    <Grid key={option.vehicleClass} size={{ xs: 12, md: 4 }}>
                      <RideOptionCard
                        option={option}
                        currency={quote.currency}
                        selected={selectedVehicleClass === option.vehicleClass}
                        onSelect={setSelectedVehicleClass}
                      />
                    </Grid>
                  ))}
                </Grid>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    disabled={!selectedVehicleClass || isCreatingRide}
                    onClick={handleConfirmRide}
                  >
                    {isCreatingRide ? "Booking ride..." : "Confirm ride"}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      )}

      {createdRide && (
        <Stack spacing={2.5}>
          <RideSummaryCard ride={createdRide} title="Created ride" />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/rides/${createdRide.id}`)}
            >
              Open ride details
            </Button>
            <Button variant="text" onClick={() => navigate("/rides")}>
              Go to my rides
            </Button>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default function RideBookingPage() {
  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <BookingContent />
    </APIProvider>
  );
}
