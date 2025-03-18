// ChatHeader.jsx
import { useContext } from "react";
import { FaPhone, FaVideo } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";

function ChatHeader({ selectedUser,selectedChat}) {
  const { isDarkMode } = useContext(ThemeContext);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
if(selectedChat.isGroupChat){
  return (
    
    <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
      <div className="relative flex items-center gap-2">
        <div className="rounded-full">
          <img
            src={selectedChat?.profileImage ? "http://localhost:5000" +selectedChat.profileImage : defaultProfileImage}
            alt=""
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
        <div>
          <h2 className="font-semibold">{selectedChat.chatName}</h2>
          <div className="flex gap-1 text-xs text-gray-500">
  {selectedChat.participants.map((user, index) => (
    <span key={user._id}>
      {user.username}
      {index !== selectedChat.participants.length - 1 && ","}
    </span>
  ))}
</div>
        </div>
      </div>
      <div className="flex gap-4">
        <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} hover:bg-green-600 bg-green-600/20 hover:text-white rounded-full p-3 cursor-pointer`}>
          <FaPhone />
        </div>
        <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} hover:bg-green-600 bg-green-600/20 hover:text-white rounded-full p-3 cursor-pointer`}>
          <FaVideo />
        </div>
      </div>
    </div>
  );
}
else{
  return (
    
    <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
      <div className="relative flex items-center gap-2">
        <div className="rounded-full">
          <img
            src={selectedUser?.profileImage ? "http://localhost:5000" +selectedUser.profileImage : defaultProfileImage}
            alt=""
            className="w-10 h-10 object-cover rounded-full"
          />
        </div>
        <div>
          <h2 className="font-semibold">{selectedUser.name}</h2>
          {selectedUser.active ? (
            <span className="text-green-500">Online</span>
          ) : (
            <span className="text-red-500">Offline</span>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} hover:bg-green-600 bg-green-600/20 hover:text-white rounded-full p-3 cursor-pointer`}>
          <FaPhone />
        </div>
        <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} hover:bg-green-600 bg-green-600/20 hover:text-white rounded-full p-3 cursor-pointer`}>
          <FaVideo />
        </div>
      </div>
    </div>
  );
}
  
}

export default ChatHeader;