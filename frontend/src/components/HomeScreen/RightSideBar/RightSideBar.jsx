import { FaUserPlus, FaUserCheck, FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext"; 
import { useNavigate } from "react-router-dom";
import { followUnfollow } from "../../../actions/UserActions";
import { toast } from "sonner";
import API_CONFIG from "../../../config/api-config";
// Custom function to format time ago (kept unchanged)
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return "1 year ago";
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return "1 month ago";
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return "1 day ago";
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hrs ago`;
  if (interval === 1) return "1 hr ago";
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} mins ago`;
  if (interval === 1) return "1 min ago";
  
  return "just now";
};

const RightSidebar = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { userInfo } = useSelector((state) => state.userLogin);
  const followUnfollowState = useSelector((state) => state.followUnfollow);
  
  const [usersToShow, setUsersToShow] = useState(5);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [search, setSearch] = useState("technology"); // Default search term
  const [followingState, setFollowingState] = useState({});
  
  const API_KEY = "24ed623baee84e789dc520e9e678b854"; // Using the API key from your Newsapp component

  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  // Initialize following state for each user
  useEffect(() => {
    if (suggestedUsers.length > 0 && userInfo?.following) {
      const initialFollowingState = {};
      suggestedUsers.forEach(user => {
        initialFollowingState[user._id] = userInfo.following.includes(user._id);
      });
      setFollowingState(initialFollowingState);
    }
  }, [suggestedUsers, userInfo]);

  const handleFollowUnfollow = (userId) => {
    const isCurrentlyFollowing = followingState[userId];
    const targetUser = suggestedUsers.find(user => user._id === userId);
    const username = targetUser?.username || "User";
    
    dispatch(followUnfollow(userId, isCurrentlyFollowing));
    
    // Optimistically update UI
    setFollowingState(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    
    toast.success(`You ${isCurrentlyFollowing ? 'unfollowed' : 'followed'} ${username}`, {
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
        textAlign: "center",
        letterSpacing: "0.5px",
        transition: "transform 0.3s ease-in-out",
      },
      position: "bottom-right",
      duration: 3000,
    });
  };
  useEffect(() => {
    if (followUnfollowState.success && followUnfollowState.userId) {
    }
  }, [followUnfollowState.success]);

  useEffect(() => {
    const fetchNews = async () => {
      setIsNewsLoading(true);
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`
        );
        const data = await response.json();
        if (data.articles) {
          console.log(data.articles);
          setNewsArticles(data.articles.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsNewsLoading(false);
      }
    };

    fetchNews();
  }, [search]);

  const handleViewAllNews = () => {
    navigate('/news');
  };
  
  const handleCategoryClick = (category) => {
    setSearch(category);
  };

  return (
    <div className="w-full h-auto space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-4 shadow-md`}>
        <h2 className="text-2xl font-bold mb-3 text-green-600"><i className="fas fa-user mr-3"></i>Who to follow</h2>
        <div className="flex flex-col gap-0">
          {suggestedUsers.slice(0, usersToShow).map((user, index) => (
            <div key={user._id || index} className={`flex items-center justify-between rounded-lg p-2 ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}>
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
                <img
                  src={user?.profileImage ?user.profileImage : defaultProfileImage}
                  alt={user.name}
                  className={`w-12 h-12 rounded-full object-cover ${followingState[user._id] ? "border-2 border-blue-600 p-0.5" : ""}`}
                />
                <div>
                  <h4 className="font-medium">{user.username}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.jobProfile}</p>
                </div>
              </div>
              <button
                onClick={() => handleFollowUnfollow(user._id)}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  followingState[user._id] 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : isDarkMode 
                      ? "bg-green-300 text-green-600 hover:bg-green-200" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {followingState[user._id] ? <FaUserCheck size={18} /> : <FaUserPlus size={18} />}
              </button>
            </div>
          ))}
        </div>
        
        {suggestedUsers.length > usersToShow && (
          <button 
            className={`w-full font-normal mt-3 py-2 ${
              isDarkMode 
                ? "text-green-200 bg-green-800 hover:bg-green-700" 
                : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
            }`}
            onClick={() => setUsersToShow(usersToShow + 5)}
          >
            View more
          </button>
        )}
      </div>
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-4 shadow-md`}>
        <h2 className="text-2xl font-bold mb-3 text-green-600"><i className="fas fa-globe mr-3"></i>Today's news</h2>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {["technology", "sports", "politics", "entertainment", "health"].map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 text-xs rounded-full capitalize ${
                search === category 
                  ? (isDarkMode ? "bg-green-600 text-white" : "bg-green-600 text-white")
                  : (isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700")
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="space-y-3">
          {isNewsLoading ? (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading news...</p>
          ) : newsArticles.length > 0 ? (
            <>
              {newsArticles.map((article, index) => (
                <NewsItem key={index} article={article} isDarkMode={isDarkMode} />
              ))}
              <button 
                className={`w-full font-normal mt-3 py-2 text-center rounded ${
                  isDarkMode 
                    ? "text-green-200 bg-green-800 hover:bg-green-700" 
                    : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
                }`}
                onClick={handleViewAllNews}
              >
                View all latest news
              </button>
            </>
          ) : (
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No news available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// News Item Component
const NewsItem = ({ article, isDarkMode }) => {
  return (
    <div className="pb-2 flex-wrap border-b last:border-b-0 border-gray-200 dark:border-gray-700">
      <a href={article.url} target="_blank" rel="noopener noreferrer">
        <h4 
          className={`text-sm font-medium hover:underline cursor-pointer truncate ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
        >
          {article.title}
        </h4>
        <p 
          className={`text-xs line-clamp-2 mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {article.description}
        </p>
      </a>
      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formatTimeAgo(article.publishedAt)}
      </span>
    </div>
  );
};

export default RightSidebar;