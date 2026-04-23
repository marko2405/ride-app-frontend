import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import TestAutocomplete from "./components/TestAutoComplete";
import RideBookingPage from "./pages/rides/RideBookingPage";
import MyRidesPage from "./pages/rides/MyRidesPage";
import RideDetailsPage from "./pages/rides/RideDetailsPage";
import AvailableRidesPage from "./pages/rides/AvailableRidesPage";
import DriverMyRidesPage from "./pages/rides/DriverMyRidesPage";
import MyRatingsPage from "./pages/MyRatingsPage";

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
          <Route path="/" element={<HomePage />} />
          <Route path="/rides/new" element={<RideBookingPage />} />
          <Route path="/rides" element={<MyRidesPage />} />
          <Route path="/driver/rides/available" element={<AvailableRidesPage />} />
          <Route path="/driver/rides" element={<DriverMyRidesPage />} />
          <Route path="/rides/:rideId" element={<RideDetailsPage />} />
          <Route path="/ratings" element={<MyRatingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
