import React from 'react';
import './ProfileNavBar.css';

function ProfileNavBar({ activeTab, setActiveTab }) {
    return (
        <div className="profile-nav-bar">
            {['posts', 'about', 'followers', 'media', 'videos'].map(tab => (
                <button
                    key={tab}
                    className={`nav-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}  // Set activeTab on click
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default ProfileNavBar;

