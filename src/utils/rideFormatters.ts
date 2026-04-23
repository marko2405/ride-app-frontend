export const formatDistanceKm = (distanceMeters: number) => {
  return `${(distanceMeters / 1000).toFixed(2)} km`;
};

export const formatDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  const parts = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }

  parts.push(`${seconds}s`);

  return parts.join(" ");
};

export const formatPrice = (amount: number, currency: string) => {
  return new Intl.NumberFormat("sr-RS", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDateTime = (value: string | null) => {
  if (!value) {
    return "Ride now";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
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
