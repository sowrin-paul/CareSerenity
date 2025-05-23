import React, { useState } from 'react';
import TopBar from '../components/TopBar';
import Navbar from '../components/NavbarU';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import styles from '../css/U_home.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const U_home = () => {
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Navbar />
            <Hero />
            <div className={styles.container}>
                <div className={styles.options}>
                    <a href="./U_create_blog.php" id="button-30" className={styles.button_30}>CreatePost</a>
                </div>
                <div className={styles.highlights}>
                    <h1 id="heading" className={styles.heading}>Recent Funds</h1>
                    {/* <?php include('./fund_fetch_BE.php') ?> */}

                    <h1 id="heading" className={styles.heading}>Upcoming Seminars</h1>
                    {/* <?php include('./seminar_fetch_BE.php') ?> */}

                    <h1 id="heading" className={styles.heading}>Volunteers Recruitment</h1>
                    {/* <?php include('./U_volunteer_recruit_fetch_BE.php') ?> */}

                    <h1 id="heading" className={styles.heading}>Recent Blogs</h1>
                    {/* <?php include('./blog_show_BE.php') ?> */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default U_home;
