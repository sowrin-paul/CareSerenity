import React from 'react';
import styles from '../css/OrphanageProfile.module.css';
import profilePic from '../assets/girl.jpg'; 
import img from '../assets/girl.jpg';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const OrphanageProfile = () => {

  const children = new Array(4).fill({
    name: 'Child Name',
    img: img, 
  });

  const navigate = useNavigate();
  const childProfile = ()=>{
    navigate('/chileDetails');
  }

  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.profileImage}>
          <img src={profilePic} alt="Profile" />
        </div>
        <div className={styles.infoSection}>
          <h1 className={styles.title}>Safe Haven Orphanage</h1>
          <p>Location: Mirpur - 12, Dhaka</p>
          <p>Email: info@safehaven.org</p>
          <p>Contact: 9341214</p>
          <p>Established: 2024-09-19, Joined: 2024-09-18</p>
        </div>
        <div className={styles.serviceSection}>
          <h2 className={styles.serviceTitle}>Best Service in town</h2>
          <p>The best Charity for orphans</p>
        </div>
      </div>

      <div className={styles.controls}>
        <button>Back</button>
        <button>Refresh</button>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search Child..." />
          <button>🔍</button>
        </div>
      </div>

      <div className={styles.gallery}>
        {children.map((child, index) => (
          <div key={index} className={styles.childCard}>
            <img src={child.img} alt={child.name} />
            <button className={styles.viewButton} onClick={childProfile}>View</button>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrphanageProfile;
