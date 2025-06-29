import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Stack } from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import Avatar from '@mui/material/Avatar';
import styles from '../css/O_profile.module.css';
import Navbar from './NavbarO';
import TopBar from './TopBar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';

const dummyAdoptionRequests = [
    {
        adoption_id: 1,
        orphan_id: 1,
        orphan_name: "James Smith",
        user_id: 1,
        user_name: "john.doe@example.com",
        status: "pending",
        application_date: "2025-06-15",
        approval_date: null
    },
    {
        adoption_id: 2,
        orphan_id: 2,
        orphan_name: "Emma Johnson",
        user_id: 2,
        user_name: "sarah.parker@example.com",
        status: "approved",
        application_date: "2025-06-10",
        approval_date: "2025-06-20"
    },
    {
        adoption_id: 3,
        orphan_id: 3,
        orphan_name: "Michael Brown",
        user_id: 3,
        user_name: "robert.wilson@example.com",
        status: "rejected",
        application_date: "2025-06-05",
        approval_date: "2025-06-18"
    }
];

const OrganizationProfile = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [orgData, setOrgData] = useState({});
    const [editData, setEditData] = useState({
        name: "",
        contact: "",
        address: "",
        website: "",
        registration_num: "",
        established_date: "",
        vision: "",
        description: "",
    });
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [totalOrphans, setTotalOrphans] = useState(0);
    const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [seminars, setSeminars] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [selectedSeminar, setSelectedSeminar] = useState(null);
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isOpenApplicationModalOpen, setIsOpenApplicationModalOpen] = useState(false);
    const [isManageVolunteersModalOpen, setIsManageVolunteersModalOpen] = useState(false);
    const [volunteerApplications, setVolunteerApplications] = useState([]);
    const [isOrphanModalOpen, setIsOrphanModalOpen] = useState(false);
    const [orphanData, setOrphanData] = useState({
        name: "",
        birth_date: "",
        gender: "Male",
        education: "",
        medical_history: ""
    });
    const [orphanError, setOrphanError] = useState("");
    const [adoptionLoading, setAdoptionLoading] = useState(true);
    const [isAdoptionDetailsModalOpen, setIsAdoptionDetailsModalOpen] = useState(false);
    const [selectedAdoptionRequest, setSelectedAdoptionRequest] = useState(null);
    const [adoptionRequests, setAdoptionRequests] = useState(dummyAdoptionRequests);
    const navigate = useNavigate();

    // fetch profile of the organization
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${apiUrl}/organization/profile/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch profile");
                const data = await res.json();
                setOrgData(data.profile);
                setEditData({
                    name: data.profile.name || "",
                    contact: data.profile.contact || "",
                    address: data.profile.address || "",
                    website: data.profile.website || "",
                    registration_num: data.profile.registration_num || "",
                    established_date: data.profile.established_date || "",
                    vision: data.profile.vision || "",
                    description: data.profile.description || "",
                });
                setProfilePicPreview(data.profile.org_logo ? `${apiUrl}${data.profile.org_logo}` : null);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [apiUrl]);

    // profile edit
    const handleEditChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "org_logo" && files && files[0]) {
            setProfilePicture(files[0]);
            setProfilePicPreview(URL.createObjectURL(files[0]));
        } else {
            setEditData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(editData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) formData.append(key, value);
        });
        if (profilePicture) {
            formData.append("org_logo", profilePicture);
        }

        try {
            const res = await fetch(`${apiUrl}/organization/profile/`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            if (!res.ok) throw new Error("Failed to update profile");
            const data = await res.json();
            setOrgData(data.profile);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    // volunteer application
    const handleVolunteerOpen = async () => {
        setIsVolunteerModalOpen(true);
        try {
            // Fetch volunteers
            const volunteerRes = await fetch(`${apiUrl}/organization/volunteers/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!volunteerRes.ok) throw new Error("Failed to fetch volunteers");
            const volunteerData = await volunteerRes.json();
            setVolunteers(volunteerData);

            // Fetch seminars created by the organization
            const seminarRes = await fetch(`${apiUrl}/organization/seminars/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (!seminarRes.ok) throw new Error("Failed to fetch seminars");
            const seminarData = await seminarRes.json();
            setSeminars(seminarData);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVolunteerClose = () => {
        setIsVolunteerModalOpen(false);
        setSelectedVolunteer(null);
        setSelectedSeminar(null);
    };

    const handleAssignVolunteer = async () => {
        if (!selectedVolunteer || !selectedSeminar) {
            alert("Please select both a volunteer and a seminar.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/organization/assign-volunteer/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    volunteer_id: selectedVolunteer,
                    seminar_id: selectedSeminar,
                }),
            });
            if (!res.ok) throw new Error("Failed to assign volunteer");
            alert("Volunteer assigned successfully!");
            handleVolunteerClose();
        } catch (err) {
            console.error(err);
            alert("Failed to assign volunteer.");
        }
    };

    // fetch adoption requests
    const fetchAdoptionRequests = async () => {
        try {
            setAdoptionLoading(true);
            const res = await fetch(`${apiUrl}/adoption/organization-requests/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch adoption requests");

            const data = await res.json();

            const formattedRequests = data.map(request => ({
                adoption_id: request.id,
                orphan_id: request.orphan?.id || 0,
                orphan_name: request.orphan?.name || "Unknown Orphan",
                user_id: request.adopter?.id || 0,
                user_name: request.adopter?.email || "Unknown User",
                status: request.status || "pending",
                application_date: request.application_date || new Date().toISOString().split('T')[0],
                approval_date: request.approval_date
            }));

            if (formattedRequests.length > 0) {
                setAdoptionRequests(formattedRequests);
            }
        } catch (err) {
            console.error("Error fetching adoption requests:", err);
            // Keep using the dummy data that's already in state
        } finally {
            setAdoptionLoading(false);
        }
    };

    useEffect(() => {
        fetchAdoptionRequests();
    }, []);

    const handleApproveAdoption = async (adoptionId) => {
        try {
            const res = await fetch(`${apiUrl}/adoption/approve/${adoptionId}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to approve adoption request");

            fetchAdoptionRequests();

            fetchTotalOrphans();
            // fetchOrphans();

            alert("Adoption request approved successfully!");
        } catch (err) {
            console.error("Error approving adoption:", err);
            alert("Failed to approve adoption request. Please try again.");
        }
    };

    const handleRejectAdoption = async (adoptionId) => {
        try {
            const res = await fetch(`${apiUrl}/adoption/reject/${adoptionId}/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to reject adoption request");

            fetchAdoptionRequests();

            alert("Adoption request rejected successfully!");
        } catch (err) {
            console.error("Error rejecting adoption:", err);
            alert("Failed to reject adoption request. Please try again.");
        }
    };

    const fetchVolunteerApplications = async () => {
        try {
            const res = await fetch(`${apiUrl}/organization/volunteer-applications/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch volunteer applications");

            const data = await res.json();
            setVolunteerApplications(data);
        } catch (err) {
            console.error("Error fetching volunteer applications:", err);
        }
    };

    useEffect(() => {
        fetchVolunteerApplications();
    }, []);

    const handleOpenVolunteerApplication = async () => {
        if (!selectedSeminar) {
            alert("Please select a seminar.");
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/organization/seminars/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to open volunteer application.");

            alert("Volunteer application opened successfully!");
            setIsOpenApplicationModalOpen(true);

            const seminarRes = await fetch(`${apiUrl}/organization/seminars/${selectedSeminar}/open-volunteer/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (seminarRes.ok) {
                const seminarData = await seminarRes.json();
                setSeminars(seminarData);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to open volunteer application.");
        }
    };

    const handleApproveVolunteer = async (applicationId) => {
        try {
            const res = await fetch(`${apiUrl}/organization/volunteer-applications/${applicationId}/approve/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to approve volunteer application");

            alert("Volunteer application approved successfully!");

            fetchVolunteerApplications();
        } catch (err) {
            console.error("Error approving volunteer application:", err);
            alert("Failed to approve volunteer application.");
        }
    };

    const handleDeclineVolunteer = async (applicationId) => {
        try {
            const res = await fetch(`${apiUrl}/organization/volunteer-applications/${applicationId}/decline/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to decline volunteer application");

            alert("Volunteer application declined.");

            fetchVolunteerApplications();
        } catch (err) {
            console.error("Error declining volunteer application:", err);
            alert("Failed to decline volunteer application.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleOrphanInputChange = (e) => {
        const { name, value } = e.target;
        setOrphanData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // orphan form submission
    const handleOrphanSubmit = async (e) => {
        e.preventDefault();
        setOrphanError("");

        if (!orphanData.name || !orphanData.birth_date) {
            setOrphanError("Name and birth date are required");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", orphanData.name);
            formData.append("birth_date", orphanData.birth_date);
            formData.append("gender", orphanData.gender);

            if (orphanData.education) {
                formData.append("education", orphanData.education);
            }

            if (orphanData.medical_history) {
                formData.append("medical_history", orphanData.medical_history);
            }

            if (orphanData.profile_picture) {
                formData.append("profile_picture", orphanData.profile_picture);
            }

            const res = await fetch(`${apiUrl}/organization/orphans/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add orphan");
            }

            alert("Orphan added successfully!");
            setIsOrphanModalOpen(false);
            setOrphanData({
                name: "",
                birth_date: "",
                gender: "Male",
                education: "",
                medical_history: "",
                profile_picture: null,
                profile_picture_preview: null
            });

            fetchTotalOrphans();
        } catch (err) {
            console.error(err);
            setOrphanError(err.message || "An error occurred while adding orphan");
        }
    };

    //fetch total orphan
    const fetchTotalOrphans = async () => {
        try {
            const res = await fetch(`${apiUrl}/organization/orphans/count/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setTotalOrphans(data.count);
            }
        } catch (err) {
            console.error("Error fetching orphan count:", err);
        }
    };

    useEffect(() => {
        fetchTotalOrphans();
    }, []);

    // donation records
    const fetchDonationRecords = async () => {
        try {
            const res = await fetch(`${apiUrl}/donations/organization/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch donation records");

            const data = await res.json();
            setDonationRequests(data);
        } catch (err) {
            console.error("Error fetching donation records:", err);
            setDonationRequests([
                {
                    id: 1,
                    amount: 5000,
                    receiver_type: 'organization',
                    user_id: 1,
                    user_name: 'john.doe@example.com',
                    status: 'completed',
                    donation_date: '2025-06-15'
                },
                {
                    id: 2,
                    amount: 3000,
                    receiver_type: 'orphan',
                    orphan_id: 1,
                    first_name: 'James',
                    last_name: 'Smith',
                    user_id: 2,
                    user_name: 'jane.smith@example.com',
                    status: 'completed',
                    donation_date: '2025-06-10'
                }
            ]);
        }
    };

    useEffect(() => {
        fetchDonationRecords();
    }, []);

    // opening the details modal
    const handleViewAdoptionDetails = (request) => {
        setSelectedAdoptionRequest(request);
        setIsAdoptionDetailsModalOpen(true);
    };

    // closing the details modal
    const handleCloseAdoptionDetailsModal = () => {
        setIsAdoptionDetailsModalOpen(false);
        setSelectedAdoptionRequest(null);
    };


    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
    };

    const handleEditOpen = () => {
        setIsEditModalOpen(true);
    };

    const handleEditClose = () => {
        setIsEditModalOpen(false);
        setProfilePicPreview(null);
    };

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
            <Navbar unreadNotifications={unreadNotifications} />
            <div className={styles.accountPageContainer}>
                <div className={styles.accountInfoContainer}>
                    {/* Profile Section */}
                    <div className={styles.profileSection}>
                        <div className={styles.accountPicture}>
                            <Avatar
                                src={orgData.org_logo ? `${apiUrl}${orgData.org_logo}` : '/assets/default_org.png'}
                                alt="Organization Logo"
                                sx={{ width: 120, height: 120 }}
                            />
                        </div>
                        <div className={styles.accountData}>
                            <h1>{orgData.name}</h1>
                            <p>Location: {orgData.address}</p>
                            <p>Email: {orgData.email}</p>
                            <p>Contact: {orgData.contact}</p>
                            <p>Established: {orgData.established_date}</p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className={styles.biography}>
                        <h2>Our Vision</h2>
                        <p>{orgData.vision}</p>
                        <h2>Description</h2>
                        <p>{orgData.description}</p>
                    </div>

                    {/* Button Group */}
                    <div className={styles.options}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={() => navigate('./O_chat')}
                        >
                            Chats
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={() => navigate('./O_funds')}
                        >
                            Funds
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={() => setIsOrphanModalOpen(true)}
                        >
                            Add Orphan
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={() => setIsOpenApplicationModalOpen(true)}
                        >
                            Open Volunteer Applications
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={() => setIsManageVolunteersModalOpen(true)}
                        >
                            Manage Volunteers
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={styles.optionButton}
                            onClick={handleEditOpen}
                        >
                            Edit Profile
                        </Button>
                    </div>

                    {/* orphan adding modal from */}
                    <Modal
                        open={isOrphanModalOpen}
                        onClose={() => setIsOrphanModalOpen(false)}
                        aria-labelledby="add-orphan-modal"
                        aria-describedby="modal-to-add-orphan-to-organization"
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 500,
                                bgcolor: "background.paper",
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <h2 id="add-orphan-modal-title" style={{ marginBottom: 16 }}>Add Orphan</h2>
                            {orphanError && (
                                <Box sx={{ color: 'error.main', mb: 2 }}>{orphanError}</Box>
                            )}
                            <form onSubmit={handleOrphanSubmit} encType="multipart/form-data">
                                <Stack spacing={2}>
                                    {/* Profile Picture Field */}
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Avatar
                                            src={orphanData.profile_picture_preview || "/assets/default_org.png"}
                                            sx={{ width: 64, height: 64 }}
                                        />
                                        <Button variant="outlined" component="label">
                                            Upload Picture
                                            <input
                                                type="file"
                                                name="profile_picture"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files && e.target.files[0];
                                                    if (file) {
                                                        setOrphanData(prev => ({
                                                            ...prev,
                                                            profile_picture: file,
                                                            profile_picture_preview: URL.createObjectURL(file)
                                                        }));
                                                    }
                                                }}
                                            />
                                        </Button>
                                    </Box>
                                    <TextField
                                        label="Full Name"
                                        name="name"
                                        value={orphanData.name}
                                        onChange={handleOrphanInputChange}
                                        required
                                        fullWidth
                                    />
                                    <TextField
                                        label="Birth Date"
                                        name="birth_date"
                                        type="date"
                                        value={orphanData.birth_date}
                                        onChange={handleOrphanInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        required
                                        fullWidth
                                    />
                                    <TextField
                                        select
                                        label="Gender"
                                        name="gender"
                                        value={orphanData.gender}
                                        onChange={handleOrphanInputChange}
                                        fullWidth
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </TextField>
                                    <TextField
                                        label="Education"
                                        name="education"
                                        value={orphanData.education}
                                        onChange={handleOrphanInputChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        helperText="Provide education details like current grade, school, etc."
                                    />
                                    <TextField
                                        label="Medical History"
                                        name="medical_history"
                                        value={orphanData.medical_history}
                                        onChange={handleOrphanInputChange}
                                        multiline
                                        rows={3}
                                        fullWidth
                                        helperText="Provide any relevant medical information"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                    >
                                        Add Orphan
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Modal>

                    {/* opening applications */}
                    <Modal
                        open={isOpenApplicationModalOpen}
                        onClose={() => setIsOpenApplicationModalOpen(false)}
                        aria-labelledby="open-application-modal"
                    >
                        <Box sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}>
                            <h2>Open Volunteer Applications</h2>
                            <p>Select a seminar to open for volunteer applications</p>
                            <TextField
                                select
                                label="Select Seminar"
                                value={selectedSeminar || ""}
                                onChange={(e) => setSelectedSeminar(e.target.value)}
                                SelectProps={{ native: true }}
                                fullWidth
                                sx={{ marginTop: 2 }}
                            >
                                <option value="" disabled />
                                {seminars.map((seminar) => (
                                    <option key={seminar.id} value={seminar.id}>
                                        {seminar.title}
                                    </option>
                                ))}
                            </TextField>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpenVolunteerApplication}
                                sx={{ marginTop: 2 }}
                            >
                                Open for Applications
                            </Button>
                        </Box>
                    </Modal>

                    {/* view and manage applications */}
                    <div className={styles.infoBox}>
                        <h2 className={styles.infoBoxHeading}>Volunteer Applications</h2>
                        <table className={styles.infoTable}>
                            <thead className={styles.tableHead}>
                                <tr>
                                    <th>Volunteer Name</th>
                                    <th>Seminar</th>
                                    <th>Date Applied</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {volunteerApplications.length > 0 ? (
                                    volunteerApplications.map((app) => (
                                        <tr key={app.id}>
                                            <td>{app.volunteer_name}</td>
                                            <td>{app.seminar_title}</td>
                                            <td>{formatDate(app.applied_at)}</td>
                                            <td>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleApproveVolunteer(app.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeclineVolunteer(app.id)}
                                                >
                                                    Decline
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>
                                            No volunteer applications yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Stats Section */}
                    <div className={styles.rightPortion}>
                        <div className={styles.tabs}>
                            <a href="./O_funds"><AttachMoneyRoundedIcon className={styles.icon} /></a>
                            <div>
                                <p>Funds</p>
                                <h3>{ } TK</h3>
                            </div>
                        </div>
                        <div className={styles.tabs}>
                            <a href="./O_adoption"><FamilyRestroomRoundedIcon className={styles.icon} /></a>
                            <div>
                                <p>Adoptions</p>
                                <h3>{ }+</h3>
                            </div>
                        </div>
                        <div className={styles.tabs}>
                            <a href="#"><PersonAddAlt1RoundedIcon className={styles.icon} /></a>
                            <div>
                                <p>Volunteers</p>
                                <h3>3</h3>
                            </div>
                        </div>
                        <div className={styles.tabs}>
                            <a href="./O_orphan"><FaceRoundedIcon className={styles.icon} /></a>
                            <div>
                                <p>Orphans</p>
                                <h3>{totalOrphans}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className={styles.infoBox}>
                        {/* Inbox */}
                        <div className={styles.infoBoxTop}>
                            <h2>Inbox</h2>
                            <input type="text" placeholder="Search..." className={styles.peopleListSearch} />
                            <div className={styles.chatContainer} id="chat-content">
                                {/* Dynamically loaded chats */}
                            </div>
                            <div className={styles.inboxFooter}>
                                <p>Previous chats</p>
                            </div>
                        </div>

                        {/* Adoption Requests */}
                        <div className={styles.infoBox}>
                            <a href="./O_adoption" style={{ textDecoration: 'none' }}>
                                <h2 className={styles.infoBoxHeading}>Adoption Requests</h2>
                            </a>
                            {adoptionLoading ? (
                                <p>Loading adoption requests...</p>
                            ) : adoptionRequests.length > 0 ? (
                                <table className={styles.infoTable}>
                                    <thead className={styles.tableHead}>
                                        <tr>
                                            <th>Requested by</th>
                                            <th>Requested for</th>
                                            <th>Request Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={styles.tableBody}>
                                        {adoptionRequests.map((request) => (
                                            <tr key={request.adoption_id}>
                                                <td>
                                                    <a href={`./O_see_user_profile?user_id=${request.user_id}`}>
                                                        {request.user_name}
                                                    </a>
                                                </td>
                                                <td>
                                                    <a href={`./O_orphan_profile?orphan_id=${request.orphan_id}`}>
                                                        {request.orphan_name}
                                                    </a>
                                                </td>
                                                <td>{formatDate(request.application_date)}</td>
                                                <td>
                                                    <p className={
                                                        request.status === 'approved'
                                                            ? styles.statusDone
                                                            : request.status === 'rejected'
                                                                ? styles.statusRejected
                                                                : styles.statusPending
                                                    }>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </p>
                                                </td>
                                                <td>
                                                    {request.status === 'pending' && (
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Button
                                                                size="small"
                                                                color="primary"
                                                                onClick={() => handleViewAdoptionDetails(request)}
                                                            >
                                                                See Details
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="success"
                                                                variant="contained"
                                                                onClick={() => handleApproveAdoption(request.adoption_id)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                color="error"
                                                                variant="contained"
                                                                onClick={() => handleRejectAdoption(request.adoption_id)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p style={{ textAlign: 'center', padding: '20px' }}>
                                    No adoption requests found.
                                </p>
                            )}
                        </div>

                        {/* Donation Requests */}
                        <div className={styles.infoBox}>
                            <a href="./O_donation" style={{ textDecoration: 'none' }}>
                                <h2 className={styles.infoBoxHeading}>Donation Records</h2>
                            </a>
                            {donationRequests.length > 0 ? (
                                <ul className={styles.donationList}>
                                    {donationRequests.map((item, index) => (
                                        <li key={index} className={item.status === 'completed' ? styles.completed : styles.notCompleted}>
                                            {item.receiver_type === 'organization' ? (
                                                <p>
                                                    <span className={styles.donationAmount}>{item.amount} TK</span> received from{' '}
                                                    <a href={`./O_see_user_profile?user_id=${item.user_id}`}>{item.user_name}</a>
                                                    {' '}<span className={styles.donationDate}>on {formatDate(item.donation_date)}</span>
                                                </p>
                                            ) : (
                                                <p>
                                                    <span className={styles.donationAmount}>{item.amount} TK</span> donated to{' '}
                                                    <a href={`./O_orphan_profile?orphan_id=${item.orphan_id}`}>
                                                        {item.first_name} {item.last_name}
                                                    </a>{' '}
                                                    from <a href={`./O_see_user_profile?user_id=${item.user_id}`}>{item.user_name}</a>
                                                    {' '}<span className={styles.donationDate}>on {formatDate(item.donation_date)}</span>
                                                </p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: 'center', padding: '20px' }}>
                                    No donation records found.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-profile-modal"
                aria-describedby="edit-organization-profile"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <form onSubmit={handleEditSubmit}>
                        <Stack spacing={2}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    src={profilePicPreview || "/assets/default_org.png"}
                                    sx={{ width: 64, height: 64 }}
                                />
                                <Button variant="outlined" component="label">
                                    Change Picture
                                    <input
                                        type="file"
                                        name="org_logo"
                                        hidden
                                        accept="image/*"
                                        onChange={handleEditChange}
                                    />
                                </Button>
                            </Box>
                            <TextField
                                label="Name"
                                name="name"
                                value={editData.name}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Contact"
                                name="contact"
                                value={editData.contact}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={editData.address}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Website"
                                name="website"
                                value={editData.website}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Registration Number"
                                name="registration_num"
                                value={editData.registration_num}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Established Date"
                                name="established_date"
                                type="date"
                                value={editData.established_date}
                                onChange={handleEditChange}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                            <TextField
                                label="Vision"
                                name="vision"
                                value={editData.vision}
                                onChange={handleEditChange}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={editData.description}
                                onChange={handleEditChange}
                                multiline
                                rows={3}
                                fullWidth
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{
                                    color: "#fff",
                                    backgroundColor: "primary.main",
                                    '&:hover': {
                                        backgroundColor: "primary.dark",
                                        color: "#fff"
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Modal>

            {/* Assign Volunteer Modal */}
            <Modal
                open={isVolunteerModalOpen}
                onClose={handleVolunteerClose}
                aria-labelledby="volunteer-modal-title"
                aria-describedby="volunteer-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 id="volunteer-modal-title" style={{ marginBottom: 15 }}>Assign Volunteer to Seminar</h2>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Select Volunteer"
                            value={selectedVolunteer || ""}
                            onChange={(e) => setSelectedVolunteer(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            fullWidth
                        >
                            <option value="" disabled />
                            {volunteers.map((volunteer) => (
                                <option key={volunteer.id} value={volunteer.id}>
                                    {volunteer.name}
                                </option>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Select Seminar"
                            value={selectedSeminar || ""}
                            onChange={(e) => setSelectedSeminar(e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            fullWidth
                        >
                            <option value="" disabled />
                            {seminars.map((seminar) => (
                                <option key={seminar.id} value={seminar.id}>
                                    {seminar.title}
                                </option>
                            ))}
                        </TextField>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={async () => {
                                try {
                                    const res = await fetch(`${apiUrl}/organization/seminars/${selectedSeminar}/open-volunteer/`, {
                                        method: "POST",
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                                        },
                                    });
                                    if (!res.ok) throw new Error("Failed to open volunteer application.");
                                    alert("Volunteer application opened successfully!");
                                } catch (err) {
                                    console.error(err);
                                    alert("Failed to open volunteer application.");
                                }
                            }}
                        >
                            Open Volunteer Application
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            {/* Adoption Details Modal */}
            <Modal
                open={isAdoptionDetailsModalOpen}
                onClose={handleCloseAdoptionDetailsModal}
                aria-labelledby="adoption-details-modal"
                aria-describedby="view-adoption-request-details"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        maxWidth: "90%",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxHeight: "90vh",
                        overflow: "auto"
                    }}
                >
                    {selectedAdoptionRequest && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" component="h2">
                                    Adoption Request Details
                                </Typography>
                                <Chip
                                    label={selectedAdoptionRequest.status.charAt(0).toUpperCase() + selectedAdoptionRequest.status.slice(1)}
                                    color={
                                        selectedAdoptionRequest.status === 'approved' ? 'success' :
                                            selectedAdoptionRequest.status === 'rejected' ? 'error' : 'warning'
                                    }
                                />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Orphan Information
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Name:</strong> {selectedAdoptionRequest.orphan_name}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => {
                                                handleCloseAdoptionDetailsModal();
                                                navigate(`./O_orphan_profile?orphan_id=${selectedAdoptionRequest.orphan_id}`);
                                            }}
                                        >
                                            View Orphan Profile
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Requester Information
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Email:</strong> {selectedAdoptionRequest.user_name}
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{ mt: 1 }}
                                            onClick={() => {
                                                handleCloseAdoptionDetailsModal();
                                                navigate(`./O_see_user_profile?user_id=${selectedAdoptionRequest.user_id}`);
                                            }}
                                        >
                                            View User Profile
                                        </Button>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Request Details
                                        </Typography>
                                        <Typography variant="body1">
                                            <strong>Request Date:</strong> {formatDate(selectedAdoptionRequest.application_date)}
                                        </Typography>
                                        {selectedAdoptionRequest.approval_date && (
                                            <Typography variant="body1">
                                                <strong>Decision Date:</strong> {formatDate(selectedAdoptionRequest.approval_date)}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                                        {selectedAdoptionRequest.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => {
                                                        handleApproveAdoption(selectedAdoptionRequest.adoption_id);
                                                        handleCloseAdoptionDetailsModal();
                                                    }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => {
                                                        handleRejectAdoption(selectedAdoptionRequest.adoption_id);
                                                        handleCloseAdoptionDetailsModal();
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </>
                                        )}
                                        <Button
                                            variant="outlined"
                                            onClick={handleCloseAdoptionDetailsModal}
                                        >
                                            Close
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            </Modal>
            <Footer />
        </div>
    );
};

export default OrganizationProfile;