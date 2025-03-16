import { useState, useContext } from "react";
import axios from "axios";
import {  useSelector } from "react-redux";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";
import { ThemeContext } from "../../context/ThemeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
const GroupChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { isDarkMode } = useContext(ThemeContext);
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
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
        `http://localhost:5000/api/message/search?query=${query}`,
        config
      );
  
      console.log("Fetched users:", res.data.users); // ✅ Check fetched users
      setSearchResult([...res.data.users]); // ✅ Force state update with spread operator
      console.log(searchResult)
      setLoading(false);
    } catch (error) {
      console.error("Search API Error:", error);
      setSearchResult([]); // Reset to empty array on error
      setLoading(false);
    }
  };
  
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  // Handle search input change with debouncing

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setIsOpen(false);
      toast.success("Group Chat is Created", {
        style: {
          background: "linear-gradient(135deg, #16a34a, #15803d)", // Gradient green
          color: "white",
          fontWeight: "bold",
          padding: "14px 20px",
          boxShadow: "0px 6px 15px rgba(22, 163, 74, 0.3)", // Smooth shadow
          borderRadius: "12px",
          border: "2px solid #38bdf8", // Light blue border
          textAlign: "center",
          letterSpacing: "0.5px",
          transition: "transform 0.3s ease-in-out", // Smooth animation
        },
        position: "bottom-right",
        duration: 3000,
      });
    } catch (error) {
      alert("Failed to create the chat");
    }
  };

  return (
    <>
      {/* Button to Open Modal */}
      <button
        onClick={() => setIsOpen(true)}
        className={`font-semibold py-2 px-4 rounded-lg transition ${
            isDarkMode
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-600"
          } hover:bg-green-600 hover:text-white`}
      >
        <FontAwesomeIcon icon={faPenToSquare} className="mr-2"/>
        New Group
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`rounded-lg shadow-lg w-96 p-5 relative transition-all
              ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
          >
            <h2 className="text-2xl font-semibold text-center mb-4">
              Create Group Chat
            </h2>

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>

            <div className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Chat Name"
                className={`border rounded px-3 py-2 w-full 
                  ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Add Users e.g., John, Piyush, Jane"
                className={`border rounded px-3 py-2 w-full
                  ${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300 text-gray-900"}`}
                onChange={(e) => handleSearch(e.target.value)}
              />

              {/* Selected Users */}
              <div className="flex flex-wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>

              {/* Search Results */}
              {loading ? (
  <p>Loading...</p>
) : searchResult.length > 0 ? (
  searchResult.map((user) => (
                 <div key={user._id} className="p-2 border-b flex items-center gap-2 my-3 hover:bg-green-600/20 rounded-lg"
                 onClick={()=>{
                    handleGroup(user)
                 }}
                 >
                   <div className="rounded-full">
                   <img src={"http://localhost:5000"+user.profileImage||defaultProfileImage} alt={user.username} className="w-10 h-10 object-cover rounded-full" />
                   </div>
                   <div>
                   <span>{user.username}</span>
                   <p className={`text-xs font-bold ${isDarkMode?"text-gray-400":"text-gray-600"}`}>Email: <span className="font-normal">{user.email}</span></p>
                   </div>
                   
                 </div>
               ))
             ) : (
               <p className="text-gray-400">No users found</p>
             )}

            </div>

            <div className="flex mt-4">
              <button
                className={`px-4 py-2 w-full font-semibold rounded transition 
                    ${
                        isDarkMode
                          ? "bg-green-900 text-green-300"
                          : "bg-green-200 text-green-600"
                      } hover:bg-green-600 hover:text-white`}
                onClick={handleSubmit}
              >
                Create Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupChatModal;
