import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./NavbarU";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import "../css/colors.css";
import "../css/navbar.css";
import "../css/profile_edit.css";
import "../css/seminar.css";
import "../css/footer.css";
import "../css/notification.css";
import "../css/feedback.css";

function SeminarUserPage() {
  const [seminars, setSeminars] = useState([]);
  const [feedback, setFeedback] = useState({ positive: "", negative: "" });
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchSeminars();
    fetchFeedback();
  }, []);

  const fetchSeminars = async () => {
    try {
      const response = await axios.get("/api/seminars");
      setSeminars(response.data);
    } catch (error) {
      console.error("Error fetching seminars:", error);
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
    console.log("Searching for:", query);
  };

  const handleRefresh = () => {
    fetchSeminars();
  };

  return (
    <>
      <Navbar />

      <div className="feedback">
        {feedback.positive && (
          <div className="positive">
            <h5>{feedback.positive}</h5>
          </div>
        )}
        {feedback.negative && (
          <div className="negative">
            <h5>{feedback.negative}</h5>
          </div>
        )}
      </div>

      <div className="options">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Organizations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">
            <i className="ri-search-line"></i>
          </button>
        </form>
        <button onClick={handleRefresh} id="button-30">
          <i className="bx bx-refresh" style={{ color: "black" }}></i>
        </button>
      </div>

      <h1 id="heading">Available Seminars :</h1>

      <div className="seminarBlock">
        {seminars.length > 0 ? (
          <div className="cards">
            {seminars.map((seminar) => (
              <Link
                key={seminar.seminar_id}
                to={`/seminar_view/${seminar.seminar_id}/${seminar.org_id}`}
              >
                <div className="seminarCard">
                  <img
                    src={`/assets/${seminar.banner}`}
                    alt="Seminar Banner"
                  />
                  <h3>{seminar.title}</h3>
                  <div className="info">
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
          <p id="notFound">Currently no seminars are available.</p>
        )}
      </div>

      <Footer />

      {/* Scroll-to-top button */}
      <button id="scrollTopBtn" title="Go to top">
        <i className="bx bx-chevrons-up bx-burst"></i>
      </button>

      {/* JavaScript files */}
      <script src="./js/scrollupBTN.js" async defer></script>
      <script src="./js/notification_color.js" async defer></script>
      <script src="./js/feedback.js" async defer></script>
    </>
  );
}

export default SeminarUserPage;
