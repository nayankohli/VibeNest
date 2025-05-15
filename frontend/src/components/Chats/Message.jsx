import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckToSlot, faTrash, faPenToSquare, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider";
import UpdateGroupModal from "./UpdateGroupModal";
import axios from 'axios';
import { toast } from 'sonner';
import "./Message.css";
import { getSender } from '../../actions/ChatActions';
import API_CONFIG from '../../config/api-config';
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
            return userInfo?.profileImage ? userInfo.profileImage: defaultProfileImage;
        }
        
        if (isGroup) {
            if (selectedChat?.participants) {
                const sender = selectedChat.participants.find(p => p._id === msg.senderId._id);
                return sender?.profileImage ? sender.profileImage : defaultProfileImage;
            }
            return defaultProfileImage;
        }
        
        return selectedUser?.profileImage ? selectedUser.profileImage : defaultProfileImage;
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
            
            const res = await axios.delete(`${API_CONFIG.BASE_URL}/api/message/${selectedMessage._id}`, {
                headers: { "Content-type": "application/json", Authorization: `Bearer ${userInfo.token}` }
            });
            
            if(res.data.success){
                const updatedMessages = messages.filter(msg => msg._id !== selectedMessage._id);
                setFetchAgain(!fetchAgain);
                setMessages(updatedMessages);
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
            
            const res = await axios.delete(`${API_CONFIG.BASE_URL}/api/message/bulk`, {
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
            const res = await axios.put(`${API_CONFIG.BASE_URL}/api/message/${editingMessage}`, 
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
        <div className={`flex flex-col h-screen overflow-y-auto custom-scrollbar relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'}`}>
            {/* Profile Header */}
            <div className={`flex flex-col items-center pt-8 pb-6 mb-4   transition-all duration-300`}>
                <div className=" mb-4 group">
                    <img 
                        src={
                            isGroup
                                ?  selectedChat?.profileImage || defaultProfileImage
                                : selectedUser?.profileImage ? selectedUser.profileImage : defaultProfileImage
                        }
                        alt={isGroup ? selectedChat?.chatName : selectedUser?.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-green-500 shadow-lg transition-transform duration-300 transform group-hover:scale-105"
                    />
                </div>

                <h2 className="font-bold text-2xl mb-1">
                    {isGroup ? selectedChat?.chatName : selectedUser?.name}
                </h2>
                
                {!isGroup && (
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                        @{selectedUser?.username}
                    </p>
                )}

                {isGroup ? (
                    <UpdateGroupModal 
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                    />
                ) : (
                    <Link to={`/profile/${selectedUser?._id}`}>
                        <button className={`${isDarkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                            : 'bg-green-500 hover:bg-green-600 text-white'} 
                            py-2 px-4 rounded-lg font-medium transition-colors duration-200 shadow-md`}>
                            View Profile
                        </button>
                    </Link>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-24">
                {Object.keys(groupedMessages || {}).map((dateKey) => (
                    <div key={dateKey} className="mb-6">
                        <div className=" flex items-center my-4">
                            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full mx-4 ${
                                isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                                {formatDate(dateKey)}
                            </span>
                            <div className={`flex-grow border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
                        </div>

                        {groupedMessages[dateKey].map((msg, index) => {
                            const isSentByCurrentUser = msg.senderId._id === userInfo._id;
                            const isSelected = selectedMessages.some(m => m._id === msg._id);

                            return (
                                <div 
                                    key={msg._id} 
                                    className={`flex w-full mb-4 ${isSentByCurrentUser ? "justify-end" : "justify-start"} 
                                               animate-fadeIn`}
                                    ref={index === groupedMessages[dateKey].length - 1 ? messagesEndRef : null}
                                >
                                    {!isSentByCurrentUser && (
                                        <div className="mr-2 self-end">
                                            <img 
                                                src={getSenderImage(msg)} 
                                                alt="Sender" 
                                                className="w-8 h-8 rounded-full object-cover border-2 border-green-500 shadow-sm"
                                            />
                                        </div>
                                    )}

                                    <div className={`flex flex-col max-w-[70%]`}>
                                        {isGroup && !isSentByCurrentUser && (
                                            <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'} mb-1 ml-1`}>
                                                {msg.senderId.name || msg.senderId.username}
                                            </span>
                                        )}
                                        
                                        {editingMessage === msg._id ? (
                                            <div className="flex flex-col gap-2">
                                                <input 
                                                    type="text" 
                                                    value={editedText} 
                                                    onChange={(e) => setEditedText(e.target.value)} 
                                                    className={`p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                        isDarkMode 
                                                            ? 'bg-gray-700 border-gray-600 text-white' 
                                                            : 'border border-gray-300 text-black'
                                                    }`}
                                                    autoFocus
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={cancelEdit}
                                                        className={`p-2 rounded-lg ${
                                                            isDarkMode 
                                                                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                        } transition-colors duration-200`}
                                                    >
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </button>
                                                    <button 
                                                        onClick={submitEditedMessage}
                                                        className={`p-2 rounded-lg ${
                                                            !editedText.trim() 
                                                                ? 'bg-green-300 cursor-not-allowed text-white' 
                                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                                        } transition-colors duration-200`}
                                                        disabled={!editedText.trim()}
                                                    >
                                                        <FontAwesomeIcon icon={faCheck} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div 
                                                className={`p-3 rounded-2xl break-words shadow-md transition-all duration-200 ${
                                                    isSelectionMode && isSelected 
                                                        ? "bg-blue-500 text-white relative" 
                                                        : isSentByCurrentUser
                                                            ? "bg-green-500 text-white rounded-tr-none"
                                                            : isDarkMode 
                                                                ? "bg-gray-700 text-white rounded-tl-none" 
                                                                : "bg-white text-gray-800 rounded-tl-none shadow-lg"
                                                } ${(isSelectionMode && isMessageSelectable(msg)) || (!isSelectionMode && isSentByCurrentUser) 
                                                    ? "cursor-pointer hover:shadow-lg" 
                                                    : ""}`}
                                                onClick={() => (isSelectionMode && isMessageSelectable(msg)) || (!isSelectionMode && isSentByCurrentUser) 
                                                    ? handleMessageClick(msg) 
                                                    : null}
                                            >
                                                {isSelectionMode && isSelected && (
                                                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 border-2 border-white shadow-md">
                                                        <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                                    </div>
                                                )}
                                                <span className="text-sm md:text-base">{msg.content}</span>
                                                {msg.isEdited && (
                                                    <span className="text-xs ml-2 opacity-70 italic">(edited)</span>
                                                )}
                                            </div>
                                        )}

                                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1 ${isSentByCurrentUser ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    {isSentByCurrentUser && (
                                        <div className="ml-2 self-end">
                                            <img 
                                                src={userInfo?.profileImage ? userInfo.profileImage : defaultProfileImage} 
                                                alt="You" 
                                                className="w-8 h-8 object-cover rounded-full border-2 border-green-500 shadow-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Selection Mode Bar */}
            {isSelectionMode && (
                <div className={`fixed bottom-0 left-0 right-0 z-40 ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } p-4 border-t flex justify-between items-center shadow-lg transition-all duration-300`}>
                    <div className="flex items-center gap-2 w-full">
                        <span className={`font-medium text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {selectedMessages.length} selected
                        </span>
                        
                        <div className="flex gap-3 ml-auto">
                            <button 
                                onClick={exitSelectionMode}
                                className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                                    isDarkMode 
                                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                                <span className="font-medium">Cancel</span>
                            </button>
                            
                            <button 
                                onClick={handleBulkMessageDelete}
                                disabled={selectedMessages.length === 0 || isDeleting}
                                className={`py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200 ${
                                    selectedMessages.length === 0 || isDeleting
                                        ? 'bg-red-300 cursor-not-allowed text-white'
                                        : 'bg-red-500 hover:bg-red-600 text-white'
                                }`}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <span className="font-medium">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dialog Modal */}
            {isDropdownOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-200" onClick={closeDialog}>
                    <div 
                        ref={dropdownRef} 
                        className={`${
                            isDarkMode 
                                ? 'bg-gray-800 text-white border border-gray-700' 
                                : 'bg-white text-gray-800 border border-gray-200'
                        } rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300`} 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {selectedMessage && (
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className={`p-3 rounded-xl break-words text-center shadow-md ${
                                    selectedMessage.senderId._id === userInfo._id 
                                        ? "bg-green-500 text-white" 
                                        : isDarkMode
                                            ? "bg-gray-700 text-white"
                                            : "bg-gray-100 text-gray-800"
                                }`}>
                                    {selectedMessage.content}
                                </div>
                            </div>
                        )}

                        <div className="w-72 sm:w-80">
                            <button 
                                className={`w-full text-left px-4 py-3 flex gap-3 items-center ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                                } transition-colors duration-150`}
                                onClick={enterSelectionMode}
                            >
                                <FontAwesomeIcon icon={faCheckToSlot} className="text-lg text-green-500" />
                                <span className="font-medium">Select messages</span>
                            </button>
                            
                            <button 
                                className={`w-full text-left px-4 py-3 flex gap-3 items-center ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700 border-gray-700' 
                                        : 'hover:bg-gray-100 border-gray-200'
                                } transition-colors duration-150 border-t border-b`}
                                onClick={handleSingleMessageDelete}
                                disabled={isDeleting}
                            >
                                <FontAwesomeIcon icon={faTrash} className="text-lg text-red-500" />
                                <span className="font-medium">{isDeleting ? 'Deleting...' : 'Delete message'}</span>
                            </button>
                            
                            <button 
                                className={`w-full text-left px-4 py-3 flex gap-3 items-center ${
                                    isDarkMode 
                                        ? 'hover:bg-gray-700' 
                                        : 'hover:bg-gray-100'
                                } transition-colors duration-150`}
                                onClick={handleEditMessage}
                                disabled={!selectedMessage}
                            >
                                <FontAwesomeIcon icon={faPenToSquare} className="text-lg text-green-500" />
                                <span className="font-medium">Edit message</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;