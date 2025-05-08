import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./NavbarU";
import Footer from "./Footer";
import { Link, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import styles from "../css/Seminar.module.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { Alert, Stack } from "@mui/material";

function USeminarUserPage() {
  const [seminars, setSeminars] = useState([]);
  const [filteredSeminars, setFilteredSeminars] = useState([]);
  const [feedback, setFeedback] = useState({ positive: "", negative: "" });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState({ location: "", date: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeminars();
    fetchFeedback();
  }, []);

  const fetchSeminars = async () => {
    try {
      const response = await axios.get("/api/seminars");
      if (Array.isArray(response.data)) {
        setSeminars(response.data);
        setFilteredSeminars(response.data); // Ensure this is an array
      } else {
        console.error("API response is not an array:", response.data);
        setSeminars([]);
        setFilteredSeminars([]);
      }
    } catch (error) {
      console.error("Error fetching seminars:", error);
      setSeminars([]);
      setFilteredSeminars([]);
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

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = seminars.filter(
      (seminar) =>
        seminar.title.toLowerCase().includes(query.toLowerCase()) ||
        seminar.location.toLowerCase().includes(query.toLowerCase()) ||
        seminar.seminar_date.includes(query)
    );
    setFilteredSeminars(filtered);

    if (filtered.length === 0) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  const handleFilter = () => {
    const filtered = seminars.filter(
      (seminar) =>
        (filter.location === "" || seminar.location === filter.location) &&
        (filter.date === "" || seminar.seminar_date === filter.date)
    );
    setFilteredSeminars(filtered);

    if (filtered.length === 0) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  };

  const handleRefresh = () => {
    fetchSeminars();
    setQuery("");
    setFilter({ location: "", date: "" });
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
      <div className={styles.feedback}>
        {feedback.positive && (
          <div className={styles.positive}>
            <h5>{feedback.positive}</h5>
          </div>
        )}
        {feedback.negative && (
          <div className={styles.negative}>
            <h5>{feedback.negative}</h5>
          </div>
        )}
      </div>

      <div className={styles.options}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by title, date, or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            <SearchRoundedIcon />
          </button>
        </form>
        <button onClick={handleRefresh} className={styles.refreshButton}>
          <RefreshRoundedIcon />
        </button>
      </div>

      <h1 className={styles.heading}>Available Seminars :</h1>
      <div className={styles.filterOptions}>
        <input
          type="text"
          placeholder="Filter by location..."
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
          className={styles.filterInput}
        />
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          className={styles.filterInput}
        />
        <button onClick={handleFilter} className={styles.filterButton}>
          <FilterAltRoundedIcon />
          Filter
        </button>
      </div>

      {/* alert showing */}
      {showAlert && (
        <Stack sx={{ width: "80%", margin: "10px auto" }} spacing={2}>
          <Alert severity="warning">No seminar found. Please try again.</Alert>
        </Stack>
      )}

      <div className={styles.seminarBlock}>
        {Array.isArray(filteredSeminars) && filteredSeminars.length > 0 ? (
          <div className={styles.cards}>
            {filteredSeminars.map((seminar) => (
              <Link
                key={seminar.seminar_id}
                to={`/seminar_view/${seminar.seminar_id}/${seminar.org_id}`}
                className={styles.cardLink}
              >
                <div className={styles.seminarCard}>
                  <img
                    src={`/assets/${seminar.banner}`}
                    alt="Seminar Banner"
                    className={styles.cardImage}
                  />
                  <h3 className={styles.cardTitle}>{seminar.title}</h3>
                  <div className={styles.cardInfo}>
                    <span>{seminar.seminar_date}</span>
                    <span>
                      <i className="bx bxs-user-check"></i>{" "}
                      {seminar.participants_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.notFound}>Currently no seminars are available.</p>
        )}
      </div>

      <Footer />

      {/* Scroll-to-top button */}
      {/* <button className={styles.scrollTopBtn} title="Go to top">
        <i className="bx bx-chevrons-up bx-burst"></i>
      </button> */}
    </>
  );
}

export default USeminarUserPage;
