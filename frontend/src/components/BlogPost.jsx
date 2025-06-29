import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/BlogPost.module.css";
import blogImage from "../assets/bg_3.jpg";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BlogPost = () => {
    return (
        <>
            <TopBar />
            <Navbar />
            <div className={styles.blogPostContainer}>
                <div className="backButtonContainer">
                    <Link to="/blog" className={styles.backButton}>
                        Back
                    </Link>
                </div>
                <hr />
                <img src={blogImage} alt="Blog Image" className={styles.blogImage} />
                <h1 className={styles.blogTitle}>Anas begging for money</h1>

                <div className={styles.blogContent}>
                    <p>
                        Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has
                        been the industry's standard dummy text ever since the 1500s, when on unknown printer took o
                        getting of type and scrambled it to make a type specimen book. It has survived not only five
                        centuries, but also the keep into electronic typesetting, remaining essentially unchanged.
                    </p>
                </div>

                <div className={styles.blogMeta}>
                    <span className={styles.author}>By admin</span>
                    <span className={styles.date}>, 2024-9-23</span>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default BlogPost;