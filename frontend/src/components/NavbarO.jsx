import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Navbar.module.css';
import TopBar from './TopBar';
import { useParams } from 'react-router-dom';
import Logo from '../assets/Logo.png';

const navOptions = {
  home: ['/O_home', '/O_create_blog', '/O_view_blog'],
  organizations: ['/O_organization', '/O_see_organization_orphanage', '/O_see_organization_profile', '/O_see_orphan_profile'],
  seminars: ['/O_seminar', '/seminar_view'],
  aboutus: ['/O_aboutus'],
  myprofile: ['/O_profile', '/O_profile_edit', '/O_chat_list', '/O_orphan', '/O_orphan_profile', '/O_orphan_removed', '/O_adoption'],
};

const NavbarO = () => {
  const location = useLocation();
  const [activeOption, setActiveOption] = useState('');
  // const [notifications, setNotifications] = useState([]);
  // const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    for (const option in navOptions) {
      if (navOptions[option].some(route => path.includes(route))) {
        setActiveOption(option);
        break;
      }
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   axios.get('/api/notifications')
  //     .then(response => {
  //       setNotifications(response.data.notifications);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching notifications:', error);
  //     });
  // }, []);

  // const markAsRead = (id) => {
  //   axios.post(`/api/notifications/markAsRead/${id}`)
  //     .then(() => {
  //       setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
  //     });
  // };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/U_home">
            <img src={Logo} className={styles.logo} alt="Logo" />
            <div className={styles.brand}>
              <span className={styles.care}>Care</span>
              <span className={styles.serenity}>Serenity</span>
            </div>
          </Link>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <Link
            to="/org-home/:userId"
              className={activeOption === "home" ? styles.active : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/adoption"
              className={activeOption === "Orphans" ? styles.active : ""}
            >
              Adoptions
            </Link>
          </li>
          <li>
            <Link
              to="/organization-seminar"
              className={activeOption === "seminars" ? styles.active : ""}
            >
              Seminars
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={activeOption === "aboutus" ? styles.active : ""}
            >
              About Us
            </Link>
          </li>
          {/* <li className={styles.icon} onClick={toggleNotification}>
                <i
                  className="bx bxs-bell"
                  style={{ display: unreadCount > 0 ? "none" : "inline-block" }}
                ></i>
                <i
                  className="bx bxs-bell-ring bx-tada"
                  style={{ display: unreadCount > 0 ? "inline-block" : "none" }}
                ></i>
              </li> */}
        </ul>
      </div>
    </>
  );
};

export default NavbarO;
