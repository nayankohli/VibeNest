import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContext';
import { FaEye, FaTrash, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';
import API_CONFIG from '../../../config/api-config';
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return date.toLocaleDateString();
};

const getMediaUrl = (path) => {
  return path ? path : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg';
};

const StoryPreview = ({ 
  userStories, 
  userInfo, 
  onClose 
}) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  // Story timer and progress handling
  React.useEffect(() => {
    let timer;
    if (!isPaused) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            goToNextStory();
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [activeStoryIndex, isPaused]);

  const handleImageError = () => {
    setImageError(true);
  };

  const goToNextStory = () => {
    if (activeStoryIndex < userStories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
      setProgress(0);
      setImageError(false);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
      setProgress(0);
      setImageError(false);
    }
  };

  const handleStoryPress = () => {
    setIsPaused(true);
  };

  const handleStoryRelease = () => {
    setIsPaused(false);
  };

  const handleDeleteStory = async (storyId) => {
    try {
      const res = await axios.delete(
        `${API_CONFIG.BASE_URL}/api/stories/delete/${storyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Story deleted successfully!", {
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
          },
          position: "bottom-right",
          duration: 3000,
        });
        
        // Remove the current story and adjust index
        if (userStories.length === 1) {
          onClose();
        } else if (activeStoryIndex === userStories.length - 1) {
          setActiveStoryIndex(prev => prev - 1);
        }
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story!");
    }
  };

  const currentStory = userStories[activeStoryIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div 
        className="h-full relative"
        onTouchStart={handleStoryPress}
        onTouchEnd={handleStoryRelease}
        onMouseDown={handleStoryPress}
        onMouseUp={handleStoryRelease}
        onMouseLeave={handleStoryRelease}
      >
        {/* Story content */}
        {!imageError ? (
          <img 
            src={getMediaUrl(currentStory.media)}
            alt="Story"
            className="w-full h-full object-contain"
            onError={handleImageError}
            draggable="false"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col text-white">
            <p className="text-xl mb-2">Unable to load media</p>
            <p className="text-sm text-gray-400">The story content couldn't be displayed</p>
          </div>
        )}
        
        {/* Story header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate(`/profile/${userStories[0].postedBy._id}`)}
          >
            <img 
              src={getMediaUrl(userStories[0].postedBy.profileImage)}
              alt={userStories[0].postedBy.username}
              className="w-10 h-10 rounded-full object-cover mr-3"
              onError={(e) => {
                e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
              }}
            />
            <div>
              <p className="text-white font-medium">{userStories[0].postedBy.username}</p>
              <p className="text-gray-300 text-xs">
                {formatTime(currentStory.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Seen indicator */}
            {currentStory.seenBy.includes(userInfo._id) && (
              <div className="text-gray-400 mr-4 flex items-center">
                <FaEye className="mr-1" />
                <span className="text-xs">Viewed</span>
              </div>
            )}
            
            {/* Delete button (only for own stories) */}
            {userStories[0].postedBy._id === userInfo._id && (
              <button 
                onClick={() => handleDeleteStory(currentStory._id)}
                className="text-white mr-4 p-2"
                aria-label="Delete story"
              >
                <FaTrash />
              </button>
            )}
            
            {/* Close button */}
            <button 
              onClick={onClose}
              className="text-white text-xl"
              aria-label="Close story view"
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Story progress bars */}
        <div className="absolute top-0 left-0 right-0 flex space-x-1 p-2">
          {userStories.map((story, index) => (
            <div 
              key={story._id}
              className="h-1 bg-gray-500 flex-1 rounded-full overflow-hidden"
            >
              <div 
                className="h-full bg-white rounded-full transition-width"
                style={{
                  width: index < activeStoryIndex ? '100%' : 
                         index === activeStoryIndex ? `${progress}%` : '0%',
                  transition: isPaused ? 'none' : 'width 0.1s linear'
                }}
              ></div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        {userStories.length > 1 && (
          <>
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-r-lg"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevStory();
              }}
              aria-label="Previous story"
            >
              <FaChevronLeft className="text-white" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-l-lg"
              onClick={(e) => {
                e.stopPropagation();
                goToNextStory();
              }}
              aria-label="Next story"
            >
              <FaChevronRight className="text-white" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StoryPreview;