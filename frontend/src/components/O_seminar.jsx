import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Color.module.css';
import '../css/Navbar.module.css';
import '../css/Profile_edit.module.css';
import '../css/Seminar.module.css';
import '../css/Footer.module.css';
import '../css/notification.css';
import '../css/Feedback.module.css';

function SeminarsPage() {
    const [seminars, setSeminars] = useState([]);
    const [ownSeminars, setOwnSeminars] = useState([]);
    const [feedback, setFeedback] = useState({ positive: '', negative: '' });
    const [unreadCount, setUnreadCount] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        seminar_date: '',
        guest: '',
        type: '',
        location: '',
        banner: null,
    });

    useEffect(() => {
        fetchUnreadNotifications();
        fetchOwnSeminars();
        fetchAvailableSeminars();
    }, []);

    const fetchUnreadNotifications = async () => {
        try {
            const res = await fetch('/api/unread-notifications');
            const data = await res.json();
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOwnSeminars = async () => {
        try {
            const res = await fetch('/api/own-seminars');
            const data = await res.json();
            setOwnSeminars(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAvailableSeminars = async () => {
        try {
            const res = await fetch('/api/available-seminars');
            const data = await res.json();
            setSeminars(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formPayload = new FormData();
        for (let key in formData) {
            formPayload.append(key, formData[key]);
        }

        try {
            const res = await fetch('/api/create-seminar', {
                method: 'POST',
                body: formPayload,
            });
            const data = await res.json();
            if (data.success) {
                setFeedback({ positive: 'Seminar created successfully!', negative: '' });
                fetchOwnSeminars();
                fetchAvailableSeminars();
                setFormData({
                    title: '',
                    subject: '',
                    description: '',
                    seminar_date: '',
                    guest: '',
                    type: '',
                    location: '',
                    banner: null,
                });
                setShowForm(false);
            } else {
                setFeedback({ positive: '', negative: data.message || 'Failed to create seminar.' });
            }
        } catch (error) {
            setFeedback({ positive: '', negative: 'An error occurred.' });
            console.error(error);
        }
    };

    const toggleLocationField = formData.type === 'offline';

    return (
        <div>
            {/* Navbar */}
            <Navbar unreadCount={unreadCount} />

            {/* Feedback Message */}
            <div className="feedback">
                {feedback.positive && <div className="positive"><h5>{feedback.positive}</h5></div>}
                {feedback.negative && <div className="negative"><h5>{feedback.negative}</h5></div>}
            </div>

            {/* Create Seminar Button */}
            <div className="options">
                <button onClick={() => setShowForm((prev) => !prev)} id="button-30">
                    Create Seminar
                </button>
            </div>

            {/* Seminar Form */}
            {showForm && (
                <div className="container" id="seminarForm">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <h2>Launch Seminar</h2>

                        <div className="form_row">
                            <label htmlFor="title">Seminar Title:</label>
                            <input type="text" id="title" name="title" value={formData.title} onChange={handleFormChange} required />
                        </div>

                        <div className="form_row">
                            <label htmlFor="subject">Seminar Subject:</label>
                            <input type="text" id="topic" name="subject" value={formData.subject} onChange={handleFormChange} required />
                        </div>

                        <div className="form_row">
                            <label htmlFor="description">Seminar Description:</label>
                            <input type="text" id="description" name="description" value={formData.description} onChange={handleFormChange} required />
                        </div>

                        <div className="form_row">
                            <label htmlFor="seminar_date">Date:</label>
                            <input type="date" id="date" name="seminar_date" value={formData.seminar_date} onChange={handleFormChange} required />
                        </div>

                        <div className="form_row">
                            <label htmlFor="guest">Guests:</label>
                            <input type="text" id="guest" name="guest" value={formData.guest} onChange={handleFormChange} required />
                        </div>

                        <div className="form_row">
                            <label htmlFor="type">Type:</label>
                            <select name="type" id="type" value={formData.type} onChange={handleFormChange} required>
                                <option value="" disabled>Select online or offline</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>

                        {toggleLocationField && (
                            <div className="form_row" id="locationField">
                                <label htmlFor="location">Location:</label>
                                <input type="text" id="location" name="location" value={formData.location} onChange={handleFormChange} />
                            </div>
                        )}

                        <div className="form_row">
                            <label htmlFor="banner">Seminar Banner:</label>
                            <input type="file" id="banner" name="banner" onChange={handleFormChange} required />
                        </div>

                        <div className="buttons">
                            <button id="button-30" type="submit">Create</button>
                        </div>
                    </form>
                </div>
            )}

            {/* My Seminars */}
            <h1 id="heading">My Seminars :</h1>
            <div className="seminarBlock">
                <div className="cards">
                    {ownSeminars.length > 0 ? ownSeminars.map((seminar) => (
                        <Link key={seminar.seminar_id} to={`/seminar-view/${seminar.seminar_id}`}>
                            <div className="seminarCard">
                                <img src={`/assets/${seminar.banner}`} alt="Seminar Banner" />
                                <h3>{seminar.title}</h3>
                                <div className="info">
                                    <span>{seminar.seminar_date}</span>
                                </div>
                            </div>
                        </Link>
                    )) : <p id="notFound">You haven't launched any seminars yet.</p>}
                </div>
            </div>

            {/* Available Seminars */}
            <h1 id="heading">Available Seminars :</h1>
            <div className="seminarBlock">
                <div className="cards">
                    {seminars.length > 0 ? seminars.map((seminar) => (
                        <Link key={seminar.seminar_id} to={`/seminar-view/${seminar.seminar_id}`}>
                            <div className="seminarCard">
                                <img src={`/assets/${seminar.banner}`} alt="Seminar Banner" />
                                <h3>{seminar.title}</h3>
                                <div className="info">
                                    <span>{seminar.seminar_date}</span>
                                    <span><i className="bx bxs-user-check"></i> {seminar.participants_count}</span>
                                </div>
                            </div>
                        </Link>
                    )) : <p id="notFound">Currently no seminars are available.</p>}
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Scroll to Top Button */}
            <button id="scrollTopBtn" title="Go to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <i className='bx bx-chevrons-up bx-burst'></i>
            </button>
        </div>
    );
}

export default SeminarsPage;
