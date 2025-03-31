import { useContext } from "react";
import { FaPhone, FaVideo, FaEllipsisV, FaUserFriends } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

function ChatHeader({ selectedUser, selectedChat }) {
  const { isDarkMode } = useContext(ThemeContext);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  if (selectedChat?.isGroupChat) {
    return (
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className=" flex items-center gap-3">
        <div className="flex items-center">
  <div className="rounded-full border-2 border-green-500 p-0.5">
    <img
      src={selectedChat?.profileImage ? "http://localhost:5000" + selectedChat.profileImage : defaultProfileImage}
      alt="Group"
      className="w-12 h-12 object-cover rounded-full"
    />
  </div>
  <div className="bg-green-500  p-1 rounded-full border-2 border-white flex items-center justify-center -ml-5 mt-[35px]">
    <FaUserFriends className="text-white text-sm" />
  </div>
</div>

          <div>
            <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedChat.chatName}
            </h2>
            <div className={`flex flex-wrap gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedChat.participants.map((user, index) => (
                <span key={user._id} className="inline-block">
                  {user.username}
                  {index !== selectedChat.participants.length - 1 && ","}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-green-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-green-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaPhone className="text-xl" />
          </button>
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-blue-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-blue-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaVideo className="text-xl" />
          </button>
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaEllipsisV />
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} `}>
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className={`rounded-full border-2 ${selectedUser?.active ? 'border-green-500' : 'border-gray-400'} p-0.5`}>
              <img
                src={selectedUser?.profileImage ? "http://localhost:5000" + selectedUser.profileImage : defaultProfileImage}
                alt="User"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            {selectedUser?.active && (
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {selectedUser?.name}
            </h2>
            <div className="flex items-center">
              {selectedUser?.active ? (
                <span className="text-green-500 text-sm flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </span>
              ) : (
                <span className="text-gray-500 text-sm flex items-center">
                  <span className="h-2 w-2 bg-gray-500 rounded-full mr-2"></span>
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-green-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-green-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaPhone className="text-xl" />
          </button>
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-blue-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-blue-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaVideo className="text-xl" />
          </button>
          <button className={`rounded-full p-3 transition-all duration-200 ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' 
              : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
          }`}>
            <FaEllipsisV />
          </button>
        </div>
      </div>
    );
  }
}

export default ChatHeader;