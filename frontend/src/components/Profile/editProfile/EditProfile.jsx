import React, { useState, useEffect } from 'react';
import Loading from "../../Loading";
import './EditProfile.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../actions/UserActions";

function EditProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading, error, success } = userUpdate;

    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');

    const [bannerPreview, setBannerPreview] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setBannerPreview(userInfo.banner || null);
            setProfilePreview(userInfo.profileImage || null);
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (success) {
            alert("Profile updated successfully");
            navigate("/profile");
        }
    }, [success, navigate]);

    useEffect(() => {
        return () => {
            if (bannerPreview) URL.revokeObjectURL(bannerPreview);
            if (profilePreview) URL.revokeObjectURL(profilePreview);
        };
    }, [bannerPreview, profilePreview]);

    const handleBannerPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerPhoto(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setProfilePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('userId', userInfo._id); // Backend should expect `userId`
        if (bannerPhoto) formData.append('banner', bannerPhoto);
        if (profilePhoto) formData.append('profileImage', profilePhoto);
        formData.append('name', name);
        formData.append('bio', bio);

        dispatch(updateProfile(formData));
    };

    return (
        <div className="edit-profile-page">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                {loading && <Loading />}
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                    <label htmlFor="bannerPhoto">Banner Photo</label>
                    <input
                        type="file"
                        id="bannerPhoto"
                        accept="image/jpeg, image/png"
                        onChange={handleBannerPhotoChange}
                    />
                    {bannerPreview && (
                        <img src={bannerPreview} alt="Banner Preview" className="preview-image" />
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input
                        type="file"
                        id="profilePhoto"
                        accept="image/jpeg, image/png"
                        onChange={handleProfilePhotoChange}
                    />
                    {profilePreview && (
                        <img src={profilePreview} alt="Profile Preview" className="preview-image" />
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
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
