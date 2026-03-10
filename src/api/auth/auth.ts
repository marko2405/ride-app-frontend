import { http } from "../http";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  desiredRole: string;
}

export interface AuthResponse {
  token: string;
}

export const login = async (data: LoginRequest) => {
  const res = await http.post<AuthResponse>("/api/auth/login", data);
  return res.data;
};

export const registerUser = async (data: RegisterRequest) => {
  const res = await http.post<AuthResponse>("/api/auth/register", data);
  return res.data;
};
