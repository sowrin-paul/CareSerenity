import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
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
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import { styled } from "@mui/material/styles";
import "../css/Color.module.css";
import TopBar from "./TopBar";
import Navbar from "./NavbarU";

const blogData = [
  {
    img: "https://picsum.photos/800/450?random=1",
    tag: "Engineering",
    title: "How AI is Changing Healthcare",
    description:
      "Explore the impact of artificial intelligence on modern healthcare and how it's improving patient outcomes.",
    authors: [
      { name: "Remy Sharp", avatar: "/static/images/avatar/1.jpg" },
      { name: "Travis Howard", avatar: "/static/images/avatar/2.jpg" },
    ],
  },
  {
    img: "https://picsum.photos/800/450?random=2",
    tag: "Product",
    title: "Our New Patient Portal",
    description:
      "Introducing our new patient portal designed for seamless communication and easy access to health records.",
    authors: [{ name: "Erica Johns", avatar: "/static/images/avatar/6.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=3",
    tag: "Design",
    title: "Designing for Accessibility",
    description:
      "A look at how we ensure our digital products are accessible to everyone, regardless of ability.",
    authors: [{ name: "Kate Morrison", avatar: "/static/images/avatar/7.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=4",
    tag: "Company",
    title: "Our Journey So Far",
    description:
      "A reflection on our company's growth, milestones, and commitment to patient care.",
    authors: [{ name: "Cindy Baker", avatar: "/static/images/avatar/3.jpg" }],
  },
  {
    img: "https://picsum.photos/800/450?random=5",
    tag: "Engineering",
    title: "Securing Patient Data",
    description:
      "How we use the latest technology to keep your health information safe and private.",
    authors: [
      { name: "Agnes Walker", avatar: "/static/images/avatar/4.jpg" },
      { name: "Trevor Henderson", avatar: "/static/images/avatar/5.jpg" },
    ],
  },
  {
    img: "https://picsum.photos/800/450?random=6",
    tag: "Product",
    title: "Telemedicine: The Future is Now",
    description:
      "Discover how telemedicine is making healthcare more accessible and convenient for everyone.",
    authors: [{ name: "Travis Howard", avatar: "/static/images/avatar/2.jpg" }],
  },
];

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

function Author({ authors }) {
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
        <AvatarGroup max={3}>
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption" sx={{ color: "var(--text-color-lighter)" }}>
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption" sx={{ color: "var(--text-color-lighter)" }}>
        July 14, 2025
      </Typography>
    </Box>
  );
}

function SearchBar() {
  return (
    <OutlinedInput
      size="small"
      id="search"
      placeholder="Search…"
      sx={{
        flexGrow: 1,
        background: "var(--background-color)",
        color: "var(--text-color)",
        borderRadius: 2,
      }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: "var(--primary-color-dark)" }}>
          <SearchRoundedIcon fontSize="small" />
        </InputAdornment>
      }
      inputProps={{
        "aria-label": "search",
      }}
    />
  );
}

const UserBlog = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <React.Fragment>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />
      <CssBaseline enableColorScheme />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: 14,
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
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
            width: "100%",
          }}
        >
          <SearchBar />
          <IconButton size="small" aria-label="RSS feed" sx={{ color: "var(--secondary-title-color)" }}>
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>

        {/* Categories */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            overflow: "auto",
            my: 2,
          }}
        >
          <Chip label="All categories" sx={{ background: "var(--primary-color-light)", color: "#fff" }} />
          <Chip label="Company" sx={{ background: "var(--secondary-color-light)", color: "#fff" }} />
          <Chip label="Product" sx={{ background: "var(--primary-color-dark)", color: "#fff" }} />
          <Chip label="Design" sx={{ background: "var(--secondary-title-color)", color: "#fff" }} />
          <Chip label="Engineering" sx={{ background: "var(--primary-title-color)", color: "#fff" }} />
        </Box>

        {/* Blog Cards */}
        <Grid container spacing={3} columns={12} sx={{ display: "flex", flexWrap: "nowrap", flexDirection: "column", alignItems: "center" }}>
          {blogData.map((blog, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <StyledCard variant="outlined">
                <CardMedia
                  component="img"
                  alt={blog.title}
                  image={blog.img}
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
                    {blog.tag}
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
                    {blog.description}
                  </StyledTypography>
                </StyledCardContent>
                <Author authors={blog.authors} />
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 4, justifyContent: "center" }}>
          <Pagination count={5} color="primary" />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default UserBlog;