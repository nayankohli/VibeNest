import React, { useState, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

function NotificationSettings() {
  const [settings, setSettings] = useState({
    likesAndComments: true,
    replyToMyComments: true,
    subscriptions: false,
    birthdays: false,
    events: true,
    emailNotifications: false,
    pushNotifications: true,
    weeklySummary: false
  });
  
  const { isDarkMode } = useContext(ThemeContext);

  const toggleSetting = (key) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: !prevSettings[key],
    }));
  };

  // Label mapping for more readable setting names
  const settingLabels = {
    likesAndComments: "Likes and Comments",
    replyToMyComments: "Reply to My Comments",
    subscriptions: "Subscriptions",
    birthdays: "Birthdays",
    events: "Events",
    emailNotifications: "Email Notifications",
    pushNotifications: "Push Notifications",
    weeklySummary: "Weekly Summary"
  };

  return (
    <div className={`p-6 rounded-lg shadow-sm ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
      <h2 className={`text-2xl font-bold mb-1 ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Notification Settings</h2>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"} mb-6`}>
        Manage your notification preferences below.
      </p>

      <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
          <div key={key} className={`flex justify-between items-center py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div>
              <span className="font-medium">
                {settingLabels[key] || key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                {getSettingDescription(key)}
              </p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={value}
                onChange={() => toggleSetting(key)}
              />
              <div className={`
                w-12 h-6 rounded-full 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:rounded-full after:h-5 after:w-5 
                after:transition-all after:duration-300 
                ${value ? "after:translate-x-6 bg-green-500" : `${isDarkMode ? "bg-gray-600" : "bg-gray-300"}`}
                ${isDarkMode ? "border border-gray-600" : ""}
                peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300
              `}></div>
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
        <button className={`px-4 py-2 rounded font-medium ${
          isDarkMode 
            ? "bg-green-600 hover:bg-green-700 text-white" 
            : "bg-green-500 hover:bg-green-600 text-white"
        } transition-colors duration-200`}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

// Helper function to get descriptions for settings
function getSettingDescription(key) {
  const descriptions = {
    likesAndComments: "Receive notifications when someone likes or comments on your posts",
    replyToMyComments: "Get notified when someone replies to your comments",
    subscriptions: "Notifications about channels and people you subscribe to",
    birthdays: "Birthday reminders for your contacts",
    events: "Updates about events you're interested in",
    emailNotifications: "Receive notifications via email",
    pushNotifications: "Get notifications on your device",
    weeklySummary: "Weekly digest of your activity"
  };
  
  return descriptions[key] || "";
}

export default NotificationSettings;