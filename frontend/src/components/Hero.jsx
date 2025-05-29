import React from "react";
import styles from "../css/Hero.module.css";
const Hero = () => {
  return (
    <div>
      <div className={styles.hero}>
        <div
          className={`${styles.section__container} ${styles.header__container}`}
        >
          <h1>Join us to make Lives Better</h1>
          <p>
            A platform for Organizations. Stay connected with orphans and
            elderly to change lives with each click. Spread kindness to all.
          </p>
        </div>

        <div
          className={`${styles.row} ${styles.info_web} ${styles["diag-ro"]}`}
          id="info_web"
        >
          {[
            "orphans to help",
            "organizations",
            "BDT as Donation",
            "users",
            "Volunteers",
          ].map((label, index) => (
            <div
              className={`${styles.aboutDiag} ${styles.info_cell}`}
              id="info_cell"
              key={index}
            >
              <p className={styles.txt}>We have</p>
              <h3 className={styles.count}>100</h3>
              <p className={styles.txt}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
