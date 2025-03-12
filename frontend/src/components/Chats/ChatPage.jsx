import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPhone,
  FaVideo,
  FaPaperclip,
  FaSmile,
  FaPaperPlane,
} from "react-icons/fa";
import Navbar from "../NavBarMainScreen/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser, fetchFollowing } from "../../actions/UserActions";
import Loading from "../Loading";
import { setMessages } from "../../reducers/ChatSlice";
import axios from "axios";
import Message from "./Message";
import './ChatPage.css';
import EmojiPicker from "emoji-picker-react";
import { ThemeContext } from "../../context/ThemeContext";

function ChatPage() {
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const { onlineUsers, messages } = useSelector(store => store.chat);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const followingList = useSelector((state) => state.followingList);
  const { following = [], followingLoading } = followingList;
  const { userInfo } = useSelector((state) => state.userLogin);
  const [message, setMessage] = useState("");

  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(fetchFollowing(userInfo._id));
    }
  }, [dispatch, userInfo]);
  
  const addEmoji = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };
  
  const sendMessage = async (receiverId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/message/send/${receiverId}`, { message }, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true
      });
      if (res.data.success) {
        dispatch(setMessages([...messages, { 
          ...res.data.newMessage, senderId: userInfo._id 
        }]));
          setMessage("");
          setShowEmojiPicker(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const emojiPickerRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
  
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);
  
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className={`h-screen overflow-hidden flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-green-100'}`}>
      <div className={`fixed top-0 left-0 w-full z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <Navbar />
      </div>

      <div className="flex flex-1 mt-20 overflow-hidden w-[80rem] px-10 mb-3 rounded-lg">
        <div className={`w-1/3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : ''} p-3 overflow-auto rounded-l-lg`}>
          <h2 className={`text-xl font-bold mb-4 border-b ${isDarkMode ? 'border-gray-700' : ''} py-3 `}>
            Active chats {" "}
            <span className={`${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-600'} px-2 py-1 rounded-full text-xs`}>
              {following.length}
            </span>
          </h2>
          <div className="relative mb-4">
            <input
              type="text"
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none ${
                isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''
              }`}
              placeholder="Search for chats"
            />
            <FaSearch className={`absolute top-3 right-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </div>
          {followingLoading ? (
            <Loading />
          ) : (
              following.map((user, index) => {
                const isOnline = onlineUsers.includes(user?._id);
                return (
                  <div
                    key={index}
                    className={`p-2 py-2 flex items-center my-2 gap-3 rounded-lg cursor-pointer ${
                      selectedUser?.name === user.name 
                        ? isDarkMode ? "bg-green-900" : "bg-green-100" 
                        : isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                    onClick={() => dispatch(setSelectedUser(user))}
                  >
                    <div className="relative">
                      <div className="rounded-full">
                        <img
                          src={user?.profileImage ? "http://localhost:5000" + user.profileImage : defaultProfileImage}
                          alt=""
                          className="w-14 h-14 object-cover rounded-full"
                        />
                      </div>
                      
                      {isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{user.message}</p>
                    </div>
                  </div>
                )
              }
          ))}
        </div>

        {selectedUser ? (
          <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} overflow-hidden rounded-r-lg`}>
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
              <div className="relative flex items-center gap-2">
                <div className="rounded-full">
                  <img
                    src={selectedUser?.profileImage ? "http://localhost:5000" + selectedUser.profileImage : defaultProfileImage}
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
                <FaPhone  />
                </div>
                <div className={`${isDarkMode ? 'text-green-400' : 'text-green-500'} hover:bg-green-600 bg-green-600/20 hover:text-white rounded-full p-3 cursor-pointer`} >
                <FaVideo />
                </div>
                
              </div>
            </div>

            <div className={`flex-1 p-4 overflow-y-auto scrollbar-hide flex flex-col ${isDarkMode ? 'bg-gray-800' : ''}`}>
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <Message />
              </div>
            </div>

            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : ''} flex items-end gap-3`}>
              <input
                type="text"
                className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''
                }`}
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(selectedUser?._id)}
              />
              <div className="flex gap-1 items-center">
                <div 
                  className={`${isDarkMode 
                    ? 'text-red-400 bg-red-900 hover:text-red-900 hover:bg-red-400' 
                    : 'text-red-600 bg-red-100 hover:text-white hover:bg-red-600'} 
                    p-2 px-3 rounded cursor-pointer`}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <FaSmile />
                </div>
                <div ref={emojiPickerRef} className="relative">
                  {showEmojiPicker && (
                    <div className={`absolute bottom-12 right-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md rounded-lg`}>
                      <EmojiPicker onEmojiClick={addEmoji} theme={isDarkMode ? 'dark' : 'light'} />
                    </div>
                  )}
                </div>
                <div 
                  className={`${isDarkMode 
                    ? 'text-white bg-gray-700 hover:bg-gray-600' 
                    : 'text-black bg-gray-200 hover:bg-black hover:text-white'} 
                    p-1 px-3 rounded cursor-pointer`}
                >
                  <input type="file" name="" id="image" accept='image/png, image/jpeg, image/jpg' hidden />
                  <label htmlFor="image">
                    <FaPaperclip />
                  </label>
                </div>
                <div 
                  className={`${isDarkMode 
                    ? 'text-blue-300 bg-blue-900 hover:bg-blue-400 hover:text-blue-900' 
                    : 'text-blue-500 bg-blue-100 hover:bg-blue-500 hover:text-white'} 
                    p-2 rounded px-3 cursor-pointer`} 
                  onClick={() => sendMessage(selectedUser?._id)}
                >
                  <FaPaperPlane />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} w-[60rem]`}>
            <FaPaperPlane className={`${isDarkMode ? 'text-blue-300' : 'text-blue-400'} w-20 h-20`} />
            <h1 className="font-medium text-center mt-4">Your messages</h1>
            <span className={`text-center ${isDarkMode ? 'text-gray-400' : ''}`}>Send a message to start a chat.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;