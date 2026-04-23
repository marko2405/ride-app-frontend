import { http } from "../../../api/http";
import type {
  CreateRideRatingRequest,
  RideRatingResponse,
  RideRatingsForRideResponse,
  UserRatingSummaryResponse,
} from "../types/rating.types";

export const createRideRating = async (
  rideId: number,
  payload: CreateRideRatingRequest,
) => {
  const res = await http.post<RideRatingResponse>(
    `/api/rides/${rideId}/rating`,
    payload,
  );
  return res.data;
};

export const getRideRatings = async (rideId: number) => {
  const res = await http.get<RideRatingsForRideResponse>(
    `/api/rides/${rideId}/rating`,
  );
  return res.data;
};

export const getUserRatingSummary = async (userId: number) => {
  const res = await http.get<UserRatingSummaryResponse>(
    `/api/users/${userId}/rating-summary`,
  );
  return res.data;
};

export const getUserRatings = async (userId: number) => {
  const res = await http.get<RideRatingResponse[]>(
    `/api/users/${userId}/ratings`,
  );
  return res.data;
};
