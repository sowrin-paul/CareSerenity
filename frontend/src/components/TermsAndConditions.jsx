// TermsAndConditions.jsx
import React from 'react';
import styles from '../css/TermsAndConditions.module.css';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
    const navigate = useNavigate();
    const Home = ()=>{
        navigate('/')
    }
    const Continue = ()=>{
        navigate('/adoptionform')
    }
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <h1 className={styles.title}>Terms & Conditions</h1>
      <p className={styles.intro}>
        These terms and conditions govern your use of CareSerenity.org. By using the Website, you agree to these Terms. If you disagree with any part of these Terms, please do not use the Website.
      </p>

      <h2 className={styles.sectionTitleRed}>Adoption Terms:</h2>

      <h3>Eligibility:</h3>
      <p>
        Prospective adoptive parents must comply with the legal requirements of their jurisdiction for adopting a child.
        <br />
        <strong>The Organization</strong> reserves the right to verify the eligibility and suitability of prospective adoptive parents through a screening process.
      </p>

      <h3>Child Placement:</h3>
      <p>
        <strong>The Organization</strong> will facilitate the adoption process while adhering to all relevant laws and regulations.
        <br />
        The placement of each child will be based on compatibility, welfare, and the best interests of the child.
      </p>

      <h3>Adoption Process:</h3>
      <p>
        Prospective parents must complete and submit all required documentation accurately and honestly.
        <br />
        <strong>The Organization</strong> will provide guidance and support throughout the adoption process, including necessary legal procedures.
      </p>

      <h3>Home Study and Assessment:</h3>
      <p>
        Prospective adoptive parents may undergo a home study or assessment conducted by <strong>the Organization</strong> or authorized professionals to ensure a safe and suitable environment for the child.
      </p>

      <h3>Post-Adoption Support:</h3>
      <p>
        <strong>The Organization</strong> may offer post-adoption support services to assist adoptive families in adjustment and addressing any challenges that may arise.
      </p>

      <h2 className={styles.sectionTitleRed}>Organization Rules:</h2>

      <h3>Privacy and Confidentiality:</h3>
      <p>
        All information provided by users during the adoption process will be treated with strict confidentiality and used solely for adoption-related purposes.
      </p>

      <h3>User Conduct:</h3>
      <p>
        Users must not engage in any unlawful or inappropriate behavior on the Website.
        <br />
        <strong>The Organization</strong> reserves the right to refuse service, terminate accounts, or cancel adoptions if users violate these Terms.
      </p>

      <h3>Liability:</h3>
      <p>
        <strong>The Organization</strong> shall not be held responsible for any misinformation provided by users or outcomes resulting from the adoption process.
      </p>

      <h3>Changes to Terms:</h3>
      <p>
        <strong>The Organization</strong> reserves the right to modify these Terms at any time. Users will be notified of any changes.
      </p>

      <h2 className={styles.sectionTitleRed}>Disclaimer:</h2>
      <p>
        These terms and conditions are for informational purposes only and do not constitute legal advice. Users are encouraged to seek legal counsel for specific guidance related to adoption laws and regulations.
      </p>

      <div className={styles.buttonGroup}>
        <button className={styles.discardButton} onClick={Home}>Discard</button>
        <button className={styles.continueButton} onClick={Continue}>Continue</button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default TermsAndConditions;
