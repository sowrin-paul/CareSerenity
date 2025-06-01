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
} from '@mui/material';
import TopBar from './TopBar';
import Navbar from './NavbarO';
import Footer from './Footer';

const OrganizationList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

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

  const handleDonate = (org) => {
    console.log(`Donate to ${org.name}`);
    // donation
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/home');
  };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />
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
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={org.profilePicture ? `${apiUrl}${org.profilePicture}` : '/assets/default_org.png'}
                alt={org.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {org.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {org.rating}
                </Typography>
              </CardContent>
              <Stack direction="row" spacing={2} sx={{ p: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleView(org)}
                  fullWidth
                >
                  View
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDonate(org)}
                  fullWidth
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
                src={selectedOrganization.profilePicture || '/assets/default_org.png'}
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
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default OrganizationList;
