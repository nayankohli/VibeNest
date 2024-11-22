import React from 'react';
import {useSelector } from "react-redux";
import './css/ProfileContent.css';

function ProfileContent({ activeTab }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin; // Access the user data from context

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <div>Displaying {userInfo.username}'s posts...</div>;
            case 'about':
                return <div>About {userInfo.username}: {userInfo.bio}</div>;
            case 'connections':
                return <div>{userInfo.username}'s connections: {userInfo.connections}</div>;
            case 'media':
                return <div>Media shared by {userInfo.username}...</div>;
            case 'videos':
                return <div>{userInfo.username}'s videos...</div>;
            default:
                return <div>Loading...</div>;
        }
    };

    return (
        <div className="profile-content">
            {renderContent()}
        </div>
    );
}

export default ProfileContent;
