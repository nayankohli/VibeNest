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
        if (user) navigate(`/edit-profile?userId=${user.userId}`);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="profile-page">
                <div className="profile-banner">
                    <img src={user.bannerPhoto || '/default-banner.jpg'} alt="Banner" className="banner-photo" />
                </div>
                <div className="profile-info-container">
                    <img src={user.profilePhoto || '/default-profile.jpg'} alt="Profile" className="profile-photo" />
                    <div className="profile-details">
                        <h2>{user.username}</h2>
                        <div className="stats">
                            <span>Connections: {user.connections || 0}</span> | <span>Posts: {user.posts || 0}</span>
                        </div>
                        <p className="profile-bio">{user.bio || 'No bio available.'}</p>
                    </div>
                    <button className="edit-profile-btn" onClick={handleEditClick}>
                        Edit Profile
                    </button>
                </div>
                <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
                <ProfileContent activeTab={activeTab} />
            </div>
        </div>
    );
}

export default ProfilePage;
