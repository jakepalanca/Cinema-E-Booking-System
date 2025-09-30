// src/App.js
import { Routes, Route } from "react-router-dom";
import BookingPage from "./Pages/BookingPage";
import Homepage from "./Homepage"
import Navbar from './Navbar';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/booking/:movieId" element={<BookingPage />} />
      </Routes>
  );
}

export default App;
