import { APIProvider } from "@vis.gl/react-google-maps";
import { AxiosError } from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createRide, getRideQuote } from "../../api/rides/rides";
import LocationInput, { type PlaceSelection } from "../../components/LocationInput";
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

const getErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
};

const mapToQuotePayload = (values: RideBookingFormValues): RideQuoteRequest => ({
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
  vehicleClass,
  scheduledFor: toScheduledForValue(values.scheduledFor),
});

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

    if (!values.pickupLat || !values.pickupLng) {
      setError("pickupAddress", {
        message: "Choose the pickup point from Google suggestions.",
      });
      valid = false;
    }

    if (!values.dropoffLat || !values.dropoffLng) {
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
      setQuoteError(getErrorMessage(error, "Failed to calculate ride quote."));
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
    } catch (error) {
      setCreateError(getErrorMessage(error, "Failed to create ride."));
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
      <Card
        sx={{
          borderRadius: 6,
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1d4ed8 48%, #312e81 100%)",
          color: "white",
          boxShadow: "0 28px 60px rgba(15, 23, 42, 0.16)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Stack spacing={1.5}>
            <Typography variant="overline" sx={{ opacity: 0.76, letterSpacing: 1.4 }}>
              Passenger booking
            </Typography>
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
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(245,247,255,0.96) 100%)",
          boxShadow: "0 22px 50px rgba(15, 23, 42, 0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
          <Stack spacing={3.5} component="form" onSubmit={handleSubmit(onGetQuote)}>
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
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Scheduled ride
                      </Typography>
                      <Box
                        component="input"
                        type="datetime-local"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isFetchingQuote || isCreatingRide}
                        style={{
                          width: "100%",
                          padding: "16.5px 14px",
                          borderRadius: "16px",
                          border: "1px solid rgba(15, 23, 42, 0.18)",
                          font: "inherit",
                          background: "white",
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Leave empty if you want the ride to start immediately.
                      </Typography>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>

            {quoteError && <Alert severity="error">{quoteError}</Alert>}
            {createError && <Alert severity="error">{createError}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isFetchingQuote || isCreatingRide}
              >
                {isFetchingQuote ? "Calculating..." : "Get quote"}
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
            title="Quote overview"
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
                  <Button
                    variant="text"
                    size="large"
                    disabled={isCreatingRide}
                    onClick={() => navigate("/rides")}
                  >
                    View my rides
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
