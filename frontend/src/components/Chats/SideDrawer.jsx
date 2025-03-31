import { useState, useContext, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchUsers } from "./hooks/UseGetSearchUsers";
import { setSelectedUser } from "../../actions/UserActions";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

const SideDrawer = ({ calledBy, isOpen, setIsOpen }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { users } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  
  const isRightSide = calledBy == "home" ? true : false;
  
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:5000/api/chat/`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const timer = setTimeout(() => {
        dispatch(fetchSearchUsers(searchQuery));
      }, 300); // Debounce for 300ms
      return () => clearTimeout(timer);
    }
  }, [searchQuery, dispatch]);

  return (
    <div className="relative mb-4">
      {/* Search Input */}
      <input
        type="text"
        className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none ${
          isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
        }`}
        placeholder="Search for chats"
        onFocus={() => setIsOpen(true)}
      />
      <FaSearch className="absolute top-3 right-3 text-gray-400" />

      {/* Overlay to close SideDrawer - now placed BEFORE the drawer to ensure proper stacking */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-[90]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SideDrawer - Position based on calledBy prop - with higher z-index than overlay */}
      <div
        className={`fixed  ${isRightSide ? 'right-0 border-l w-[30rem] top-0' : 'left-0 border-r top-20 w-96'} h-full  ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white"
        } shadow-lg p-4 transform  border-t ${
          isOpen 
            ? "translate-x-0" 
            : isRightSide 
              ? "translate-x-full" 
              : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-[100]`}
      >
        {/* Close Button */}
        <button 
          className={`absolute top-3 ${isRightSide ? 'left-3' : 'right-3'} text-gray-400`} 
          onClick={() => setIsOpen(false)}
        >
          ✖
        </button>

        <h2 className={"text-xl font-bold mb-4 text-center"}>Search Results</h2>

        {/* Search Bar Inside Drawer */}
        <div className="relative mb-4">
          <input
            type="text"
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
            }`}
            placeholder="Search for chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute top-3 right-3 text-gray-400" />
        </div>

        {/* Search Results */}
        <div className="mt-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div 
                key={user._id} 
                className="p-2 border-b flex items-center gap-2 my-3 hover:bg-green-600/20 rounded-lg"
                onClick={() => {
                  accessChat(user._id);
                  dispatch(setSelectedUser(user));
                }}
              >
                <div className="rounded-full">
                  <img 
                    src={"http://localhost:5000" + user.profileImage || defaultProfileImage} 
                    alt={user.username} 
                    className="w-10 h-10 object-cover rounded-full" 
                  />
                </div>
                <div>
                  <span>{user.username}</span>
                  <p className={`text-xs font-bold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Email: <span className="font-normal">{user.email}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideDrawer;