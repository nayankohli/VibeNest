import React, { useState, useContext, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { setComments, setReplies } from "../../../../reducers/PostReducers"; // Update reducer import
import { ThemeContext } from "../../../../context/ThemeContext";
import './Comment.css';
import { toast } from "sonner";

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
  const { comments, replies } = useSelector((store) => store.post); // Update to access replies
  const dispatch = useDispatch();
  
  const [isDeleted, setIsDeleted] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(comment.likes?.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(comment.likes?.length || 0);
  const [showReplies, setShowReplies] = useState(false);
  const [commentReplies, setCommentReplies] = useState([]);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (isReplying && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isReplying]);

  // Load replies when "View replies" is clicked
  useEffect(() => {
    if (showReplies && comment.replyCount > 0 && commentReplies.length === 0) {
      fetchReplies();
    }
  }, [showReplies]);

  const fetchReplies = async () => {
    if (isLoadingReplies) return;
    
    setIsLoadingReplies(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/${comment._id}/replies/all`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        setCommentReplies(res.data.replies);
        dispatch(setReplies([...replies, ...res.data.replies]));
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Could not load replies");
    } finally {
      setIsLoadingReplies(false);
    }
  };

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
          // Remove this comment from the comments list
          const updatedComments = comments.filter(
            (commentItem) => commentItem?._id !== comment._id
          );
          dispatch(setComments(updatedComments));
          toast.success(`You deleted a comment`, {
            style: {
              background: isDarkMode ? "" : "black",
              color: isDarkMode ? "black" : "white",
              fontWeight: "bold",
              padding: "14px 20px",
              boxShadow: isDarkMode 
                ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
                : "0px 6px 15px rgba(22, 163, 74, 0.3)",
              borderRadius: "12px",
              border: isDarkMode 
                ? "2px solid #0ea5e9" 
                : "2px solid #38bdf8",
              textAlign: "center",
              letterSpacing: "0.5px",
              transition: "transform 0.3s ease-in-out",
            },
            position: "bottom-right",
            duration: 3000,
          });
        }, 300); // Matches motion exit animation time
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error deleting comment");
    }
  };
  
  const handleLikeComment = async () => {
    try {
      const endpoint = isLiked 
        ? `http://localhost:5000/api//posts/unlike/${comment._id}/comment`
        : `http://localhost:5000/api/posts/like/${comment._id}/comment`;
        
      const res = await axios.post(
        endpoint,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        // Optimistic update for UI responsiveness
        setIsLiked(!isLiked);
        setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);

        const updatedComments = comments.map(c => {
          if (c._id === comment._id) {
            const likes = isLiked 
              ? c.likes.filter(id => id !== currentUserId)
              : [...(c.likes || []), currentUserId];
            return { ...c, likes };
          }
          return c;
        });
        
        dispatch(setComments(updatedComments));
        toast.success(`You ${isLiked ? 'unliked' : 'liked'} a comment`, {
          style: {
            background: isDarkMode ? "" : "black",
            color: isDarkMode ? "black" : "white",
            fontWeight: "bold",
            padding: "14px 20px",
            boxShadow: isDarkMode 
              ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
              : "0px 6px 15px rgba(22, 163, 74, 0.3)",
            borderRadius: "12px",
            border: isDarkMode 
              ? "2px solid #0ea5e9" 
              : "2px solid #38bdf8",
            textAlign: "center",
            letterSpacing: "0.5px",
            transition: "transform 0.3s ease-in-out",
          },
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error liking/unliking comment");
    }
  };
  
  const handleSubmitReply = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/replies/create`,
        { 
          text: replyText,
          commentId: comment._id,
          post: postId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        // Add the new reply to the replies list in redux
        const newReply = res.data.reply;
        
        dispatch(setReplies([...replies, newReply]));
        setCommentReplies([newReply, ...commentReplies]);
        
        // Update comment's replyCount
        const updatedComments = comments.map(c => {
          if (c._id === comment._id) {
            return { ...c, replyCount: (c.replyCount || 0) + 1 };
          }
          return c;
        });
        dispatch(setComments(updatedComments));
        
        // Reset reply state
        setReplyText("");
        setIsReplying(false);
        // Show replies since we just added one
        setShowReplies(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error replying to comment");
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
              className="object-cover rounded-full w-10 h-10"
            />
          </div>

          {/* Comment Container */}
          <div className="max-w-[80%] w-fit">
            {/* Comment bubble with dark/light mode support */}
            <div className={`${
                isDarkMode ? 'bg-gray-700 shadow-gray-900' : 'bg-gray-100 shadow-gray-200'
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
              <span 
                className={`cursor-pointer hover:underline flex items-center ${isLiked ? 'text-blue-500' : ''}`}
                onClick={handleLikeComment}
              >
                Like {likesCount > 0 && `(${likesCount})`}
              </span>
              
              <span 
                className="cursor-pointer hover:underline"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </span>
              
              {/* Show view replies option if this comment has replies */}
              {comment.replyCount > 0 && (
                <span 
                  className="cursor-pointer hover:underline"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? 'Hide replies' : `View replies (${comment.replyCount})`}
                </span>
              )}
              
              {isOwner && (
                <span
                  className="cursor-pointer hover:underline text-red-500"
                  onClick={handleDeleteComment}
                >
                  Delete
                </span>
              )}
            </div>
            
            {/* Reply Form */}
            {isReplying && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmitReply}
                className="mt-2"
              >
                <div className="flex">
                  <input
                    type="text"
                    ref={replyInputRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className={`flex-grow rounded-l-md p-2 text-sm ${
                      isDarkMode 
                        ? 'bg-gray-800 text-gray-200 border-gray-700' 
                        : 'bg-white text-gray-800 border-gray-200'
                    } border`}
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className={`rounded-r-md px-3 ${
                      replyText.trim()
                        ? 'bg-blue-500 text-white'
                        : `${isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                    }`}
                  >
                    Send
                  </button>
                </div>
              </motion.form>
            )}
            
            {/* Replies Section */}
            {showReplies && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
              >
                {isLoadingReplies ? (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} pl-5`}>
                    Loading replies...
                  </div>
                ) : commentReplies.length > 0 ? (
                  commentReplies.map((reply) => (
                    <Reply
                      key={reply._id}
                      reply={reply}
                      currentUserId={currentUserId}
                      postOwnerId={postOwnerId}
                      commentId={comment._id}
                    />
                  ))
                ) : (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} pl-5`}>
                    No replies yet
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Reply Component
const Reply = ({ reply, currentUserId, postOwnerId, commentId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { replies } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  
  const [isDeleted, setIsDeleted] = useState(false);
  const [isLiked, setIsLiked] = useState(reply.likes?.includes(currentUserId));
  const [likesCount, setLikesCount] = useState(reply.likes?.length || 0);

  const handleDeleteReply = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/posts/${reply._id}/delete/reply`,
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
          // Remove this reply from the replies list
          const updatedReplies = replies.filter(
            (replyItem) => replyItem?._id !== reply._id
          );
          dispatch(setReplies(updatedReplies));
          toast.success(`You deleted a reply`, {
            style: {
              background: isDarkMode ? "" : "black",
              color: isDarkMode ? "black" : "white",
              fontWeight: "bold",
              padding: "14px 20px",
              boxShadow: isDarkMode 
                ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
                : "0px 6px 15px rgba(22, 163, 74, 0.3)",
              borderRadius: "12px",
              border: isDarkMode 
                ? "2px solid #0ea5e9" 
                : "2px solid #38bdf8",
              textAlign: "center",
              letterSpacing: "0.5px",
              transition: "transform 0.3s ease-in-out",
            },
            position: "bottom-right",
            duration: 3000,
          });
        }, 300);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error deleting reply");
    }
  };
  
  const handleLikeReply = async () => {
    try {
      const endpoint = isLiked 
        ? `http://localhost:5000/api/posts/${reply._id}/unlike/reply`
        : `http://localhost:5000/api/posts/${reply._id}/like/reply`;
        
      const res = await axios.post(
        endpoint,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        // Optimistic update for UI responsiveness
        setIsLiked(!isLiked);
        setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
        
        // Update the reply in the redux store
        const updatedReplies = replies.map(r => {
          if (r._id === reply._id) {
            const likes = isLiked 
              ? r.likes.filter(id => id !== currentUserId)
              : [...(r.likes || []), currentUserId];
            return { ...r, likes };
          }
          return r;
        });
        
        dispatch(setReplies(updatedReplies));
        toast.success(`You ${isLiked ? 'unliked' : 'liked'} a reply`, {
          style: {
            background: isDarkMode ? "" : "black",
            color: isDarkMode ? "black" : "white",
            fontWeight: "bold",
            padding: "14px 20px",
            boxShadow: isDarkMode 
              ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
              : "0px 6px 15px rgba(22, 163, 74, 0.3)",
            borderRadius: "12px",
            border: isDarkMode 
              ? "2px solid #0ea5e9" 
              : "2px solid #38bdf8",
            textAlign: "center",
            letterSpacing: "0.5px",
            transition: "transform 0.3s ease-in-out",
          },
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error liking/unliking reply");
    }
  };
  
  // Determine if the current user can delete the reply
  const isOwner =
    reply.repliedBy._id === currentUserId || postOwnerId === currentUserId;

  return (
    <AnimatePresence>
      {!isDeleted && (
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }} 
          transition={{ duration: 0.3 }}
          className="flex mb-3 pl-5"
        >
          {/* Profile Image */}
          <div className="mr-3">
            <img
              src={"http://localhost:5000" + reply?.repliedBy?.profileImage}
              alt="Profile"
              className="object-cover rounded-full w-8 h-8"
            />
          </div>

          {/* Reply Container */}
          <div className="max-w-[85%] w-fit">
            {/* Reply bubble with dark/light mode support */}
            <div className={`${
                isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-gray-50 shadow-gray-200'
              } shadow-md p-3 rounded-lg`}
            >
              <div className="flex items-center justify-between w-full">
                <p className={`font-semibold text-xs ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}
                >
                  {reply?.repliedBy?.username}
                </p>
                <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } ml-2 whitespace-nowrap`}
                >
                  {getRelativeTime(reply.createdAt)}
                </span>
              </div>

              {/* Reply Text */}
              <p className={`text-xs ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                } break-words`}
              >
                {reply?.text}
              </p>
            </div>

            {/* Like, Delete (if owner) Options */}
            <div className={`flex text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } mt-1 space-x-3`}
            >
              <span 
                className={`cursor-pointer hover:underline flex items-center ${isLiked ? 'text-blue-500' : ''}`}
                onClick={handleLikeReply}
              >
                Like {likesCount > 0 && `(${likesCount})`}
              </span>
              
              {isOwner && (
                <span
                  className="cursor-pointer hover:underline text-red-500"
                  onClick={handleDeleteReply}
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