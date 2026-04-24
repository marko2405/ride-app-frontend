import { http } from "../http";

export type Role = "USER" | "DRIVER" | "ADMIN";
export type RegisterRole = "USER" | "DRIVER";
export type VehicleClass = "ECONOMIC" | "BUSINESS" | "COMFORT";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: RegisterRole;
  licenseNumber?: string | null;
  yearsOfExperience?: number | null;
  vehicleClass?: VehicleClass;
  carBrand?: string;
  carModel?: string;
  carColor?: string;
  plateNumber?: string;
  seats?: number;
}

export interface AuthResponse {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  enabled: boolean;
}

export const login = async (data: LoginRequest) => {
  const res = await http.post<AuthResponse>("/api/auth/login", data);
  return res.data;
};

export const registerUser = async (data: RegisterRequest) => {
  const res = await http.post<AuthResponse>("/api/auth/register", data);
  return res.data;
};
