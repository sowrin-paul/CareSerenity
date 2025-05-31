import React from 'react';
import styles from '../css/ChildDetails.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import img from '../assets/girl.jpg';
import { useNavigate } from 'react-router-dom';

const ChildDetails = () => {
    const navigate = useNavigate();
    const gotohome = ()=>{
        navigate('/');
    }
    const TermsAndConditions = ()=>{
      navigate('/t&c');
    }
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <button className={styles.backButton} onClick={gotohome}>Back</button>
      <hr />

      <div className={styles.profileImageWrapper}>
        <img
          className={styles.profileImage}
          src= {img} // Replace with actual image path
          alt="Child"
        />
      </div>

      <h1 className={styles.name}>Sabit Molla</h1>

      <div className={styles.detailsForm}>
        <div className={styles.inputRow}><label>Full Name :</label><span>Sabit Molla</span></div>
        <div className={styles.inputRow}><label>Email :</label><span>sabit@example.com</span></div>
        <div className={styles.inputRow}><label>Contact :</label><span>0123456789</span></div>
        <div className={styles.inputRow}><label>NID :</label><span>1234567890</span></div>
        <div className={styles.inputRow}><label>Occupation :</label><span>Student</span></div>
        <div className={styles.inputRow}><label>Address :</label><span>123 Main Street</span></div>
        <div className={styles.inputRow}><label>Website :</label><span>www.sabitmolla.com</span></div>
        <div className={styles.inputRow}><label>Gender :</label><span>Male</span></div>
        <div className={styles.inputRow}><label>Division :</label><span>Dhaka</span></div>
        <div className={styles.inputRow}><label>Date of Birth :</label><span>2005-08-15</span></div>
        <div className={styles.inputRow}><label>Profile Picture :</label><span>Available</span></div>

        <div className={styles.actionButtons}>
          <button type="button">Gift</button>
          <button type="button" onClick={TermsAndConditions}>Adopt</button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ChildDetails;
