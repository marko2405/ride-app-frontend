import type { RideStatus, VehicleClass } from "../types/ride";

export const formatDistance = (distanceMeters: number) => {
  return `${(distanceMeters / 1000).toFixed(2)} km`;
};

export const formatDistanceKm = formatDistance;

export const formatDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (parts.length === 0) {
    parts.push("< 1m");
  }

  return parts.join(" ");
};

export const formatMoney = (amount: number, currency: string) => {
  return `${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} ${currency}`;
};

export const formatPrice = formatMoney;

export const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Ride now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export const toScheduledForValue = (value: string) => {
  if (!value) {
    return null;
  }

  return `${value}:00`;
};

export const formatCoordinate = (value: number) => {
  return value.toFixed(6);
};

export const formatRideAddress = (address?: string | null) => {
  const trimmedAddress = address?.trim();
  return trimmedAddress || "Address unavailable";
};

export const formatRating = (averageRating: number, totalRatings: number) => {
  if (totalRatings === 0) {
    return "No ratings yet";
  }

  const label = totalRatings === 1 ? "rating" : "ratings";
  return `${averageRating.toFixed(1)} (${totalRatings} ${label})`;
};

const vehicleClassLabels: Record<VehicleClass, string> = {
  ECONOMIC: "Economic",
  BUSINESS: "Business",
  COMFORT: "Comfort",
};

export const formatVehicleClass = (vehicleClass: VehicleClass) => {
  return vehicleClassLabels[vehicleClass];
};

const rideStatusLabels: Record<RideStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const formatRideStatus = (status: RideStatus) => {
  return rideStatusLabels[status];
};
