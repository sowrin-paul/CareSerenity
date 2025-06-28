import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Stack } from '@mui/material';
import styles from '../css/Blog.module.css';
import { useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import Navbar from './NavbarU';
import Footer from './Footer';

const apiUrl = import.meta.env.VITE_API_URL;

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    try {
      const res = await fetch(`${apiUrl}/blogs/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to create blog');
      alert('Blog created successfully!');
      setTitle('');
      setContent('');
      setImage(null);
      navigate('/user-home');
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />
      <div className={styles.container} style={{ marginTop: 100}}>
        <div className={styles.card}>
          <h1 className={styles.title}>Write a new Blog</h1>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextField
                label="Content"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <Button variant="outlined" component="label">
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.postButton}
              >
                Post Blog
              </Button>
            </Stack>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogCreate;
