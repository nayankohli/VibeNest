import React, { useState, useEffect, useContext } from 'react';
import Loading from "../../Loading";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, resetUserUpdate } from "../../../actions/UserActions";
import { ThemeContext } from "../../../context/ThemeContext"; // Import ThemeContext

function EditProfilePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode } = useContext(ThemeContext); // Access the theme context

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading, error, success } = userUpdate;

    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [dob, setDob] = useState('');
    const [location, setLocation] = useState('');
    const [gender, setGender] = useState('');
    const [jobProfile, setJobProfile] = useState('');

    const [bannerPreview, setBannerPreview] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
        } else {
            setName(userInfo.name || '');
            setBio(userInfo.bio || '');
            setDob(userInfo.dob ? userInfo.dob.split('T')[0] : '');
            setLocation(userInfo.location || '');
            setGender(userInfo.gender || '');
            setJobProfile(userInfo.jobProfile || '');
            setBannerPreview(userInfo.banner || null);
            setProfilePreview(userInfo.profileImage || null);
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (success) {
            alert("Profile updated successfully");
            navigate("/profile/" + userInfo._id);
            dispatch(resetUserUpdate()); 
        }
    }, [success, navigate, dispatch, userInfo]);

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
        formData.append('userId', userInfo._id); 
        if (bannerPhoto) formData.append('banner', bannerPhoto);
        if (profilePhoto) formData.append('profileImage', profilePhoto);
        formData.append('name', name);
        formData.append('bio', bio);
        formData.append('dob', dob);
        formData.append('location', location);
        formData.append('gender', gender);
        formData.append('jobProfile', jobProfile);

        dispatch(updateProfile(formData));
    };

    // Prepare theme-dependent classes
    const containerClass = isDarkMode 
        ? "container mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md" 
        : "container mx-auto p-6 bg-white rounded-lg ";
    
    const inputClass = isDarkMode
        ? "w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md outline-none focus:ring-2 focus:ring-green-500"
        : "w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-green-500";
    
    const fileInputClass = isDarkMode
        ? "block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-500"
        : "block w-full text-sm text-gray-600 border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-green-500";
    
    const labelClass = isDarkMode
        ? "font-semibold text-gray-200"
        : "font-semibold text-gray-700";
    
    const buttonClass = isDarkMode
        ? "w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded-md"
        : "w-full bg-green-300 hover:bg-green-400 font-bold py-2 rounded-md";

    return (
        <div className={containerClass}>
            {loading && <Loading />}
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Edit Profile</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {loading && <div className="loading"></div>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="bannerPhoto" className={labelClass}>Banner Photo</label>
                        <input 
                            type="file" 
                            id="bannerPhoto" 
                            accept="image/jpeg, image/png" 
                            onChange={handleBannerPhotoChange} 
                            className={fileInputClass} 
                        />
                        {bannerPreview && (
                            <div className={`mt-2 ${isDarkMode ? "border border-gray-600" : ""} rounded-md`}>
                                <img 
                                    src={bannerPreview.startsWith("http") ? bannerPreview : `http://localhost:5000${bannerPreview}`}
                                    alt="Banner preview" 
                                    className="w-full max-h-40 object-cover rounded-md" 
                                />
                            </div>
                        )}
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="profilePhoto" className={labelClass}>Profile Photo</label>
                        <input 
                            type="file" 
                            id="profilePhoto" 
                            accept="image/jpeg, image/png" 
                            onChange={handleProfilePhotoChange} 
                            className={fileInputClass} 
                        />
                        {profilePreview && (
                            <div className="mt-2">
                                <img 
                                    src={profilePreview.startsWith("http") ? profilePreview : `http://localhost:5000${profilePreview}`}
                                    alt="Profile preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" 
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/3">
                        <label htmlFor="name" className={labelClass}>Name</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className={inputClass} 
                        />
                    </div>
                    <div className="w-1/3">
                        <label htmlFor="dob" className={labelClass}>Date of Birth</label>
                        <input 
                            type="date" 
                            id="dob" 
                            value={dob} 
                            onChange={(e) => setDob(e.target.value)} 
                            className={inputClass} 
                        />
                    </div>
                    <div className="w-1/3">
                        <label htmlFor="gender" className={labelClass}>Gender</label>
                        <select 
                            id="gender" 
                            value={gender} 
                            onChange={(e) => setGender(e.target.value)} 
                            className={inputClass}
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="location" className={labelClass}>Location</label>
                        <input 
                            type="text" 
                            id="location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            className={inputClass} 
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="jobProfile" className={labelClass}>Job Profile</label>
                        <input 
                            type="text" 
                            id="jobProfile" 
                            value={jobProfile} 
                            onChange={(e) => setJobProfile(e.target.value)} 
                            className={inputClass} 
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="bio" className={labelClass}>Bio</label>
                    <textarea 
                        id="bio" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        rows="4" 
                        className={inputClass}
                    ></textarea>
                </div>
                <button type="submit" className={buttonClass}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfilePage;