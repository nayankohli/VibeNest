import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "../../actions/UserActions"; // Update this path as needed

function ChatNotifications({ notification, setNotification, userInfo, setSelectedChat, getSender, isNotifiDropdownOpen, setIsNotifiDropdownOpen, isDarkMode}) {
  const dispatch = useDispatch();
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const handleNotificationClick = (notifi) => {
    setSelectedChat(notifi.chat);
    if (!notifi.chat.isGroupChat) {
      dispatch(
        setSelectedUser(
          getSender(userInfo, notifi.chat.participants)
        )
      );
    }
    setNotification(
      Array.isArray(notification)
        ? notification.filter((n) => n !== notifi)
        : []
    );
    setIsNotifiDropdownOpen(!isNotifiDropdownOpen);
  };

  const clearAllNotifications = () => {
    setNotification([]);
  };

  return (
    <div className={`shadow-lg rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      {notification && notification.length > 0 && (
        <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium px-1">Notifications</h3>
          <button 
            onClick={clearAllNotifications}
            className={`text-xs px-2 py-1 rounded ${
              isDarkMode 
                ? 'bg-red-900 text-red-200 hover:bg-red-800' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            } transition-colors duration-200`}
          >
            Clear All
          </button>
        </div>
      )}
      
      {notification && notification.length ? (
        <div className="max-h-80 overflow-y-auto p-2">
          {notification.map((notifi) => (
            <div
              key={notifi._id}
              onClick={() => handleNotificationClick(notifi)}
              className={`p-3 mb-2 rounded-lg cursor-pointer flex items-center hover:bg-${isDarkMode ? "gray-700" : "gray-100"} transition-colors duration-200`}
            >
              {!notifi.chat.isGroupChat ? (
                <img
                  src={getSender(userInfo, notifi.chat.participants)?.profileImage 
                    ? `http://localhost:5000${getSender(userInfo, notifi.chat.participants).profileImage}`
                    : defaultProfileImage}
                  alt={getSender(userInfo, notifi.chat.participants)?.name || "User"}
                  className="w-10 h-10 rounded-full object-cover border border-blue-500 mr-3"
                />
              ) : (
                <img
                  src={notifi.chat.profileImage 
                    ? `http://localhost:5000${notifi.chat.profileImage}` 
                    : defaultProfileImage}
                  alt={notifi.chat.chatName || "Group"}
                  className="w-10 h-10 rounded-full object-cover border border-blue-500 mr-3"
                />
              )}
              
              <div className="flex-1">
                <div className="font-semibold">
                  {notifi.chat.isGroupChat
                    ? `New message in ${notifi.chat.chatName}`
                    : `New message from ${getSender(userInfo, notifi.chat.participants)?.name || "User"}`}
                </div>
                
                {notifi.content && (
                  <div className="text-xs mt-1 opacity-80">
                    {notifi.content.length > 30
                      ? notifi.content.substring(0, 30) + "..."
                      : notifi.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center">
          <div className="flex flex-col items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-12 w-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-3`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
              />
            </svg>
            <p className="font-medium">No notifications to show</p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              You're all caught up!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatNotifications;