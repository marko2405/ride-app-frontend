import { http } from "../http";

export type Role = "USER" | "DRIVER" | "ADMIN";

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
  role: Role;
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
