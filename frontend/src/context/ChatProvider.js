import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  // Custom notification setter that updates both state and localStorage
  const updateNotification = (newNotifications) => {
    setNotification(newNotifications);
    localStorage.setItem("chatNotifications", JSON.stringify(newNotifications));
  };

  // Add a new function to create specific types of notifications
  const addNotification = (content, type, data = {}) => {
    const newNotification = {
      id: Date.now(),
      content,
      type, // 'message', 'birthday', 'like', 'follow', etc.
      data, // any additional data specific to this notification type
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedNotifications = [newNotification, ...notification];
    updateNotification(updatedNotifications);
    return newNotification;
  };

  // Function to mark notifications as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notification.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    updateNotification(updatedNotifications);
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notification.map(notif => ({ ...notif, read: true }));
    updateNotification(updatedNotifications);
  };

  // Filter notifications by type
  const getNotificationsByType = (type) => {
    return notification.filter(notif => notif.type === type);
  };

  useEffect(() => {
    // Load user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  
    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem("chatNotifications");
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotification(parsedNotifications);
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        localStorage.removeItem("chatNotifications"); // Clear invalid data
      }
    }
  
    // Only redirect if not already on login or register page
    if (!userInfo && 
        !window.location.pathname.includes("/login") && 
        !window.location.pathname.includes("/register")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification: updateNotification, // Use custom setter instead
        chats,
        setChats,
        // New notification functions
        addNotification,
        markAsRead,
        markAllAsRead,
        getNotificationsByType
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;