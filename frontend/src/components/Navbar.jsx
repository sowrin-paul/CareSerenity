import React from 'react';
import Logo from '../assets/Logo.png';
import styles from '../css/Navbar.module.css';

const Navbar = () => {
    const handleScroll = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${id}`);
        }
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.logoContainer}>
                <img src={Logo} className={styles.logo} alt="Logo" />
                <div className={styles.brand}>
                    <span className={styles.care}>Care</span>
                    <span className={styles.serenity}>Serenity</span>
                </div>
            </div>
            <div className={styles.navLinks}>
                <a href="#" className={styles.active}>Home</a>
                <a href="#" onClick={() => handleScroll("services")}>Services</a>
                <a href="#" onClick={() => handleScroll("donations")}>Donations</a>
                <a href="#" onClick={() => handleScroll("blogs")}>Blogs</a>
                <a href="#" onClick={() => handleScroll("aboutUs")}>About Us</a>
                <a href="#" onClick={() => handleScroll("contactUs")}>Contact Us</a>
            </div>
        </div>
    );
};

export default Navbar;
