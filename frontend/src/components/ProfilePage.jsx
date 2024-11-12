import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileNavBar from './ProfileNavBar';
import ProfileContent from './ProfileContent';
import { useUser } from './UserContext';
import Navbar from './Navbar'; 
import './css/ProfilePage.css';

function ProfilePage() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('posts');
    const navigate = useNavigate(); 
    const handleEditClick = () => {
        navigate('/edit-profile'); // Navigate to the EditProfile page
    };

    return (
        <div className="main">
            <div className="navbar-container">
                    <Navbar /> {/* Navbar grid item */}
                </div>
                <div className="profile-page">
            {/* Banner Section */}
            <div className="profile-banner">
                <img src={user.bannerPhoto} alt="Banner" className="banner-photo" />
            </div>
            
            {/* Profile Info Section */}
            <div className="profile-info-container">
            <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
                <div className="profile-details">
                    <h2>{user.username}</h2>
                    <div className="stats">
                        <span>Connections: {user.connections}</span> | <span>Posts: {user.posts}</span>
                    </div>
                    <p className="profile-bio">{user.bio}</p>
                </div>
                <button className="edit-profile-btn" onClick={handleEditClick}>Edit Profile</button>
            </div>

            {/* Profile Nav Bar */}
            <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content based on selected tab */}
            <ProfileContent activeTab={activeTab} />
        </div>
        </div>
    );
}

export default ProfilePage;
