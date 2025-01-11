import React from 'react';
import {useSelector } from "react-redux";
import './ProfileContent.css';
import DisplayPosts from '../displayPosts/DisplayPosts';
function ProfileContent({ activeTab }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin; // Access the user data from context

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <DisplayPosts/>;
            case 'about':
                return <div> {userInfo.bio}</div>;
            case 'followers':
                return <div> {userInfo.followers}</div>;
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
