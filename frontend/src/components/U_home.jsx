import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Typography,
    IconButton,
    Stack,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Box,
    Chip,
} from '@mui/material';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import TopBar from '../components/TopBar';
import NavbarU from '../components/NavbarU';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import styles from '../css/U_home.module.css';


const apiUrl = import.meta.env.VITE_API_URL;

const U_home = () => {
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [upcomingSeminars, setUpcomingSeminars] = useState([]);
    const [seminarLoading, setSeminarLoading] = useState(true);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showLeft, setShowLeft] = useState(false);
    const [openApplications, setOpenApplications] = useState([]);
    const [applicationLoading, setApplicationLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: '', severity: 'success', open: false });
    const [appliedSeminars, setAppliedSeminars] = useState([]);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // seminars
    useEffect(() => {
        const fetchSeminar = async () => {
            try {
                const res = await fetch(`${apiUrl}/available-seminars/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch the seminars.");
                const data = await res.json();
                setUpcomingSeminars(data);
            } catch (error) {
                setUpcomingSeminars([]);
            } finally {
                setSeminarLoading(false);
            }
        };
        fetchSeminar();
        setShowAlert();
    }, []);

    // blogs
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
                setRecentBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
                setRecentBlogs([]);
            } finally {
                setBlogLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const el = scrollRef.current;
            if (!el) return;
            setShowLeft(el.scrollLeft > 0);
            setShowRight(el.scrollLeft + el.clientwidth < el.scrollWidth - 1);
        };
        handleScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll);
        };
    }, [upcomingSeminars, scrollRef]);

    // volunteer application
    useEffect(() => {
        const fetchOpenApplications = async () => {
            try {
                setApplicationLoading(true);
                const res = await fetch(`${apiUrl}/volunteer/open-applications/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch open applications.");
                const data = await res.json();
                setOpenApplications(data);

                // Fetch user's applied seminars
                const appliedRes = await fetch(`${apiUrl}/volunteer/my-applications/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (appliedRes.ok) {
                    const appliedData = await appliedRes.json();
                    // Create an array of seminar IDs the user has applied to
                    setAppliedSeminars(appliedData.map(app => app.seminar.id));
                }
            } catch (err) {
                console.error("Error fetching volunteer applications:", err);
                setOpenApplications([]);
            } finally {
                setApplicationLoading(false);
            }
        };
        fetchOpenApplications();
    }, []);

    const handleApplyVolunteer = async (seminarId) => {
        try {
            const res = await fetch(`${apiUrl}/volunteer/apply/${seminarId}/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                // Add this seminar to applied list to update UI
                setAppliedSeminars(prev => [...prev, seminarId]);
                setFeedback({
                    message: 'Application submitted successfully!',
                    severity: 'success',
                    open: true
                });
            } else {
                const data = await res.json();
                setFeedback({
                    message: data.error || 'Failed to submit application.',
                    severity: 'error',
                    open: true
                });
            }
        } catch (error) {
            console.error('Error applying for volunteer:', error);
            setFeedback({
                message: 'An error occurred while submitting your application.',
                severity: 'error',
                open: true
            });
        }
    };

    const handleCloseFeedback = () => {
        setFeedback(prev => ({ ...prev, open: false }));
    };

    const handleScroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 320;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    const handleCardClick = (blog) => {
        setSelectedBlog(blog);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBlog(null);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <NavbarU />
            <Hero />
            <div className={styles.container}>
                <div className={styles.highlights}>
                    <h1 id="heading" className={styles.heading}>Recent Funds</h1>
                    {/* <?php include('./fund_fetch_BE.php') ?> */}

                    {/* upcoming seminars */}
                    <h1 id="heading" className={styles.heading}>Upcoming Seminars</h1>
                    {showLeft && (
                        <IconButton
                            onClick={() => handleScroll('left')}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    {seminarLoading ? (
                        <p>Loading...</p>
                    ) : upcomingSeminars.length > 0 ? (
                        <div
                            ref={scrollRef}
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 24,
                                padding: '8px 40px',
                                scrollBehavior: 'smooth',
                            }}
                        >
                            {upcomingSeminars.map((seminar) => (
                                <Card
                                    key={seminar.id || seminar.seminar_id}
                                    sx={{
                                        width: 300,
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        cursor: 'default',
                                        flex: '0 0 auto',
                                    }}
                                >
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={
                                                seminar.banner
                                                    ? `${apiUrl}${seminar.banner}`
                                                    : '/assets/default_banner.jpg'
                                            }
                                            alt={seminar.title}
                                            sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {seminar.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {seminar.seminar_date}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {seminar.subject}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {showAlert && (
                                <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                                    <Alert severity="warning">Currently no seminar available.</Alert>
                                </Stack>
                            )}
                        </>
                    )}
                    {showRight && (
                        <IconButton
                            onClick={() => handleScroll('right')}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 2,
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    )}

                    {/* volunteer recruitment section */}
                    <Box sx={{ mt: 6, mb: 4 }}>
                        <h1 id="heading" className={styles.heading}>Volunteer Opportunities</h1>

                        {applicationLoading ? (
                            <p>Loading volunteer opportunities...</p>
                        ) : openApplications.length > 0 ? (
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {openApplications.map((seminar) => (
                                    <Card
                                        key={seminar.id}
                                        sx={{
                                            width: 320,
                                            borderRadius: 3,
                                            boxShadow: 3,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            marginTop: 5
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={seminar.banner ? `${apiUrl}${seminar.banner}` : '/assets/default_seminar.jpg'}
                                            alt={seminar.title}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="h6" gutterBottom>{seminar.title}</Typography>

                                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                                <Chip
                                                    label={seminar.seminar_type === 'online' ? 'Online' : 'In-person'}
                                                    color={seminar.seminar_type === 'online' ? 'info' : 'success'}
                                                    size="small"
                                                />
                                                <Chip
                                                    icon={<VolunteerActivismIcon />}
                                                    label="Volunteers Needed"
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            </Box>

                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Date:</strong> {seminar.seminar_date}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>By:</strong> {seminar.organization?.name || 'Organization'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {seminar.description?.substring(0, 100)}...
                                            </Typography>

                                            {appliedSeminars.includes(seminar.id) ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled
                                                    fullWidth
                                                >
                                                    Applied
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={() => handleApplyVolunteer(seminar.id)}
                                                    sx={{
                                                        '&:hover': {
                                                            backgroundColor: '#136ad4',
                                                        }
                                                    }}

                                                >
                                                    Apply as Volunteer
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Stack sx={{ width: "100%", margin: "20px auto" }} spacing={2}>
                                <Alert severity="info">
                                    There are currently no open volunteer positions. Check back later!
                                </Alert>
                            </Stack>
                        )}
                    </Box>

                </div>
            </div>

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
        </div >
    );
};

export default U_home;
