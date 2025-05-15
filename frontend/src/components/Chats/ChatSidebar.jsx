import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { setSelectedUser } from "../../actions/UserActions";
import Loading from "../Loaders/Loading";
import SideDrawer from "./SideDrawer";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../actions/ChatActions";
import GroupChatModal from "./GroupChatModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaCircle, FaEllipsisH, FaUserFriends, FaRegSmile, FaPaperPlane } from "react-icons/fa";
import API_CONFIG from "../../config/api-config";

function ChatSidebar({ fetchAgain, calledBy, isOpen, setIsOpen, isMobile, setShowChatWindow }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [loggedUser, setLoggedUser] = useState();
  const { userInfo } = useSelector((state) => state.userLogin);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const followingList = useSelector((state) => state.followingList);
  const { following = [], followingLoading } = followingList;
  const { onlineUsers } = useSelector((store) => store.chat);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        `${API_CONFIG.BASE_URL}/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  const isUserOnline = (userId) => {
    return onlineUsers?.some(user => user.userId === userId);
  };
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    
    if (calledBy === "home") {
      navigate("/chats");
    }
    
    if (!chat.isGroupChat) {
      dispatch(setSelectedUser(getSender(loggedUser, chat.participants)));
    }
    if (isMobile && setShowChatWindow) {
      setShowChatWindow(true);
    }
  };
  
  const isRightSide = calledBy == "home" ? true : false;
  
  return (
    <div
      className={`w-full ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white "
      } p-4 overflow-auto rounded-l-lg ${isRightSide?"h-screen":"h-full"} flex flex-col relative`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full ${
          isDarkMode ? 'bg-blue-900/20' : 'bg-blue-200/30'
        }`}></div>
        <div className={`absolute -left-20  -bottom-20 w-80 h-80 rounded-full ${
          isDarkMode ? 'bg-green-900/20' : 'bg-green-400/20'
        }`}></div>
      </div>

      <div
        className={`py-4 mb-6 flex items-center justify-between border-b ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        } sticky top-0 backdrop-blur-sm z-10 
        } rounded-t-xl`}
      >
        <h2 className={`text-xl font-bold flex items-center gap-3`}>
          <div className={`p-2 rounded-full ${
            isDarkMode ? 'bg-gradient-to-br from-blue-800 to-indigo-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          } shadow-md`}>
            <FaUserFriends className="text-white w-5 h-5" />
          </div>
          My Chats
          <span
            className={`p-1 px-3 rounded-full ${
            isDarkMode ? 'bg-emerald-900/80' : 'bg-emerald-500'
          } shadow-lg text-md text-white animate-pulse`}
          >
            {chats.length}
          </span>
        </h2>
      
        <button
          onClick={() => setIsGroupOpen(true)}
          className={`inline-flex items-center px-3 py-3 rounded-full 
            ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-emerald-700 hover:to-green-800' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700'
            } text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1`}
        >
          <FontAwesomeIcon icon={faPenToSquare} className="mr-2"/>
          New Group
        </button>
      </div>
      <div className="mb-6 relative z-10">
        <SideDrawer calledBy={calledBy} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      {followingLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide pr-1">
          {chats?.length > 0 ? (
            chats.map((chat) => {
              const chatSender = !chat.isGroupChat ? getSender(loggedUser, chat.participants) : null;
              const isOnline = chatSender ? isUserOnline(chatSender._id) : false;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className={`cursor-pointer flex items-center gap-3 p-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedChat === chat
                      ? isDarkMode 
                        ? "bg-gradient-to-r from-green-800/60 to-emerald-800/60 border-l-4 border-green-500 transform scale-102" 
                        : "bg-gradient-to-r from-green-100 to-emerald-100 border-l-4 border-green-500 transform scale-102"
                      : isDarkMode
                        ? "hover:bg-gray-700/90 bg-gray-900/60 backdrop-blur-sm hover:shadow-lg" 
                        : "hover:bg-white/90 bg-white/70 backdrop-blur-sm hover:shadow-lg"
                  } ${selectedChat === chat ? "shadow-xl" : "shadow-md"}  overflow-hidden`}
                >
                  {selectedChat === chat && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${
                        isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-500/20'
                      }`}></div>
                    </div>
                  )}
                  <div className="">
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                      selectedChat === chat 
                        ? isDarkMode ? "border-green-500" : "border-green-500" 
                        : isDarkMode ? "border-gray-600" : "border-gray-200"
                    } shadow-md transform transition-transform ${selectedChat === chat ? "scale-110" : "hover:scale-105"}`}>
                      {!chat.isGroupChat ? (
                        <img
                          src={chatSender.profileImage ? chatSender.profileImage : defaultProfileImage}
                          alt={chatSender.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        chat.profileImage ? (
                          <img
                            src={chat.profileImage}
                            alt="Group Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              isDarkMode 
                                ? "bg-gradient-to-br from-indigo-900 to-violet-900" 
                                : "bg-gradient-to-br from-indigo-500 to-violet-500"
                            }`}
                          >
                            <FaUsers
                              className="text-xl text-white"
                            />
                          </div>
                        )
                      )}
                    </div>
                    {!chat.isGroupChat && isOnline && (
                      <>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-semibold truncate text-base ${
                        selectedChat === chat 
                          ? isDarkMode ? "text-green-300" : "text-green-700"
                          : ""
                      }`}>
                        {chat.isGroupChat
                          ? chat.chatName
                          : chatSender.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode 
                          ? isOnline ? "bg-green-900/40 text-green-300" : "bg-gray-700 text-gray-400"
                          : isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      } font-medium`}>
                        {chat.isGroupChat ? `${chat.participants.length} members` : (isOnline ? "Online" : "Offline")}
                      </span>
                    </div>
                    {chat.latestMessage ? (
                      <div className={`text-sm truncate ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } bg-opacity-40 rounded py-1`}>
                        <span className={`font-medium ${
                          isDarkMode ? "text-blue-300" : "text-blue-600"
                        }`}>{chat.latestMessage.senderId.username}:</span>{" "}
                        {chat.latestMessage.content}
                      </div>
                    ) : (
                      <div className={`text-xs italic ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      } py-1`}>
                        No messages yet
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`text-center py-12 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            } bg-opacity-70 backdrop-blur-sm rounded-xl p-6 ${
              isDarkMode ? "bg-gray-900/50" : "bg-white/60"
            } shadow-lg`}>
              <div className="mx-auto w-16 h-16 mb-4 ">
                <div className={`p-6 rounded-full text-center ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-800 to-indigo-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                } shadow-lg`}>
                  <FaUserFriends className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="mb-3 text-xl font-semibold">No conversations yet</p>
              <p className="text-sm mb-6">Start a new chat or create a group</p>
              
            </div>
          )}
        </div>
      )}
      {isGroupOpen &&
      <GroupChatModal isGroupOpen={isGroupOpen}
      setIsGroupOpen={setIsGroupOpen}/>
      }
    </div>
  );
}

export default ChatSidebar;