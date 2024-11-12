import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faBell, faGears } from '@fortawesome/free-solid-svg-icons';
import './css/Navbar.css'; // Assuming your styles are in a Navbar.css file

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const newSocket = io('http://localhost:5000'); // Replace with your server URL if needed
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/logout');
            localStorage.removeItem('token');
            navigate('/login');
            if (socket) socket.disconnect(); // Disconnect the socket on logout
        } catch (error) {
            console.error('Logout failed:', error);
            alert('Failed to logout');
        }
    };
    const handleViewProfile = () => {
        navigate('/profile');
    };
    return (
        <div className="navbar">
            <div className="logo">
                <img src="http://localhost:3000/pictures/logo-no-background.png" alt="logo" />
            </div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." />
            </div>
            <div className="nav-options">
                <button><FontAwesomeIcon icon={faMessage} /></button>
                <button><FontAwesomeIcon icon={faBell} /></button>
                <button><FontAwesomeIcon icon={faGears} /></button>
            </div>
            <div className="account">
                <button onClick={toggleDropdown}>Account</button>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <ul>
                            <li onClick={handleViewProfile}>View Profile</li>
                            <li>Your Saved</li>
                            <li>Settings</li>
                            <li>Security & Privacy</li>
                            <li onClick={handleLogout}>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
