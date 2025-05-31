import React from 'react';
import styles from '../css/BlogCreate.module.css';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './Navbar';
import Footer from './Footer';

const BlogCreate = () => {

const navigate = useNavigate();
const gotohome = ()=>{
    navigate('/')
}
  return (
    <>
    <TopBar />
    <Navbar />
    <div className={styles.container}>
      <button className={styles.backButton} onClick={gotohome}>Back</button>
      <div className={styles.card}>
        <h1 className={styles.title}>Write a new Blog</h1>
        <input className={styles.input} type="text" placeholder="Title" />
        <textarea className={styles.textarea} placeholder="Your thoughts ..." />
        <input className={styles.fileInput} type="file" />
        <button className={styles.postButton}>Post</button>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default BlogCreate;
