import { useEffect, useState, useRef } from "react";
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
function ChatPage() {
  const dispatch = useDispatch();
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
    <div className="h-screen overflow-hidden flex flex-col justify-center items-center">
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <Navbar />
      </div>

      <div className="flex flex-1 mt-20 overflow-hidden w-[80rem] px-10 mb-3 rounded-lg">
        <div className="w-1/3 bg-white border-r p-4 overflow-auto rounded-l-lg">
          <h2 className="text-xl font-bold mb-4">
            Active chats {" "}
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
              {following.length}
            </span>
          </h2>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Search for chats"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
          {followingLoading ? (
            <Loading />
          ) : (
              following.map((user, index) => {
                const isOnline = onlineUsers.includes(user?._id);
                return (
                  <div
                  key={index}
                  className={`p-3 flex items-center gap-3 rounded cursor-pointer ${
                    selectedUser?.name === user.name ? "bg-blue-100" : ""
                  }`}
                  onClick={() => dispatch(setSelectedUser(user))}
                >
                  <div className="relative">
                    <div className="rounded-full">
                    <img
                      src={user?.profileImage ? "http://localhost:5000" + user.profileImage : defaultProfileImage}
                      alt=""
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    </div>
                    
                    {
                    isOnline ?
                    (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
                  ):(
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                    ) }
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.message}</p>
                  </div>
                </div>
                )
              }
          ))}
        </div>

        {selectedUser ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden rounded-r-lg">
            <div className="flex items-center justify-between p-4 border-b">
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
                {selectedUser.active? (<span className=" text-green-500">Online</span>):(
                  <span className=" text-red-500">Offline</span>
                )}
                </div>
                
                
              </div>
              <div className="flex gap-4">
                <FaPhone className="text-gray-500 cursor-pointer" />
                <FaVideo className="text-gray-500 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide flex flex-col">
  <div className="flex-1 overflow-y-auto scrollbar-hide">
    <Message />
  </div>
</div>



            <div className="p-4 border-t flex items-end gap-3">
              <input
                type="text"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(selectedUser?._id)}
              />
              <div className="flex gap-1 items-center">
              <div className="text-red-600 bg-red-100 p-2 px-3 rounded hover:text-white hover:bg-red-600 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)} >
              <FaSmile />
              </div>
              <div ref={emojiPickerRef} className="relative">
                    {showEmojiPicker && (
                      <div className="absolute bottom-12 right-2 bg-white shadow-md rounded-lg">
                        <EmojiPicker onEmojiClick={addEmoji} className="bg-gray-100" />
                      </div>
                    )}
                    </div>
              <div className="text-black p-1 px-3 rounded hover:bg-black hover:text-white bg-gray-200 cursor-pointer" >
              <input type="file" name="" id="image" accept='image/png , image/jpeg, image/jpg' hidden />
              <label htmlFor="image">
              <FaPaperclip />
              </label>
              </div>
              <div className="text-blue-500 bg-blue-100 p-2 rounded hover:bg-blue-500 hover:text-white px-3 cursor-pointer" onClick={() => sendMessage(selectedUser?._id)} >
              <FaPaperPlane />
              </div>
              </div>
              
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mx-auto bg-white w-[60rem]">
            <FaPaperPlane className="text-blue-400 w-20 h-20" />
            <h1 className="font-medium text-center mt-4">Your messages</h1>
            <span className="text-center">Send a message to start a chat.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;