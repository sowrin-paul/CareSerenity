import React, { useState } from "react";
import styles from "../css/DonationForm.module.css";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const DonationForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h2>Donation Form</h2>
          <button className={styles.closeBtn}>&times;</button>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <span className={styles.icon}>📧</span>
            <input type="email" placeholder="Email Address" required />
          </div>

          <label className={styles.label}>Payment Method</label>
          <div className={styles.paymentMethods}>
            <button
              type="button"
              className={`${styles.paymentBtn} ${paymentMethod === "Credit Card" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("Credit Card")}
            >
              Credit Card
            </button>
            <button
              type="button"
              className={`${styles.paymentBtn} ${paymentMethod === "Bkash" ? styles.active : ""}`}
              onClick={() => setPaymentMethod("Bkash")}
            >
              Bkash
            </button>
          </div>

          {paymentMethod === "Credit Card" ? (
            <>
              <div className={styles.inputGroup}>
                <span className={styles.icon}>💳</span>
                <input type="text" placeholder="Card Number" required />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.icon}>🔒</span>
                <input type="text" placeholder="Card CVC" required />
              </div>
              <div className={styles.doubleInput}>
                <div className={styles.inputGroup}>
                  <span className={styles.icon}>📅</span>
                  <input type="text" placeholder="Exp Month" required />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.icon}>📆</span>
                  <input type="text" placeholder="Exp Year" required />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.inputGroup}>
                <span className={styles.icon}>📞</span>
                <input type="text" placeholder="Bkash Number" required />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.icon}>🔧</span>
                <input type="text" placeholder="Transaction ID" required />
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <span className={styles.icon}>💰</span>
            <input type="number" placeholder="Donation Amount" required />
          </div>

          <button type="submit" className={styles.submitBtn}>Donate</button>
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default DonationForm;
