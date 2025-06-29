import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { styled } from "@mui/material/styles";
import "../css/Color.module.css";
import TopBar from "./TopBar";
import NavbarU from "./NavbarU";
import Footer from "./Footer";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: "var(--background-color)",
  borderColor: "var(--primary-color-light)",
  "&:hover": {
    boxShadow: `0 4px 20px 0 var(--primary-color-light)`,
    cursor: "pointer",
  },
}));

const StyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

function Author({ author, date }) {
  // Extract first name from the author name if available
  const authorFirstName = author ? author.split(' ')[0] : "Anonymous";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
        <AvatarGroup max={1}>
          <Avatar
            alt={author || "User"}
            sx={{ width: 24, height: 24 }}
          />
        </AvatarGroup>
        <Typography variant="caption" sx={{ color: "var(--text-color-lighter)" }}>
          {authorFirstName}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: "var(--text-color-lighter)" }}>
        {formatDate(date)}
      </Typography>
    </Box>
  );
}

function SearchBar({ search, setSearch, handleSearch }) {
  return (
    <OutlinedInput
      size="small"
      id="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
      placeholder="Search…"
      sx={{
        flexGrow: 1,
        background: "var(--background-color)",
        color: "var(--text-color)",
        borderRadius: 2,
      }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: "var(--primary-color-dark)" }}>
          <SearchRoundedIcon fontSize="small" onClick={handleSearch} style={{ cursor: 'pointer' }} />
        </InputAdornment>
      }
      inputProps={{
        'aria-label': 'search'
      }}
    />
  );
}

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UserBlog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', severity: 'success', open: false });
  const [likedBlogs, setLikedBlogs] = useState({});
  const [dislikedBlogs, setDislikedBlogs] = useState({});
  const [search, setSearch] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [activeTag, setActiveTag] = useState("All categories");
  const navigate = useNavigate();

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/blogs/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch blogs.");
        const data = await res.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setFeedback({
          message: "Failed to load blogs. Please try again later.",
          severity: "error",
          open: true
        });
      } finally {
        setLoading(false);
      }
    };

    // Fetch user's liked and disliked blogs
    const fetchUserReactions = async () => {
      try {
        const res = await fetch(`${apiUrl}/blogs/user-reactions/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();

          const liked = {};
          const disliked = {};

          data.forEach(reaction => {
            if (reaction.reaction_type === 'like') {
              liked[reaction.blog_id] = true;
            } else if (reaction.reaction_type === 'dislike') {
              disliked[reaction.blog_id] = true;
            }
          });

          setLikedBlogs(liked);
          setDislikedBlogs(disliked);
        }
      } catch (error) {
        console.error("Error fetching user reactions:", error);
      }
    };

    fetchBlogs();
    fetchUserReactions();
  }, [apiUrl]);

  // Filter blogs by search and tag
  useEffect(() => {
    let result = blogs;

    // Filter by search
    if (search) {
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by tag
    if (activeTag !== "All categories") {
      result = result.filter(blog => blog.category === activeTag);
    }

    setFilteredBlogs(result);
  }, [blogs, search, activeTag]);

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = () => {
  };

  const handleTagFilter = (tag) => {
    setActiveTag(tag);
  };

  // like
  const handleLike = async (blogId, event) => {
    if (event) event.stopPropagation();

    try {
      const reaction_type = likedBlogs[blogId] ? 'remove' : 'like';

      const res = await fetch(`${apiUrl}/blogs/${blogId}/react/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reaction_type }),
      });

      if (res.ok) {
        const updatedBlogs = blogs.map(blog => {
          if (blog.id === blogId) {
            const likeDelta = likedBlogs[blogId] ? -1 : 1;
            const dislikeDelta = dislikedBlogs[blogId] ? -1 : 0;

            return {
              ...blog,
              likes: blog.likes + likeDelta,
              dislikes: blog.dislikes + dislikeDelta,
            };
          }
          return blog;
        });

        setBlogs(updatedBlogs);
        setFilteredBlogs(prevFiltered =>
          prevFiltered.map(blog => {
            if (blog.id === blogId) {
              const likeDelta = likedBlogs[blogId] ? -1 : 1;
              const dislikeDelta = dislikedBlogs[blogId] ? -1 : 0;

              return {
                ...blog,
                likes: blog.likes + likeDelta,
                dislikes: blog.dislikes + dislikeDelta,
              };
            }
            return blog;
          })
        );

        if (selectedBlog && selectedBlog.id === blogId) {
          const likeDelta = likedBlogs[blogId] ? -1 : 1;
          const dislikeDelta = dislikedBlogs[blogId] ? -1 : 0;

          setSelectedBlog({
            ...selectedBlog,
            likes: selectedBlog.likes + likeDelta,
            dislikes: selectedBlog.dislikes + dislikeDelta,
          });
        }

        setLikedBlogs(prev => ({
          ...prev,
          [blogId]: !prev[blogId]
        }));

        if (dislikedBlogs[blogId]) {
          setDislikedBlogs(prev => ({
            ...prev,
            [blogId]: false
          }));
        }
      }
    } catch (error) {
      console.error("Error liking blog:", error);
      setFeedback({
        message: "Failed to like blog. Please try again later.",
        severity: "error",
        open: true
      });
    }
  };

  // dislike
  const handleDislike = async (blogId, event) => {
    if (event) event.stopPropagation();

    try {
      const reaction_type = dislikedBlogs[blogId] ? 'remove' : 'dislike';

      const res = await fetch(`${apiUrl}/blogs/${blogId}/react/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reaction_type }),
      });

      if (res.ok) {
        const updatedBlogs = blogs.map(blog => {
          if (blog.id === blogId) {
            const dislikeDelta = dislikedBlogs[blogId] ? -1 : 1;
            const likeDelta = likedBlogs[blogId] ? -1 : 0;

            return {
              ...blog,
              dislikes: blog.dislikes + dislikeDelta,
              likes: blog.likes + likeDelta,
            };
          }
          return blog;
        });

        setBlogs(updatedBlogs);
        setFilteredBlogs(prevFiltered =>
          prevFiltered.map(blog => {
            if (blog.id === blogId) {
              const dislikeDelta = dislikedBlogs[blogId] ? -1 : 1;
              const likeDelta = likedBlogs[blogId] ? -1 : 0;

              return {
                ...blog,
                dislikes: blog.dislikes + dislikeDelta,
                likes: blog.likes + likeDelta,
              };
            }
            return blog;
          })
        );

        if (selectedBlog && selectedBlog.id === blogId) {
          const dislikeDelta = dislikedBlogs[blogId] ? -1 : 1;
          const likeDelta = likedBlogs[blogId] ? -1 : 0;

          setSelectedBlog({
            ...selectedBlog,
            dislikes: selectedBlog.dislikes + dislikeDelta,
            likes: selectedBlog.likes + likeDelta,
          });
        }

        setDislikedBlogs(prev => ({
          ...prev,
          [blogId]: !prev[blogId]
        }));

        if (likedBlogs[blogId]) {
          setLikedBlogs(prev => ({
            ...prev,
            [blogId]: false
          }));
        }
      }
    } catch (error) {
      console.error("Error disliking blog:", error);
      setFeedback({
        message: "Failed to dislike blog. Please try again later.",
        severity: "error",
        open: true
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/home");
  };

  const handleCloseFeedback = () => {
    setFeedback(prev => ({ ...prev, open: false }));
  };

  const categories = ["All categories", ...new Set(blogs.map(blog => blog.category).filter(Boolean))];

  return (
    <React.Fragment>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <NavbarU />
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: 14,
          marginBottom: 8,
          gap: 4,
        }}
      >
        {/* Header */}
        <Box>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              color: "var(--primary-title-color)",
              fontFamily: "var(--primary-font)",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            Blog
          </Typography>
          <Typography
            sx={{
              color: "var(--primary-text-color)",
              fontFamily: "var(--secondary-font)",
              fontSize: 18,
            }}
          >
            Stay in the loop with the latest about our products and care.
          </Typography>
        </Box>

        {/* Search and RSS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              alignItems: "center",
              width: "100%",
            }}
          >
            <SearchBar search={search} setSearch={setSearch} handleSearch={handleSearch} />
            <IconButton size="small" aria-label="RSS feed" sx={{ color: "var(--secondary-title-color)" }}>
              <RssFeedRoundedIcon />
            </IconButton>
          </Box>

          {/* Create Post button */}
          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Button
              component={Link}
              to="/blogs"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: "30px",
                textTransform: "none",
                padding: "8px 20px",
                fontWeight: "bold",
                boxShadow: "0 8px 16px 0 rgba(0,0,0,0.1)",
                background: "var(--primary-color-light)",
                "&:hover": {
                  background: "var(--primary-color-dark)",
                  transform: "translateY(-2px)",
                  transition: "all 0.3s"
                }
              }}
            >
              Create Post
            </Button>
          </Box>
        </Box>

        {/* Blog Cards */}
        <Grid container spacing={3} columns={12} sx={{ display: "flex", flexDirection: "column", flexWrap: "nowrap" }}>
          {loading ? (
            <Typography variant="body1" sx={{ p: 3 }}>Loading blogs...</Typography>
          ) : filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <Grid item xs={12} sm={6} md={4} key={blog.id}>
                <StyledCard variant="outlined" onClick={() => handleBlogClick(blog)}>
                  <CardMedia
                    component="img"
                    alt={blog.title}
                    image={blog.image ? `${apiUrl}${blog.image}` : 'https://picsum.photos/800/450?random=1'}
                    sx={{
                      aspectRatio: "16 / 9",
                      borderBottom: "1px solid var(--primary-color-light)",
                    }}
                  />
                  <StyledCardContent>
                    <Typography
                      gutterBottom
                      variant="caption"
                      component="div"
                      sx={{ color: "var(--secondary-title-color)", fontWeight: 600 }}
                    >
                      {blog.category || "Blog"}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      sx={{ color: "var(--primary-title-color)", fontWeight: 700 }}
                    >
                      {blog.title}
                    </Typography>
                    <StyledTypography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ color: "var(--text-color)" }}
                    >
                      {blog.content.substring(0, 120)}...
                    </StyledTypography>

                    {/* Like/Dislike buttons */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          color={likedBlogs[blog.id] ? "primary" : "default"}
                          onClick={(e) => handleLike(blog.id, e)}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#136ad4',
                            }
                          }}
                        >
                          {likedBlogs[blog.id] ? <ThumbUpIcon
                            fontSize="small"
                            sx={{
                              '&:hover': {
                                backgroundColor: '#136ad4',
                              }
                            }} /> : <ThumbUpOutlinedIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="caption">{blog.likes || 0}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          color={dislikedBlogs[blog.id] ? "error" : "default"}
                          onClick={(e) => handleDislike(blog.id, e)}
                        >
                          {dislikedBlogs[blog.id] ? <ThumbDownIcon fontSize="small" /> : <ThumbDownOutlinedIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="caption">{blog.dislikes || 0}</Typography>
                      </Box>
                    </Box>
                  </StyledCardContent>
                  <Author author={blog.author_name} date={blog.created_at} />
                </StyledCard>
              </Grid>
            ))
          ) : (
            <Box sx={{ p: 3, width: '100%', textAlign: 'center' }}>
              <Typography variant="body1">No blogs found matching your search.</Typography>
            </Box>
          )}
        </Grid>

        {/* Pagination - only show if we have more than 6 blogs */}
        {filteredBlogs.length > 6 && (
          <Box sx={{ display: "flex", flexDirection: "row", pt: 4, justifyContent: "center" }}>
            <Pagination count={Math.ceil(filteredBlogs.length / 6)} color="primary" />
          </Box>
        )}
      </Container>

      {/* Blog Detail Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {selectedBlog && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
              <Typography variant="h5" sx={{ color: "var(--primary-title-color)", fontWeight: 700 }}>
                {selectedBlog.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {selectedBlog.author_name || 'Anonymous'} • {formatDate(selectedBlog.created_at)}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ my: 2 }}>
                <img
                  src={selectedBlog.image ? `${apiUrl}${selectedBlog.image}` : 'https://picsum.photos/800/450?random=1'}
                  alt={selectedBlog.title}
                  style={{ width: '100%', borderRadius: '4px', maxHeight: '400px', objectFit: 'cover' }}
                />
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: "var(--text-color)" }}>
                {selectedBlog.content}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2, borderTop: '1px solid #eee' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={likedBlogs[selectedBlog.id] ? "contained" : "outlined"}
                  color="primary"
                  startIcon={likedBlogs[selectedBlog.id] ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                  onClick={() => handleLike(selectedBlog.id)}
                >
                  Like ({selectedBlog.likes || 0})
                </Button>
                <Button
                  variant={dislikedBlogs[selectedBlog.id] ? "contained" : "outlined"}
                  color="error"
                  startIcon={dislikedBlogs[selectedBlog.id] ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
                  onClick={() => handleDislike(selectedBlog.id)}
                >
                  Dislike ({selectedBlog.dislikes || 0})
                </Button>
              </Box>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback.severity}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      <Footer />
    </React.Fragment>
  );
};

export default UserBlog;