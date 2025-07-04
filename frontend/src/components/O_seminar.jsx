import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Alert, Stack, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Snackbar, Button, Card, CardContent, CardActionArea, CardMedia, Typography, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import CancelIcon from "@mui/icons-material/Cancel";
import Collapse from '@mui/material/Collapse';
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSeminar, setSelectedSeminar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        title: '',
        subject: '',
        description: '',
        seminar_date: '',
        guest: '',
        seminar_type: '',
        location: '',
        banner: null,
    });
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // edit seminar
    const handleEditClick = () => {
        if (!selectedSeminar) return;

        setEditFormData({
            title: selectedSeminar.title || '',
            subject: selectedSeminar.subject || '',
            description: selectedSeminar.description || '',
            seminar_date: selectedSeminar.seminar_date || '',
            guest: selectedSeminar.guest || '',
            seminar_type: selectedSeminar.seminar_type || '',
            location: selectedSeminar.location || '',
            banner: null,
        });

        setIsModalOpen(false);
        setIsEditModalOpen(true);
    };

    // edit seminar
    const handleEditFormChange = (e) => {
        const { name, value, files } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // update submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSeminar) return;

        const formPayload = new FormData();

        for (let key in editFormData) {
            if (editFormData[key] !== null && editFormData[key] !== undefined) {
                formPayload.append(key, editFormData[key]);
            }
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const res = await fetch(`${apiUrl}/seminars/${selectedSeminar.id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formPayload,
            });

            setIsUploading(false);

            if (res.ok) {
                setFeedback({ positive: 'Seminar updated successfully!', negative: '' });
                fetchOwnSeminars();
                fetchAvailableSeminars();
                setIsEditModalOpen(false);
            } else {
                const data = await res.json();
                setFeedback({ positive: '', negative: data.message || 'Failed to update seminar.' });
            }
        } catch (error) {
            setIsUploading(false);
            setFeedback({ positive: '', negative: 'An error occurred while updating.' });
        }
    };

    // delete seminar card
    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    // delete confirmation
    const handleDeleteConfirm = async () => {
        if (!selectedSeminar) return;

        try {
            const res = await fetch(`${apiUrl}/seminar-delete/${selectedSeminar.id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                setFeedback({ positive: 'Seminar deleted successfully!', negative: '' });
                fetchOwnSeminars();
                fetchAvailableSeminars();
                setIsDeleteConfirmOpen(false);
                setIsModalOpen(false);
            } else {
                const data = await res.json();
                setFeedback({ positive: '', negative: data.message || 'Failed to delete seminar.' });
            }
        } catch (error) {
            setFeedback({ positive: '', negative: 'An error occurred while deleting.' });
        }
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    useEffect(() => {
        fetchOwnSeminars();
        fetchAvailableSeminars();
    }, []);

    const fetchOwnSeminars = async () => {
        try {
            const res = await fetch(`${apiUrl}/own-seminars/`, {
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
                setOwnSeminars(data); // Set the seminars created by the logged-in organization
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

    const handleCardClick = (id) => {
        const ownSeminar = ownSeminars.find(s => s.id === id);
        const availableSeminar = seminars.find(s => s.id === id);

        const seminar = ownSeminar || availableSeminar;
        setSelectedSeminar(seminar);
        setLoading(true);
        setIsModalOpen(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSeminar(null);
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
                        sx={{
                            '&:hover': {
                                backgroundColor: '#136dd4',
                                color: '#fff',
                            }
                        }}
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
                                sx={{
                                    justifyContent: 'center'
                                }}
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
                                sx={{
                                    backgroundColor: '#FF597B',
                                    color: '#000'
                                }}
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
                        <div
                            key={seminar.id}
                            className={seminarStyles.cardLink}
                            onClick={() => handleCardClick(seminar.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={seminarStyles.card}>
                                <img src={`${apiUrl}${seminar.banner}`} alt="Seminar Banner" className={seminarStyles.cardImage} />
                                <h3 className={seminarStyles.cardTitle}>{seminar.title}</h3>
                                <div className={seminarStyles.cardInfo}>
                                    <span className={seminarStyles.cardDate}>{seminar.seminar_date}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                            <Alert severity="warning">Currently no seminar available.</Alert>
                        </Stack>
                    )}
                </div>
            </div>

            <h1 className={seminarStyles.title}>Available Seminars :</h1>

            {/* Available Seminars */}
            <div className={seminarStyles.seminarBlock}>
                {Array.isArray(filteredSeminars) && filteredSeminars.length > 0 ? (
                    <div className={seminarStyles.cards}>
                        {filteredSeminars.map((seminar) => (
                            <Card
                                key={seminar.id}
                                className={seminarStyles.seminarCard}
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
                                    textDecoration: "none",
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
                                        {seminar.organization && (
                                            <Typography variant="body2" color="text.secondary">
                                                <b>By:</b> {seminar.organization.name}
                                            </Typography>
                                        )}
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
                                <b>Subject:</b> {selectedSeminar?.subject}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Type:</b> {selectedSeminar?.seminar_type}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Location:</b> {selectedSeminar?.location || 'Online'}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Description:</b> {selectedSeminar?.description}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                <b>Special Guest:</b> {selectedSeminar?.guest}
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {/* Show edit and delete buttons */}
                    {ownSeminars.some(s => s.id === selectedSeminar?.id) && (
                        <>
                            <Button
                                onClick={handleEditClick}
                                color="primary"
                                startIcon={<EditIcon />}
                            >
                                Modify
                            </Button>
                            <Button
                                onClick={handleDeleteClick}
                                color="error"
                                startIcon={<DeleteIcon />}
                            >
                                Delete
                            </Button>
                        </>
                    )}
                    <Button onClick={handleModalClose} color="primary" startIcon={<ArrowBackIcon />}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Seminar Modal */}
            <Dialog open={isEditModalOpen} onClose={handleEditModalClose} maxWidth="md" fullWidth>
                <DialogTitle>Edit Seminar</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleUpdateSubmit} encType="multipart/form-data">
                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Title"
                                name="title"
                                value={editFormData.title}
                                onChange={handleEditFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Subject"
                                name="subject"
                                value={editFormData.subject}
                                onChange={handleEditFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Seminar Description"
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditFormChange}
                                required
                                fullWidth
                                margin="dense"
                                multiline
                                rows={4}
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <TextField
                                label="Date"
                                name="seminar_date"
                                type="date"
                                value={editFormData.seminar_date}
                                onChange={handleEditFormChange}
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
                                value={editFormData.guest}
                                onChange={handleEditFormChange}
                                required
                                fullWidth
                                margin="dense"
                            />
                        </div>

                        <div className={profileEditStyles.formRow}>
                            <FormControl fullWidth margin="dense" required>
                                <InputLabel id="edit-type-label">Type</InputLabel>
                                <Select
                                    labelId="edit-type-label"
                                    name="seminar_type"
                                    value={editFormData.seminar_type}
                                    label="Seminar Type"
                                    onChange={handleEditFormChange}
                                >
                                    <MenuItem value="">
                                        <em>Select online or offline</em>
                                    </MenuItem>
                                    <MenuItem value="online">Online</MenuItem>
                                    <MenuItem value="offline">Offline</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {editFormData.seminar_type === 'offline' && (
                            <div className={profileEditStyles.formRow}>
                                <TextField
                                    label="Location"
                                    name="location"
                                    value={editFormData.location}
                                    onChange={handleEditFormChange}
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
                                Update Seminar Banner
                                <input
                                    type="file"
                                    name="banner"
                                    hidden
                                    onChange={handleEditFormChange}
                                />
                            </Button>
                            {editFormData.banner && (
                                <span style={{ marginLeft: 8 }}>{editFormData.banner.name || 'New file selected'}</span>
                            )}
                        </div>

                        {isUploading && (
                            <div style={{ margin: '16px 16px' }}>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                                <div style={{ textAlign: 'center' }}>{uploadProgress}%</div>
                            </div>
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditModalClose} color="error">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateSubmit} color="primary" variant="contained">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <Typography id="alert-dialog-description">
                        Are you sure you want to delete the seminar "{selectedSeminar?.title}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteConfirmOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Footer />
        </div>
    );
}

export default OSeminarsPage;
