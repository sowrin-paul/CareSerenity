import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import TopBar from './TopBar';
import NavbarO from './NavbarO';
import NavbarU from './NavbarU';
import Footer from './Footer';
import img from '../assets/org.png';
import FavoriteIcon from '@mui/icons-material/Favorite';

const OrganizationList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  // New state variables for donation
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [feedback, setFeedback] = useState({ message: '', severity: 'success', open: false });
  const [donationLoading, setDonationLoading] = useState(false);

  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await fetch(`${apiUrl}/organizations/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch organizations');
        const data = await res.json();
        setOrganizations(data);
        setFilteredOrganizations(data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = organizations.filter((org) =>
      org.name.toLowerCase().includes(value)
    );
    setFilteredOrganizations(filtered);
  };

  const handleView = (org) => {
    setSelectedOrganization(org);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrganization(null);
  };

  // Handle donate button click
  const handleDonate = (org) => {
    setSelectedOrganization(org);
    setIsDonateModalOpen(true);
  };

  // Handle donation modal close
  const handleCloseDonateModal = () => {
    setIsDonateModalOpen(false);
    setDonationAmount('');
  };

  // Handle donation submission
  const handleDonationSubmit = async () => {
    if (!selectedOrganization || !donationAmount || isNaN(donationAmount)) {
      setFeedback({
        message: 'Please enter a valid donation amount',
        severity: 'error',
        open: true,
      });
      return;
    }

    try {
      setDonationLoading(true);
      // Log what we're sending for debugging
      console.log('Submitting organization donation:', {
        organization_id: selectedOrganization.id,
        amount: parseFloat(donationAmount)
      });

      const res = await fetch(`${apiUrl}/donations/organization/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          organization_id: selectedOrganization.id,
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
    } finally {
      setDonationLoading(false);
    }
  };

  // Handle feedback close
  const handleCloseFeedback = () => {
    setFeedback(prev => ({ ...prev, open: false }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/home');
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {role === "1" ? <NavbarO /> : <NavbarU />}
      <Box sx={{ padding: '20px', marginTop: 10 }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <TextField
            label="Search Organizations"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
            sx={{ width: '400px' }}
          />
        </Stack>

        {/* Organization Cards */}
        <Stack spacing={3} alignItems="center">
          {filteredOrganizations.map((org, index) => (
            <Card
              key={index}
              sx={{
                width: '90%',
                maxWidth: '600px',
                margin: '0 auto',
                boxShadow: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 5,
                },
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={org.org_logo ? `${apiUrl}${org.org_logo}` : `${img}`}
                alt={org.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {org.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {org.rating || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {org.address || 'Location not available'}
                </Typography>
              </CardContent>
              <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleView(org)}
                  fullWidth
                  sx={{
                    '&:hover': {
                      backgroundColor: '#136ad4',
                    }
                  }}
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDonate(org)}
                  fullWidth
                  startIcon={<FavoriteIcon />}
                >
                  Donate
                </Button>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Organization Details Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedOrganization?.name || 'Organization Details'}</DialogTitle>
        <DialogContent>
          {selectedOrganization && (
            <>
              <img
                src={selectedOrganization.org_logo ? `${apiUrl}${selectedOrganization.org_logo}` : `${img}`}
                alt={selectedOrganization.name}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '16px' }}
              />
              <Typography variant="body1" gutterBottom>
                <b>Contact:</b> {selectedOrganization.contact || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Address:</b> {selectedOrganization.address || 'N/A'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Website:</b>{' '}
                {selectedOrganization.website ? (
                  <a href={selectedOrganization.website} target="_blank" rel="noopener noreferrer">
                    {selectedOrganization.website}
                  </a>
                ) : (
                  'N/A'
                )}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <b>Description:</b> {selectedOrganization.description || 'N/A'}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              handleCloseModal();
              handleDonate(selectedOrganization);
            }}
            startIcon={<FavoriteIcon />}
          >
            Donate
          </Button>
        </DialogActions>
      </Dialog>

      {/* Donation Modal */}
      <Dialog
        open={isDonateModalOpen}
        onClose={handleCloseDonateModal}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrganization && (
          <>
            <DialogTitle>
              <Typography variant="h5">Donate to {selectedOrganization.name}</Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ p: 1 }}>
                <Typography variant="body1" paragraph>
                  Your donation will support {selectedOrganization.name}'s mission to help orphans and provide better care and opportunities for children in need.
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
                disabled={!donationAmount || isNaN(donationAmount) || donationLoading}
              >
                {donationLoading ? <CircularProgress size={24} /> : 'Donate'}
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

export default OrganizationList;