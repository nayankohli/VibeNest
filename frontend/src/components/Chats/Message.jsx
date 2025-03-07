import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import UseGetAllMessage from './hooks/UseGetAllMessage';
import UseGetRTM from './hooks/UseGetRTM';
import { Link } from 'react-router-dom';
import './Message.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{faCheckToSlot,
    faTrash,
    faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
const Message = () => {
    UseGetRTM();
    UseGetAllMessage();

    const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
    const { messages } = useSelector(store => store.chat);
    const { userInfo } = useSelector(state => state.userLogin);

    const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

    const messagesEndRef = useRef(null);

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
    
    
    

    return (
        <div className="flex flex-col gap-3 px-4 h-screen overflow-y-auto custom-scrollbar relative">
            <div className="flex flex-col justify-center items-center gap-2 mb-40 mt-10">
                <img 
                    src={selectedUser?.profileImage ? "http://localhost:5000" + selectedUser.profileImage : defaultProfileImage}
                    alt={selectedUser?.name} 
                    className="w-40 h-40 rounded-full"
                />
                <h2 className="font-bold text-3xl">{selectedUser?.name}</h2>
                <p className="text-gray-600">{selectedUser?.username}</p>
                <Link to={`/profile/${selectedUser?._id}`}>
                    <button className="bg-gray-300 text-md font-medium p-1 px-3 rounded-lg hover:bg-gray-400">
                        View Profile
                    </button>
                </Link>
            </div>

            {Object.keys(groupedMessages).map((dateKey) => (
                <div key={dateKey}>
                    <div className="text-center text-gray-500 text-sm font-semibold my-2">
                        {formatDate(dateKey)}
                    </div>

                    {groupedMessages[dateKey].map((msg, index) => {
                        const isSentByCurrentUser = msg.senderId === userInfo._id;

                        return (
                            <div 
                                key={msg._id} 
                                className={`flex items-end ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
                                ref={index === groupedMessages[dateKey].length - 1 ? messagesEndRef : null}
                                
                            >
                                {!isSentByCurrentUser && (
                                    <img 
                                        src={selectedUser?.profileImage ? `http://localhost:5000${selectedUser.profileImage}` : defaultProfileImage} 
                                        alt="Sender Profile" 
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                )}

                                <div className="flex flex-col max-w-[70%] mb-3">
                                    {editingMessage === msg._id ? (
                                        <input 
                                            type="text" 
                                            value={editedText} 
                                            onChange={(e) => setEditedText(e.target.value)} 
                                            className="p-2 border border-gray-400 rounded-lg"
                                             
                                            autoFocus
                                        />
                                    ) : (
                                        <div className={`p-2 px-3 rounded-lg break-words shadow-md ${
                                            isSentByCurrentUser
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-300 text-black"
                                        }`}
                                        onClick={() => handleMessageClick(msg)}>
                                            {msg.message}
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-500 mt-1 text-right">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {isSentByCurrentUser && (
                                    <img 
                                        src={userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage} 
                                        alt="Your Profile" 
                                        className="w-8 h-8 rounded-full ml-2"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}

{isDropdownOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={closeDialog}>
        <div ref={dropdownRef} className=" bg-white   p-2 rounded-lg  dialog-box" onClick={(e) => e.stopPropagation()}>

            {selectedMessage && (
    <div className={`p-2 px-3 rounded-lg break-words text-center shadow-md w-auto ${
        selectedMessage.senderId === userInfo._id ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
    }`}>
        {selectedMessage.message}
    </div>
)}


            <div className="flex flex-col w-80 font-7 justify-center text-left rounded-lg p-3 gap-0 mt-4">
                <button className="px-4 py-2  hover:bg-green-300 hover:text-white"><div className='flex gap-3'><FontAwesomeIcon icon={faCheckToSlot} className="text-xl" /><p>Select</p></div></button>
                <button className="px-4 py-2  hover:bg-green-300 hover:text-white border-b-2 border-t-2 border-gray-400"><div className='flex gap-3'><FontAwesomeIcon icon={faTrash} className="text-xl" /><p>Delete</p></div></button>
                <button className="px-4 py-2  hover:bg-green-300 hover:text-white"><div className='flex gap-3'><FontAwesomeIcon icon={faPenToSquare} className="text-xl" /><p>Edit</p></div></button>
            </div>
        </div>
    </div>
)}


            <div ref={messagesEndRef} />
        </div>
    );
};

export default Message;
