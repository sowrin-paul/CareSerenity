import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import seminarStyles from '../css/Seminar.module.css';
import profileEditStyles from '../css/ProfileEdit.module.css';
import Navbar from './NavbarO';
import Footer from './Footer';
import TopBar from './TopBar';

function OSeminarsPage() {
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
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOwnSeminars();
        fetchAvailableSeminars();
    }, []);

    const fetchOwnSeminars = async () => {
        try {
            const res = await fetch('/own-seminars/');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setOwnSeminars(data);
        } catch (error) {
            console.error('Error fetching own seminars:', error);
        }
    };

    const fetchAvailableSeminars = async () => {
        try {
            const res = await fetch('/available-seminars/');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setSeminars(data);
        } catch (error) {
            console.error('Error fetching available seminars:', error);
            setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
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
            if (key === "type") {
                formPayload.append("seminar_type",  formData[key]);
            } else {
                formPayload.append(key, formData[key]);
            }
        }

        try {
            const res = await fetch('/seminars/', {
                method: 'POST',
                body: formPayload,
            });
            const data = await res.json();
            if (res.ok) {
                setFeedback({ positive: 'Seminar created successfully!', negative: '' });
                fetchOwnSeminars();
                fetchAvailableSeminars();
                setFormData({
                    title: '',
                    subject: '',
                    description: '',
                    seminar_date: '',
                    guest: '',
                    seminar_type: '',
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

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Navbar unreadCount={unreadCount} />

            {/* Feedback Message */}
            <Snackbar
                open={!!feedback.positive}
                autoHideDuration={4000}
                onClose={() => setFeedback({ ...feedback, positive: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    onClose={() => setFeedback({ ...feedback, positive: '' })}
                    sx={{ width: '100%' }}
                >
                    {feedback.positive}
                </Alert>
            </Snackbar>
            <Snackbar
                open={!!feedback.negative}
                autoHideDuration={4000}
                onClose={() => setFeedback({ ...feedback, negative: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity="error"
                    onClose={() => setFeedback({ ...feedback, negative: '' })}
                    sx={{ width: '100%' }}
                >
                    {feedback.negative}
                </Alert>
            </Snackbar>

            {/* Create Seminar Button */}
            <div className={profileEditStyles.options} style={{ paddingTop: '100px' }}>
                <Button
                    variant="contained"
                    onClick={() => setShowForm((prev) => !prev)}
                    id="button-30"
                >
                    Create Seminar
                </Button>
            </div>

            {/* Seminar Form */}
            <Collapse in={showForm} timeout={400} unmountOnExit>
                <div className={profileEditStyles.container}>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <h2>Launch Seminar</h2>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Title"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Description"
                                name="description"
                                value={formData.description}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Date"
                                name="seminar_date"
                                type="date"
                                value={formData.seminar_date}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                margin="dense"
                                InputLabelProps={{ shrink: true }}
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Guests"
                                name="guest"
                                value={formData.guest}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <FormControl fullWidth margin="dense" required>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    name="seminar_type"
                                    value={formData.type}
                                    label="Type"
                                    onChange={handleFormChange}
                                >
                                    <MenuItem value="">
                                        <em>Select online or offline</em>
                                    </MenuItem>
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="offline">Offline</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {toggleLocationField && (
                            <div className={profileEditStyles.formRow}>
                                <TextField
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleFormChange}
                                    fullWidth
                                    margin="dense"
                                />
                            </div>
                        )}

                        <div className={profileEditStyles.formRow}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ justifyContent: 'center' }}
                            >
                                Upload Seminar Banner
                                <input
                                    type="file"
                                    name="banner"
                                    hidden
                                    onChange={handleFormChange}
                                    required
                                />
                            </Button>
                            {formData.banner && (
                                <span style={{ marginLeft: 8 }}>{formData.banner.name || 'File selected'}</span>
                            )}
                        </div>

                        <div className={profileEditStyles.buttons}>
                            <Button
                                variant="contained"
                                id="button-30"
                                type="submit"
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </Collapse>

                {/* My Seminars */}
                <div className={seminarStyles.seminarContainer}>
                    <h1 className={seminarStyles.title}>My Seminars :</h1>
                    <div className={seminarStyles.grid}>
                        {ownSeminars.length > 0 ? ownSeminars.map((seminar) => (
                            <Link key={seminar.seminar_id} to={`/seminar-view/${seminar.seminar_id}`} className={seminarStyles.cardLink}>
                                <div className={seminarStyles.card}>
                                    <img src={`/assets/${seminar.banner}`} alt="Seminar Banner" className={seminarStyles.cardImage} />
                                    <h3 className={seminarStyles.cardTitle}>{seminar.title}</h3>
                                    <div className={seminarStyles.cardInfo}>
                                        <span className={seminarStyles.cardDate}>{seminar.seminar_date}</span>
                                    </div>
                                </div>
                            </Link>
                        )) : <p className={seminarStyles.notFound}>You haven't launched any seminars yet.</p>}
                    </div>
                </div>

                {/* Available Seminars */}
                <div className={seminarStyles.seminarContainer}>
                    <h1 className={seminarStyles.title}>Available Seminars :</h1>
                    <div className={seminarStyles.grid}>
                        {seminars.length > 0 ? seminars.map((seminar) => (
                            <Link key={seminar.seminar_id} to={`/seminar-view/${seminar.seminar_id}`} className={seminarStyles.cardLink}>
                                <div className={seminarStyles.card}>
                                    <img src={`/assets/${seminar.banner}`} alt="Seminar Banner" className={seminarStyles.cardImage} />
                                    <h3 className={seminarStyles.cardTitle}>{seminar.title}</h3>
                                    <div className={seminarStyles.cardInfo}>
                                        <span className={seminarStyles.cardDate}>{seminar.seminar_date}</span>
                                        <span><i className="bx bxs-user-check"></i> {seminar.participants_count}</span>
                                    </div>
                                </div>
                            </Link>
                        )) : <p className={seminarStyles.notFound}>Currently no seminars are available.</p>}
                    </div>
                </div>
            <Footer />
        </div>
    );
}

export default OSeminarsPage;
