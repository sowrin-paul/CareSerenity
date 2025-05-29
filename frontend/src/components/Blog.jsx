import React from "react";
import styles from "../css/Blog.module.css";
import img1 from '../assets/bg_2.jpg';
import img2 from '../assets/bg_3.jpg';
import img3 from '../assets/bg_4.jpg';
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const blogPosts = [
  {
    id: 1,
    title: "Creating Brighter Futures for Orphans",
    image: img1,
    summary: "Discover how we’re helping children build brighter tomorrows through love, care, and education.",
    date: "April 20, 2025",
  },
  {
    id: 2,
    title: "Volunteer Spotlight: A Day with the Kids",
    image: img2,
    summary: "Meet our incredible volunteers and see the difference they’re making in the lives of orphans.",
    date: "April 15, 2025",
  },
  {
    id: 3,
    title: "How You Can Support Our Mission",
    image: img3,
    summary: "There are many ways to get involved—donate, volunteer, or simply spread the word.",
    date: "April 10, 2025",
  },
];

const Blog = () => {
  return (
    <>
    <TopBar />
    <Navbar />
    <section className={styles.blogContainer}>
      <h2 className={styles.title}>Our Blog</h2>
      <div className={styles.grid}>
        {blogPosts.map((post) => (
          <article key={post.id} className={styles.card}>
            <img
              src={post.image}
              alt={post.title}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <p className={styles.cardDate}>{post.date}</p>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p className={styles.cardSummary}>{post.summary}</p>
              <button className={styles.readMoreBtn}>Read More →</button>
            </div>
          </article>
        ))}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Blog;
