import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { fetchFollowing } from "../../actions/UserActions";
import { ChatState } from "../../context/ChatProvider";
import { setMessages } from "../../reducers/ChatSlice";
import Navbar from "../NavBarMainScreen/Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import EmptyChat from "./EmptyChat";
import "./ChatPage.css";
import API_CONFIG from "../../config/api-config";
const ENDPOINT = `${API_CONFIG.BASE_URL}`;
var socket, selectedChatCompare;

function ChatPage() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { userInfo } = useSelector((state) => state.userLogin);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const { messages } = useSelector((store) => store.chat);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const { notification, setNotification } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));
  }, []);
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  useEffect(() => {
    if (selectedChat && isMobile) {
      setShowChatWindow(true);
    }
  }, [selectedChat, isMobile]);
  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(fetchFollowing(userInfo._id));
    }
  }, [dispatch, userInfo]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || 
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        dispatch(setMessages([...messages, newMessageRecieved]));
      }
    });
  });
  useEffect(() => {
    selectedChatCompare = selectedUser;
  }, [selectedUser]);
  const handleBackToSidebar = () => {
    setShowChatWindow(false);
  };

  return (
    <div className={`h-screen overflow-hidden flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-green-100'}`}>
      <div className={`fixed top-0 left-0 w-full z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <Navbar />
      </div>

      <div className={`flex sm:w-full lg:h-[60rem] mt-20 lg:w-[80rem] mb-14 lg:mb-3 ${isDarkMode ? "" : "border"} rounded-lg overflow-hidden`}>
        <div className={`${isMobile && showChatWindow ? 'hidden' : 'flex'} w-full lg:w-1/3 md:border-r h-full flex-col ${
          isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white"
        }`}>
          <ChatSidebar 
            fetchAgain={fetchAgain} 
            calledBy={"chatPage"} 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isMobile={isMobile}
            setShowChatWindow={setShowChatWindow}
          />
        </div>
        <div className={`${isMobile && !showChatWindow ? 'hidden' : 'flex'} flex-grow h-full`}>
          {selectedChat ? (
            <ChatWindow 
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              isMobile={isMobile}
              handleBackToSidebar={handleBackToSidebar}
            />
          ) : (
            <EmptyChat
              isOpen={isOpen}
              setIsOpen={setIsOpen} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;