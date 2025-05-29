import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavbarU";
import Footer from "./Footer";
import TopBar from "./TopBar";
import styles from "../css/Seminar.module.css";
import {
  Alert, Stack, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Button, Card, CardContent, CardActionArea, CardMedia, Typography, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CancelIcon from "@mui/icons-material/Cancel";

function USeminarUserPage() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [feedback, setFeedback] = useState({ positive: "", negative: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const res = await fetch(`${apiUrl}/available-seminars/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch available seminars.");
      const data = await res.json();
      setSeminars(data);
      setFilteredSeminars(data);
    } catch (error) {
      setFeedback({ positive: "", negative: "Failed to fetch available seminars." });
    }
  };

  useEffect(() => {
    const filtered = seminars.filter((seminar) => {
      const matchesTitle = seminar.title?.toLowerCase().includes(search.toLowerCase());
      const matchesDate = searchDate ? seminar.seminar_date === searchDate : true;
      const matchesLocation = seminar.location?.toLowerCase().includes(searchLocation.toLowerCase());
      const matchesType = filterType && filterType !== "All" ? seminar.seminar_type === filterType : true;
      return matchesTitle && matchesDate && matchesLocation && matchesType;
    });

    setFilteredSeminars(filtered);
    setShowAlert(filtered.length === 0);
  }, [search, searchDate, searchLocation, filterType, seminars]);

  const handleCardClick = async (seminarId) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/seminars/${seminarId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch seminar details.");
      const data = await res.json();
      setSelectedSeminar(data);

      const regRes = await fetch(`${apiUrl}/seminars/${seminarId}/is-registered/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (regRes.ok) {
        const regData = await regRes.json();
        setIsRegistered(regData.registered);
      }

      setIsModalOpen(true);
    } catch (error) {
      setFeedback({ positive: "", negative: "Failed to load seminar details." });
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSeminar(null);
  };

  const handleRegistration = async () => {
    try {
      const url = isRegistered
        ? `${apiUrl}/seminars/${selectedSeminar.id}/deregister/`
        : `${apiUrl}/seminars/${selectedSeminar.id}/register/`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Registration action failed");
      setIsRegistered(!isRegistered);
      setSelectedSeminar((prev) => ({
        ...prev,
        participants_count: isRegistered
          ? prev.participants_count - 1
          : prev.participants_count + 1,
      }));
      setFeedback({
        positive: isRegistered ? "Registration cancelled." : "Successfully registered!",
        negative: "",
      });
    } catch (error) {
      setFeedback({
        positive: "",
        negative: "Registration action failed.",
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/home");
  };

  const handleRefresh = () => {
    fetchSeminars();
    setSearch("");
    setFilterType("");
    setShowAlert(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />

      {/* Feedback Messages */}
      <Snackbar
        open={!!feedback.positive}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, positive: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
            <SearchRoundedIcon />
          </IconButton>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshRoundedIcon />
          </IconButton>
          <IconButton
            onClick={() => setShowFilter((f) => !f)}
            color={showFilter ? "secondary" : "primary"}
          >
            <FilterListRoundedIcon />
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
                onClick={() => handleCardClick(seminar.id)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="160"
                    image={seminar.banner ? `${apiUrl}${seminar.banner}` : "/assets/default_banner.jpg"}
                    alt="Seminar Banner"
                    sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {seminar.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {seminar.seminar_date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </div>
        ) : (
          <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
            <Alert severity="warning">Currently no seminar available.</Alert>
          </Stack>
        )}
      </div>

      {/* Seminar Details Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSeminar?.title || "Seminar Details"}</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <img
                src={selectedSeminar?.banner ? `${apiUrl}${selectedSeminar.banner}` : "/assets/default_banner.jpg"}
                alt="Seminar Banner"
                style={{ width: "100%", borderRadius: "8px", marginBottom: "16px" }}
              />
              <Typography variant="body1" gutterBottom>
                <b>Date:</b> {selectedSeminar?.seminar_date}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Location:</b> {selectedSeminar?.location}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Description:</b> {selectedSeminar?.description}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Special Guest:</b> {selectedSeminar?.guest}
              </Typography>
              <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
                <Button
                  variant={isRegistered ? "outlined" : "contained"}
                  color={isRegistered ? "error" : "success"}
                  startIcon={isRegistered ? <CancelIcon /> : <HowToRegIcon />}
                  onClick={handleRegistration}
                >
                  {isRegistered ? "Cancel Registration" : "Register"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary" startIcon={<ArrowBackIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
}

export default USeminarUserPage;

