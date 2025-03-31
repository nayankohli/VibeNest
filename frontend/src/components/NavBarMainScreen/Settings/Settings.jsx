import React, { useState, useContext } from "react";
import EditProfile from "../../Profile/editProfile/EditProfile";
import Navbar from "../Navbar";
import { ThemeContext } from "../../../context/ThemeContext";
import NotificationSettings from "./NotificationSetting";
import PrivacySecuritySettings from "./PrivacySecuritySettings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGears } from "@fortawesome/free-solid-svg-icons";
function Settings() {
    const [activeTab, setActiveTab] = useState("account");
    const { isDarkMode } = useContext(ThemeContext);

    return (
        <div className={` ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-green-100'} min-h-screen`}>
            {/* Navbar (Always at the Top) */}
            <div className={`fixed top-0 left-0 w-full z-50 shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <Navbar />
            </div>

            {/* Sidebar & Content Wrapper */}
            <div className="flex  pt-16 p-6 mt-6 px-20">

                {/* Sidebar - Added self-start, h-fit, and sticky classes */}
                <div className={`w-full md:w-1/4 shadow-lg rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} self-start sticky top-20 h-fit`}>
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-green-400" : "text-green-600"}`}><FontAwesomeIcon icon={faGears} className="mr-3" /> Settings</h2>
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
                <div className={`w-full md:w-3/4 shadow-lg rounded-lg mt-6 md:mt-0 md:ml-6 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    {activeTab === "account" && <EditProfile />}
                    {activeTab === "privacy" && (
                        <PrivacySecuritySettings/>
                    )}
                    {activeTab === "notifications" && (
                        <NotificationSettings/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;