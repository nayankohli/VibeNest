import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Message.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faTrash, faPenToSquare, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider";
import UpdateGroupModal from "./UpdateGroupModal";
import axios from 'axios';
import { toast } from 'sonner';

const Message = ({ messages, fetchAgain, setFetchAgain, setMessages }) => {
    const { isDarkMode } = useContext(ThemeContext);
    const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
    const { userInfo } = useSelector(state => state.userLogin);
    const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    const messagesEndRef = useRef(null);
    const { selectedChat } = ChatState();
    
    const [editingMessage, setEditingMessage] = useState(null);
    const [editedText, setEditedText] = useState("");
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const dropdownRef = useRef(null);
    const isGroup = selectedChat?.isGroupChat;

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
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setSelectedMessage(null);
                setIsDropdownOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDropdownOpen]);
    
    const getSenderImage = (msg) => {
        if (msg.senderId._id === userInfo._id) {
            return userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage;
        }
        
        if (isGroup) {
            if (selectedChat?.participants) {
                const sender = selectedChat.participants.find(p => p._id === msg.senderId._id);
                return sender?.profileImage ? `http://localhost:5000${sender.profileImage}` : defaultProfileImage;
            }
            return defaultProfileImage;
        }
        
        return selectedUser?.profileImage ? `http://localhost:5000${selectedUser.profileImage}` : defaultProfileImage;
    };
    const handleMessageClick = (msg) => {
        if (isSelectionMode) {
            toggleMessageSelection(msg);
        } else {
            if (msg.senderId._id === userInfo._id) {
                setSelectedMessage(msg);
                setIsDropdownOpen(true);
            }
        }
    };
    const closeDialog = () => {
        setSelectedMessage(null);
        setIsDropdownOpen(false);
    };
    const enterSelectionMode = () => {
        if (selectedMessage) {
            setSelectedMessages([selectedMessage]);
        }
        setIsSelectionMode(true);
        setIsDropdownOpen(false);
    };

    // Toggle selection of a message
    const toggleMessageSelection = (msg) => {
        setSelectedMessages(prev => {
            const isSelected = prev.some(m => m._id === msg._id);
            if (isSelected) {
                return prev.filter(m => m._id !== msg._id);
            } else {
                return [...prev, msg];
            }
        });
    };
    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedMessages([]);
    };
    const handleSingleMessageDelete = async () => {
        if (!selectedMessage) return;
        
        try {
            setIsDeleting(true);
            
            const res=await axios.delete(`http://localhost:5000/api/message/${selectedMessage._id}`, {
                headers: { "Content-type": "application/json", Authorization: `Bearer ${userInfo.token}` }
            });
            if(res.data.success){
                const updatedMessages = messages.filter(msg => msg._id !== selectedMessage._id);
            setFetchAgain(!fetchAgain);
            setMessages(updatedMessages)
            toast.success(res.data.message);
            }
            
            setIsDropdownOpen(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to delete message');
        } finally {
            setIsDeleting(false);
        }
    };
    const handleBulkMessageDelete = async () => {
        if (selectedMessages.length === 0) return;
        
        try {
            setIsDeleting(true);
            const allowedMessageIds = selectedMessages
                .filter(msg => msg.senderId._id === userInfo._id)
                .map(msg => msg._id);
                
            if (allowedMessageIds.length === 0) {
                toast.error("You can only delete your own messages");
                return;
            }
            const res = await axios.delete(`http://localhost:5000/api/message/bulk`, {
                headers: { 
                    "Content-type": "application/json", 
                    Authorization: `Bearer ${userInfo.token}` 
                },
                data: { messageIds: allowedMessageIds } 
            });

            if(res.data.success){
                const updatedMessages = messages.filter(msg => !allowedMessageIds.includes(msg._id));
            setMessages(updatedMessages);
            
            setFetchAgain(!fetchAgain);
        
            toast.success(`${allowedMessageIds.length} message(s) deleted successfully`);
            if (allowedMessageIds.length < selectedMessages.length) {
                toast.warning(`${selectedMessages.length - allowedMessageIds.length} message(s) weren't deleted (you can only delete your own messages)`);
            }
            }
            exitSelectionMode();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response?.data?.message || 'Failed to delete messages');
        } finally {
            setIsDeleting(false);
        }
    };
    const handleEditMessage = () => {
        if (!selectedMessage) return;
        
        setEditingMessage(selectedMessage._id);
        setEditedText(selectedMessage.content);
        setIsDropdownOpen(false);
    };
    const submitEditedMessage = async () => {
        if (!editingMessage || !editedText.trim()) return;
        
        try {
            const res=await axios.put(`http://localhost:5000/api/message/${editingMessage}`, 
                { content: editedText },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`
                    }
                }
            );
            if (res.data.success) {
                const updatedMessages = messages.map(msg => 
                    msg._id === editingMessage ? { ...msg, content: editedText } : msg
                );
                setMessages(updatedMessages);
                
                setFetchAgain(!fetchAgain);
                
                toast.success('Message updated successfully');
            }
            cancelEdit();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update message');
        }
    };
    const cancelEdit = () => {
        setEditingMessage(null);
        setEditedText("");
    };
    const isMessageSelectable = (msg) => {
        return msg.senderId._id === userInfo._id;
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

            {/* Messages Section */}
            <div className={`pb-28`}>
                {Object.keys(groupedMessages || {}).map((dateKey) => (
                    <div key={dateKey}>
                        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm font-semibold my-2`}>
                            {formatDate(dateKey)}
                        </div>

                        {groupedMessages[dateKey].map((msg, index) => {
                            // Check if the message is sent by the current user
                            const isSentByCurrentUser = msg.senderId._id === userInfo._id;
                            const isSelected = selectedMessages.some(m => m._id === msg._id)

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
                                            <div className="flex flex-col gap-2">
                                                <input 
                                                    type="text" 
                                                    value={editedText} 
                                                    onChange={(e) => setEditedText(e.target.value)} 
                                                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-400 text-black'}`}
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={cancelEdit}
                                                        className={`p-1 px-2 rounded ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                    <button 
                                                        onClick={submitEditedMessage}
                                                        className="p-1 px-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
                                                        disabled={!editedText.trim()}
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div 
                                                className={`p-2 px-3 rounded-lg break-words shadow-md ${
                                                    isSelectionMode && isSelected 
                                                        ? "bg-blue-500 text-white" 
                                                        : isSentByCurrentUser
                                                            ? "bg-green-500 text-white rounded-tr-none"
                                                            : isDarkMode 
                                                                ? "bg-gray-700 text-white rounded-tl-none" 
                                                                : "bg-gray-300 text-black rounded-tl-none"
                                                } ${(isSelectionMode) || (!isSelectionMode && isSentByCurrentUser) ? "cursor-pointer" : ""} relative`}
                                                onClick={() => (isSelectionMode) || (!isSelectionMode && isSentByCurrentUser) ? handleMessageClick(msg) : null}
                                            >
                                                {isSelectionMode && isSelected && (
                                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
                                                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                    </div>
                                                )}
                                                {msg.content}
                                                {msg.isEdited && (
                                                    <span className="text-xs ml-2 opacity-70">(edited)</span>
                                                )}
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

            {/* Fixed Bottom Action Buttons for Selection Mode */}
            {isSelectionMode && (
                <div className={`fixed bottom-0 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-3 border-t flex justify-between items-center shadow-lg`}>
                    <div className="flex items-center gap-2 w-full">
                        <span className="font-medium">{selectedMessages.length} selected</span>
                        
                        <div className="flex gap-2 ml-auto">
                            <button 
                                onClick={exitSelectionMode}
                                className={`p-2 px-4 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                Cancel
                            </button>
                            
                            <button 
                                onClick={handleBulkMessageDelete}
                                disabled={selectedMessages.length === 0 || isDeleting}
                                className={`p-2 px-4 rounded-lg flex items-center gap-2 ${
                                    selectedMessages.length === 0 || isDeleting
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Action Dropdown */}
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
                            <button 
                                className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800' : 'hover:bg-green-300'} hover:text-white`}
                                onClick={enterSelectionMode}
                            >
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faCheckToSlot} className="text-xl" />
                                    <p>Select</p>
                                </div>
                            </button>
                            <button 
                                className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800 border-gray-600' : 'hover:bg-green-300 border-gray-400'} hover:text-white border-b border-t`}
                                onClick={handleSingleMessageDelete}
                                disabled={isDeleting}
                            >
                                <div className="flex gap-3">
                                    <FontAwesomeIcon icon={faTrash} className="text-xl" />
                                    <p>{isDeleting ? 'Deleting...' : 'Delete'}</p>
                                </div>
                            </button>
                            <button 
                                className={`px-4 py-2 ${isDarkMode ? 'hover:bg-green-800' : 'hover:bg-green-300'} hover:text-white`}
                                onClick={handleEditMessage}
                                disabled={!selectedMessage}
                            >
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