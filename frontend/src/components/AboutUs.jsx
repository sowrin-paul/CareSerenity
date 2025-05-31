import React from 'react'
import styles from '../css/ServicesPage.module.css'
import TopBar from './TopBar'
import Navbar from './Navbar'
import Footer from './Footer'

const AboutUs = () => {
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <h2 className={styles.subHeading}>Joining Hands, Changing Stories</h2>
      <p className={styles.quote}>— Help. Advocate. Educate. Care!</p>

      <div className={styles.infoSection}>
        <div className={styles.textSection}>
          <h4>CareSerenity.org</h4>
          <p>
            CareSerenity.org is a centralized platform for child welfare and adoption-related services, aimed at improving transparency and accessibility.
            Our goal is to streamline the adoption journey and provide long-term support to both organizations and families.
          </p>
        </div>
        <div className={styles.imageGroup}>
          <img src="/path-to-image1.jpg" alt="support" />
          <img src="/path-to-image2.jpg" alt="community" />
          <img src="/path-to-image3.jpg" alt="volunteers" />
        </div>
      </div>

      <div className={styles.mapSection}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3650.582336034878!2d90.4471350761669!3d23.79788287863816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1721831420744!5m2!1sen!2sus"
          title="location"
          className={styles.map}
        ></iframe>
      </div>

      <div className={styles.contactContainer}>
        <div className={styles.contactForm}>
          <h3>Contact Form</h3>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button>Send</button>
        </div>
        <div className={styles.contactInfo}>
          <h3>Address</h3>
          <p>CareSerenity.org<br />123 Adoption St.<br />Cityville, CO 00000</p>
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}

export default AboutUs
