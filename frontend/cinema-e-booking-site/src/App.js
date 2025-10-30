import { Routes, Route } from "react-router-dom";
import BookingPage from "./Pages/BookingPage";
import DetailsPage from "./Pages/DetailsPage";
import Homepage from "./Homepage";
import Browse from "./Browse";
import logo from './logo.svg';
import RegistrationPage from "./RegistrationPage";
import Login from "./Login";
import Profile from "./EditProfile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
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
    </Routes>
  );
}

export default App;
