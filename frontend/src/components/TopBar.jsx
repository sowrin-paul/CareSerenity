import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from '../css/Topbar.module.css'; 
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
  const navigate = useNavigate();
  const gotLogin = () => {
    navigate('/login');
  }
  const gotSignUp = () => {
    navigate('/signup');
  }
  return (
    <div className={styles.topbar}>
      <div className={styles["contact-info"]}>
        <span><FaPhoneAlt className={styles.icon} /> +8801973336001</span>
        <span><FaEnvelope className={styles.icon} /> care.serenity@gmail.com</span>
        <span><FaMapMarkerAlt className={styles.icon} /> 1/1, Block-B, Road-27, Dhaka - 1216</span>
      </div>
      <div className={styles["account-actions"]}>
        <a onClick={gotSignUp}>Create Account</a>
        <button className={styles["login-btn"]} onClick={gotLogin}>Login</button>
      </div>
    </div>
  );
};

export default TopBar;
