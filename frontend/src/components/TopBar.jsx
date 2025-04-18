import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../css/Topbar.css'

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="contact-info">
        <span><FaPhoneAlt className="icon" /> +8801973336001</span>
        <span><FaEnvelope className="icon" /> care.serenity@gmail.com</span>
        <span><FaMapMarkerAlt className="icon" /> 1/1, Block-B, Road-27, Dhaka - 1216</span>
      </div>
      <div className="account-actions">
        <a href="#">Create Account</a>
        <button className="login-btn">Login</button>
      </div>
    </div>
  );
};

export default TopBar;
