import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { FaHeart, FaComment, FaCamera, FaVideo } from "react-icons/fa";
import { ThemeContext } from "../../context/ThemeContext";
import Loader from "../Loaders/Loader"; 
import Navbar from "../NavBarMainScreen/Navbar";
import CommentDialog from "../Profile/displayPosts/CommentDialog/CommentDialog";
import { setSelectedPost } from "../../reducers/PostReducers";
import API_CONFIG from "../../config/api-config";

const SavedPostMedia = ({ post, isDarkMode, onRemoveFromSaved, open, setOpen }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  
  const imageMedia = post.media 
    ? post.media.filter(media => !media.endsWith(".mp4"))
    : [];
  
  const videoMedia = post.media 
    ? post.media.filter(media => media.endsWith(".mp4"))
    : [];
    
  const hasImageMedia = imageMedia.length > 0;
  const hasVideoMedia = videoMedia.length > 0;
  
  const handlePostClick = () => {
    dispatch(setSelectedPost(post));
    setOpen(true);
  };
  
  const isLiked = post.likes.includes(userInfo._id) ? true : false;
  
  return (
    <div 
      className="relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer aspect-square"
      onClick={handlePostClick}
    >
      {hasImageMedia ? (
        <>
          <img
            src={`${API_CONFIG.BASE_URL}${imageMedia[0]}`}
            alt="Saved post media"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {imageMedia.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
              1/{imageMedia.length}
            </div>
          )}
        </>
      ) : hasVideoMedia ? (
        <>
          <video
            src={`${API_CONFIG.BASE_URL}${videoMedia[0]}`}
            className="w-full h-full object-cover"
            preload="metadata"
          />
          {videoMedia.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
              1/{videoMedia.length}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-10 transition-opacity duration-200">
            <div className="bg-white bg-opacity-80 p-2 rounded-full">
              <FaVideo className="text-green-600 text-xl" />
            </div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>
          <FaCamera className="text-4xl mb-2 opacity-50" />
          <p>No media</p>
        </div>
      )}
      <div className="absolute z-10 bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center space-x-3 text-sm">
          <span className="flex items-center space-x-1">
            <FaHeart className={`${isLiked ? "text-red-500" : "text-gray-300"} text-lg sm:text-xl`} />
            <span className="text-white text-sm sm:text-lg">
              {post.likes?.length || 0}
            </span>
          </span>
          <span className="flex items-center space-x-1">
            <FaComment className="text-gray-300 text-lg sm:text-xl" />
            <span className="text-white text-sm sm:text-lg">
              {post.comments?.length || 0}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { selectedPost } = useSelector((store) => store.post);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!userInfo || !userInfo.token) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${API_CONFIG.BASE_URL}/api/users/saved-posts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setSavedPosts(res.data.savedPosts);
        } else {
          setError("Failed to fetch saved posts");
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [userInfo]);

  const removeFromSaved = async (postId) => {
    try {
      setSavedPosts(savedPosts.filter(post => post._id !== postId));
      
      const res = await axios.get(
        `${API_CONFIG.BASE_URL}/api/posts/${postId}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        const refreshRes = await axios.get(
          `${API_CONFIG.BASE_URL}/api/users/saved-posts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
          }
        );
        setSavedPosts(refreshRes.data.savedPosts);
      }
    } catch (error) {
      console.error("Error removing post from saved:", error);
      const refreshRes = await axios.get(
        `${API_CONFIG.BASE_URL}/api/users/saved-posts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
      setSavedPosts(refreshRes.data.savedPosts);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-green-100 text-gray-900"}`}>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className={`rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-md overflow-hidden`}>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center mb-6">
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? "text-white" : "text-green-600"}`}>
                Your Saved Posts
              </h1>
              <span className={`font-bold p-1 px-2 text-sm sm:text-lg rounded-lg ml-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
                {savedPosts?.length || 0}
              </span>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader />
              </div>
            ) : error ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"} mb-4`}>
                {error}
              </div>
            ) : savedPosts.length === 0 ? (
              <div className={`p-4 sm:p-6 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                <p className="text-lg mb-4">You haven't saved any posts yet.</p>
                <p>When you save posts, they'll appear here for easy access later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {savedPosts.map((post) => (
                  <SavedPostMedia 
                    key={post._id} 
                    post={post} 
                    onRemoveFromSaved={() => removeFromSaved(post._id)}
                    isDarkMode={isDarkMode}
                    open={open}
                    setOpen={setOpen}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  );
};

export default SavedPosts;