import React, { useState } from "react";
import EditProfile from "../../Profile/editProfile/EditProfile";
import Navbar from "../Navbar";
function Settings() {
    const [activeTab, setActiveTab] = useState("account");

    return (
        <div className="relative">
    {/* Navbar (Always at the Top) */}
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar />
    </div>

    {/* Sidebar & Content Wrapper */}
    <div className="flex flex-col md:flex-row pt-16 p-6 mt-6 px-20">

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">Settings</h2>
            <ul className="space-y-2">
                <li 
                    className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                        activeTab === "account" ? "bg-green-200" : "hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("account")}
                >
                    <i className="fas fa-user mr-3"></i> Account
                </li>
                <li 
                    className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                        activeTab === "privacy" ? "bg-green-200" : "hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("privacy")}
                >
                    <i className="fas fa-lock mr-3"></i> Privacy & Security
                </li>
                <li 
                    className={`cursor-pointer p-3 rounded-lg transition-all flex items-center ${
                        activeTab === "notifications" ? "bg-green-200 text-white" : "hover:bg-green-100"
                    }`}
                    onClick={() => setActiveTab("notifications")}
                >
                    <i className="fas fa-bell mr-3"></i> Notifications
                </li>
            </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 bg-white shadow-lg rounded-lg mt-6 md:mt-0 md:ml-6">
            {activeTab === "account" && <EditProfile />}
            {activeTab === "privacy" && (
                <div>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Privacy Settings</h2>
                    <p className="text-gray-600">Manage your privacy settings here...</p>
                </div>
            )}
            {activeTab === "notifications" && (
                <div>
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Notification Settings</h2>
                    <p className="text-gray-600">Manage your notification preferences...</p>
                </div>
            )}
        </div>
    </div>
</div>


    );
}

export default Settings;
