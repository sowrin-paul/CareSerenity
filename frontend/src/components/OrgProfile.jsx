import React from 'react';
import styles from '../css/OrgProfile.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

const OrgProfile = () => {
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <img src="/avatar.png" alt="Profile" className={styles.avatar} />
          <div>
            <h2 className={styles.title}>Dhaka Foundation</h2>
            <p>Location: Mirpur - 6, Bangladesh</p>
            <p>Email: xyx@gmail.com</p>
            <p>Contact: 0192345678</p>
            <p>Established: 1984</p>
          </div>
        </div>
        <div className={styles.slogan}>
          <h3>The best Charity</h3>
          <p>The best Charity for orphans</p>
        </div>
      </div>

      <div className={styles.toggleButtons}>
        <button>Funds</button>
        <button>Orphanage</button>
      </div>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <span>Funds</span>
        </div>
        <div className={styles.statBox}>
          <span>Requests</span>
          <p className={styles.zero}>0</p>
        </div>
        <div className={styles.statBox}>
          <span>Volunteers</span>
          <p className={styles.count}>3</p>
        </div>
        <div className={styles.statBox}>
          <span>Orphans</span>
          <p className={styles.zero}>0</p>
        </div>
      </div>

      <div className={styles.requestsSection}>
        <h3 className={styles.requestsTitle}>Adoption Requests</h3>
        <table className={styles.requestsTable}>
          <thead>
            <tr>
              <th>Requested by</th>
              <th>Requested for</th>
              <th>Action</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty body for now */}
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrgProfile;
