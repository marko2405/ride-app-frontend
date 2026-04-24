export type VehicleClass = "ECONOMIC" | "BUSINESS" | "COMFORT";

export type RideStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface RidePersonInfo {
  id: number;
  fullName: string;
  averageRating: number;
  totalRatings: number;
}

export interface RideVehicleInfo {
  vehicleClass: VehicleClass;
  carBrand: string;
  carModel: string;
  carColor: string;
  plateNumber: string;
  seats: number;
}

export interface RideQuoteRequest {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}

export interface RideOptionResponse {
  vehicleClass: VehicleClass;
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
}

export interface RideQuoteResponse {
  distanceMeters: number;
  durationSeconds: number;
  currency: string;
  options: RideOptionResponse[];
}

export interface CreateRideRequest {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  vehicleClass: VehicleClass;
  scheduledFor: string | null;
}

export interface RideResponse {
  id: number;
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
  vehicleClass: VehicleClass;
  status: RideStatus;
  distanceMeters: number;
  durationSeconds: number;
  currency: string;
  basePrice: number;
  distancePrice: number;
  totalPrice: number;
  scheduledFor: string | null;
  passengerId: number;
  driverId: number | null;
  passengerInfo: RidePersonInfo;
  driverInfo: RidePersonInfo | null;
  vehicleInfo: RideVehicleInfo | null;
  createdAt: string;
  updatedAt: string;
}
