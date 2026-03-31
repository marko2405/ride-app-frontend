import { http } from "../http";

export interface UserProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  username: string;
}

export interface DriverProfileResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  licenseNumber: string | null;
  yearsOfExperience: number | null;
  active: boolean;
  averageRating: number;
  totalRatings: number;
}

export interface UpdateDriverProfileRequest {
  licenseNumber: string;
  yearsOfExperience: number | null;
}

export const getMyProfile = async () => {
  const res = await http.get<UserProfileResponse>("/api/profile/me");
  return res.data;
};

export const updateMyProfile = async (data: UpdateUserProfileRequest) => {
  const res = await http.put<UserProfileResponse>("/api/profile/me", data);
  return res.data;
};

export const getMyDriverProfile = async () => {
  const res = await http.get<DriverProfileResponse>("/api/profile/me/driver");
  return res.data;
};

export const updateMyDriverProfile = async (
  data: UpdateDriverProfileRequest,
) => {
  const res = await http.put<DriverProfileResponse>(
    "/api/profile/me/driver",
    data,
  );
  return res.data;
};
