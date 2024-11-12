import React from 'react';
import { useUser } from './UserContext';
import './css/ProfileContent.css';

function ProfileContent({ activeTab }) {
    const { user } = useUser();  // Access the user data from context

    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return <div>Displaying {user.username}'s posts...</div>;
            case 'about':
                return <div>About {user.username}: {user.bio}</div>;
            case 'connections':
                return <div>{user.username}'s connections: {user.connections}</div>;
            case 'media':
                return <div>Media shared by {user.username}...</div>;
            case 'videos':
                return <div>{user.username}'s videos...</div>;
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
