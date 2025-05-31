import React from 'react';
import styles from '../css/ServicesPage.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

const ServicesPage = () => {
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <h1 className={styles.title}>Our Services</h1>
      <p className={styles.description}>
        A platform for organizations. Stay connected with volunteers, donors, and beneficiaries using smart tools tailored for them all.
      </p>

      <div className={styles.servicesGrid}>
        {[
          { title: 'Raise Fund For Orgs', icon: '❤️' },
          { title: 'Enabling Adoptions, Enriching Lives', icon: '👨‍👩‍👧' },
          { title: 'Dynamic Donation System', icon: '💰' },
          { title: 'Seminars', icon: '🎤' },
          { title: 'Access to Orphanage for Everyone', icon: '🏠' },
          { title: 'Join As Volunteer', icon: '🙋‍♂️' },
        ].map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.icon}>{service.icon}</div>
            <h3>{service.title}</h3>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default ServicesPage;
