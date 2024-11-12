import React, { useState } from 'react';
import './css/EditProfile.css';

function EditProfilePage() {
    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');

    const handleBannerPhotoChange = (e) => setBannerPhoto(URL.createObjectURL(e.target.files[0]));
    const handleProfilePhotoChange = (e) => setProfilePhoto(URL.createObjectURL(e.target.files[0]));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle form submission
        console.log('Updated profile details:', { username, bio, bannerPhoto, profilePhoto });
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                {/* Banner Photo */}
                <div className="form-group">
                    <label htmlFor="bannerPhoto">Banner Photo</label>
                    <input type="file" id="bannerPhoto" accept="image/*" onChange={handleBannerPhotoChange} />
                    {bannerPhoto && <img src={bannerPhoto} alt="Banner Preview" className="banner-preview" />}
                </div>

                {/* Profile Photo */}
                <div className="form-group">
                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input type="file" id="profilePhoto" accept="image/*" onChange={handleProfilePhotoChange} />
                    {profilePhoto && <img src={profilePhoto} alt="Profile Preview" className="profile-preview" />}
                </div>

                {/* Username */}
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

                {/* Bio */}
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

                {/* Submit Button */}
                <button type="submit" className="save-button">Save Changes</button>
            </form>
        </div>
    );
}

export default EditProfilePage;
