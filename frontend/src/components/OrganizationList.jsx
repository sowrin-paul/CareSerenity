import React, { useState } from 'react';
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
} from '@mui/material';
import TopBar from './TopBar';
import Navbar from './NavbarU';
import Footer from './Footer';

const organizations = [
  {
    name: 'Safe Haven Orphanage',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'info@safehaven.org',
    profilePicture: '/assets/org1.jpg',
    rating: 4.5,
  },
  {
    name: 'Little Spirituals Foundation',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'ls.foundation@gmail.com',
    profilePicture: '/assets/org2.jpg',
    rating: 4.2,
  },
  {
    name: 'Dhaka Foundation',
    description: 'The best Charity for orphans',
    phone: '+880123234445',
    email: 'info@safehaven.org',
    profilePicture: '/assets/org3.jpg',
    rating: 4.8,
  },
  {
    name: 'Mirpur Care Centre',
    description: 'We care about your life',
    phone: '3242433222',
    email: 'dhakafoundation@gmail.com',
    profilePicture: '/assets/org4.jpg',
    rating: 4.0,
  },
  {
    name: 'Safe Haven Orphanage',
    description: 'To save children life',
    phone: '+880123234445',
    email: 'info@safehaven.org',
    profilePicture: '/assets/org1.jpg',
    rating: 4.5,
  },
];

const OrganizationList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filteredOrganizations, setFilteredOrganizations] = useState(organizations);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = organizations.filter((org) =>
      org.name.toLowerCase().includes(value)
    );
    setFilteredOrganizations(filtered);
  };

  const handleView = (org) => {
    navigate('/orgProfile', { state: { organization: org } });
  };

  const handleDonate = (org) => {
    console.log(`Donate to ${org.name}`);
    // Implement donation functionality later
  };

  const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />
      <Box sx={{ padding: '20px' }}>
        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/')}>
            Back
          </Button>
          <TextField
            label="Search Organizations"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
            sx={{ width: '300px' }}
          />
        </Stack>

        {/* Organization Cards */}
        <Stack spacing={3} alignItems="center">
          {filteredOrganizations.map((org, index) => (
            <Card
              key={index}
              sx={{
                width: '90%', // Card width
                maxWidth: '600px', // Maximum width
                margin: '0 auto', // Center the card
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={org.profilePicture || '/assets/default_org.png'}
                alt={org.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {org.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rating: {org.rating} ⭐
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
      <Footer />
    </>
  );
};

export default OrganizationList;
