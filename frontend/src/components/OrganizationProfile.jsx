import React, { useState, useEffect } from 'react';
import styles from '../css/OrganizationProfile.module.css';
import TopBar from './TopBar';
import TopBarO from './TopbarO';
import NavbarO from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const OrganizationProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const role = localStorage.getItem('role');
  const accountLink = role === "1" ? "/organization-profile" : "/user-profile";

    useEffect(() => {
      const storedRole = localStorage.getItem('role');
      setRole(storedRole);
    }, []);

  const navigate = useNavigate();

  const orphanage = () => {
    navigate('/orphanageProfile')
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/home');
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <NavbarO />
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <div className={styles.avatar}></div>
          <div className={styles.details}>
            <h2 className={styles.name}>Safe Haven Orphanage</h2>
            <p>Location: Mirpur - 12, Dhaka</p>
            <p>Email: info@safehaven.org</p>
            <p>District: 58421</p>
            <p>Established: 2020-09-10, Joined: 2024-09-10</p>
          </div>
          <div className={styles.promo}>
            <h3 className={styles.highlight}>Best Service in town</h3>
            <p>The best Charity for orphans</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button>Inbox</button>
          <button onClick={orphanage}>Orphanage</button>
        </div>

        <section>
          <h4 className={styles.sectionTitle}>Funds :</h4>
          <div className={styles.fundCard}>
            <img
              src="https://via.placeholder.com/120x80"
              alt="Fund Campaign"
              className={styles.fundImage}
            />
            <div className={styles.fundDetails}>
              <span className={styles.tag}>Open</span>
              <span className={styles.tagGreen}>Live</span>
              <h5>Connect the people</h5>
              <p>
                Help connect children through donations, ensuring their education
                and nutrition.
              </p>
              <button className={styles.donateButton}>Donate</button>
            </div>
          </div>
        </section>

        <section>
          <h4 className={styles.sectionTitle}>Volunteers Recruitment :</h4>
          <p className={styles.inactiveText}>Recruitments currently off now</p>
        </section>

        <section>
          <h4 className={styles.sectionTitle}>Seminars :</h4>
          <p className={styles.inactiveText}>No seminars to show</p>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default OrganizationProfile;
