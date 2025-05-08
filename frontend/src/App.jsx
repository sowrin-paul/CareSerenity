import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from "./components/Signup";
import UserDashboard from "./components/userDashboard";
import U_home from "./components/U_home";
import O_profile from "./components/O_profile";
import USeminarUserPage from "./components/U_seminar";
// import OSeminarsPage from "./components/O_seminar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-home/:userId/" element={<U_home />} />
        <Route path="/organization-profile/:userId" element={<O_profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-seminar" element={<USeminarUserPage />} />
        {/* <Route path="/organization-seminar" element={<OSeminarsPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
