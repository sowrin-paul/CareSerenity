import React, { useEffect, useState } from 'react';
import '../css/Color.module.css';
import '../css/Navbar.module.css';
import '../css/Organizations.module.css';
import '../css/Footer.module.css';
import Navbar from './NavbarO';
import Footer from './Footer';

const OrganizationProfile = () => {
    const [orgData, setOrgData] = useState({});
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [donationRequests, setDonationRequests] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [totalOrphans, setTotalOrphans] = useState(0);

    const {
        org_logo,
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
        total_adoptions
    } = orgData;

    return (
        <div>
            <Navbar unreadNotifications={unreadNotifications} />

            {/* Feedback Messages */}
            <div className="feedback-message">
                {/* control feedback */}
            </div>

            <div className="account-container">
                {/* Profile Section */}
                <div className="profile-section">
                    <div className="profile-picture">
                        <img src={`./assets/${org_logo}`} alt="Organization Logo" />
                    </div>
                    <div className="profile-details">
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
                <div className="bio-section">
                    <h2>Our Vision</h2>
                    <p>{org_vision}</p>
                    <h2>Description</h2>
                    <p>{org_description}</p>
                </div>

                {/* Button Group */}
                <div className="button-group">
                    <a href="./O_chat" className="btn-link">Chats</a>
                    <a href="./O_funds" className="btn-link">Funds</a>
                    <a href="./O_orphan" className="btn-link">Orphanage</a>
                    <a href="./O_volunteer" className="btn-link">Volunteers</a>
                    <a href="./O_profile_edit" className="btn-link">Edit Profile</a>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stats-box">
                        <a href="./O_funds"><i className='bx bxs-dollar-circle'></i></a>
                        <div>
                            <p>Funds</p>
                            <h3>{total_amount_received} TK</h3>
                        </div>
                    </div>
                    <div className="stats-box">
                        <a href="./O_adoption"><i className='bx bxs-face'></i></a>
                        <div>
                            <p>Adoptions</p>
                            <h3>{total_adoptions}</h3>
                        </div>
                    </div>
                    <div className="stats-box">
                        <a href="#"><i className='bx bxs-user-plus'></i></a>
                        <div>
                            <p>Volunteers</p>
                            <h3>3</h3>
                        </div>
                    </div>
                    <div className="stats-box">
                        <a href="./O_orphan"><i className='bx bxs-report'></i></a>
                        <div>
                            <p>Orphans</p>
                            <h3>{totalOrphans}</h3>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="info-section">
                    {/* Inbox */}
                    <div className="info-box">
                        <h2>Inbox</h2>
                        <input type="text" placeholder="Search..." className="search-input" />
                        <div className="chat-preview-list" id="chat-content">
                            {/* dynamically loaded chats */}
                        </div>
                        <div className="inbox-footer">
                            <p>Previous chats</p>
                        </div>
                    </div>

                    {/* Adoption Requests */}
                    <div className="info-box">
                        <a href="./O_adoption" style={{ textDecoration: 'none' }}>
                            <h2 className="info-box-heading">Adoption Requests</h2>
                        </a>
                        <table className="info-table">
                            <thead className="table-head">
                                <tr>
                                    <th>Requested by</th>
                                    <th>Requested for</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
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
                                            <p className={item.status === 'Approved' ? 'status-done' : 'status-pending'}>
                                                {item.status}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Donation Requests */}
                    <div className="info-box">
                        <a href="./O_donation" style={{ textDecoration: 'none' }}>
                            <h2 className="info-box-heading">Donation Records</h2>
                        </a>
                        <ul className="donation-list">
                            {donationRequests.map((item, index) => (
                                <li key={index} className={item.receiver_type === 'organization' ? 'completed' : 'not-completed'}>
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

                <div className="chatbox hidden"></div>
            </div>

            <Footer />
        </div>
    );
};

export default OrganizationProfile;