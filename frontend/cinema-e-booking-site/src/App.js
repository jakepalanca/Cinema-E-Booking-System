import { Routes, Route } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import DetailsPage from "./pages/DetailsPage";
import Homepage from "./pages/Homepage";
import Browse from "./pages/Browse";
import RegistrationPage from "./pages/RegistrationPage";
import Login from "./pages/Login";
import Profile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";
import AdminHomepage from "./pages/AdminHomepage";
import ManageMovies from "./pages/ManageMovies";
import ManageShowtimes from "./pages/ManageShowtimes";
import ManagePromotions from "./pages/ManagePromotions";
import VerificationPage from "./pages/VerificationPage";
import './css/App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/details/:movieId" element={<DetailsPage />} />
      <Route path="/booking/:movieId" element={<BookingPage />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerificationPage />} />
      <Route path="/edit-profile" element={<Profile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-homepage" element={<AdminHomepage />} />
      <Route path="/admin/manage-movies" element={<ManageMovies />} />
      <Route path="/admin/manage-showtimes" element={<ManageShowtimes />} />
      <Route path="/admin/manage-promotions" element={<ManagePromotions />} />
    </Routes>
  );
}

export default App;
