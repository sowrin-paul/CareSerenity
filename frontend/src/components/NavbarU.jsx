import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const navOptions = {
  home: [
    "/U_home",
    "/U_create_blog",
    "/U_view_blog"
  ],
  organizations: [
    "/U_organization",
    "/U_see_organization_orphanage",
    "/U_see_organization_profile",
    "/U_see_orphan_profile"
  ],
  adoptions: [
    "/U_adoption"
  ],
  seminars: [
    "/U_seminar"
  ],
  joinus: [
    "/U_joinus"
  ],
  aboutus: [
    "/U_aboutus"
  ],
  myprofile: [
    "/U_profile",
    "/U_profile_edit",
    "/U_chat_list"
  ]
};

function Navbar() {
  const location = useLocation();
  const [activeOption, setActiveOption] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifi, setShowNotifi] = useState(false);

  useEffect(() => {
    // active nav option based on URL
    const currentPath = location.pathname;
    for (const option in navOptions) {
      if (navOptions[option].some(path => currentPath.includes(path))) {
        setActiveOption(option);
        break;
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data);
        const unread = response.data.filter(notif => notif.is_read === 0).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(`/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };

  const toggleNotifi = () => {
    setShowNotifi(prev => !prev);
  };

  return (
    <nav>
      <div className="top-nav">
        <ul className="contact-info">
          <li className="top-nav-item">
            <i className='bx bxs-phone'></i>
            <a href="tel:+8801973336001">+880 1973336001</a>
          </li>
          <li className="top-nav-item">
            <i className='bx bxl-gmail'></i>
            <a href="mailto:care.senerity@gmail.com">care.senerity@gmail.com</a>
          </li>
          <li className="top-nav-item">
            <i className='bx bxs-map'></i>
            <a href="#">1/1, Block-B, Road-27, Dhaka - 1216</a>
          </li>
        </ul>
        <ul className="auth-links">
          <li>
            <Link to="/U_profile" className={activeOption === 'myprofile' ? 'active' : ''}>My account</Link>
          </li>
          <li>
            <Link id="login-btn" to="/LandingPage">Logout</Link>
          </li>
        </ul>
      </div>

      <div className="bottom-nav">
        <div className="logo">
          <script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/ripples.js"></script>
          <l-ripples size="45" speed="2" color="#f3254e"></l-ripples>
          <Link to="/U_home">
            <span className="icon first">Care</span>
            <span className="icon second">Serenity</span>
          </Link>
        </div>

        <ul className="main-nav">
          <li><Link to="/U_home" className={activeOption === 'home' ? 'active' : ''}>Home</Link></li>
          <span className="h-bar"></span>
          <li><Link to="/U_organization" className={activeOption === 'organizations' ? 'active' : ''}>Organizations</Link></li>
          <span className="h-bar"></span>
          <li><Link to="/U_adoption" className={activeOption === 'adoptions' ? 'active' : ''}>Adoptions</Link></li>
          <span className="h-bar"></span>
          <li><Link to="/U_seminar" className={activeOption === 'seminars' ? 'active' : ''}>Seminars</Link></li>
          <span className="h-bar"></span>
          {/* <li><Link to="/U_joinus" className={activeOption === 'joinus' ? 'active' : ''}>Join Us</Link></li>
          <span className="h-bar"></span> */}
          <li><Link to="/U_aboutus" className={activeOption === 'aboutus' ? 'active' : ''}>About Us</Link></li>

          <li className="icon" onClick={toggleNotifi}>
            <i className='bx bxs-bell' style={{ display: unreadCount > 0 ? 'none' : 'inline-block' }}></i>
            <i className='bx bxs-bell-ring bx-tada' style={{ display: unreadCount > 0 ? 'inline-block' : 'none' }}></i>
          </li>

          {showNotifi && (
            <div className="notifi-box" id="box">
              <h2>Notifications</h2>
              <div id="content">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.notification_id}
                      className={`notifi-item${notification.is_read === 0 ? " unseen" : ""}`}
                      style={notification.is_read === 0 ? { background: "rgb(255, 182, 193, .5)" } : {}}
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
