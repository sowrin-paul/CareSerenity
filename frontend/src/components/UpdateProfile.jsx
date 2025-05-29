import React from 'react'
import styles from '../css/UpdateProfile.module.css'
const UpdateProfile = () => {
  return (
    <div className={styles.profile_container}>
      <button className={styles.back_button}>Back</button>
      <div className={styles.sprofile_card}>
        <img
          className={styles.profile_image}
          src="your_image_path.jpg"
          alt="Profile"
        />
        <h1 className={styles.profile_name}>Anayatul Ahad Shoikot</h1>
        <form className={styles.profile_form}>
          {[
            'Full Name',
            'Email',
            'Contact',
            'NID',
            'Occupation',
            'Address',
            'Website',
            'Gender',
            'Division',
            'Date of Birth',
            'Profile Picture',
          ].map((label, index) => (
            <div className={styles.form_group} key={index}>
              <label>{label}:</label>
              <input type="text" placeholder={label} />
            </div>
          ))}
          <button type="submit" className={styles.update_button}>
            Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateProfile
