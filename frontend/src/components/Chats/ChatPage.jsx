// ChatPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
import { fetchFollowing } from "../../actions/UserActions";
import { ChatState } from "../../context/ChatProvider";
import { setMessages } from "../../reducers/ChatSlice"; // Added import
import Navbar from "../NavBarMainScreen/Navbar";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import EmptyChat from "./EmptyChat";
import "./ChatPage.css";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function ChatPage() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { userInfo } = useSelector((state) => state.userLogin);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const { messages } = useSelector((store) => store.chat);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const {  notification, setNotification } = ChatState();

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connected", () => setSocketConnected(true));

    // eslint-disable-next-line
  }, []);

  // Fetch user's following list
  useEffect(() => {
    if (userInfo && userInfo._id) {
      dispatch(fetchFollowing(userInfo._id));
    }
  }, [dispatch, userInfo]);

  // Handle incoming messages
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        dispatch(setMessages([...messages, newMessageRecieved])); // Use dispatch
      }
    });
  });

  // Update selectedChatCompare when selectedChat changes
  useEffect(() => {
    selectedChatCompare = selectedUser;
    // eslint-disable-next-line
  }, [selectedUser]);

  return (
    <div className={`h-screen overflow-hidden flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-900' : 'bg-green-100'}`}>
      <div className={`fixed top-0 left-0 w-full z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <Navbar />
      </div>

      <div className={`flex mt-20 h-[50rem] overflow-hidden w-[85rem]  mb-3 ${isDarkMode?"":"border"} rounded-lg`}>
        <div className={`w-[30rem] border-r h-full ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
       } ${
        isDarkMode ? "border-gray-700" : ""
      }`}>
        {<ChatSidebar fetchAgain={fetchAgain} calledBy={"chatPage"} 
        isOpen={isOpen}
        setIsOpen={setIsOpen} />}
        </div>
        
        

        {selectedChat ? (
          <ChatWindow 
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            // Pass dispatch down to children
          />
        ) : (
          <EmptyChat
          isOpen={isOpen}
          setIsOpen={setIsOpen} />
        )}
      </div>
    </div>
  );
}

export default ChatPage;