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
    const [adoptionRequests, setAdoptionRequests] = useState([]);
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
    const navigate = useNavigate();

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
                            onClick={() => navigate('./O_orphan')}
                        >
                            Orphanage
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.optionButton}
                            onClick={handleVolunteerOpen}
                        >
                            Volunteers
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
                            <table className={styles.infoTable}>
                                <thead className={styles.tableHead}>
                                    <tr>
                                        <th>Requested by</th>
                                        <th>Requested for</th>
                                        <th>Action</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tableBody}>
                                    {adoptionRequests.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <a href={`./O_see_user_profile?user_id=${item.user_id}`}>
                                                    {item.user_name}
                                                </a>
                                            </td>
                                            <td>
                                                <a href={`./O_orphan_profile?orphan_id=${item.orphan_id}`}>
                                                    {item.first_name}
                                                </a>
                                            </td>
                                            <td>
                                                <a href={`./O_adoption_request_details?adoption_id=${item.adoption_id}&user_id=${item.user_id}&orphan_id=${item.orphan_id}`}>
                                                    View
                                                </a>
                                            </td>
                                            <td>
                                                <p className={item.status === 'Approved' ? styles.statusDone : styles.statusPending}>
                                                    {item.status}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Donation Requests */}
                        <div className={styles.infoBox}>
                            <a href="./O_donation" style={{ textDecoration: 'none' }}>
                                <h2 className={styles.infoBoxHeading}>Donation Records</h2>
                            </a>
                            <ul className={styles.donationList}>
                                {donationRequests.map((item, index) => (
                                    <li key={index} className={item.receiver_type === 'organization' ? styles.completed : styles.notCompleted}>
                                        {item.receiver_type === 'organization' ? (
                                            <p>Donation Received {item.amount}TK from <a href={`./O_see_user_profile?user_id=${item.user_id}`}>{item.user_name}</a></p>
                                        ) : (
                                            <p>{item.first_name} {item.last_name} received {item.amount}TK from <a href={`./O_see_user_profile?user_id=${item.user_id}`}>{item.user_name}</a></p>
                                        )}
                                    </li>
                                ))}
                            </ul>
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
                            <Button type="submit" variant="contained" color="primary">
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
            <Footer />
        </div>
    );
};

export default OrganizationProfile;