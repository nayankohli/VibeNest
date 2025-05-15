import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { ThemeContext } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import UserBadgeItem from "./userAvatar/UserBadgeItem";
import { toast } from "sonner";
import API_CONFIG from "../../config/api-config";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  
  // For managing the image state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const { userInfo } = useSelector((state) => state.userLogin);

  // Update state when selected chat changes or modal opens
  useEffect(() => {
    if (selectedChat && isOpen) {
      setGroupChatName(selectedChat.chatName || "");
      setPreviewImage(null);
      setSelectedFile(null);
    }
  }, [selectedChat, isOpen]);

  const handleAddUser = async (user1) => {
    if (selectedChat.participants.find((u) => u._id === user1._id)) {
      toast.error("User already in group!", {
        style: {
          background: "red",
          color: "white",
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
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone in group!", {
        style: {
          background: "red",
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)",
          borderRadius: "12px",
          border: "2px solid #38bdf8",
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out",
        },
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_CONFIG.BASE_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/message/search?query=${query}`,
        config
      );

      console.log("Fetched users:", res.data.users);
      setSearchResult([...res.data.users]);
      setLoading(false);
    } catch (error) {
      console.error("Search API Error:", error);
      setSearchResult([]);
      setLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      
      const formData = new FormData();
      formData.append("chatId", selectedChat._id);
      formData.append("chatName", groupChatName);
      
      // Only append file if a new one was selected
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const { data } = await axios.put(
        `${API_CONFIG.BASE_URL}/api/chat/update`,
        formData,
        config
      );
      
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating group:", error);
      setRenameLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_CONFIG.BASE_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert("error occured");
      setLoading(false);
    }
  };

  // Get the current image to display (preview or server image)
  const getDisplayImage = () => {
    if (previewImage) {
      return previewImage;
    } else if (selectedChat?.profileImage) {
      return selectedChat.profileImage;
    } else {
      return defaultProfileImage;
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`${isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-white' 
          : 'bg-green-500 hover:bg-green-600 text-white'} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md`}
      >
        Group Details
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-0">
          {/* Blurred backdrop */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: isDarkMode 
                ? "rgba(0, 0, 0, 0.75)" 
                : "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)"
            }}
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Modal content - NO blur here */}
          <div
            className={`relative w-full flex flex-col max-w-md p-4 sm:p-6 rounded-xl shadow-2xl transform transition-all duration-300 ${
              isDarkMode 
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-white text-gray-800 border border-gray-200"
            } overflow-y-auto max-h-screen`}
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent line-clamp-1">
                {selectedChat.chatName}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-300 text-2xl sm:text-3xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <div className="relative group">
                  <img
                    src={getDisplayImage()}
                    alt="Group"
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-green-300 shadow-lg group-hover:border-green-500 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-full flex items-center justify-center transition-all duration-300">
                    <input
                      type="file"
                      accept="image/*"
                      id="group-photo-input"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => document.getElementById("group-photo-input").click()}
                  className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 mt-2 sm:mt-0 rounded-full text-sm sm:text-base ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
                  } text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl`}
                >
                  Change Image
                </button>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-3 items-center">
                <div className="w-full">
                  <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Group Name
                  </label>
                  <input
                    type="text"
                    placeholder="Rename Group"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                    className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    }`}
                  />
                </div>
                
                <button
                  onClick={handleUpdate}
                  className={`inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-8 py-2 sm:py-3 rounded-full
                    ${isDarkMode 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
                  } text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 ${renameLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                  disabled={renameLoading}
                >
                  {renameLoading ? "Updating..." : "Update Group"}
                </button>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 sm:mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Group Members
                </label>
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4 max-h-16 sm:max-h-20 overflow-y-auto p-2 rounded-lg border"
                     style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}
                >
                  {selectedChat.participants.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      admin={selectedChat.groupAdmin}
                      handleFunction={() => handleRemove(u)}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Add Members
                </label>
                <input
                  type="text"
                  placeholder="Search users to add"
                  onChange={(e) => handleSearch(e.target.value)}
                  className={`w-full p-2 sm:p-3 border rounded-lg focus:ring-2 focus:outline-none transition-colors duration-300 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500 focus:border-green-500"
                      : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                  }`}
                />
                
                <div className={`mt-2 max-h-24 sm:max-h-32 overflow-y-auto rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-50"
                } ${searchResult.length > 0 ? "border" : ""} ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                }`}>
                  {loading ? (
                    <div className="p-3 text-center">
                      <div className="inline-block h-5 w-5 sm:h-6 sm:w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    searchResult.map((user) => (
                      <div
                        key={user._id}
                        className={`p-2 sm:p-3 ${
                          isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                        } cursor-pointer transition-colors duration-200 border-b ${
                          isDarkMode ? "border-gray-600" : "border-gray-200"
                        } flex items-center gap-2`}
                        onClick={() => handleAddUser(user)}
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs sm:text-base">
                          {user.name.charAt(0)}
                        </div>
                        <span className="text-sm sm:text-base truncate">{user.name}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-0 pt-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className={`py-2 px-4 sm:px-6 rounded-full font-medium transition-all duration-300 sm:mr-2 ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } order-2 sm:order-1`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemove(user)}
                  className={`font-medium transition-all duration-300 
                  inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 rounded-full ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-red-600 to-pink-700 hover:from-rose-700 hover:to-red-800' 
                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-700'
                    } text-white transition-all duration-200 shadow-lg hover:shadow-xl order-1 sm:order-2`}
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupChatModal;