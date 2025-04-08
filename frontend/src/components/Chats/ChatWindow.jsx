import { useState, useEffect, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider";
import { FaSmile, FaPaperclip, FaPaperPlane, FaArrowLeft } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import API_CONFIG from "../../config/api-config";
const ENDPOINT = `${API_CONFIG.BASE_URL}`;
var socket, selectedChatCompare;

function ChatWindow({ fetchAgain, setFetchAgain, isMobile, handleBackToSidebar }) {
  const dispatch = useDispatch();
  const { 
    selectedChat, 
    setSelectedChat, 
    user, 
    chats, 
    setChats, 
    notification,
    setNotification,
    addNotification,
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
  const messageEndRef = useRef(null);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      setLoading(true);
      const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/message/${selectedChat?._id}`, config);
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
    // Scroll to bottom when messages change
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          localStorage.setItem("chatNotifications", JSON.stringify(updatedNotifications));
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
        const { data } = await axios.post(`${API_CONFIG.BASE_URL}/api/message/send`, { content: newMessage, chatId: selectedChat._id }, config);
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

  const handleEmojiClick = (emojiObject) => {
    setNewMessage(prevMessage => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = () => {
    // Implement file attachment functionality
    console.log("Attachment clicked");
  };

  return (
    <div className={`w-full flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} overflow-hidden rounded-r-lg border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} h-full`}>
      {/* Mobile Back Button */}
      
      <ChatHeader selectedUser={selectedUser} selectedChat={selectedChat} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} isMobile={isMobile} handleBackToSidebar={handleBackToSidebar} />
      
      <div className={`flex-1 px-4 overflow-y-auto scrollbar-hide ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} h-[calc(100vh-230px)] md:h-[calc(100vh-200px)]`}>
        <div className="overflow-y-auto h-full py-4 scrollbar-hide">
          <MessageList loading={loading} messages={messages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setMessages={setMessages}/>
          <div ref={messageEndRef} />
        </div>
      </div>
      
      {/* Typing indicator with correct positioning */}
      {isTyping && (
        <div className="px-4 py-2">
          <div className="flex items-center">
            <div className="mr-2">
              <img 
                src={selectedUser?.profileImage ? `${API_CONFIG.BASE_URL}${selectedUser.profileImage}` : defaultProfileImage} 
                alt="Typing" 
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-md"
              />
            </div>
            <div className={`p-2 px-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'} inline-flex items-center transition-all duration-300 ease-in-out`}>
              <span className="mr-1 font-medium">Typing</span>
              <span className="flex">
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '300ms'}}></span>
                <span className="h-2 w-2 bg-current rounded-full mx-0.5 animate-bounce" style={{animationDelay: '600ms'}}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      
      <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} flex flex-col md:flex-row items-end gap-3 shadow-inner`}>
        {/* EmojiPicker */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef} 
            className="absolute bottom-20 left-4 z-50"
          >
            <EmojiPicker 
              onEmojiClick={handleEmojiClick} 
              disableAutoFocus={true} 
              theme={isDarkMode ? "dark" : "light"}
            />
          </div>
        )}

        <div className="flex w-full items-end gap-2">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <FaSmile className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          
          <button 
            onClick={handleAttachmentClick}
            className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
          >
            <FaPaperclip className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
          
          <input
            type="text"
            className={`flex-1 p-3 border rounded-full focus:ring-2 focus:outline-none transition-all duration-200 ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
                : 'bg-gray-100 border-gray-200 text-gray-800 focus:ring-blue-400'
            }`}
            placeholder="Type a message..."
            value={newMessage}
            onChange={typingHandler}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
          />
          
          <button 
            onClick={() => sendMessage("Enter")}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              newMessage.trim() 
                ? isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : isDarkMode 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPaperPlane className="text-xl" />
          </button>
        </div>
      </div>
      
      {/* Responsive adjustments for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatWindow;