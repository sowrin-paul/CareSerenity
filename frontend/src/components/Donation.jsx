import React from "react";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from '../css/Donation.module.css';
import { useNavigate } from "react-router-dom";

const DonateSection = () => {

    const navigate = useNavigate();
    const gotoDonationForm = ()=>{
        navigate('/donationForm');
    }
    return (
        <>
            <TopBar />
            <Navbar />
            <div className={styles.donateSection}>
                <div className={styles.donateGrid}>
                    {/* Fund Donation Card */}
                    <div className={styles.donateCard}>
                        <div className={styles.donateIcon}>💰</div>
                        <div className={styles.donateTitle}>Fund</div>
                        <div className={styles.donateDescription}>
                            Supports our organization's growth and development
                        </div>
                        <button className={styles.donateButton} onClick={gotoDonationForm}>Donate Now</button>
                    </div>

                    {/* Food Donation Card */}
                    <div className={styles.donateCard}>
                        <div className={styles.donateIcon}>🛒</div>
                        <div className={styles.donateTitle}>Food</div>
                        <div className={styles.donateDescription}>
                            Aids our orphans in overcoming hunger and maintaining good health
                        </div>
                        <button className={styles.donateButton}>Donate Now</button>
                    </div>

                    {/* Footwear Donation Card */}
                    <div className={styles.donateCard}>
                        <div className={styles.donateIcon}>👟</div>
                        <div className={styles.donateTitle}>Footwear</div>
                        <div className={styles.donateDescription}>
                            Assists our orphans in acquiring footwear for comfort and style
                        </div>
                        <button className={styles.donateButton}>Donate Now</button>
                    </div>

                    {/* Clothes Donation Card */}
                    <div className={styles.donateCard}>
                        <div className={styles.donateIcon}>👕</div>
                        <div className={styles.donateTitle}>Clothes</div>
                        <div className={styles.donateDescription}>
                            Empowers our orphans by providing them with clothing for a better appearance and confidence
                        </div>
                        <button className={styles.donateButton}>Donate Now</button>
                    </div>

                    {/* Stationary Donation Card */}
                    <div className={styles.donateCard}>
                        <div className={styles.donateIcon}>📚</div>
                        <div className={styles.donateTitle}>Stationary</div>
                        <div className={styles.donateDescription}>
                            Stationary enables our orphans to access essential stationary for their educational pursuits
                        </div>
                        <button className={styles.donateButton}>Donate Now</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DonateSection;
