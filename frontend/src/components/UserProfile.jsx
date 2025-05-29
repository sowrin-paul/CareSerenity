import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../css/UserProfile.module.css';
import TopBar from './TopBar';
import Navbar from './NavbarU';
import Footer from './Footer';
import {
  Card, CardContent, CardHeader, Avatar, Typography, Button, Stack, Divider, Box, Chip, Paper, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InfoIcon from '@mui/icons-material/Info';
import dayjs from 'dayjs';

const apiUrl = import.meta.env.VITE_API_URL;

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Prefer not to say", label: "Prefer not to say" }
];

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [registeredSeminars, setRegisteredSeminars] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/user/profile/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setAdoptionRequests(data.adoption_requests || []);
        setRegisteredSeminars(data.registered_seminars || []);
        setDonations(data.donations || []);
      } catch (e) {
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle edit dialog open
  const handleEditOpen = () => {
    setEditData({
      address: profile?.address || "",
      contact: profile?.contact || "",
      job: profile?.job || "",
      birth_date: profile?.birth_date || "",
      gender: profile?.gender || "",
      nid: profile?.nid || "",
      location: profile?.location || "",
      website: profile?.website || "",
      image: null,
    });
    setProfilePicPreview(profile?.image ? `${apiUrl}/media/${profile.image}` : null);
    setEditOpen(true);
  };

  //  edit dialog close
  const handleEditClose = () => {
    setEditOpen(false);
    setProfilePicPreview(null);
  };

  // form field change
  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setEditData((prev) => ({ ...prev, image: files[0] }));
      setProfilePicPreview(URL.createObjectURL(files[0]));
    } else {
      setEditData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // profile update submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) formData.append(key, value);
    });
    try {
      const res = await fetch(`${apiUrl}/user/profile/update/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();
      setProfile(data.profile);
      setEditOpen(false);
    } catch (error) {
      // Optionally show error
    }
  };

  if (loading) {
    return <Box sx={{ textAlign: 'center', mt: 8 }}>Loading...</Box>;
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/home');
  }

  return (
    <>
      <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Navbar />
      <Box className={styles.profileContainer} >
        <Card className={styles.profileCard} >
          <CardHeader
            avatar={
              <Avatar
                src={profile?.image ? `${apiUrl}/media/${profile.image}` : "/assets/default_org.png"}
                alt={user?.name}
                sx={{ width: 80, height: 80, fontSize: 36, bgcolor: '#1976d2', mr: 2 }}
              >
                {user?.name?.[0]}
              </Avatar>
            }
            title={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  {user?.name}
                </Typography>
                <IconButton size="small" onClick={handleEditOpen} aria-label="Edit Profile">
                  <EditIcon fontSize="small" />
                </IconButton>
              </Stack>
            }
            subheader={
              <Chip label={user?.accountType || "User"} color="primary" size="small" sx={{ mt: 1, textTransform: 'capitalize' }} />
            }
            sx={{ pb: 0, alignItems: 'center' }}
          />
          <CardContent>
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="body1"><b>Email:</b> {user?.email}</Typography>
              <Typography variant="body1"><b>Contact:</b> {profile?.contact}</Typography>
              <Typography variant="body1"><b>Address:</b> {profile?.address}</Typography>
              <Typography variant="body1"><b>Job:</b> {profile?.job}</Typography>
              <Typography variant="body1"><b>Birth Date:</b> {profile?.birth_date ? dayjs(profile.birth_date).format('YYYY-MM-DD') : ""}</Typography>
              <Typography variant="body1"><b>Gender:</b> {profile?.gender}</Typography>
              <Typography variant="body1"><b>NID:</b> {profile?.nid}</Typography>
              <Typography variant="body1"><b>Location:</b> {profile?.location}</Typography>
              <Typography variant="body1"><b>Website:</b> {profile?.website}</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Button variant="contained" color="primary" startIcon={<ChatIcon />}>
                Chats
              </Button>
              <Button variant="outlined" color="success" startIcon={<VolunteerActivismIcon />}>
                Volunteers
              </Button>
              <Button variant="outlined" color="info" startIcon={<InfoIcon />}>
                Profile Info
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Box className={styles.section} sx={{ mb: 2 }}>
              <Typography variant="h6" className={styles.sectionTitle} sx={{ mb: 1 }}>
                Adoption Requests
              </Typography>
              {adoptionRequests.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888' }}>
                  You have no pending requests.
                </Paper>
              ) : (
                adoptionRequests.map((req, idx) => (
                  <Paper key={idx} sx={{ p: 2, mb: 1 }}>{req.title || req}</Paper>
                ))
              )}
            </Box>
            <Box className={styles.section} sx={{ mb: 2 }}>
              <Typography variant="h6" className={styles.sectionTitle} sx={{ mb: 1 }}>
                Registered Seminars
              </Typography>
              {registeredSeminars.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888' }}>
                  You don't have any upcoming seminars.
                </Paper>
              ) : (
                registeredSeminars.map((sem, idx) => (
                  <Paper key={idx} sx={{ p: 2, mb: 1 }}>{sem.title || sem}</Paper>
                ))
              )}
            </Box>
            <Box className={styles.section}>
              <Typography variant="h6" className={styles.sectionTitle} sx={{ mb: 1 }}>
                Donations
              </Typography>
              {donations.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888' }}>
                  You have not made any donations yet.
                </Paper>
              ) : (
                donations.map((don, idx) => (
                  <Paper key={idx} sx={{ p: 2, mb: 1 }}>
                    {don.amount ? `৳${don.amount} to ${don.cause || 'N/A'}` : don}
                  </Paper>
                ))
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <form onSubmit={handleEditSubmit} encType="multipart/form-data">
          <DialogContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={profilePicPreview || (profile?.image ? `${apiUrl}/media/${profile.image}` : "/assets/default_org.png")}
                  sx={{ width: 64, height: 64 }}
                />
                <Button variant="outlined" component="label">
                  Change Picture
                  <input type="file" name="image" hidden accept="image/*" onChange={handleEditChange} />
                </Button>
              </Box>
              <TextField
                label="Contact"
                name="contact"
                value={editData.contact || ""}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Address"
                name="address"
                value={editData.address || ""}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Job"
                name="job"
                value={editData.job || ""}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Birth Date"
                name="birth_date"
                type="date"
                value={editData.birth_date || ""}
                onChange={handleEditChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                select
                label="Gender"
                name="gender"
                value={editData.gender || ""}
                onChange={handleEditChange}
                fullWidth
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="NID"
                name="nid"
                value={editData.nid || ""}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Location"
                name="location"
                value={editData.location || ""}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Website"
                name="website"
                value={editData.website || ""}
                onChange={handleEditChange}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
      <Footer />
    </>
  );
};

export default UserProfile;