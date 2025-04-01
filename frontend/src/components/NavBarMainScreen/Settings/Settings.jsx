import React, { useState, useContext } from "react";
import EditProfile from "../../Profile/editProfile/EditProfile";
import Navbar from "../Navbar";
import { ThemeContext } from "../../../context/ThemeContext";
import NotificationSettings from "./NotificationSetting";
import PrivacySecuritySettings from "./PrivacySecuritySettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function Settings() {
    const [activeTab, setActiveTab] = useState("account");
    const { isDarkMode } = useContext(ThemeContext);
    const [showMobileMenu, setShowMobileMenu] = useState(true);

    // Function to handle tab change on mobile
    const handleMobileTabClick = (tab) => {
        setActiveTab(tab);
        setShowMobileMenu(false);
    };

    // Function to go back to mobile menu
    const handleBackToMenu = () => {
        setShowMobileMenu(true);
    };

    return (
        <div className={` ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-100'} min-h-screen`}>
            {/* Navbar (Always at the Top) */}
            <div className={`fixed top-0 left-0 w-full z-50 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Navbar />
            </div>

            {/* Mobile View (Two-Step Navigation) */}
            <div className="md:hidden items-center  py-20 px-1 ">
                {showMobileMenu ? (
                    // Step 1: Mobile Menu
                    <div className={`w-full shadow-lg rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                            <FontAwesomeIcon icon={faGears} className="mr-3" /> Settings
                        </h2>
                        <div className="flex flex-col gap-2">
                            <div
                                className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100"
                                }`}
                                onClick={() => handleMobileTabClick("account")}
                            >
                                <i className="fas fa-user mr-3"></i> Account
                            </div>
                            <div 
                                className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100"
                                }`}
                                onClick={() => handleMobileTabClick("privacy")}
                            >
                                <i className="fas fa-lock mr-3"></i> Privacy & Security
                            </div>
                            <div 
                                className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100"
                                }`}
                                onClick={() => handleMobileTabClick("notifications")}
                            >
                                <i className="fas fa-bell mr-3"></i> Notifications
                            </div>
                        </div>
                    </div>
                ) : (
                    // Step 2: Mobile Content View with Back Button
                    <div className={`w-full shadow-lg rounded-lg p-6 mb-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>

                        <div>
                            {activeTab === "account" && <EditProfile handleBackToMenu={handleBackToMenu} />}
                            {activeTab === "privacy" && <PrivacySecuritySettings handleBackToMenu={handleBackToMenu} />}
                            {activeTab === "notifications" && <NotificationSettings handleBackToMenu={handleBackToMenu} />}
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop View (Original Layout) */}
            <div className="hidden md:flex pt-16 p-6 mt-6 px-20">
                {/* Sidebar - Added self-start, h-fit, and sticky classes */}
                <div className={`w-1/4 shadow-lg rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} self-start sticky top-20 h-fit`}>
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                        <FontAwesomeIcon icon={faGears} className="mr-3" /> Settings
                    </h2>
                    <div className="flex flex-col gap-2">
                        <div
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                activeTab === "account" ? (isDarkMode ? "bg-green-700" : "bg-green-200") : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100")
                            }`}
                            onClick={() => setActiveTab("account")}
                        >
                            <i className="fas fa-user mr-3"></i> Account
                        </div>
                        <div 
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                activeTab === "privacy" ? (isDarkMode ? "bg-green-700" : "bg-green-200") : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100")
                            }`}
                            onClick={() => setActiveTab("privacy")}
                        >
                            <i className="fas fa-lock mr-3"></i> Privacy & Security
                        </div>
                        <div 
                            className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                                activeTab === "notifications" ? (isDarkMode ? "bg-green-700 text-white" : "bg-green-200 ") : (isDarkMode ? "hover:bg-gray-700" : "hover:bg-green-100")
                            }`}
                            onClick={() => setActiveTab("notifications")}
                        >
                            <i className="fas fa-bell mr-3"></i> Notifications
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`w-3/4 shadow-lg rounded-lg mt-0 ml-6 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {activeTab === "account" && <EditProfile />}
                    {activeTab === "privacy" && <PrivacySecuritySettings />}
                    {activeTab === "notifications" && <NotificationSettings />}
                </div>
            </div>
        </div>
    );
}

export default Settings;