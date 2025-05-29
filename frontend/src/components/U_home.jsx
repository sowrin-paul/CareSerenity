import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardActionArea, CardMedia, Typography, IconButton, Stack, Alert } from '@mui/material';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import TopBar from '../components/TopBar';
import Navbar from '../components/NavbarU';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import styles from '../css/U_home.module.css';


const apiUrl = import.meta.env.VITE_API_URL;

const U_home = () => {
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [upcomingSeminars, setUpcomingSeminars] = useState([]);
    const [seminarLoading, setSeminarLoading] = useState(true);
    const [showAlert, setShowAlert] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showLeft, setShowLeft] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

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

    const handleScroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 320;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }

    const handleSeminarClick = (seminarId) => {
        navigate(`/seminar-view/${seminarId}`);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Navbar />
            <Hero />
            <div className={styles.container}>
                <div className={styles.options}>
                    <a href="./U_create_blog.php" id="button-30" className={styles.button_30}>CreatePost</a>
                </div>
                <div className={styles.highlights}>
                    <h1 id="heading" className={styles.heading}>Recent Funds</h1>
                    {/* <?php include('./fund_fetch_BE.php') ?> */}

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
                                scrollBehavior: 'smooth'
                            }}
                        >
                            {upcomingSeminars.map(seminar => (
                                <Card
                                    key={seminar.id || seminar.seminar_id}
                                    sx={{
                                        width: 300,
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        cursor: 'pointer',
                                        flex: '0 0 auto'
                                    }}
                                    onClick={() => handleSeminarClick(seminar.id || seminar.seminar_id)}
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
                                            <Typography gutterBottom variant='h6' component="div">
                                                {seminar.title}
                                            </Typography>
                                            <Typography variant='body2' color='text.secondary'>
                                                {seminar.seminar_date}
                                            </Typography>
                                            <Typography variant='body2' color='text.secondary'>
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


                    <h1 id="heading" className={styles.heading}>Volunteers Recruitment</h1>
                    {/* <?php include('./U_volunteer_recruit_fetch_BE.php') ?> */}

                    <h1 id="heading" className={styles.heading}>Recent Blogs</h1>
                    {/* <?php include('./blog_show_BE.php') ?> */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default U_home;
