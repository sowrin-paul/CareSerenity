import React from 'react';
import styles from '../css/Navbar.module.css';

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles["logo-container"]}>
                {/* <img src="" alt="Logo" className="logo" /> */}
                <div className={styles.brand}>
                    <span className={styles.care}>Care</span>
                    <span className={styles.serenity}>Serenity</span>
                </div>
            </div>
            <div className={styles["nav-links"]}>
                <a href="#" className={styles.active}>Home</a>
                <a href="#">Services</a>
                <a href="#">Donations</a>
                <a href="#">Blogs</a>
                <a href="#">About Us</a>
                <a href="#">Contact Us</a>
            </div>
        </div>
    );
};

export default Navbar;
