import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from '../css/UserProfile.module.css';
import TopBar from './TopBar';
import Navbar from './NavbarU';
import Footer from './Footer';
import {
  Card, CardContent, CardHeader, Avatar, Typography, Button, Stack, Divider, Box, Chip, Paper, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ChatIcon from '@mui/icons-material/Chat';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import InfoIcon from '@mui/icons-material/Info';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
  const [adoptionLoading, setAdoptionLoading] = useState(true);
  const [registeredSeminars, setRegisteredSeminars] = useState([]);
  const [seminarsLoading, setSeminarsLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [donationsLoading, setDonationsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      } catch (e) {
        setUser(null);
        setProfile(null);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch adoption requests
  useEffect(() => {
    const fetchAdoptionRequests = async () => {
      setAdoptionLoading(true);
      try {
        const res = await fetch(`${apiUrl}/adoption/user-requests/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch adoption requests");
        const data = await res.json();
        setAdoptionRequests(data);
      } catch (e) {
        console.error("Error fetching adoption requests:", e);
      } finally {
        setAdoptionLoading(false);
      }
    };

    if (user) {
      fetchAdoptionRequests();
    }
  }, [user]);

  // Fetch registered seminars
  useEffect(() => {
    const fetchRegisteredSeminars = async () => {
      setSeminarsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/seminars/registered/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch registered seminars");
        const data = await res.json();
        setRegisteredSeminars(data);
      } catch (e) {
        console.error("Error fetching registered seminars:", e);
        // Use dummy data as fallback
        setRegisteredSeminars(dummySeminars);
      } finally {
        setSeminarsLoading(false);
      }
    };

    if (user) {
      fetchRegisteredSeminars();
    }
  }, [user]);

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      setDonationsLoading(true);
      try {
        const res = await fetch(`${apiUrl}/donations/user/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch donations");
        const data = await res.json();
        setDonations(data);
      } catch (e) {
        console.error("Error fetching donations:", e);
      } finally {
        setDonationsLoading(false);
      }
    };

    if (user) {
      fetchDonations();
    }
  }, [user]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format('MMMM D, YYYY');
  };

  // Handle adoption request cancel
  const handleCancelAdoption = async (adoptionId) => {
    if (!confirm("Are you sure you want to cancel this adoption request?")) return;

    try {
      const res = await fetch(`${apiUrl}/adoption/cancel/${adoptionId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to cancel adoption request");

      // Refresh adoption requests
      setAdoptionRequests(prevRequests =>
        prevRequests.filter(req => req.id !== adoptionId)
      );

      alert("Adoption request cancelled successfully");
    } catch (err) {
      console.error("Error cancelling adoption:", err);
      alert("Failed to cancel adoption request: " + err.message);
    }
  };

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
    setProfilePicPreview(profile?.image ? `${apiUrl}${profile.image}` : null);
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
      alert("Profile updated successfully");
    } catch (error) {
      alert("Failed to update profile: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/home');
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
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
                src={profile?.image ? `${apiUrl}${profile.image}` : "/assets/default_profile.png"}
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
              <Typography variant="body1"><b>Contact:</b> {profile?.contact || "Not provided"}</Typography>
              <Typography variant="body1"><b>Address:</b> {profile?.address || "Not provided"}</Typography>
              <Typography variant="body1"><b>Job:</b> {profile?.job || "Not provided"}</Typography>
              <Typography variant="body1"><b>Birth Date:</b> {profile?.birth_date ? formatDate(profile.birth_date) : "Not provided"}</Typography>
              <Typography variant="body1"><b>Gender:</b> {profile?.gender || "Not provided"}</Typography>
              <Typography variant="body1"><b>NID:</b> {profile?.nid || "Not provided"}</Typography>
              <Typography variant="body1"><b>Location:</b> {profile?.location || "Not provided"}</Typography>
              <Typography variant="body1"><b>Website:</b> {profile?.website || "Not provided"}</Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Button variant="contained" color="primary" startIcon={<ChatIcon />}
                onClick={() => navigate('/chat')}>
                Chats
              </Button>
              <Button variant="outlined" color="success" startIcon={<VolunteerActivismIcon />}
                onClick={() => navigate('/volunteer')}>
                Volunteer
              </Button>
              <Button variant="outlined" color="info" startIcon={<InfoIcon />}
                onClick={() => navigate('/seminars')}>
                Seminars
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />

            {/* Adoption Requests Section */}
            <Box className={styles.section} sx={{ mb: 3 }}>
              <Typography variant="h6" className={styles.sectionTitle}
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentIcon color="primary" /> Adoption Requests
              </Typography>
              {adoptionLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : adoptionRequests.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888', textAlign: 'center' }}>
                  You have not made any adoption requests yet.
                </Paper>
              ) : (
                <Box>
                  {adoptionRequests.map((request) => (
                    <Paper key={request.id} sx={{
                      p: 2, mb: 2, borderLeft: '4px solid',
                      borderColor:
                        request.status === 'approved' ? 'success.main' :
                          request.status === 'rejected' ? 'error.main' : 'warning.main'
                    }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Request for: {request.orphan?.name || "Unknown Orphan"}
                        </Typography>
                        <Typography variant="body2">
                          Status: <Chip
                            size="small"
                            label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            color={
                              request.status === 'approved' ? 'success' :
                                request.status === 'rejected' ? 'error' : 'warning'
                            }
                          />
                        </Typography>
                        <Typography variant="body2">
                          Requested on: {formatDate(request.application_date)}
                        </Typography>
                        {request.approval_date && (
                          <Typography variant="body2">
                            Decision date: {formatDate(request.approval_date)}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          Organization: {request.organization_name || "Unknown"}
                        </Typography>
                        {request.status === 'pending' && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelAdoption(request.id)}
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                          >
                            Cancel Request
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            {/* Registered Seminars Section */}
            <Box className={styles.section} sx={{ mb: 3 }}>
              <Typography variant="h6" className={styles.sectionTitle}
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptIcon color="primary" /> Registered Seminars
              </Typography>
              {seminarsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : registeredSeminars.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888', textAlign: 'center' }}>
                  You haven't registered for any seminars yet.
                </Paper>
              ) : (
                <Box>
                  {registeredSeminars.map((seminar) => (
                    <Paper key={seminar.id} sx={{ p: 2, mb: 2 }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {seminar.title}
                        </Typography>
                        <Typography variant="body2">
                          Date: {formatDate(seminar.date)}
                        </Typography>
                        <Typography variant="body2">
                          Time: {seminar.time}
                        </Typography>
                        <Typography variant="body2">
                          Location: {seminar.location}
                        </Typography>
                        <Typography variant="body2">
                          Organization: {seminar.organization_name}
                        </Typography>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/seminar/${seminar.id}`)}
                          sx={{ alignSelf: 'flex-start', mt: 1 }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>

            {/* Donations Section */}
            <Box className={styles.section}>
              <Typography variant="h6" className={styles.sectionTitle}
                sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FavoriteIcon color="error" /> Your Donations
              </Typography>
              {donationsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : donations.length === 0 ? (
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', color: '#888', textAlign: 'center' }}>
                  You have not made any donations yet.
                </Paper>
              ) : (
                <Box>
                  {donations.map((donation) => (
                    <Paper key={donation.id} sx={{
                      p: 2, mb: 2, borderLeft: '4px solid',
                      borderColor:
                        donation.status === 'completed' ? 'success.main' :
                          donation.status === 'failed' ? 'error.main' : 'warning.main'
                    }}>
                      <Stack spacing={1}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {donation.amount ? `৳${donation.amount}` : 'Unknown amount'}
                          {donation.receiver_type === 'orphan'
                            ? ` to ${donation.orphan_name || 'an orphan'}`
                            : ` to ${donation.organization_name || 'an organization'}`
                          }
                        </Typography>
                        <Typography variant="body2">
                          Status: <Chip
                            size="small"
                            label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            color={
                              donation.status === 'completed' ? 'success' :
                                donation.status === 'failed' ? 'error' : 'warning'
                            }
                          />
                        </Typography>
                        <Typography variant="body2">
                          Date: {formatDate(donation.donation_date)}
                        </Typography>
                        <Typography variant="body2">
                          Reference: {donation.id ? `DON-${donation.id}` : 'N/A'}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Box>
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
                  src={profilePicPreview || (profile?.image ? `${apiUrl}${profile.image}` : "/assets/default_profile.png")}
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