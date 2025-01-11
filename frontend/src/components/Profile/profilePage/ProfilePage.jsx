import React, { useState, useEffect } from 'react';
import ProfileNavBar from '../navbar/ProfileNavBar';
import ProfileContent from '../content/ProfileContent';
import Navbar from '../../NavBarMainScreen/Navbar';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

function ProfilePage() {
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const [activeTab, setActiveTab] = useState('posts');

    if(userInfo.profileImage==" "||userInfo.profileImage==null){
        userInfo.profileImage='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
    }
    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        }
    }, [navigate, userInfo]);

    const handleEditClick = () => {
        if (userInfo) navigate(`/edit-profile`);
    };

    return (
        <div className="main">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="profile-page">
                <div className="profile-banner">
                    <img 
                        src={"http://localhost:5000"+userInfo.banner || '/default-banner.jpg'} 
                        alt="Banner" 
                        className="banner-photo" 
                    />
                </div>
                <div className="profile-info-container">
                    <img 
                        src={"http://localhost:5000"+userInfo.profileImage} 
                        alt="Profile" 
                        className="profile-photo" 
                    />
                    <div className="profile-details">
                        <h2>{userInfo.name || 'Anonymous User'}</h2>
                        <div className="stats">
                            <span>Followers: {userInfo.followers.length }</span> | <span>Posts: {userInfo.posts.length}</span>
                        </div>
                        <p className="profile-bio">{userInfo.bio || 'No bio available.'}</p>
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
