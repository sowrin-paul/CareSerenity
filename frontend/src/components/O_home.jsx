import React, { useEffect, useRef, useState } from 'react';
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
} from '@mui/material';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TopBar from './TopBar';
import NavbarO from './NavbarO';
import Footer from './Footer';
import styles from '../css/U_home.module.css';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';

const apiUrl = import.meta.env.VITE_API_URL;

const O_home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [seminars, setSeminars] = useState([]);
    const [seminarLoading, setSeminarLoading] = useState(true);
    const [orphans, setOrphans] = useState([]);
    const [orphanLoading, setOrphanLoading] = useState(true);
    const [selectedOrphan, setSelectedOrphan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showLeft, setShowLeft] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    // Fetch seminars
    useEffect(() => {
        const fetchSeminars = async () => {
            try {
                const res = await fetch(`${apiUrl}/available-seminars/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch seminars.");
                const data = await res.json();
                setSeminars(data);
            } catch (error) {
                setSeminars([]);
            } finally {
                setSeminarLoading(false);
            }
        };
        fetchSeminars();
    }, []);

    // Fetch orphans
    useEffect(() => {
        const fetchOrphans = async () => {
            try {
                const res = await fetch(`${apiUrl}/organization/orphans/list/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch orphans.");
                const data = await res.json();
                setOrphans(data);
            } catch (error) {
                setOrphans([]);
            } finally {
                setOrphanLoading(false);
            }
        };
        fetchOrphans();
    }, []);

    // scroll on seminar extend
    useEffect(() => {
        const handleScroll = () => {
            const el = scrollRef.current;
            if (!el) return;
            setShowLeft(el.scrollLeft > 0);
            setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
        };
        handleScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll);
        };
    }, [seminars, scrollRef]);

    const handleScroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 320;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    };

    const handleOrphanClick = (orphan) => {
        setSelectedOrphan(orphan);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrphan(null);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <NavbarO />
            <Hero />
            <div className={styles.container}>
                {/* Seminars Section */}
                <div className={styles.highlights}>
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
                    ) : seminars.length > 0 ? (
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
                            {seminars.map((seminar) => (
                                <Card
                                    key={seminar.id || seminar.seminar_id}
                                    sx={{
                                        width: 300,
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        flex: '0 0 auto',
                                        cursor: 'default',
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
                        <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                            <Alert severity="warning">No seminars available.</Alert>
                        </Stack>
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
                </div>

                {/* Orphans Section */}
                <div className={styles.highlights}>
                    <h1 id="heading" className={styles.heading}>Orphans</h1>
                    {orphanLoading ? (
                        <p>Loading...</p>
                    ) : orphans.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: '8px 40px' }}>
                            {orphans.map((orphan) => (
                                <Card
                                    key={orphan.id}
                                    sx={{
                                        width: 300,
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        flex: '0 0 auto',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleOrphanClick(orphan)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={orphan.photo ? `${apiUrl}${orphan.photo}` : '/assets/default_orphan.jpg'}
                                        alt={orphan.name}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {orphan.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Gender: {orphan.gender}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Birth Date: {orphan.birth_date}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Adopted: {orphan.is_adopted ? "Yes" : "No"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                            <Alert severity="warning">No orphans available.</Alert>
                        </Stack>
                    )}
                </div>

                {/* Orphan Detail Modal */}
                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>{selectedOrphan?.name || "Orphan Details"}</DialogTitle>
                    <DialogContent>
                        {selectedOrphan && (
                            <>
                                <img
                                    src={selectedOrphan.photo ? `${apiUrl}${selectedOrphan.photo}` : '/assets/default_orphan.jpg'}
                                    alt={selectedOrphan.name}
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                                />
                                <Typography variant="body1" gutterBottom>
                                    <b>Gender:</b> {selectedOrphan.gender}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <b>Birth Date:</b> {selectedOrphan.birth_date}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <b>Education:</b> {selectedOrphan.education || "N/A"}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <b>Medical History:</b> {selectedOrphan.medical_history || "N/A"}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    <b>Adopted:</b> {selectedOrphan.is_adopted ? "Yes" : "No"}
                                </Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Footer />
        </div>
    );
};

export default O_home;