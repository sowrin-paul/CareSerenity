import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from "./components/Signup";
import U_home from "./components/U_home";
import O_home from "./components/O_home";
import O_profile from "./components/O_profile";
import USeminarUserPage from "./components/U_seminar";
import OSeminarsPage from "./components/O_seminar";
import SeminarView from "./components/SeminarView";
import UserProfile from "./components/UserProfile";
import OrganizationList from "./components/OrganizationList";
import BlogCreate from "./components/BlogCreate";
import UserBlog from "./components/UserBlog";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-home/:userId" element={<U_home />} />
        <Route path="/org-home/:userId" element={<O_home />} />
        <Route path="/organization-profile" element={<O_profile />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-seminar" element={<USeminarUserPage />} />
        <Route path="/organization-seminar" element={<OSeminarsPage />} />
        <Route path="/seminar-view/:id" element={<SeminarView />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/organization-lists" element={<OrganizationList />} />
        <Route path="/blogs" element={<BlogCreate />} />
        <Route path="/user-blogs" element={<UserBlog />} />
      </Routes>
    </Router>
  );
}

export default App;
