import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Message.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider";
import UpdateGroupModal from "./UpdateGroupModal";

const Message = ({ messages, fetchAgain, setFetchAgain }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
    const { userInfo } = useSelector(state => state.userLogin);
    const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    const messagesEndRef = useRef(null);
    const { selectedChat } = ChatState();
    const [editingMessage, setEditingMessage] = useState(null);
    const [editedText, setEditedText] = useState("");
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Today";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', weekday: 'short', year: 'numeric' });
        }
    };

    const groupedMessages = messages?.reduce((acc, msg) => {
        const msgDate = new Date(msg.createdAt).toDateString();
        if (!acc[msgDate]) {
            acc[msgDate] = [];
        }
        acc[msgDate].push(msg);
        return acc;
    }, {});

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const dropdownRef = useRef(null);
    
    const handleMessageClick = (msg) => {
        setSelectedMessage(msg);
        setIsDropdownOpen(true);
    };

    const closeDialog = () => {
        setSelectedMessage(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedMessage(null);  // Ensure modal closes
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    const isGroup = selectedChat?.isGroupChat;

    // Helper function to get the appropriate sender image
    const getSenderImage = (msg) => {
        // If it's your message, show your image
        if (msg.senderId._id === userInfo._id) {
            return userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage;
        }
        
        // If it's a group chat, find the sender's image
        if (isGroup) {
            // Find the sender in participants if available
            if (selectedChat?.participants) {
                const sender = selectedChat.participants.find(p => p._id === msg.senderId._id);
                return sender?.profileImage ? `http://localhost:5000${sender.profileImage}` : defaultProfileImage;
            }
            return defaultProfileImage;
        }
        
        // If it's a direct chat, show the other person's image
        return selectedUser?.profileImage ? `http://localhost:5000${selectedUser.profileImage}` : defaultProfileImage;
    };

    return (
        <div className={`flex flex-col gap-3 px-4 h-screen overflow-y-auto custom-scrollbar relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <div className="flex flex-col justify-center items-center gap-2 mb-40 mt-10">
                <div className="rounded-full">
                    <img 
                        src={
                            isGroup
                                ? "http://localhost:5000" + selectedChat?.profileImage || defaultProfileImage
                                : selectedUser?.profileImage ? "http://localhost:5000" + selectedUser.profileImage : defaultProfileImage
                        }
                        alt={isGroup ? selectedChat?.chatName : selectedUser?.name}
                        className="w-40 h-40 rounded-full object-cover border-2 border-blue-500"
                    />
                </div>

                <h2 className="font-bold text-3xl">
                    {isGroup ? selectedChat?.chatName : selectedUser?.name}
                </h2>
                
                {!isGroup && (
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedUser?.username}</p>
                )}

                {isGroup ? (
                    <UpdateGroupModal 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                ) : (
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <button className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-md font-medium p-1 px-3 rounded-lg`}>
                            View Profile
                        </button>
                    </Link>
                )}
            </div>

            <div className="pb-20">
                {Object.keys(groupedMessages || {}).map((dateKey) => (
                    <div key={dateKey}>
                        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold my-2`}>
                            {formatDate(dateKey)}
                        </div>

                        {groupedMessages[dateKey].map((msg, index) => {
                            // Check if the message is sent by the current user
                            const isSentByCurrentUser = msg.senderId._id === userInfo._id;

                            return (
                                <div 
                                    key={msg._id} 
                                    className={`flex w-full mb-4 ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                                    ref={index === groupedMessages[dateKey].length - 1 ? messagesEndRef : null}
                                >
                                    {/* Show sender's avatar for messages not sent by current user */}
                                    {!isSentByCurrentUser && (
                                        <div className="mr-2 self-end">
                                            <img 
                                                src={getSenderImage(msg)} 
                                                alt="Sender" 
                                                className="w-8 h-8 rounded-full object-cover border border-blue-500"
                                            />
                                        </div>
                                    )}

                                    <div className={`flex flex-col max-w-[70%]`}>
                                        {/* Display sender name in group chats */}
                                        {isGroup && !isSentByCurrentUser && (
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-1 ml-1`}>
                                                {msg.senderId.name || msg.senderId.username}
                                            </span>
                                        )}
                                        
                                        {editingMessage === msg._id ? (
                                            <input 
                                                type="text" 
                                                value={editedText} 
                                                onChange={(e) => setEditedText(e.target.value)} 
                                                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-400 text-black'}`}
                                                autoFocus
                                            />
                                        ) : (
                                            <div 
                                                className={`p-2 px-3 rounded-lg break-words shadow-md ${
                                                    isSentByCurrentUser
                                                        ? "bg-green-500 text-white rounded-tr-none"
                                                        : isDarkMode 
                                                            ? "bg-gray-700 text-white rounded-tl-none" 
                                                            : "bg-gray-300 text-black rounded-tl-none"
                                                }`}
                                                onClick={() => handleMessageClick(msg)}
                                            >
                                                {msg.content}
                                            </div>
                                        )}

                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 ${isSentByCurrentUser ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Show current user's avatar for messages sent by current user */}
                                    {isSentByCurrentUser && (
                                        <div className="ml-2 self-end">
                                            <img 
                                                src={userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage} 
                                                alt="You" 
                                                className="w-8 h-8 object-cover rounded-full border border-blue-500"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {isDropdownOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={closeDialog}>
                    <div 
                        ref={dropdownRef} 
                        className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-2 rounded-lg dialog-box`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedMessage && (
                            <div className={`p-2 px-3 rounded-lg break-words text-center shadow-md w-auto ${
                                selectedMessage.senderId._id === userInfo._id 
                                    ? "bg-green-500 text-white" 
                                    : isDarkMode
                                        ? "bg-gray-700 text-white"
                                        : "bg-gray-300 text-black"
                            }`}>
                                {selectedMessage.content}
                            </div>
                        )}

                        <div className="flex flex-col w-80 font-7 justify-center text-left rounded-lg p-3 gap-0 mt-4">
                            <button className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800' : 'hover:bg-green-300'} hover:text-white`}>
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faCheckToSlot} className="text-xl" />
                                    <p>Select</p>
                                </div>
                            </button>
                            <button className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800 border-gray-600' : 'hover:bg-green-300 border-gray-400'} hover:text-white border-b border-t`}>
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                    <p>Delete</p>
                                </div>
                            </button>
                            <button className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800' : 'hover:bg-green-300'} hover:text-white`}>
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-xl" />
                                    <p>Edit</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default Message;