import { http } from "../http";
import type {
  CreateRideRequest,
  RideQuoteRequest,
  RideQuoteResponse,
  RideResponse,
} from "../../types/ride";

export const getRideQuote = async (payload: RideQuoteRequest) => {
  const res = await http.post<RideQuoteResponse>("/api/rides/quote", payload);
  return res.data;
};

export const createRide = async (payload: CreateRideRequest) => {
  const res = await http.post<RideResponse>("/api/rides", payload);
  return res.data;
};

export const getMyRides = async () => {
  const res = await http.get<RideResponse[]>("/api/rides/my");
  return res.data;
};

export const getAvailableRides = async () => {
  const res = await http.get<RideResponse[]>("/api/rides/available");
  return res.data;
};

export const getMyDriverRides = async () => {
  const res = await http.get<RideResponse[]>("/api/rides/driver/my");
  return res.data;
};

export const getRideById = async (rideId: number) => {
  const res = await http.get<RideResponse>(`/api/rides/${rideId}`);
  return res.data;
};

export const acceptRide = async (rideId: number) => {
  const res = await http.patch<RideResponse>(`/api/rides/${rideId}/accept`);
  return res.data;
};

export const startRide = async (rideId: number) => {
  const res = await http.patch<RideResponse>(`/api/rides/${rideId}/start`);
  return res.data;
};

export const completeRide = async (rideId: number) => {
  const res = await http.patch<RideResponse>(`/api/rides/${rideId}/complete`);
  return res.data;
};

export const cancelRide = async (rideId: number) => {
  const res = await http.patch<RideResponse>(`/api/rides/${rideId}/cancel`);
  return res.data;
};
