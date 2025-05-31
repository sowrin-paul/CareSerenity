import React from 'react';
import styles from '../css/AdoptionForm.module.css';
import image from '../assets/bg_2.jpg';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

const AdoptionForm = () => {
    const navigate = useNavigate();
    const back = ()=>{
        navigate('/t&c')
    }
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <button className={styles.backButton} onClick={back}>Back</button>
      <hr />
      <div className={styles.imageContainer}>
        <img
          src={image} // Replace with actual image path
          alt="Applicant"
          className={styles.image}
        />
      </div>
      <h2 className={styles.title}>Adoption Application Form</h2>
      <form className={styles.form}>
        {[
          'Email',
          'Contact',
          'NID',
          'Occupation',
          'Address',
          'Marital Status',
          'Adoption Reason',
          'Current Children',
          'Home Environment',
          'Additional Info'
        ].map((label, index) => (
          <div className={styles.formRow} key={index}>
            <label>{label}:</label>
            <input type="text" className={styles.input} />
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default AdoptionForm;
