import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "./userAvatar/UserBadgeItem";
import UserListItem from "./userAvatar/UserListItem";
import { ThemeContext } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTimes, faSearch, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import API_CONFIG from "../../config/api-config";
const GroupChatModal = ({isGroupOpen, setIsGroupOpen}) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { isDarkMode } = useContext(ThemeContext);
  const { user, chats, setChats } = ChatState();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isGroupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGroupOpen]);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
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
  
      setSearchResult([...res.data.users]);
      setLoading(false);
    } catch (error) {
      console.error("Search API Error:", error);
      setSearchResult([]);
      setLoading(false);
    }
  };
  
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      toast.error("Please fill all fields", {
        position: "top-center",
        duration: 2000,
      });
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `${API_CONFIG.BASE_URL}/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsGroupOpen(false);
      toast.success("Group Chat is Created", {
        style: {
          background: "linear-gradient(135deg, #16a34a, #15803d)",
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
    } catch (error) {
      toast.error("Failed to create the chat", {
        position: "top-center",
        duration: 2000,
      });
    }
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsGroupOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <>
        <div 
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-all duration-300"
        style={{ zIndex: 9999 }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsGroupOpen(false);
          }
        }}
      >
        {/* For the inner modal dialog div, update the styling */}
        <div
          className={`rounded-xl shadow-2xl w-96 p-6 relative transition-all duration-300 transform scale-100 
            ${isDarkMode 
              ? "bg-gray-800 text-white border border-gray-700" 
              : "bg-white text-gray-900 border border-gray-200"}`}
          style={{
            maxHeight: "90vh",
            overflow: "auto",
            // Remove margin: 0 auto and let flexbox handle the centering
          }}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                Create Group Chat
              </h2>

              {/* Close Button */}
              <button
                className={`rounded-full p-2 transition-colors duration-200 
                  ${isDarkMode 
                    ? "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-800"}`}
                onClick={() => setIsGroupOpen(false)}
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Group Chat Name"
                  className={`border rounded-lg px-4 py-3 w-full transition-colors duration-200 focus:outline-none focus:ring-2 
                    ${isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-emerald-500 focus:border-emerald-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"}`}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search users to add..."
                  className={`border rounded-lg pl-10 pr-4 py-3 w-full transition-colors duration-200 focus:outline-none focus:ring-2
                    ${isDarkMode 
                      ? "bg-gray-700 border-gray-600 text-white focus:ring-emerald-500 focus:border-emerald-500" 
                      : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500"}`}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className={`flex flex-wrap gap-2 p-2 rounded-lg border border-dashed
                  ${isDarkMode ? "border-gray-600 bg-gray-700/50" : "border-gray-300 bg-gray-100/50"}`}>
                  {selectedUsers.map((u) => (
                    <UserBadgeItem
                      key={u._id}
                      user={u}
                      handleFunction={() => handleDelete(u)}
                    />
                  ))}
                </div>
              )}

              {/* Search Results */}
              <div className={`max-h-48 overflow-y-auto rounded-lg 
                ${isDarkMode ? "scrollbar-thin scrollbar-thumb-gray-600" : "scrollbar-thin scrollbar-thumb-gray-300"}`}>
                {loading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 
                      ${isDarkMode ? "border-emerald-400" : "border-emerald-600"}`}></div>
                  </div>
                ) : searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <div 
                      key={user._id} 
                      className={`p-3 mb-2 flex items-center gap-3 rounded-lg cursor-pointer transition-all duration-200
                        ${isDarkMode 
                          ? "hover:bg-emerald-700/30 border border-gray-700" 
                          : "hover:bg-emerald-100 border border-gray-200"}`}
                      onClick={() => handleGroup(user)}
                    >
                      <div className={`rounded-full overflow-hidden border-2 
                        ${isDarkMode ? "border-emerald-700" : "border-emerald-500"}`}>
                        <img 
                          src={user.profileImage ? `${API_CONFIG.BASE_URL}` + user.profileImage : defaultProfileImage} 
                          alt={user.username} 
                          className="w-10 h-10 object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.username}</p>
                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {user.email}
                        </p>
                      </div>
                      <FontAwesomeIcon 
                        icon={faUserPlus} 
                        className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} 
                      />
                    </div>
                  ))
                ) : search ? (
                  <div className={`p-4 text-center rounded-lg 
                    ${isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                    No users found matching "{search}"
                  </div>
                ) : null}
              </div>
            </div>

            <button
              className={`mt-6 px-4 py-3 w-full font-semibold rounded-lg transition-all duration-300 flex justify-center items-center
                ${isDarkMode
                  ? "bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                } shadow-md hover:shadow-lg transform hover:-translate-y-1`}
              onClick={handleSubmit}
            >
              Create Group Chat
            </button>
          </div>
        </div>
    </>
  );
};

export default GroupChatModal;