import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from "./components/Signup";
import U_home from './components/U_home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/u_home" element={<U_home />} />
      </Routes>
    </Router>
  );
}

export default App;
