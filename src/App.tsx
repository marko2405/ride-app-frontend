import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import RoleHomeRoute from "./components/RoleHomeRoute";
import DashboardLayout from "./components/DashboardLayout";
import TestAutocomplete from "./components/TestAutoComplete";
import RideBookingPage from "./pages/rides/RideBookingPage";
import MyRidesPage from "./pages/rides/MyRidesPage";
import RideDetailsPage from "./pages/rides/RideDetailsPage";
import AvailableRidesPage from "./pages/rides/AvailableRidesPage";
import DriverMyRidesPage from "./pages/rides/DriverMyRidesPage";
import MyRatingsPage from "./pages/MyRatingsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminDriversPage from "./pages/admin/AdminDriversPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/test-map" element={<TestAutocomplete />} />
          <Route path="/" element={<RoleHomeRoute />} />
          <Route path="/rides/new" element={<RideBookingPage />} />
          <Route path="/rides" element={<MyRidesPage />} />
          <Route path="/driver/rides/available" element={<AvailableRidesPage />} />
          <Route path="/driver/rides" element={<DriverMyRidesPage />} />
          <Route path="/rides/:rideId" element={<RideDetailsPage />} />
          <Route path="/ratings" element={<MyRatingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/drivers"
            element={
              <AdminRoute>
                <AdminDriversPage />
              </AdminRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
