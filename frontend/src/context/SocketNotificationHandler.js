
import React, { useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket;
const SocketNotificationHandler = ({ children }) => {
  const { 
    user, 
    addNotification, 
    notifications 
  } = ChatState();
  useEffect(() => {
    if (user) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);

      // Socket event listeners for different notification types
      socket.on("message received", (newMessageReceived) => {
        // Format the message notification
        const messageNotification = {
          id: newMessageReceived.id,
          type: "message",
          sender: newMessageReceived.sender,
          content: newMessageReceived.content,
          chat: newMessageReceived.chat,
          read: false,
          createdAt: newMessageReceived.createdAt
        };

        addNotification(messageNotification);
      });

      socket.on("follow request", (followRequest) => {
        // Format the follow request notification
        const followNotification = {
          id: followRequest.id || Date.now().toString(),
          type: "followRequest",
          sender: followRequest.sender,
          content: `${followRequest.sender.name} requested to follow you`,
          read: false,
          responded: false,
          createdAt: followRequest.createdAt || new Date().toISOString()
        };

        addNotification(followNotification);
      });

      // Add more socket listeners for other notification types

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);
  return <>{children}</>;
};
export default SocketNotificationHandler;