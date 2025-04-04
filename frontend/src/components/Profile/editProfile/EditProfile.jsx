import React, { useState, useEffect, useContext } from 'react';
import Loading from "../../Loaders/Loading";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, resetUserUpdate } from "../../../actions/UserActions";
import { ThemeContext } from "../../../context/ThemeContext";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import API_CONFIG from '../../../config/api-config';

function EditProfilePage({handleBackToMenu}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isDarkMode } = useContext(ThemeContext);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading, error, success } = userUpdate;

    const [bannerPhoto, setBannerPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [username, setUsername] = useState('');
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
            setUsername(userInfo.username || '');
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
            toast.success("Profile Updated Successfully!", {
                style: {
                  background: isDarkMode 
                  ? "" 
                  : "black",
                  color:isDarkMode 
                  ? "black" 
                  : "white",
                  fontWeight: "bold",
                  padding: "14px 20px",
                  boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
                  borderRadius: "12px",
                  border: "2px solid #38bdf8",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  transition: "transform 0.3s ease-in-out",
                },
                position: "top-center",
                duration: 3000,
            });
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
        formData.append('username', username);
        formData.append('name', name);
        formData.append('bio', bio);
        formData.append('dob', dob);
        formData.append('location', location);
        formData.append('gender', gender);
        formData.append('jobProfile', jobProfile);

        dispatch(updateProfile(formData));
    };

    // Enhanced theme-dependent classes with improved responsiveness
    const containerClass = isDarkMode 
        ? "container mx-auto p-1 lg:p-4 bg-gray-800 text-white rounded-xl w-full max-w-6xl" 
        : "container mx-auto p-1 lg:p-4 bg-white rounded-xl w-full max-w-6xl";
    
    const inputClass = isDarkMode
        ? "w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 text-white rounded-lg outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        : "w-full p-2 sm:p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition duration-200";
    
    const buttonClass = isDarkMode
        ? "w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
        : "w-full bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 sm:py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1";
    
    const sectionClass = isDarkMode
        ? "mb-4 sm:mb-6 bg-gray-700 p-4 sm:p-6 rounded-lg shadow-md"
        : "mb-4 sm:mb-6 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm";

    const headingClass = isDarkMode
        ? " flex text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-400 border-b border-gray-700 pb-3"
        : "text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-green-600 border-b border-gray-200 pb-3";
    
    const labelClass = isDarkMode
        ? "font-semibold text-gray-200 mb-1 block text-sm sm:text-base"
        : "font-semibold text-gray-700 mb-1 block text-sm sm:text-base";

    return (
        <div className={containerClass}>
            {loading && <Loading />}
            <h2 className={headingClass}><div
                      className={`cursor-pointer block lg:hidden p-1 -ml-4 mr-4 rounded-full ${
                        isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-green-100"
                      }`}
                      onClick={() => handleBackToMenu()}
                    >
                      <FontAwesomeIcon icon={faArrowLeft}  />
                    </div><i className="fas fa-pen-to-square mr-2 sm:mr-3"></i>Edit Profile</h2>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {loading && <div className="loading"></div>}
                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 mb-4 sm:mb-6 rounded-md" role="alert">
                    <p>{error}</p>
                </div>}
                
                {/* Media Section */}
                <div className={sectionClass}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? "text-green-300" : "text-green-600"}`}>Profile Media</h3>
                    <div className="flex flex-col space-y-4 sm:space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                        {/* Banner Photo */}
                        <div className="w-full md:w-1/2">
                            <label className={labelClass}>Banner Photo</label>
                            
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                id="bannerPhoto" 
                                accept="image/jpeg, image/png" 
                                onChange={handleBannerPhotoChange}
                                className="hidden" 
                            />
                            
                            {/* Banner Preview - MODIFIED FOR BETTER HOVER EXPERIENCE & RESPONSIVENESS */}
                            <div className={`mt-2 relative rounded-lg overflow-hidden group ${bannerPreview ? 'h-28 sm:h-32 md:h-40' : 'h-24 sm:h-28 md:h-32 border-2 border-dashed flex items-center justify-center'} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                {bannerPreview ? (
                                    <>
                                        <img 
                                            src={bannerPreview.startsWith("http") ? bannerPreview : `${API_CONFIG.BASE_URL}${bannerPreview}`}
                                            alt="Banner preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center cursor-pointer">
                                            <label htmlFor="bannerPhoto" className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <label htmlFor="bannerPhoto" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 sm:h-10 sm:w-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1 sm:mb-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload banner image</span>
                                    </label>
                                )}
                            </div>
                        </div>
                        
                        {/* Profile Photo - MODIFIED FOR BETTER HOVER EXPERIENCE & RESPONSIVENESS */}
                        <div className="w-full md:w-1/2">
                            <label className={labelClass}>Profile Photo</label>
                            
                            {/* Hidden File Input */}
                            <input 
                                type="file" 
                                id="profilePhoto" 
                                accept="image/jpeg, image/png" 
                                onChange={handleProfilePhotoChange}
                                className="hidden" 
                            />
                            
                            {/* Profile Preview */}
                            <div className="mt-2 flex justify-center">
                                <div className={`relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden group ${profilePreview ? '' : 'border-2 border-dashed flex items-center justify-center'} ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                    {profilePreview ? (
                                        <>
                                            <img 
                                                src={profilePreview.startsWith("http") ? profilePreview : `${API_CONFIG.BASE_URL}${profilePreview}`}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover" 
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center cursor-pointer">
                                                <label htmlFor="profilePhoto" className="p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label htmlFor="profilePhoto" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 sm:h-8 sm:w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Upload photo</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Personal Info Section */}
                <div className={sectionClass}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? "text-green-300" : "text-green-600"}`}>Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <label htmlFor="username" className={labelClass}>Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className={inputClass} 
                                placeholder="Your Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className={labelClass}>Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                className={inputClass} 
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label htmlFor="dob" className={labelClass}>Date of Birth</label>
                            <input 
                                type="date" 
                                id="dob" 
                                value={dob} 
                                onChange={(e) => setDob(e.target.value)} 
                                className={inputClass} 
                            />
                        </div>
                    </div>
                </div>
                
                {/* Location & Work Section */}
                <div className={sectionClass}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? "text-green-300" : "text-green-600"}`}>Additional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
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
                        <div>
                            <label htmlFor="location" className={labelClass}>Location</label>
                            <input 
                                type="text" 
                                id="location" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                className={inputClass} 
                                placeholder="City, Country"
                            />
                        </div>
                        <div>
                            <label htmlFor="jobProfile" className={labelClass}>Job Profile</label>
                            <input 
                                type="text" 
                                id="jobProfile" 
                                value={jobProfile} 
                                onChange={(e) => setJobProfile(e.target.value)} 
                                className={inputClass} 
                                placeholder="Your profession"
                            />
                        </div>
                    </div>
                </div>
                
                {/* Bio Section */}
                <div className={sectionClass}>
                    <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${isDarkMode ? "text-green-300" : "text-green-600"}`}>About You</h3>
                    <div>
                        <label htmlFor="bio" className={labelClass}>Bio</label>
                        <textarea 
                            id="bio" 
                            value={bio} 
                            onChange={(e) => setBio(e.target.value)} 
                            rows="3"
                            className={inputClass}
                            placeholder="Tell us about yourself..."
                        ></textarea>
                    </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-2 sm:pt-4">
                    <button type="submit" className={buttonClass}>
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProfilePage;