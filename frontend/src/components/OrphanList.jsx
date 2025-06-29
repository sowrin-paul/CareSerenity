import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    Chip,
    CircularProgress,
    Container,
    Stack,
    Divider,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import TopBar from './TopBar';
import NavbarU from './NavbarU';
import Footer from './Footer';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: theme.shadows[8],
    },
    borderRadius: 12,
    overflow: 'hidden',
}));

const OrphanList = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [orphans, setOrphans] = useState([]);
    const [filteredOrphans, setFilteredOrphans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [ageSort, setAgeSort] = useState('');
    const [selectedOrphan, setSelectedOrphan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [isAdoptionRequested, setIsAdoptionRequested] = useState({});
    const [feedback, setFeedback] = useState({ message: '', severity: 'success', open: false });
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Fetch orphans and adoption requests on component mount
    useEffect(() => {
        const fetchOrphans = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${apiUrl}/orphans/list/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch orphans');

                const data = await res.json();
                setOrphans(data);
                setFilteredOrphans(data);

                // Map adoption requests from orphan data
                const adoptionMap = {};
                data.forEach(orphan => {
                    if (orphan.has_pending_request) {
                        adoptionMap[orphan.id] = true;
                    }
                });
                setIsAdoptionRequested(adoptionMap);
            } catch (err) {
                console.error('Error fetching orphans:', err);
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchOrphans();
    }, [apiUrl]);

    // Filter orphans when search query or filters change
    useEffect(() => {
        let result = [...orphans];

        if (searchQuery) {
            result = result.filter(orphan =>
                orphan.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (genderFilter) {
            result = result.filter(orphan => orphan.gender === genderFilter);
        }

        if (ageSort) {
            result.sort((a, b) => {
                const aAge = calculateAge(a.birth_date);
                const bAge = calculateAge(b.birth_date);
                return ageSort === 'asc' ? aAge - bAge : bAge - aAge;
            });
        }

        setFilteredOrphans(result);
    }, [orphans, searchQuery, genderFilter, ageSort]);

    const calculateAge = (birthDate) => {
        const dob = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }

        return age;
    };

    // Handle orphan card click
    const handleOrphanClick = (orphan) => {
        setSelectedOrphan(orphan);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Handle adopt request
    const handleAdoptRequest = async () => {
        if (!selectedOrphan) return;

        try {
            const res = await fetch(`${apiUrl}/adoption/request/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ orphan_id: selectedOrphan.id }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to submit adoption request');
            }

            // Update local state to reflect the new adoption request
            setIsAdoptionRequested(prev => ({
                ...prev,
                [selectedOrphan.id]: true,
            }));

            setFeedback({
                message: 'Adoption request submitted successfully! The organization will review your request.',
                severity: 'success',
                open: true,
            });

            handleCloseModal();
        } catch (err) {
            console.error('Error requesting adoption:', err);
            setFeedback({
                message: err.message || 'Failed to submit adoption request',
                severity: 'error',
                open: true,
            });
        }
    };

    // Handle cancel adoption request
    const handleCancelAdoption = async () => {
        if (!selectedOrphan) return;

        try {
            const res = await fetch(`${apiUrl}/adoption/cancel/${selectedOrphan.id}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to cancel adoption request');
            }

            // Update local state to reflect the canceled adoption request
            setIsAdoptionRequested(prev => {
                const updated = { ...prev };
                delete updated[selectedOrphan.id];
                return updated;
            });

            setFeedback({
                message: 'Adoption request cancelled successfully',
                severity: 'success',
                open: true,
            });

            handleCloseModal();
        } catch (err) {
            console.error('Error cancelling adoption:', err);
            setFeedback({
                message: err.message || 'Failed to cancel adoption request',
                severity: 'error',
                open: true,
            });
        }
    };

    // Handle donate button click
    const handleDonateClick = (e, orphan) => {
        e.stopPropagation();
        setSelectedOrphan(orphan);
        setIsDonateModalOpen(true);
    };

    // Handle donation submit
    const handleDonationSubmit = async () => {
        if (!selectedOrphan || !donationAmount || isNaN(donationAmount)) {
            setFeedback({
                message: 'Please enter a valid donation amount',
                severity: 'error',
                open: true,
            });
            return;
        }

        try {
            // Log what we're sending for debugging
            console.log('Submitting donation:', {
                orphan_id: selectedOrphan.id,
                amount: parseFloat(donationAmount)
            });

            const res = await fetch(`${apiUrl}/donations/orphan/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    orphan_id: selectedOrphan.id,
                    amount: parseFloat(donationAmount),
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!res.ok) {
                let errorMessage = 'Failed to process donation';

                // Try to get error message from response
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();

            setFeedback({
                message: 'Donation processed. Redirecting to payment page...',
                severity: 'success',
                open: true,
            });

            setIsDonateModalOpen(false);
            setDonationAmount('');

            // Redirect to the payment URL provided by the backend
            if (data.payment_url) {
                console.log(`Redirecting to: ${apiUrl}${data.payment_url}`);
                // Add a slight delay to allow the user to see the success message
                setTimeout(() => {
                    window.location.href = `${apiUrl}${data.payment_url}`;
                }, 1500);
            }
        } catch (err) {
            console.error('Error processing donation:', err);
            setFeedback({
                message: err.message || 'Failed to process donation',
                severity: 'error',
                open: true,
            });
        }
    };

    const handleCloseDonateModal = () => {
        setIsDonateModalOpen(false);
        setDonationAmount('');
    };

    // Handle feedback close
    const handleCloseFeedback = () => {
        setFeedback(prev => ({ ...prev, open: false }));
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/home');
    };

    return (
        <>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <NavbarU />

            <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        textAlign: 'center',
                        color: 'var(--primary-title-color)',
                        mb: 4
                    }}
                >
                    Orphans Available for Adoption
                </Typography>

                {/* Search and filter section */}
                <Box sx={{ mb: 4 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <TextField
                            placeholder="Search orphans..."
                            variant="outlined"
                            fullWidth
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ maxWidth: { sm: '50%' } }}
                        />

                        <Stack direction="row" spacing={2}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="gender-filter-label">Gender</InputLabel>
                                <Select
                                    labelId="gender-filter-label"
                                    label="Gender"
                                    value={genderFilter}
                                    onChange={e => setGenderFilter(e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="age-sort-label">Age</InputLabel>
                                <Select
                                    labelId="age-sort-label"
                                    label="Age"
                                    value={ageSort}
                                    onChange={e => setAgeSort(e.target.value)}
                                >
                                    <MenuItem value="">Default</MenuItem>
                                    <MenuItem value="asc">Youngest first</MenuItem>
                                    <MenuItem value="desc">Oldest first</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
                </Box>

                {/* Results count */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {filteredOrphans.length} orphans found
                </Typography>

                {/* Orphans grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
                ) : filteredOrphans.length > 0 ? (
                    <Grid container spacing={3}>
                        {filteredOrphans.map(orphan => (
                            <Grid item xs={12} sm={6} md={4} key={orphan.id}>
                                <StyledCard>
                                    <Box
                                        onClick={() => handleOrphanClick(orphan)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={orphan.profile_picture ? `${apiUrl}${orphan.profile_picture}` : '/assets/default_profile.jpg'}
                                            alt={orphan.name}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {orphan.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                                <Chip
                                                    label={`${calculateAge(orphan.birth_date)} years`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={orphan.gender}
                                                    size="small"
                                                    color="secondary"
                                                    variant="outlined"
                                                />
                                                {isAdoptionRequested[orphan.id] && (
                                                    <Chip
                                                        label="Request Pending"
                                                        size="small"
                                                        color="warning"
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {orphan.education && `Education: ${orphan.education.substring(0, 50)}${orphan.education.length > 50 ? '...' : ''}`}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Organization: {orphan.organizations_name || 'Care Serenity'}
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }} />
                                    <CardActions sx={{ p: 2, pt: 0 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            onClick={() => handleOrphanClick(orphan)}
                                            sx={{
                                                mr: 1, '&:hover': {
                                                    backgroundColor: '#136ad4',
                                                }
                                            }}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={(e) => handleDonateClick(e, orphan)}
                                            startIcon={<FavoriteIcon />}
                                            sx={{ width: "100%" }}
                                        >
                                            Donate
                                        </Button>
                                    </CardActions>
                                </StyledCard>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', p: 5 }}>
                        <Typography variant="h6">No orphans found matching your criteria</Typography>
                    </Box>
                )}
            </Container>

            {/* Orphan Details Modal */}
            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
            >
                {selectedOrphan && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5">{selectedOrphan.name}</Typography>
                        </DialogTitle>
                        <DialogContent dividers>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={5}>
                                    <img
                                        src={selectedOrphan.profile_picture ? `${apiUrl}${selectedOrphan.profile_picture}` : '/assets/default_profile.jpg'}
                                        alt={selectedOrphan.name}
                                        style={{ width: '100%', borderRadius: '8px', maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={7}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary">Age</Typography>
                                            <Typography variant="body1">{calculateAge(selectedOrphan.birth_date)} years old</Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary">Gender</Typography>
                                            <Typography variant="body1">{selectedOrphan.gender}</Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary">Education</Typography>
                                            <Typography variant="body1">{selectedOrphan.education || 'N/A'}</Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary">Medical History</Typography>
                                            <Typography variant="body1">{selectedOrphan.medical_history || 'N/A'}</Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle1" color="text.secondary">Organization</Typography>
                                            <Typography variant="body1">{selectedOrphan.organizations_name || 'Care Serenity'}</Typography>
                                        </Box>
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>About {selectedOrphan.name}</Typography>
                                    <Typography variant="body1" paragraph>
                                        {selectedOrphan.description || `${selectedOrphan.name} is looking for a loving home. By adopting ${selectedOrphan.name}, you'll be giving them the chance at a better future and a family they deserve.`}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6" gutterBottom>Adoption Process</Typography>
                                    <Typography variant="body1" paragraph>
                                        The adoption process involves submitting a request, which will be reviewed by the organization. If approved, you'll be contacted for further steps.
                                    </Typography>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions sx={{ p: 3 }}>
                            <Button onClick={handleCloseModal} color="inherit">
                                Close
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={(e) => {
                                    handleCloseModal();
                                    handleDonateClick(e, selectedOrphan);
                                }}
                                startIcon={<FavoriteIcon />}
                            >
                                Donate
                            </Button>

                            {isAdoptionRequested[selectedOrphan.id] ? (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancelAdoption}
                                >
                                    Cancel Adoption Request
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAdoptRequest}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#136ad4',
                                        }
                                    }}
                                >
                                    Request Adoption
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Donation Modal */}
            <Dialog
                open={isDonateModalOpen}
                onClose={handleCloseDonateModal}
                maxWidth="sm"
                fullWidth
            >
                {selectedOrphan && (
                    <>
                        <DialogTitle>
                            <Typography variant="h5">Donate to help {selectedOrphan.name}</Typography>
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="body1" paragraph>
                                    Your donation will go directly to support {selectedOrphan.name}'s education, healthcare, and other essential needs.
                                </Typography>

                                <TextField
                                    label="Donation Amount ($)"
                                    type="number"
                                    fullWidth
                                    variant="outlined"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    sx={{ mt: 2 }}
                                    autoFocus
                                />

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    All donations are tax-deductible and will be processed securely.
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDonateModal} color="inherit">
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDonationSubmit}
                                disabled={!donationAmount || isNaN(donationAmount)}
                            >
                                Donate
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

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
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {feedback.message}
                </Alert>
            </Snackbar>

            <Footer />
        </>
    );
};

export default OrphanList;