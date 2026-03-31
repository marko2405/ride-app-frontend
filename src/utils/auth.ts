import type { AuthResponse } from "../api/auth/auth";

export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export const getStoredUser = (): AuthResponse | null => {
  const raw = localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
};

export const saveAuthData = (data: AuthResponse) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
};

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export const isDriver = () => getStoredUser()?.role === "DRIVER";
export const isAdmin = () => getStoredUser()?.role === "ADMIN";
export const isUser = () => getStoredUser()?.role === "USER";
