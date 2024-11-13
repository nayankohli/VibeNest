import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './css/EditProfile.css';

function EditProfilePage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId'); // Get userId from query string

    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/api/profile/${userId}`);
                const { username, bio } = response.data;
                setUsername(username);
                setBio(bio);
            } catch (error) {
                console.error('Error fetching profile data:', error.response?.data || error.message);
            }
        };
        if (userId) fetchProfileData();
    }, [userId]);

    const handleBannerPhotoChange = (e) => setBannerPhoto(e.target.files[0]);
    const handleProfilePhotoChange = (e) => setProfilePhoto(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('bannerPhoto', bannerPhoto);
        formData.append('profilePhoto', profilePhoto);
        formData.append('username', username);
        formData.append('bio', bio);

        try {
            const response = await axios.post('/api/edit-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating profile:', error.response?.data || error.message);
        }
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <div className="form-group">
                    <label htmlFor="bannerPhoto">Banner Photo</label>
                    <input type="file" id="bannerPhoto" accept="image/jpeg, image/png" onChange={handleBannerPhotoChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input type="file" id="profilePhoto" accept="image/jpeg, image/png" onChange={handleProfilePhotoChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself"
                        rows="4"
                    />
                </div>
                <button type="submit" className="save-button">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProfilePage;
