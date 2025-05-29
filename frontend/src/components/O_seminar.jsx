import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Snackbar from '@mui/material/Snackbar';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import seminarStyles from '../css/Seminar.module.css';
import profileEditStyles from '../css/ProfileEdit.module.css';
import Navbar from './NavbarO';
import Footer from './Footer';
import TopBar from './TopBar';

function OSeminarsPage() {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [seminars, setSeminars] = useState([]);
    const [ownSeminars, setOwnSeminars] = useState([]);
    const [feedback, setFeedback] = useState({ positive: '', negative: '' });
    const [unreadCount, setUnreadCount] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subject: '',
        description: '',
        seminar_date: '',
        guest: '',
        seminar_type: '',
        location: '',
        banner: null,
    });
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [filterType, setFilterType] = useState('');
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        fetchOwnSeminars();
        fetchAvailableSeminars();
    }, []);

    const fetchOwnSeminars = async () => {
        try {
            const res = await fetch('/own-seminars/', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error fetching own seminars:', errorText);
                return;
            }
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                setOwnSeminars(data);
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text);
            }
        } catch (error) {
            console.error('Error fetching own seminars:', error);
        }
    };

    const fetchAvailableSeminars = async () => {
        try {
            const res = await fetch(`${apiUrl}/available-seminars/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error fetching available seminars:', errorText);
                setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
                return;
            }
            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                setSeminars(data);
            } else {
                const text = await res.text();
                console.error('Non-JSON response:', text);
                setFeedback({ positive: '', negative: 'Failed to fetch available seminars.' });
            }
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
            formPayload.append(key, formData[key]);
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const res = await fetch(`${apiUrl}/seminars/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formPayload,
            });

            setIsUploading(false);

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
                const data = await res.json();
                setFeedback({ positive: '', negative: data.message || 'Failed to create seminar.' });
            }
        } catch (error) {
            setIsUploading(false);
            setFeedback({ positive: '', negative: 'An error occurred.' });
        }
    };

    const toggleLocationField = formData.seminar_type === 'offline';

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    // Filtered seminars based on search and filter
    const filteredOwnSeminars = ownSeminars.filter(seminar => {
        const matchesTitle = seminar.title?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = searchDate ? seminar.seminar_date === searchDate : true;
        const matchesLocation = seminar.location?.toLowerCase().includes(searchLocation.toLowerCase());
        const matchesType = filterType ? seminar.seminar_type === filterType : true;
        return matchesTitle && matchesDate && matchesLocation && matchesType;
    });

    const filteredSeminars = seminars.filter(seminar => {
        const matchesTitle = seminar.title?.toLowerCase().includes(search.toLowerCase());
        const matchesDate = searchDate ? seminar.seminar_date === searchDate : true;
        const matchesLocation = seminar.location?.toLowerCase().includes(searchLocation.toLowerCase());
        const matchesType = filterType ? seminar.seminar_type === filterType : true;
        return matchesTitle && matchesDate && matchesLocation && matchesType;
    });

    const handleSearch = (e) => {
        e.preventDefault();
    };

    const handleRefresh = () => {
        fetchOwnSeminars();
        fetchAvailableSeminars();
        setSearch('');
        setSearchDate('');
        setFilterType('');
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
                sx={{ position: 'fixed', zIndex: 11 }}
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
                sx={{
                    position: 'fixed', zIndex: 11
                }}
            >
                <Alert
                    severity="error"
                    onClose={() => setFeedback({ ...feedback, negative: '' })}
                    sx={{ width: '100%' }}
                >
                    {feedback.negative}
                </Alert>
            </Snackbar>

            {/* Options and Create Button */}
            <div className={profileEditStyles.options} style={{
                display: 'flex', justifyContent: 'space-between', marginTop: 100
            }}>
                {/* Search & Filter Bar */}
                <form
                    onSubmit={handleSearch}
                    style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                    <TextField
                        label="Search"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        size="small"
                        variant="outlined"
                    />
                    <TextField
                        label="Search by Date"
                        type="date"
                        value={searchDate}
                        onChange={e => setSearchDate(e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        variant="outlined"
                    />
                    <IconButton type="submit" color="primary">
                        <SearchIcon />
                    </IconButton>
                    <IconButton onClick={handleRefresh} color="primary">
                        <RefreshIcon />
                    </IconButton>
                    <IconButton onClick={() => setShowFilter(f => !f)} color={showFilter ? "secondary" : "primary"}>
                        <FilterListIcon />
                    </IconButton>
                    {showFilter && (
                        <FormControl size="small" style={{ minWidth: 120 }}>
                            <InputLabel id="filter-type-label">Type</InputLabel>
                            <Select
                                labelId="filter-type-label"
                                value={filterType}
                                label="Type"
                                onChange={e => setFilterType(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="online">Online</MenuItem>
                                <MenuItem value="offline">Offline</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </form>
                {!showForm ? (
                    <Button
                        variant="contained"
                        onClick={() => setShowForm(true)}
                        id="button-30"
                    >
                        Create Seminar
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setShowForm(false)}
                        id="button-30"
                        startIcon={<CloseIcon />}
                    >
                        Cancel
                    </Button>
                )}
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
                                    value={formData.seminar_type}
                                    label="Seminar Type"
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

                        {isUploading && (
                            <div style={{ margin: '16px 16px' }}>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                                <div style={{ textAlign: 'center' }}>{uploadProgress}%</div>
                            </div>
                        )}

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
                    {filteredOwnSeminars.length > 0 ? filteredOwnSeminars.map((seminar) => (
                        <Link key={seminar.id} to={`/seminar-view/${seminar.id}`} className={seminarStyles.cardLink}>
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
                    {filteredSeminars.length > 0 ? filteredSeminars.map((seminar) => (
                        <Link key={seminar.id} to={`/seminar-view/${seminar.id}`} className={seminarStyles.cardLink}>
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
