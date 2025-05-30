import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Button, Stack } from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import FaceRoundedIcon from '@mui/icons-material/FaceRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import FamilyRestroomRoundedIcon from '@mui/icons-material/FamilyRestroomRounded';
import styles from '../css/O_profile.module.css';
import Navbar from './NavbarO';
import TopBar from './TopBar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';

const OrganizationProfile = () => {
    const [orgData, setOrgData] = useState({});
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [totalOrphans, setTotalOrphans] = useState(0);
    const { userId } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(false);
    const navigate = useNavigate();

    const {
        org_name,
        org_location,
        org_email,
        org_phone,
        established,
        acc_join_date,
        role,
        org_vision,
        org_description,
        total_amount_received,
        total_adoptions,
    } = orgData;

    useEffect(() => {
        fetch("/organization/profile/", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }).then((res) => res.json()).then((data) => {
            setOrgData(data);
            setEditData(data);
        }).catch((err) => console.error(err));
    }, []);

    const handleEditChange = (e) => {
        const {name, value} = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        fetch("/organization/profile/", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(editData),
        }).then((res) => res.json()).then((data) => {
            setOrgData(data);
            setIsEditModalOpen(false);
        }).catch((err) => console.error(err));
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/home");
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
                            <img src={`./assets/${orgData.org_logo}`} alt="Organization Logo" />
                        </div>
                        <div className={styles.accountData}>
                            <h1>{org_name}</h1>
                            <p>Location: {org_location}, Bangladesh</p>
                            <p>Email: {org_email}</p>
                            <p>Contact: {org_phone}</p>
                            <p>Established: {established}</p>
                            <p>Joined: {acc_join_date}</p>
                            <p>Account Type: {role}</p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className={styles.biography}>
                        <h2>Our Vision</h2>
                        <p>{org_vision}</p>
                        <h2>Description</h2>
                        <p>{org_description}</p>
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
                            onClick={() => navigate('./O_volunteer')}
                        >
                            Volunteers
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            className={styles.optionButton}
                            onClick={() => setIsEditModalOpen(true)} // Open the edit profile modal
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
                                <h3>{total_amount_received} TK</h3>
                            </div>
                        </div>
                        <div className={styles.tabs}>
                            <a href="./O_adoption"><FamilyRestroomRoundedIcon className={styles.icon} /></a>
                            <div>
                                <p>Adoptions</p>
                                <h3>{total_adoptions}+</h3>
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
                onClose={() => setIsEditModalOpen(false)}
                aria-labelledby="edit-profile-modal"
                aria-describedby="edit-organization-profile"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <form onSubmit={handleEditSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                name="name"
                                value={editData.name || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Contact"
                                name="contact"
                                value={editData.contact || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Address"
                                name="address"
                                value={editData.address || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Website"
                                name="website"
                                value={editData.website || ''}
                                onChange={handleEditChange}
                                fullWidth
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={editData.description || ''}
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
            <Footer />
        </div>
    );
};

export default OrganizationProfile;