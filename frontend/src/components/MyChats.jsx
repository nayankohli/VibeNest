import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getSender,setSelectedChat } from '../actions/ChatActions';
import ChatLoading from './ChatLoading';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const MyChats = ({ fetchAgain }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat/', {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      });
      console.log("fetched data:"+data)
      setChats(data);
    } catch (error) {
      alert('Failed to load chats');
    }
  };  // Import the action
  // Dispatch action to set selected chat
  const handleChatSelect = (chat) => {
    console.log("chat selected"+chat);
    dispatch(setSelectedChat(chat));  // Dispatch the chat selection
  };
  
  useEffect(() => {
      if (!userInfo) {
        navigate("/login");
      } else {
        fetchChats();
      }
    }, [dispatch, navigate, userInfo,fetchAgain]);

  return (
    <div className="flex flex-col items-center p-4 bg-white w-full max-w-sm rounded-lg border border-gray-300">
      <div className="flex justify-between w-full pb-3 px-3">
        <h2 className="text-xl font-sans">My Chats</h2>
        <GroupChatModal>
          <button className="flex items-center text-sm p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">
            <span className="mr-2">+</span> New Group Chat
          </button>
        </GroupChatModal>
      </div>
      <div className="flex flex-col p-3 bg-gray-100 w-full h-full rounded-lg overflow-y-hidden">
        {chats.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatSelect(chat)}
              className={`cursor-pointer p-2 rounded-lg mb-2 ${selectedChat === chat._id ? 'bg-teal-500 text-white' : 'bg-gray-200'}`}
            >
              <span className="text-lg">
                {!chat.isGroupChat ? getSender(userInfo, chat.users) : chat.chatName}
              </span>
              {chat.latestMessage && (
                <span className="text-xs text-gray-500 block mt-1">
                  <strong>{chat.latestMessage.sender.name}:</strong> {chat.latestMessage.content.length > 50
                    ? `${chat.latestMessage.content.substring(0, 51)}...`
                    : chat.latestMessage.content}
                </span>
              )}
            </div>
          ))
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
};

export default MyChats;
