import { http } from "../http";

export interface AdminDashboardResponse {
  totalUsers: number;
  totalPassengers: number;
  totalDrivers: number;
  activeDrivers: number;
  totalRides: number;
  requestedRides: number;
  acceptedRides: number;
  inProgressRides: number;
  completedRides: number;
  cancelledRides: number;
  economicRides: number;
  businessRides: number;
  comfortRides: number;
  totalRevenue: number;
}

export interface AdminUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  enabled: boolean;
  createdAt: string;
}

export interface AdminDriverResponse {
  userId: number;
  driverProfileId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  enabled: boolean;
  active: boolean;
  vehicleClass: string;
  licenseNumber: string | null;
  yearsOfExperience: number | null;
  averageRating: number;
  totalRatings: number;
  carBrand: string | null;
  carModel: string | null;
  carColor: string | null;
  plateNumber: string | null;
  seats: number | null;
}

export const getAdminDashboard = async () => {
  const res = await http.get<AdminDashboardResponse>("/api/admin/dashboard");
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await http.get<AdminUserResponse[]>("/api/admin/users");
  return res.data;
};

export const getAdminDrivers = async () => {
  const res = await http.get<AdminDriverResponse[]>("/api/admin/drivers");
  return res.data;
};

export const toggleAdminUserStatus = async (userId: number) => {
  await http.patch(`/api/admin/users/${userId}/toggle-status`);
};

export const toggleAdminDriverStatus = async (userId: number) => {
  await http.patch(`/api/admin/drivers/${userId}/toggle-status`);
};
