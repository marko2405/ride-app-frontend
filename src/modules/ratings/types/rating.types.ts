export type RatingType = "PASSENGER_TO_DRIVER" | "DRIVER_TO_PASSENGER";

export type CreateRideRatingRequest = {
  score: number;
};

export type RideRatingResponse = {
  id: number;
  rideId: number;
  fromUserId: number;
  toUserId: number;
  ratingType: RatingType;
  score: number;
  createdAt: string;
};

export type RideRatingsForRideResponse = {
  passengerToDriverRating: RideRatingResponse | null;
  driverToPassengerRating: RideRatingResponse | null;
};

export type UserRatingSummaryResponse = {
  userId: number;
  averageRating: number;
  totalRatings: number;
  breakdown: Record<string, number>;
};
