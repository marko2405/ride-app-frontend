import type { RatingType } from "../types/rating.types";

export const formatRatingType = (ratingType: RatingType) => {
  const labels: Record<RatingType, string> = {
    PASSENGER_TO_DRIVER: "Passenger rated driver",
    DRIVER_TO_PASSENGER: "Driver rated passenger",
  };

  return labels[ratingType];
};

export const formatRatingDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("sr-RS", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatAverageRating = (value: number) => {
  return value.toFixed(1);
};
