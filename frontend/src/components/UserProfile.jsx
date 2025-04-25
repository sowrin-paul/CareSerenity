import React from 'react';
import styles from '../css/UserProfile.module.css';
import avatar from '../assets/girl.jpg';
const UserProfile = () => {
  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_card}>
        <div className={styles.profile_header}>
          <img src={avatar} alt="User Avatar" className={styles.avatar} />
          <div className={styles.user_info}>
            <h2 className={styles.name}>Jannatul Ferdous</h2>
            <p>Location: Mirpur _ 6, Bangladesh</p>
            <p>Email: jannafer@gmail.com</p>
            <p>Contact: 0192345678</p>
            <p>Account Type: user</p>
          </div>
          <div className={styles.occupation}>
            <span>Occupation</span>
            <p>Student</p>
          </div>
        </div>

        <div className={styles.profile_buttons}>
          <button>Chats</button>
          <button>Volunteers</button>
          <button>Profile Info</button>
        </div>

        <div className={styles.section}>
          <h3 className={styles.section_title}>Adoption Requests :</h3>
          <p className={styles.empty_message}>You have no pending request</p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.section_title}>Registered Seminars :</h3>
          <p className={styles.empty_message}>You don't have any upcoming seminars</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
