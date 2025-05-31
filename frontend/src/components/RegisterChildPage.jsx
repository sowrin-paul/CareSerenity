import React from 'react';
import styles from '../css/RegisterChildPage.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const RegisterChildPage = () => {
    const navigate = useNavigate();
    const back = ()=>{
        navigate('/orgP');
    }
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
            <p>Email: jannati@gmail.com</p>
            <p>Contact: 0192345678</p>
            <p>Established: 1994</p>
          </div>
        </div>
        <div className={styles.slogan}>
          <h3>The best Charity</h3>
          <p>The best Charity for orphans</p>
        </div>
      </div>

      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={back}>back</button>
      </div>

      <h2 className={styles.heading}>Register Child</h2>

      <form className={styles.form}>
        <label>Full Name :</label>
        <input type="text" name="fullName" />

        <label>Age :</label>
        <input type="number" name="age" />

        <label>Religion :</label>
        <input type="text" name="religion" />

        <label>Area :</label>
        <input type="text" name="area" />

        <label>Study :</label>
        <input type="text" name="study" />

        <label>Problems (if any) :</label>
        <input type="text" name="problems" />

        <label>Gender :</label>
        <input type="text" name="gender" />

        <label>Date of Birth :</label>
        <input type="date" name="dob" />

        <label>Profile Picture :</label>
        <input type="file" name="profilePic" />

        <button type="submit" className={styles.submitButton}>Register</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default RegisterChildPage;
