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
} from '@mui/material';
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
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [blogLoading, setBlogLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showLeft, setShowLeft] = useState(false);
    const [openApplications, setOpenApplications] = useState([]);
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

    useEffect(() => {
    const fetchOpenApplications = async () => {
        try {
            const res = await fetch(`${apiUrl}/volunteer/open-applications/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!res.ok) throw new Error("Failed to fetch open applications.");
            const data = await res.json();
            setOpenApplications(data);
        } catch (err) {
            console.error(err);
        }
    };
    fetchOpenApplications();
}, []);

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
            <Navbar />
            <Hero />
            <div className={styles.container}>
                <div className={styles.options}>
                    <Link to="/blogs" id="button-30" className={styles.button_30}>CreatePost</Link>
                </div>
                <div className={styles.highlights}>
                    <h1 id="heading" className={styles.heading}>Recent Blogs</h1>
                    {blogLoading ? (
                        <p>Loading...</p>
                    ) : recentBlogs.length > 0 ? (
                        <div
                            style={{
                                display: 'flex',
                                overflowX: 'auto',
                                gap: 24,
                                padding: '8px 40px',
                                scrollBehavior: 'smooth',
                            }}
                        >
                            {recentBlogs.map((blog) => (
                                <Card
                                    key={blog.id}
                                    sx={{
                                        width: 300,
                                        minWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: 3,
                                        flex: '0 0 auto',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleCardClick(blog)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={blog.image ? `${apiUrl}${blog.image}` : '/assets/default_blog.jpg'}
                                        alt={blog.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {blog.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {blog.content.substring(0, 100)}...
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Stack sx={{ width: "100%", margin: "10px auto" }} spacing={2}>
                            <Alert severity="warning">No blogs available.</Alert>
                        </Stack>
                    )}
                </div>

                {/* Blog Detail Modal */}
                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>{selectedBlog?.title || "Blog Details"}</DialogTitle>
                    <DialogContent>
                        {selectedBlog && (
                            <>
                                <img
                                    src={selectedBlog.image ? `${apiUrl}${selectedBlog.image}` : '/assets/default_blog.jpg'}
                                    alt={selectedBlog.title}
                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
                                />
                                <Typography variant="body1" gutterBottom>
                                    {selectedBlog.content}
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


                    <h1 id="heading" className={styles.heading}>Volunteers Recruitment</h1>
                    <h1>Open Volunteer Applications</h1>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {openApplications.map((seminar) => (
                            <Card key={seminar.id} sx={{ width: 300 }}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image="/assets/default_seminar.jpg"
                                    alt={seminar.title}
                                />
                                <CardContent>
                                    <Typography variant="h6">{seminar.title}</Typography>
                                    <Typography variant="body2">{seminar.description}</Typography>
                                    <Typography variant="body2">Date: {seminar.date}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </div >
    );
};

export default U_home;
