import { useContext } from "react";
import { FaPhone, FaVideo, FaEllipsisV, FaUserFriends, FaArrowLeft } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import API_CONFIG from "../../config/api-config";

function ChatHeader({ selectedUser, selectedChat, isMobile, handleBackToSidebar }) {
  const { isDarkMode } = useContext(ThemeContext);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  if (selectedChat?.isGroupChat) {
    return (
      <div className={`flex items-center justify-between p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {isMobile && (
          <button 
            onClick={handleBackToSidebar}
            className={`mr-2 p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } transition-colors duration-200`}
          >
            <FaArrowLeft />
          </button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 flex-grow min-w-0">
          <div className="flex items-center flex-shrink-0">
            <div className="rounded-full border-2 border-green-500 p-0.5">
              <img
                src={selectedChat?.profileImage ? selectedChat.profileImage : defaultProfileImage}
                alt="Group"
                className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-full"
              />
            </div>
            <div className="bg-green-500 p-1 rounded-full border-2 border-white flex items-center justify-center -ml-3 sm:-ml-5 mt-6 sm:mt-[35px]">
              <FaUserFriends className="text-white text-xs sm:text-sm" />
            </div>
          </div>

          <div className="min-w-0 flex-grow">
            <h2 className={`font-bold text-base sm:text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedChat.chatName}
            </h2>
            <div className={`flex flex-wrap gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
              {selectedChat.participants.map((user, index) => (
                <span key={user._id} className="inline-block">
                  {user.username}
                  {index !== selectedChat.participants.length - 1 && ","}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-3 flex-shrink-0">
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-green-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-green-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaPhone className="text-lg sm:text-xl" />
          </button>
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-blue-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-blue-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaVideo className="text-lg sm:text-xl" />
          </button>
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaEllipsisV className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex items-center justify-between p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        {isMobile && (
          <button 
            onClick={handleBackToSidebar}
            className={`mr-2 p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            } transition-colors duration-200`}
          >
            <FaArrowLeft />
          </button>
        )}
        
        <div className="flex items-center gap-2 sm:gap-3 flex-grow min-w-0">
          <div className="relative flex-shrink-0">
            <div className={`rounded-full border-2 ${selectedUser?.active ? 'border-green-500' : 'border-gray-400'} p-0.5`}>
              <img
                src={selectedUser?.profileImage ? selectedUser.profileImage : defaultProfileImage}
                alt="User"
                className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-full"
              />
            </div>
            {selectedUser?.active && (
              <div className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="min-w-0 flex-grow">
            <h2 className={`font-bold text-base sm:text-lg truncate ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedUser?.name}
            </h2>
            <div className="flex items-center">
              {selectedUser?.active ? (
                <span className="text-green-500 text-xs sm:text-sm flex items-center truncate">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
                  Online
                </span>
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm flex items-center truncate">
                  <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-500 rounded-full mr-1 sm:mr-2"></span>
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 sm:gap-3 flex-shrink-0">
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-green-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-green-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaPhone className="text-lg sm:text-xl" />
          </button>
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-blue-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-blue-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaVideo className="text-lg sm:text-xl" />
          </button>
          <button className={`rounded-full p-2 sm:p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaEllipsisV className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    );
  }
}

export default ChatHeader;