import React from 'react';
import styles from '../css/OrganizationList.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const organizations = [
  {
    name: 'Safe Haven Orphanage',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'info@safehaven.org',
  },
  {
    name: 'Little Spirituals Foundation',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'ls.foundation@gmail.com',
  },
  {
    name: 'Dhaka Foundation',
    description: 'The best Charity for orphans',
    phone: '+880123234445',
    email: 'info@safehaven.org',
  },
  {
    name: 'Mirpur Care Centre',
    description: 'We care about your life',
    phone: '3242433222',
    email: 'dhakafoundation@gmail.com',
  },
  {
    name: 'Safe Haven Orphanage',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'info@safehaven.org',
  },
];

const OrganizationList = () => {

const navigate = useNavigate();
const gotohome = ()=>{
    navigate('/');
}
const view = ()=>{
  navigate('/orgProfile');
}

  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={gotohome}>Back</button>
        <input
          type="text"
          placeholder="Search Organizations..."
          className={styles.searchBar}
        />
      </div>
      <hr />
      <div className={styles.list}>
        {organizations.map((org, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.logo}></div>
            <div className={styles.info}>
              <h2>{org.name}</h2>
              <p>{org.description}</p>
              <p>Phone: {org.phone}</p>
              <p>Email: {org.email}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={view}>View</button>
              <button className={styles.button}>Donate</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrganizationList;
