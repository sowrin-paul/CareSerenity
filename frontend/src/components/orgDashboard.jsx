import { React, useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router-dom';

const UserDashboard = () => {
    const [username, setUsername] = useState('');
    const {userId} = useParams();

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}`);
                setUsername(response.data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, [userId]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome to {username || 'User'} Dashboard</h1>
            <p>Hello, {username || 'User'}! Here is your dashboard where you can manage your account and view your activities.</p>

            <div style={{ marginTop: '20px' }}>
                <h2>Quick Links</h2>
                <ul>
                    <li><a href="/profile">View Profile</a></li>
                    <li><a href="/settings">Account Settings</a></li>
                    <li><a href="/activities">Your Activities</a></li>
                    <li><a href="/logout">Logout</a></li>
                </ul>
            </div>
        </div>
    );
};

export default UserDashboard;