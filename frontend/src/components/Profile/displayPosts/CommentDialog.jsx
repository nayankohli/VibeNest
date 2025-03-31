import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts, setComments } from "../../../reducers/PostReducers";
import Comment from "./Comment";
import UseGetAllComments from "./UseGetAllComments";
import "./CommentDialog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  faHeart,
  faComment,
  faBookmark,
  faCircleDot,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
const getRelativeTime = (createdAt) => {
  const currentTime = new Date();
  const postTime = new Date(createdAt);
  const diffInSeconds = Math.floor((currentTime - postTime) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

  // Format date as '2 Jan' or '2 Jan 2025' if not the current year
  const options = { day: "numeric", month: "short" };
  const formattedDate = postTime.toLocaleDateString("en-US", options);

  if (postTime.getFullYear() !== currentTime.getFullYear()) {
    return `${formattedDate} ${postTime.getFullYear()}`;
  }

  return formattedDate;
};

const CommentDialog = ({ open, setOpen, post }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { comments, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const commentsEndRef = useRef(null);
  const [slideDirection, setSlideDirection] = useState("none");
  const [liked, setLiked] = useState(post?.likes?.includes(userInfo?._id) || false);
  const [postLike, setPostLike] = useState(post.likes?.length);
  const [isBookmarked, setIsBookmarked] = useState(userInfo?.bookmarks?.includes(post?._id) || false);
  UseGetAllComments();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [currentMedia, setCurrentMedia] = useState(0);
    const carouselRef = useRef(null);
  
    // Reset current media index when post changes
    useEffect(() => {
      setCurrentMedia(0);
    }, [post?._id]);

  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  const addEmoji = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };
  
  const changeEventHandler = (e) => setText(e.target.value);
  
  const likeOrDislikeHandler = async () => {
    // Optimistically update UI
    setLiked(!liked);
    setPostLike(liked ? postLike - 1 : postLike + 1);

    try {
        const action = liked ? 'dislike' : 'like';
        const res = await axios.get(`http://localhost:5000/api/posts/${post._id}/${action}`, { 
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true
        });

        console.log(res.data);
        if (!res.data.success) {
            // If API fails, revert UI changes
            setLiked(liked);
            setPostLike(liked ? postLike + 1 : postLike - 1);
            toast.error("Failed to update like status.");
        }
        else{
          toast.success(`You ${action} this post`);
        }
    } catch (error) {
        console.error(error);
        // Revert UI in case of an error
        setLiked(liked);
        setPostLike(liked ? postLike + 1 : postLike - 1);
    }
  };

  const sendMessageHandler = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/comment/${post?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const newComment = res.data.comment;
        dispatch(setComments([...comments, newComment]));
        const updatedPosts = posts.map((p) =>
          p._id === post._id
            ? { ...p, comments: [...p.comments, newComment] }
            : p
        );
        dispatch(setPosts(updatedPosts));
        setText("");
        toast.success("Comment added successfully", {
                style: {
                  background: isDarkMode 
                    ? "" 
                    : "black",
                  color: isDarkMode 
                  ? "black" 
                  : "white",
                  fontWeight: "bold",
                  padding: "14px 20px",
                  boxShadow: isDarkMode 
                    ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
                    : "0px 6px 15px rgba(22, 163, 74, 0.3)",
                  borderRadius: "12px",
                  border: isDarkMode 
                    ? "2px solid #0ea5e9" 
                    : "2px solid #38bdf8",
                },
                position: "bottom-right",
                duration: 3000,
              });
        setShowEmojiPicker(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigatePost = (direction) => {
    const currentIndex = posts.findIndex((p) => p._id === post?._id);
    if (direction === "next" && currentIndex < posts.length - 1) {
      setSlideDirection("next");
      setTimeout(() => dispatch(setPosts(posts[currentIndex + 1])), 300);
    }
    if (direction === "prev" && currentIndex > 0) {
      setSlideDirection("prev");
      setTimeout(() => dispatch(setPosts(posts[currentIndex - 1])), 300);
    }
  };

  const emojiPickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  const bookmarkHandler = async () => {
    // Optimistic UI update
    setIsBookmarked((prev) => !prev);
  
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/${post?._id}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        const updatedUserInfo = { 
          ...userInfo, 
          bookmarks: res.data.isBookmarked
            ? [...userInfo.bookmarks, post._id]  // Add bookmark
            : userInfo.bookmarks.filter(id => id !== post._id)  // Remove bookmark
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        toast.success(
          res.data.message || (isBookmarked ? "Bookmark removed!" : "Post bookmarked!", {
            style: {
              background: isDarkMode 
                ? "" 
                : "black",
              color: isDarkMode 
              ? "black" 
              : "white",
              fontWeight: "bold",
              padding: "14px 20px",
              boxShadow: isDarkMode 
                ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
                : "0px 6px 15px rgba(22, 163, 74, 0.3)",
              borderRadius: "12px",
              border: isDarkMode 
                ? "2px solid #0ea5e9" 
                : "2px solid #38bdf8",
            },
            position: "bottom-right",
            duration: 3000,
          })
        );
      } else {
        // Revert if failed
        setIsBookmarked((prev) => !prev);
        toast.error("Failed to update bookmark status!");
      }
    } catch (error) {
      console.error("Error in bookmarking:", error);
      setIsBookmarked((prev) => !prev);
      toast.error(error.response?.data?.message || "Failed to update bookmark!");
    }
  };
  const goToNextMedia = (e) => {
    e.stopPropagation();
    if (post.media?.length > 1) {
      setCurrentMedia((prev) => (prev === post.media.length - 1 ? 0 : prev + 1));
    }
  };

  const goToPrevMedia = (e) => {
    e.stopPropagation();
    if (post.media?.length > 1) {
      setCurrentMedia((prev) => (prev === 0 ? post.media.length - 1 : prev - 1));
    }
  };

  const goToMedia = (index) => {
    setCurrentMedia(index);
  };
  
  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <button
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-3 hover:text-gray-800 hover:bg-opacity-70 text-2xl hover:border-2 hover:border-gray-600"
          onClick={() => setOpen(false)}
        >
          ✖
        </button>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-white hover:bg-opacity-70 bg-black bg-opacity-50 p-3 hover:border-2 hover:border-gray-600"
          onClick={() => navigatePost("prev")}
        >
          ◀
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-white hover:bg-opacity-70 bg-black bg-opacity-50 p-3 hover:border-2 hover:border-gray-600"
          onClick={() => navigatePost("next")}
        >
          ▶
        </button>

        <div
          className={`${isDarkMode ? 'bg-gray-800 border text-white' : 'bg-white'} shadow-lg w-full max-w-5xl h-[90vh] flex flex-row relative`}
          ref={dialogRef}
        >
          {/* Left Side - Post Image */}
          <div className={`w-7/12 h-full flex justify-center items-center bg-black`}>
          {post.media && post.media.length > 0 && (
  <div className={"w-full h-[31rem] relative overflow-hidden flex justify-center items-center "}>
    <div 
      ref={carouselRef}
      className="w-full h-full flex transition-transform duration-300 ease-in-out" 
      style={{ 
        transform: `translateX(-${currentMedia * 100}%)`,
        display: 'flex'
      }}
    >
      {post.media.map((mediaItem, index) => (
        <div 
          key={index} 
          className="w-full h-full flex-shrink-0 flex justify-center items-center"
        >
          {mediaItem.endsWith(".mp4") ? (
            <video
              controls
              className="max-w-full max-h-full object-scale-down"
            >
              <source
                src={`http://localhost:5000${mediaItem}`}
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src={`http://localhost:5000${mediaItem}`}
              alt="Post content"
              className="max-w-full max-h-full rounded-lg object-scale-down"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto'
              }}
              loading="lazy"
            />
          )}
        </div>
      ))}
    </div>

    {/* Navigation elements */}
    {post.media.length > 1 && (
      <>
        {/* Left arrow */}
        <button 
          onClick={goToPrevMedia}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-1"
          aria-label="Previous media"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Right arrow */}
        <button 
          onClick={goToNextMedia}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-1"
          aria-label="Next media"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
          {post.media.map((_, index) => (
            <button
              key={index}
              onClick={() => goToMedia(index)}
              className={`w-2 h-2 rounded-full focus:outline-none transition-all duration-200 ${
                currentMedia === index 
                  ? 'bg-white w-4' 
                  : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to media ${index + 1}`}
            />
          ))}
        </div>
      </>
    )}
  </div>
)}
          </div>

          {/* Right Side - Post Details & Comments */}
          <div className={`w-5/12 flex flex-col h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* User Info Header */}
            <div className={`flex items-center p-4 border-b gap-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <Link to="#" className="flex items-center w-full">
                {/* Avatar */}
                <div className="rounded-full">
                  <img
                    src={"http://localhost:5000" + post?.postedBy?.profileImage}
                    alt="avatar"
                    className="w-12 h-12 object-cover mr-4 rounded-full"
                  />
                </div>

                {/* User Info */}
                <div className="flex flex-col ml-2 w-full">
                  <div className="flex items-center gap-3 whitespace-nowrap overflow-hidden">
                    {/* Username (Prevents Wrapping) */}
                    <h4 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {post?.postedBy?.username}
                    </h4>

                    {/* Time and Status (Prevents Wrapping) */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm flex-nowrap">
                      <FontAwesomeIcon icon={faCircleDot} className="text-xs" />
                      <p className="text-xs">{getRelativeTime(post?.createdAt)}</p>
                    </div>
                  </div>

                  {/* Job Profile */}
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                    {post?.postedBy?.jobProfile}
                  </span>
                </div>

                {/* More Options Icon */}
                <FontAwesomeIcon
                  icon={faEllipsis}
                  className={`${isDarkMode ? 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'} transition-all p-2 rounded-lg cursor-pointer ml-auto`}
                />
              </Link>
            </div>

            {/* Comments Section */}
            <div className={`flex-1 overflow-y-auto p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {/* Original Post Caption */}
              <div className="flex mb-4">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {post?.caption}
                </span>
              </div>
              <div className="">
                <div className="flex gap-4 mb-2">
                  <div className="flex flex-col items-center mb-4">
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`cursor-pointer text-2xl ${liked ? 'text-red-600' : isDarkMode ? 'text-gray-200 hover:text-gray-100' : 'text-black hover:text-gray-600'}`}
                      onClick={likeOrDislikeHandler} 
                    />
                    <div className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-gray-300' : ''}`}>
                      {postLike} likes
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={faComment}
                      className={`cursor-pointer text-2xl ${isDarkMode ? 'text-gray-200 hover:text-gray-100' : 'text-black hover:text-gray-600'}`}
                    />
                    <div className={`font-semibold text-xs mb-1 ${isDarkMode ? 'text-gray-300' : ''}`}>
                      {post?.comments?.length} comments
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon
                      icon={faBookmark}
                      className={`cursor-pointer text-2xl ${isBookmarked ? 'text-blue-500' : isDarkMode ? 'text-gray-200 hover:text-gray-100' : 'text-black hover:text-gray-600'}`}
                      onClick={bookmarkHandler}
                    />
                  </div>
                </div>
              </div>
              {/* Comments */}
              {comments.map((comment) => (
        <Comment 
          key={comment._id} 
          comment={comment} 
          currentUserId={userInfo._id} 
          postOwnerId={post?.postedBy?._id} 
          postId={post._id}
        />
      ))}
              <div ref={commentsEndRef} />
            </div>

            {/* Add Comment Input */}
            <div className={`p-4 flex items-center border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <input
                type="text"
                value={text}
                onChange={changeEventHandler}
                placeholder="Add a comment..."
                className={`flex-1 text-sm border-none outline-none ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white'}`}
                onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
              />
              <button
                type="button"
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} mx-2`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile size={20} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-300 hover:text-gray-500'}`} />
              </button>
              
              {/* Emoji Picker Dropdown */}
              <div ref={emojiPickerRef} className="relative">
                {showEmojiPicker && (
                  <div className={`absolute bottom-12 right-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md rounded-lg`}>
                    <EmojiPicker onEmojiClick={addEmoji} theme={isDarkMode ? 'dark' : 'light'} />
                  </div>
                )}
              </div>
              <button
                className={`font-semibold ${
                  text.trim() 
                    ? 'text-green-500' 
                    : isDarkMode 
                      ? 'text-green-800' 
                      : 'text-green-200'
                }`}
                disabled={!text.trim()}
                onClick={sendMessageHandler}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CommentDialog;