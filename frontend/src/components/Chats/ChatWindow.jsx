import { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider";
import { FaSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function ChatWindow({ fetchAgain, setFetchAgain }) {
  const dispatch = useDispatch();
  const { 
    selectedChat, 
    setSelectedChat, 
    user, 
    chats, 
    setChats, 
    notification,
    setNotification,
    addNotification, // Use the new function instead of setNotification
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { isDarkMode } = useContext(ThemeContext);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const [socketConnected, setSocketConnected] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/message/${selectedChat?._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []); 

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedUser]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        
        
        if (!notification.includes(newMessageRecieved)) {
          const senderName = newMessageRecieved.sender.name || 'Someone';
          const notificationContent = `${senderName}: ${newMessageRecieved.content.substring(0, 30)}${newMessageRecieved.content.length > 30 ? '...' : ''}`;
          
          const newNotification = addNotification(
            notificationContent,
            'message', 
            {
              messageId: newMessageRecieved._id,
              chatId: newMessageRecieved.chat._id,
              senderId: newMessageRecieved.sender._id,
              senderName: senderName,
              messageContent: newMessageRecieved.content,
              senderPic: newMessageRecieved.sender.profileImage || defaultProfileImage
            }
          );
          console.log("new type is: " + newNotification.type); 
          const updatedNotifications = [newNotification, ...notification];
    setNotification(updatedNotifications);
    localStorage.setItem("chatNotifications", JSON.stringify(updatedNotifications));// Properly access the type property
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  }, [notification, messages, fetchAgain]);

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event === "Enter") && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = { headers: { "Content-type": "application/json", Authorization: `Bearer ${userInfo.token}` } };
        setNewMessage("");
        const { data } = await axios.post("http://localhost:5000/api/message/send", { content: newMessage, chatId: selectedChat._id }, config);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        console.error("Failed to send message", error);
      }
    }
  };

  const handleOutsideClick = (event) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showEmojiPicker]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} overflow-hidden rounded-r-lg`}>
      <ChatHeader selectedUser={selectedUser} selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      
      <div className={`flex-1 px-4 overflow-y-auto scrollbar-hide flex flex-col ${isDarkMode ? 'bg-gray-800' : ''}`}>
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <MessageList loading={loading} messages={messages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </div>
      </div>
      
      {/* Typing indicator with correct positioning */}
      {isTyping && (
        <div className="px-4 py-2 mb-2">
          <div className="flex items-center">
            <div className="mr-2">
              <img 
                src={selectedUser?.profileImage ? `http://localhost:5000${selectedUser.profileImage}` : defaultProfileImage} 
                alt="Typing" 
                className="w-8 h-8 rounded-full object-cover border border-blue-500"
              />
            </div>
            <div className={`p-2 px-4 rounded-lg shadow-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-300 text-black'} inline-flex items-center`}>
              <span className="mr-1">Typing</span>
              <span className="flex">
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '300ms'}}></span>
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '600ms'}}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : ''} flex items-end gap-3`}>
        <input
          type="text"
          className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-green-500 focus:no-outline ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : ''}`}
          placeholder="Type a message"
          value={newMessage}
          onChange={typingHandler}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
        />
        <div className="flex gap-1 items-center">
          <div className={`p-2 px-3 rounded cursor-pointer ${isDarkMode ? 'text-red-400 bg-red-900 hover:text-red-900 hover:bg-red-400' : 'text-red-600 bg-red-100 hover:text-white hover:bg-red-600'}`} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <FaSmile />
          </div>
          <div ref={emojiPickerRef} className="relative">
            {showEmojiPicker && (
              <div className={`absolute bottom-12 right-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md rounded-lg`}>
                <EmojiPicker onEmojiClick={(emojiObject) => setNewMessage(prev => prev + emojiObject.emoji)} theme={isDarkMode ? 'dark' : 'light'} />
              </div>
            )}
          </div>
          <div className="p-1 px-3 rounded cursor-pointer">
            <input type="file" id="image" accept="image/png, image/jpeg, image/jpg" hidden />
            <label htmlFor="image"><FaPaperclip /></label>
          </div>
          <div className={`p-2 rounded px-3 cursor-pointer ${isDarkMode ? 'text-blue-300 bg-blue-900 hover:bg-blue-400 hover:text-blue-900' : 'text-blue-500 bg-blue-100 hover:bg-blue-500 hover:text-white'}`} onClick={() => sendMessage("Enter")}>
            <FaPaperPlane />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;