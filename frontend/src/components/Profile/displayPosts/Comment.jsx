import React, { useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { setComments } from "../../../reducers/PostReducers";
import { ThemeContext } from "../../../context/ThemeContext";
import './Comment.css';

const getRelativeTime = (createdAt) => {
  const currentTime = new Date();
  const postTime = new Date(createdAt);
  const diffInSeconds = Math.floor((currentTime - postTime) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w`;

  return postTime.toLocaleDateString();
};

const Comment = ({ comment, currentUserId, postOwnerId, postId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};
  const { comments } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const [isDeleted, setIsDeleted] = useState(false);

  const handleDeleteComment = async () => {
    try {
      console.log("Deleting comment with ID:", comment._id);
      
      const res = await axios.delete(
        `http://localhost:5000/api/posts/delete/${comment._id}/comment/${postId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        setIsDeleted(true); // Trigger exit animation
  
        setTimeout(() => {
          const updatedComments = comments.filter(
            (commentItem) => commentItem?._id !== comment._id
          );
          dispatch(setComments(updatedComments));
        }, 300); // Matches motion exit animation time
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error deleting comment");
    }
  };
  
  // Determine if the current user can delete the comment
  const isOwner =
    comment.commentedBy._id === currentUserId || postOwnerId === currentUserId;

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }} // Sliding animation
          transition={{ duration: 0.3 }}
          className="flex mb-3"
          id={`comment-${comment._id}`} 
        >
          {/* Profile Image */}
          <div className="mr-3">
            <img
              src={"http://localhost:5000" + comment?.commentedBy?.profileImage}
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full"
            />
          </div>

          {/* Comment Container */}
          <div className="max-w-[80%] w-fit">
            {/* Comment bubble with dark/light mode support */}
            <div className={`${
                isDarkMode 
                  ? 'bg-gray-700 shadow-gray-900' 
                  : 'bg-gray-100 shadow-gray-200'
              } shadow-md p-3 rounded-lg`}
            >
              <div className="flex items-center justify-between w-full">
                <p className={`font-semibold text-sm ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {comment?.commentedBy?.username}
                </p>
                <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } ml-2 whitespace-nowrap`}
                >
                  {getRelativeTime(comment.createdAt)}
                </span>
              </div>

              {/* Comment Text */}
              <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } break-words`}
              >
                {comment?.text}
              </p>
            </div>

            {/* Reply, Like, Delete (if owner) Options */}
            <div className={`flex text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } mt-1 space-x-3`}
            >
              <span className="cursor-pointer hover:underline">Like</span>
              <span className="cursor-pointer hover:underline">Reply</span>
              {isOwner && (
                <span
                  className="cursor-pointer hover:underline text-red-500"
                  onClick={handleDeleteComment}
                >
                  Delete
                </span>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Comment;