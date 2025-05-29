import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import TopBar from "./TopBar";
import React from "react";
import Logo from '../assets/Logo.png';
import styles from '../css/Navbar.module.css';

const navOptions = {
  home: ["/user-home", "/U_create_blog", "/U_view_blog"],
  organizations: [
    "/U_organization",
    "/U_see_organization_orphanage",
    "/U_see_organization_profile",
    "/U_see_orphan_profile",
  ],
  adoptions: ["/U_adoption"],
  seminars: ["/user-seminar/:userId"],
  joinus: ["/U_joinus"],
  aboutus: ["/U_aboutus"],
  myprofile: ["/user-profile", "/U_profile_edit", "/U_chat_list"],
};

function Navbar() {
  const { userId } = useParams();
  const location = useLocation();
  const [activeOption, setActiveOption] = useState("");
  // const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  // const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    for (const option in navOptions) {
      if (navOptions[option].some((path) => currentPath.includes(path))) {
        setActiveOption(option);
        break;
      }
    }
  }, [location.pathname]);

  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await axios.get("/api/notifications");
  //       // setNotifications(response.data);
  //       const unread = response.data.filter((notification) => notification.is_read === 0).length;
  //       setUnreadCount(unread);
  //     } catch (error) {
  //       console.error("Error fetching notifications", error);
  //     }
  //   };

  //   fetchNotifications();
  // }, []);

  // const markAsRead = async (id) => {
  //   try {
  //     await axios.post(`/api/notifications/read/${id}`);
  //     setNotifications((prev) =>
  //       prev.map((n) => (n.notification_id === id ? { ...n, is_read: 1 } : n))
  //     );
  //     setUnreadCount((prev) => prev - 1);
  //   } catch (error) {
  //     console.error("Error marking notification as read", error);
  //   }
  // };

  const toggleNotification = () => {
    // setShowNotification((prev) => !prev);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logoContainer}>
          <Link to="/user-home/:userId">
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
              to="/user-home/:userId"
              className={activeOption === "home" ? styles.active : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/user-organization"
              className={activeOption === "organizations" ? styles.active : ""}
            >
              Organizations
            </Link>
          </li>
          <li>
            <Link
              to="/user-adoption"
              className={activeOption === "adoptions" ? styles.active : ""}
            >
              Adoptions
            </Link>
          </li>
          <li>
            <Link
              to="/user-seminar"
              className={activeOption === "seminars" ? styles.active : ""}
            >
              Seminars
            </Link>
          </li>
          <li>
            <Link
              to="/user-aboutus"
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
}

export default Navbar;
