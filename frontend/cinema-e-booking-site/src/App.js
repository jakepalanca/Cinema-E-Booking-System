// src/App.js
import { Routes, Route } from "react-router-dom";
import BookingPage from "./Pages/BookingPage";
import DetailsPage from "./Pages/DetailsPage";
import Homepage from "./Homepage";
import Browse from "./Browse";
import Navbar from './Navbar';
import logo from './logo.svg';
import RegistrationPage from "./RegistrationPage";
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/details/:movieId" element={<DetailsPage />} />
        <Route path="/booking/:movieId" element={<BookingPage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/register" element={<RegistrationPage />} />
      </Routes>
  );
}

export default App;
