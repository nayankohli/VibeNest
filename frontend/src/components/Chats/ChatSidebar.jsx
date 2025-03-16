import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { setSelectedUser } from "../../actions/UserActions";
import Loading from "../Loading";
import SideDrawer from "./SideDrawer";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../actions/ChatActions";
import GroupChatModal from './GroupChatModal'
function ChatSidebar({ fetchAgain }) {
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const [loggedUser, setLoggedUser] = useState();
  const { userInfo } = useSelector((state) => state.userLogin);
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const followingList = useSelector((state) => state.followingList);
  const { following = [], followingLoading } = followingList;
  const { onlineUsers } = useSelector((store) => store.chat);
  const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  // Toast notifications for errors

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
      console.log(chats);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`w-1/3 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white"
      } border-r ${
        isDarkMode ? "border-gray-700" : ""
      } p-3 overflow-auto rounded-l-lg`}
    >
      <div className={`py-2 mb-4 flex items-center justify-between border-b ${
          isDarkMode ? "border-gray-700" : ""
        } `}>
      <h2
        className={`text-xl font-bold py-3`}
      >
        My Chats{" "}
        <span
          className={`${
            isDarkMode
              ? "bg-green-900 text-green-300"
              : "bg-green-100 text-green-600"
          } px-2 py-1 rounded-full text-xs`}
        >
          {chats.length}
        </span>
      </h2>
      <div>
        <GroupChatModal/>
      </div>
      </div>
      

      <div className="relative mb-4">
        <SideDrawer />
      </div>

      {followingLoading ? (
        <Loading />
      ) : (
        <div className="space-y-2">
          {chats?.length > 0 ? (
            chats.map((chat) => (
              <div
  key={chat._id}
  onClick={() => {
    setSelectedChat(chat);
    if(!chat.isGroupChat)
    dispatch(setSelectedUser(getSender(loggedUser, chat.participants)));
  }}
  className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
    selectedChat === chat
      ? "bg-green-600/30"
      : isDarkMode
      ? "bg-gray-700 text-white hover:bg-gray-600"
      : "bg-gray-200 hover:bg-gray-300"
  }`}
>
  {!chat.isGroupChat ? (
    <img
      src={`http://localhost:5000${
        getSender(loggedUser, chat.participants).profileImage
      }`||defaultProfileImage}
      alt={getSender(loggedUser, chat.participants).name}
      className="w-12 h-12 rounded-full object-cover"
    />
  ):(
    <img
      src={chat.profileImage?"http://localhost:5000"+chat?.profileImage :defaultProfileImage }
      className="w-12 h-12 rounded-full object-cover"
    />
  )}
  <div>
    <div className="font-semibold">
      {chat.isGroupChat
        ? chat.chatName
        : getSender(loggedUser, chat.participants).name}
    </div>
    {chat.latestMessage && (
      <div className="text-xs">
        <b>{chat.latestMessage.senderId.username}:</b>{" "}
        {chat.latestMessage.content.length > 50
          ? chat.latestMessage.content.substring(0, 50) + "..."
          : chat.latestMessage.content}
      </div>
    )}
  </div>
</div>

            ))
          ) : (
            <p>No chats available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatSidebar;
