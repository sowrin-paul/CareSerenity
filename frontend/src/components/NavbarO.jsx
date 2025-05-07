import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/Navbar.module.css';

const navOptions = {
  home: ['/O_home', '/O_create_blog', '/O_view_blog'],
  organizations: ['/O_organization', '/O_see_organization_orphanage', '/O_see_organization_profile', '/O_see_orphan_profile'],
  seminars: ['/O_seminar', '/seminar_view'],
  aboutus: ['/O_aboutus'],
  myprofile: ['/O_profile', '/O_profile_edit', '/O_chat_list', '/O_orphan', '/O_orphan_profile', '/O_orphan_removed', '/O_adoption'],
};

function Navbar() {
  const location = useLocation();
  const [activeOption, setActiveOption] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    const path = location.pathname;

    for (const option in navOptions) {
      if (navOptions[option].some(route => path.includes(route))) {
        setActiveOption(option);
        break;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    axios.get('/api/notifications')
      .then(response => {
        setNotifications(response.data.notifications);
      })
      .catch(error => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  const markAsRead = (id) => {
    axios.post(`/api/notifications/markAsRead/${id}`)
      .then(() => {
        setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
      });
  };

  return (
    <nav>
      <div className={styles.topNav}>
        <ul className={styles.contactInfo}>
          <li className={styles.topNavItem}>
            <i className='bx bxs-phone'></i>
            <a href="tel:+8801973336001">+880 1973336001</a>
          </li>
          <li className={styles.topNavItem}>
            <i className='bx bxl-gmail'></i>
            <a href="mailto:care.senerity@gmail.com">care.senerity@gmail.com</a>
          </li>
          <li className={styles.topNavItem}>
            <i className='bx bxs-map'></i>
            <a href="#">1/1, Block-B, Road-27, Dhaka - 1216</a>
          </li>
        </ul>
        <ul className={styles.authLinks}>
          <li>
            <Link to="/O_profile" className={activeOption === 'myprofile' ? styles.active : ''}>
              My account
            </Link>
          </li>
          <li>
            <Link id="login-btn" to="/">Logout</Link>
          </li>
        </ul>
      </div>

      <div className={styles.bottomNav}>
        <div className={styles.logo}>
          <Link to="/O_home">
            <span className="icon first">Care</span><span className="icon second">Serenity</span>
          </Link>
        </div>

        <ul className={styles.mainNav}>
          <li>
            <Link to="/O_home" className={activeOption === 'home' ? styles.active : ''}>
              Home
            </Link>
          </li>
          <span className={styles.hBar}></span>
          <li>
            <Link to="/O_organization" className={activeOption === 'organizations' ? styles.active : ''}>
              Organizations
            </Link>
          </li>
          <span className={styles.hBar}></span>
          <li>
            <Link to="/O_seminar" className={activeOption === 'seminars' ? styles.active : ''}>
              Seminars
            </Link>
          </li>
          <span className={styles.hBar}></span>
          <li>
            <Link to="/O_aboutus" className={activeOption === 'aboutus' ? styles.active : ''}>
              About Us
            </Link>
          </li>

          {/* <li className="icon" onClick={() => setShowBox(prev => !prev)}>
            {unreadCount > 0 ? (
              <i className='bx bxs-bell-ring bx-tada'></i>
            ) : (
              <i className='bx bxs-bell'></i>
            )}
          </li> */}

          {showBox && (
            <div className="notifi-box" id="box">
              <h2>Notifications</h2>
              <div id="content">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.notification_id}
                      className={`notifi-item${notification.is_read === 0 ? ' unseen' : ''}`}
                      style={notification.is_read === 0 ? { background: 'rgba(255, 182, 193, .5)' } : {}}
                      onClick={() => markAsRead(notification.notification_id)}
                    >
                      <div className="text">
                        <h4>{notification.content}</h4>
                        <p>{notification.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No notifications</p>
                )}
              </div>
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
