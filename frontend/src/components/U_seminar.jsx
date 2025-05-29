import { useEffect, useState } from "react";
import Navbar from "./NavbarU";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import styles from "../css/Seminar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Alert, Stack, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Button, Card, CardContent, CardActionArea, CardMedia, Typography } from "@mui/material";

function USeminarUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [feedback, setFeedback] = useState({ positive: "", negative: "" });
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeminars();
    fetchFeedback && fetchFeedback()
  });
  const fetchSeminars = async () => {
    try {
      const res = await fetch(`${apiUrl}/available-seminars/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errorText = await res.text();
        setSeminars([]);
        setFilteredSeminars([]);
        setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
        console.error('Error fetching available seminars:', errorText);
        return;
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setSeminars(data);
        setFilteredSeminars(data);
      } else {
        const text = await res.text();
        setSeminars([]);
        setFilteredSeminars([]);
        setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
        console.error('Non-JSON response:', text);
      }
    } catch (error) {
      setSeminars([]);
      setFilteredSeminars([]);
      setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
      console.error('Error fetching available seminars:', error);
    }
  };

  const fetchFeedback = () => {
    const positive = sessionStorage.getItem("positive");
    const negative = sessionStorage.getItem("negative");
    if (positive || negative) {
      setFeedback({ positive, negative });
      sessionStorage.removeItem("positive");
      sessionStorage.removeItem("negative");
    }
  };

  // Filtering
  const filtered = seminars.filter((seminar) => {
    const matchesTitle = seminar.title?.toLowerCase().includes(search.toLowerCase());
    const matchesDate = searchDate ? seminar.seminar_date === searchDate : true;
    const matchesLocation = seminar.location?.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesType = filterType && filterType !== "All" ? seminar.seminar_type === filterType : true;
    return matchesTitle && matchesDate && matchesLocation && matchesType;
  });

  useEffect(() => {
    setFilteredSeminars(filtered);
    setShowAlert(filtered.length === 0);
  }, [search, searchDate, searchLocation, filterType, seminars]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleRefresh = () => {
    fetchSeminars();
    setSearch("");
    setFilterType("");
    setShowAlert(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/home");
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />

      {/* Feedback Message */}
      <Snackbar
        open={!!feedback.positive}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, positive: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ position: "fixed", zIndex: 11 }}
      >
        <Alert
          severity="success"
          onClose={() => setFeedback({ ...feedback, positive: "" })}
          sx={{ width: "100%" }}
        >
          {feedback.positive}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!feedback.negative}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, negative: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ position: "fixed", zIndex: 11 }}
      >
        <Alert
          severity="error"
          onClose={() => setFeedback({ ...feedback, negative: "" })}
          sx={{ width: "100%" }}
        >
          {feedback.negative}
        </Alert>
      </Snackbar>

      {/* Options Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "24px 0 8px 0",
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, marginTop: 100, marginLeft: 280 }}
        >
          <TextField
            label="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            variant="outlined"
          />
          <IconButton type="submit" color="primary">
            <SearchIcon />
          </IconButton>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowFilter((f) => !f)}
            color={showFilter ? "secondary" : "primary"}
          >
            <FilterListIcon />
          </IconButton>
          {showFilter && (
            <FormControl size="small" style={{ minWidth: 120 }}>
              <InputLabel id="filter-type-label">Type</InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          )}
        </form>
      </div>

      <h1 className={styles.heading}>Available Seminars :</h1>

      <div className={styles.seminarBlock}>
        {Array.isArray(filteredSeminars) && filteredSeminars.length > 0 ? (
          <div className={styles.cards}>
            {filteredSeminars.map((seminar) => (
              <Card
                key={seminar.id}
                className={styles.seminarCard}
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  minWidth: 260,
                  maxWidth: 300,
                  margin: "12px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textDecoration: "none"
                }}
                component={Link}
                to={`/seminar-view/${seminar.id}`}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="160"
                    image={seminar.banner ? `${apiUrl}/media/${seminar.banner}` : '/assets/default_banner.jpg'}
                    alt="Seminar Banner"
                    className={styles.cardImage}
                    sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" className={styles.cardTitle}>
                      {seminar.title}
                    </Typography>
                    <div className={styles.cardInfo}>
                      <Typography variant="body2" color="text.secondary">
                        {seminar.seminar_date}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 2 }}>
                        <i className="bx bxs-user-check"></i> {seminar.participants_count}
                      </Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Alert for no seminars */}
            {showAlert && (
              <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                <Alert severity="warning">Currently no seminar available.</Alert>
              </Stack>
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

export default USeminarUserPage;
