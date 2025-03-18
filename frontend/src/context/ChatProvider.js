import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const navigate = useNavigate();

  const updateNotification = (newNotifications) => {
    setNotification(newNotifications);
    localStorage.setItem("chatNotifications", JSON.stringify(newNotifications));
  };

  const addNotification = (content, type, data = {}) => {
    const newNotification = {
      id: Date.now(),
      content,
      type,
      data, 
      read: false,
      createdAt: new Date().toISOString(),
    };
    return newNotification;
  };
  const markAsRead = (notificationId) => {
    const updatedNotifications = notification.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    updateNotification(updatedNotifications);
  };
  const markAllAsRead = () => {
    const updatedNotifications = notification.map(notif => ({ ...notif, read: true }));
    updateNotification(updatedNotifications);
  };
  const getNotificationsByType = (type) => {
    return notification.filter(notif => notif.type === type);
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    const savedNotifications = localStorage.getItem("chatNotifications");
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotification(parsedNotifications);
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        localStorage.removeItem("chatNotifications");
      }
    }
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