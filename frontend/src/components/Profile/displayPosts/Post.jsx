import React, { useState, useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "../../../reducers/PostReducers";
import axios from "axios";
import CommentDialog from "./CommentDialog";
import { ThemeContext } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StoryPreview from "../../HomeScreen/Stories/StoryView";
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

  return postTime.toLocaleDateString();
};

const Post = ({ post }) => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { posts } = useSelector(
    (store) => store.post
  );
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [liked, setLiked] = useState(
    post?.likes?.includes(userInfo?._id) || false
  );
  const [postLike, setPostLike] = useState(post?.likes?.length);
  const [comment, setComment] = useState(post?.comments);
  const [showOptions, setShowOptions] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(userInfo?.bookmarks?.includes(post?._id) || false);
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  // Media carousel state
  const [currentMedia, setCurrentMedia] = useState(0);
  const carouselRef = useRef(null);
  const [showStoryPreview, setShowStoryPreview] = useState(false);
  const [userStories, setUserStories] = useState([]);
  // Reset current media index when post changes
  useEffect(() => {
    setCurrentMedia(0);
  }, [post?._id]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    const prevLiked = liked; // Store previous state before toggling
    setLiked((prev) => !prev);
    setPostLike((prev) => (prevLiked ? prev - 1 : prev + 1));
  
    try {
      const action = prevLiked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:5000/api/posts/${post?._id}/${action}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        }
      );
      console.log("API Response:", res.data);

      if (!res.data.success) {
        throw new Error("Failed to update like status.");
      }
  
      // Show toast message on success
      toast.success(prevLiked ? "Post disliked successfully" : "Post liked successfully", {
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
  
    } catch (error) {
      console.error(error);
      setLiked(prevLiked); // Revert to previous state
      setPostLike((prev) => (prevLiked ? prev + 1 : prev - 1));
  
      // Show error toast
      toast.error("Error updating post. Please try again.");
    }
  };

  const commentHandler = async () => {
    if (!text.trim()) {
      console.log("🚨 Empty comment: toast should be raised");
      toast.error("Comment cannot be empty!",{
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
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/comment/${post?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        }
      );
      if (!res.data.success) {
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
      }

      // Update state
      const updatedCommentData = [...comment, res.data.comment];
      setComment(updatedCommentData);

      const updatedPostData = posts.map((p) =>
        p._id === post._id ? { ...p, comments: updatedCommentData } : p
      );
      dispatch(setPosts(updatedPostData));

      setText("");
    } catch (error) {
      console.error("🚨 Error in commentHandler:", error);
      toast.error("Something went wrong. Try again later!");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/posts/delete/${post?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message || "Post deleted successfully!", {
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
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error(error.response?.data?.message || "Failed to delete post!");
    }
  };

  const bookmarkHandler = async () => {
    // Optimistic UI update
    setIsBookmarked((prev) => !prev);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/${post?._id}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
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
          res.data.message || (isBookmarked ? "Bookmark removed!" : "Post bookmarked!"), {
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
          }
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim()) {
      commentHandler();
    }
  };

  const fetchUserStories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/stories/user/${post?.postedBy?._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success && res.data.stories.length > 0) {
        setUserStories(res.data.stories);
        setShowStoryPreview(true);
      } else {
        toast.info("No stories available for this user.");
      }
    } catch (error) {
      console.error("Error fetching user stories:", error);
      toast.error("Failed to fetch stories.");
    }
  };

  // Carousel navigation functions
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

  const isFollowing = userInfo.following.includes(post?.postedBy?._id) ? true : false;

  return (
    <div
      key={post?._id}
      className={`rounded-lg shadow mb-4 overflow-hidden ${
        isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"
      }`}
    >
      {/* Post header */}
      <div className="p-3 sm:p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div 
            className={`rounded-full cursor-pointer ${
              post?.postedBy?.story.length>0
                ? "border-2 border-blue-500 p-0.5 rounded-full" 
                : ""
            }`}
            onClick={() => {
              if (post?.postedBy?.hasStories) {
                fetchUserStories();
              } else {
                navigate(`/profile/${post?.postedBy?._id}`);
              }
            }}
          >
            <img
              src={
                post?.postedBy?.profileImage ? "http://localhost:5000" + post?.postedBy?.profileImage : defaultProfileImage
              }
              alt={`${post?.postedBy?.username}'s avatar`}
              className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full mr-2 sm:mr-3"
            />
          </div>
          <div className="flex flex-col items-start">
            <p className="font-semibold text-sm sm:text-base">{post?.postedBy?.username}</p>
            <p
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              } cursor-pointer`}
              onClick={() => navigate(`/profile/${post?.postedBy?._id}`)}
            >
              {getRelativeTime(post?.createdAt)}
              {userInfo._id !== post?.postedBy?._id && (
                <span className="ml-1 text-green-500">
                  {isFollowing ? "Following" : "Follow"}
                </span>
              )}
            </p>
          </div>
        </div>
  
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className={`${
              isDarkMode
                ? "text-gray-400 hover:text-gray-200"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="19" cy="12" r="1"></circle>
              <circle cx="5" cy="12" r="1"></circle>
            </svg>
          </button>
  
          {showOptions && (
            <div
              className={`absolute right-0 mt-2 py-2 w-48 rounded-md shadow-lg z-10 ${
                isDarkMode
                  ? "bg-gray-600 border border-gray-500"
                  : "bg-white border border-gray-200"
              }`}
            >
              {userInfo?._id === post?.postedBy?._id && (
                <button
                  onClick={() => {
                    deletePostHandler();
                    setShowOptions(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Delete Post
                </button>
              )}
              <button
                onClick={() => {
                  bookmarkHandler();
                  setShowOptions(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  isDarkMode
                    ? "text-gray-200 hover:bg-gray-500"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isBookmarked ? "Remove Bookmark" : "Bookmark Post"}
              </button>
            </div>
          )}
        </div>
      </div>
  
      {/* Post content */}
      <div className="px-3 sm:px-4 pb-3">
        <p className="mb-3 text-center text-sm sm:text-base">{post?.caption}</p>
  
        {post.media && post.media.length > 0 && (
          <div className="w-full h-64 sm:h-96 md:h-[28rem] lg:h-[31rem] relative overflow-hidden rounded-lg border flex justify-center items-center bg-black">
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
                      className="max-w-full max-h-full object-scale-down"
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                {/* Right arrow */}
                <button 
                  onClick={goToNextMedia}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-1"
                  aria-label="Next media"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
  
                {/* Dots indicator */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
                  {post.media.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToMedia(index)}
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full focus:outline-none transition-all duration-200 ${
                        currentMedia === index 
                          ? 'bg-white w-3 sm:w-4' 
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
  
      {/* Post actions */}
      <div
        className={`px-3 sm:px-4 py-2 flex justify-between border-t ${
          isDarkMode ? "border-gray-600" : "border-gray-100"
        }`}
      >
        <div className="flex space-x-4 sm:space-x-6">
          <button
            onClick={likeOrDislikeHandler}
            className={`flex items-center ${
              liked
                ? isDarkMode
                  ? "text-red-400"
                  : "text-red-500"
                : isDarkMode
                ? "text-gray-400 hover:text-red-400"
                : "text-gray-500 hover:text-red-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="text-xs sm:text-sm">{postLike}</span>
          </button>
  
          <button
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className={`flex items-center ${
              isDarkMode
                ? "text-gray-400 hover:text-green-400"
                : "text-gray-500 hover:text-green-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span className="text-xs sm:text-sm">{comment?.length}</span>
          </button>
        </div>
  
        <button
          onClick={bookmarkHandler}
          className={`flex items-center ${
            isBookmarked
              ? isDarkMode
                ? "text-blue-400"
                : "text-blue-500"
              : isDarkMode
              ? "text-gray-400 hover:text-green-400"
              : "text-gray-500 hover:text-green-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isBookmarked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
  
      {/* Comments section */}
      {comment?.length > 0 && (
        <div className="px-3 sm:px-4 py-2 flex items-center">
          <button
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className={`text-xs sm:text-sm ${
              isDarkMode
                ? "text-green-400 hover:text-green-300"
                : "text-green-600 hover:text-green-700"
            } font-medium`}
          >
            View all {comment?.length} comments
          </button>
        </div>
      )}
  
      {/* Comment input */}
      <div
        className={`px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 ${
          isDarkMode ? "border-gray-600" : "border-gray-100"
        }`}
      >
        <div className="flex-shrink-0">
          <img
            src={"http://localhost:5000" + userInfo.profileImage}
            alt="Your avatar"
            className="rounded-full object-cover w-6 h-6 sm:w-8 sm:h-8"
          />
        </div>
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            onKeyDown={handleKeyDown}
            className={`outline-none w-full px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm ${
              isDarkMode
                ? "bg-gray-600 text-white border border-gray-500 focus:border-blue-400"
                : "bg-gray-100 text-gray-700 border border-gray-200 focus:border-blue-400"
            }`}
          />
          {text && (
            <button
              onClick={commentHandler}
              className={`absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              } font-medium text-xs sm:text-sm`}
            >
              Post
            </button>
          )}
        </div>
      </div>
  
      <CommentDialog open={open} setOpen={setOpen} post={post} />
      {showStoryPreview && (
        <StoryPreview 
          userStories={userStories}
          userInfo={userInfo}
          onClose={() => setShowStoryPreview(false)}
        />
      )}
    </div>
  );
};

export default Post;