import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from "./components/Signup";
import UserDashboard from "./components/userDashboard";
import U_home from "./components/U_home";
import O_profile from "./components/O_profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/U_home/:userId/" element={<U_home />} />
        <Route path="/O_profile/:userId" element={<O_profile />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
