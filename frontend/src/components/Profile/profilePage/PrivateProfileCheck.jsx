import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import defaultBanner from "./defaultBanner.jpg";
import { ChatState } from "../../../context/ChatProvider";
import io from "socket.io-client";
import axios from "axios";
const ENDPOINT = "http://localhost:5000";
let socket;

const PrivateProfileCheck = ({ profile, loggedInUser, onFollow }) => {
  const [canViewProfile, setCanViewProfile] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { notification, setNotification, addNotification } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
useEffect(() => {
    socket = io(ENDPOINT);
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });
    
    socket.emit("setup", loggedInUser);
    
    socket.on("connected", () => {
      console.log("Socket confirmed connected for user:", loggedInUser._id);
      setSocketConnected(true);
    });
    socket.on("follow request received", (notification) => {
      console.log("Received follow request notification:", notification);
      safeAddNotification(
        notification.content, 
        notification.type, 
        notification.data
      );
    });
    
    return () => {
      socket.off("follow request received");
      socket.off("connected");
      socket.off("connect");
      socket.disconnect();
    };
  }, [loggedInUser]);
  
  useEffect(() => {
    if (
      profile.privacy !== "private" ||
      loggedInUser._id === profile._id ||
      profile.followers.some((follower) => follower === loggedInUser._id)
    ) {
      setCanViewProfile(true);
    } else {
      setCanViewProfile(false);
    }
  }, [profile, loggedInUser]);

  if (canViewProfile) {
    return null;
  }
  
  const safeAddNotification = (content, type, data) => {
    if (typeof addNotification === 'function') {
      console.log(true);
      addNotification(content, type, data);
    } else if (setNotification) {
      setNotification(prev => [
        {
          id: Date.now(),
          content,
          type,
          data,
          timestamp: Date.now(),
          read: false
        },
        ...(prev || [])
      ]);
    }
  };
  
  const handleFollow = async () => {
    try {
      await onFollow(profile._id);
      if (socketConnected) {
        const followRequestData = {
          sender: loggedInUser,
          recipient: profile,
          timestamp: new Date()
        };
        socket.emit("follow request", followRequestData);
        safeAddNotification(
          `You sent a follow request to ${profile.name || profile.username}`,
          'follow_request_sent_confirmation',
          {
            recipientId: profile._id,
            recipientName: profile.name || profile.username,
            recipientPic: profile.profileImage ? profile.profileImage : defaultProfileImage
          }
        );
        setCanViewProfile(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  
  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } rounded-lg shadow-md  max-w-4xl mx-auto mt-4`}
    >
      <div className="relative">
        <img
          src={
            profile?.banner
              ? "http://localhost:5000" + profile?.banner
              : defaultBanner
          }
          alt="Profile banner"
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
          <img
            src={
              profile?.profileImage
                ? "http://localhost:5000" + profile?.profileImage
                : defaultProfileImage
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-bold">
          {profile.name || profile.username}
        </h2>
        <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          @{profile.username}
        </p>
        <div className="flex flex-col px-6 pb-6">
          <div className="flex justify-center  items-center space-x-8 my-6">
            <div className="text-center">
              <p className="font-semibold">{profile.posts?.length || 0}</p>
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Posts
              </p>
            </div>
            <div className="text-center border-l border-r px-4">
              <p className="font-semibold">{profile.followers?.length || 0}</p>
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{profile.following?.length || 0}</p>
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Following
              </p>
            </div>
          </div>

          <div
            className={`${
              isDarkMode ? "bg-gray-700" : "bg-gray-100"
            } flex flex-col gap-2 p-4 items-center rounded-lg mb-6`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDarkMode ? "#f1f1f1" : "#333333"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <div>
              <p
                className={`${
                  isDarkMode ? "text-gray-100" : "text-gray-800"
                } font-medium`}
              >
                This account is private
              </p>

              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } text-sm`}
              >
                Follow this account to see their posts
              </p>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`${
              isDarkMode
                ? "bg-green-900 text-green-200 hover:bg-green-700"
                : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
            } py-2 px-6 rounded-full w-full font-medium`}
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateProfileCheck;