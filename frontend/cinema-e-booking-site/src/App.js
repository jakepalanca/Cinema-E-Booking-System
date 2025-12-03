import { Routes, Route, Navigate } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import DetailsPage from "./pages/DetailsPage";
import Homepage from "./pages/Homepage";
import Browse from "./pages/Browse";
import Showtimes from "./pages/Showtimes";
import Promotions from "./pages/Promotions";
import RegistrationPage from "./pages/RegistrationPage";
import Login from "./pages/Login";
import Profile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminHomepage from "./pages/AdminHomepage";
import ManageMovies from "./pages/ManageMovies";
import ManageShowings from "./pages/ManageShowings";
import ManagePromotions from "./pages/ManagePromotions";
import VerificationPage from "./pages/VerificationPage";
import { useAuth } from "./contexts/AuthContext";
import './css/App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/details/:movieId" element={<DetailsPage />} />
      <Route path="/booking/:movieId" element={
        <ProtectedRoute>
          <BookingPage />
        </ProtectedRoute>
      } />
      <Route path="/browse" element={<Browse />} />
      <Route path="/showtimes" element={<Showtimes />} />
      <Route path="/promotions" element={<Promotions />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerificationPage />} />
      <Route path="/edit-profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-homepage" element={<AdminHomepage />} />
      <Route path="/admin/manage-movies" element={<ManageMovies />} />
      <Route path="/admin/manage-showings" element={<ManageShowings />} />
      <Route path="/admin/manage-promotions" element={<ManagePromotions />} />
    </Routes>
  );
}

export default App;
