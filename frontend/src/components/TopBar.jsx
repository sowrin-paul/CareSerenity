import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../css/Topbar.module.css';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const TopBar = ({ isLoggedIn, onLogout }) => {
  return (
    <div className={styles.topbar}>
      <ul className={styles.contactInfo}>
        <li>
          <CallIcon className={styles.icon} />
          <a href="tel:+8801973336001">+880 1973336001</a>
        </li>
        <li>
          <EmailIcon className={styles.icon} />
          <a href="mailto:care.senerity@gmail.com">care.senerity@gmail.com</a>
        </li>
        <li>
          <LocationOnIcon className={styles.icon} />
          <a href="#">1/1, Block-B, Road-27, Dhaka - 1216</a>
        </li>
      </ul>
      <ul className={styles.accountActions}>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/user-profile/">My Account</Link>
            </li>
            <li>
              <button onClick={onLogout} className={styles.loginBtn}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" className={styles.createAccountBtn}>
                Create Account
              </Link>
            </li>
            <li>
              <Link to="/login" className={styles.loginBtn}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default TopBar;
