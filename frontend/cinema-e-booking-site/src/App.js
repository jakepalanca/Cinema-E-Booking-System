import { Routes, Route } from "react-router-dom";
import BookingPage from "./BookingPage";
import DetailsPage from "./DetailsPage";
import Homepage from "./Homepage";
import Browse from "./Browse";
import logo from './logo.svg';
import RegistrationPage from "./RegistrationPage";
import Login from "./Login";
import Profile from "./EditProfile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AdminLogin from "./AdminLogin";
import AdminHomepage from "./AdminHomepage";
import ManageMovies from "./ManageMovies";
import ManageShowtimes from "./ManageShowtimes";
import ManagePromotions from "./ManagePromotions";
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/details/:movieId" element={<DetailsPage />} />
      <Route path="/booking/:movieId" element={<BookingPage />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/login" element={<Login />} />
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
