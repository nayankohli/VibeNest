import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listStories, markStorySeen, deleteStory } from '../../../actions/StoryActions';
import UploadStory from "./UploadStory";
import { FaTimes, FaChevronLeft, FaChevronRight, FaTrash, FaEye } from "react-icons/fa";
import Loader from "../../Loaders/Loader";
const Stories = ({ isDarkMode }) => {
  const dispatch = useDispatch();
  const { storyGroups, loading, error } = useSelector((state) => state.storyList);
  const { userInfo } = useSelector((state) => state.userLogin);
  
  const [showStoryView, setShowStoryView] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [storyDuration] = useState(5000); // 5 seconds per story
  const [progress, setProgress] = useState(0);
  const [sortedStoryGroups, setSortedStoryGroups] = useState([]);
  
  const storyViewRef = useRef(null);
  const progressRefs = useRef([]);
  const progressTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  
  useEffect(() => {
    dispatch(listStories());
  }, [dispatch]);
  
  // Sort story groups - unseen stories first
  useEffect(() => {
    if (storyGroups) {
      // Create a deep copy to avoid modifying the original data
      const sortedGroups = JSON.parse(JSON.stringify(storyGroups));
      
      // Sort groups - those with unseen stories first
      sortedGroups.sort((a, b) => {
        if (a.hasUnseenStories && !b.hasUnseenStories) return -1;
        if (!a.hasUnseenStories && b.hasUnseenStories) return 1;
        return 0;
      });
      
      setSortedStoryGroups(sortedGroups);
    }
  }, [storyGroups]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (storyViewRef.current && !storyViewRef.current.contains(event.target)) {
        closeStoryView();
      }
    };
    
    if (showStoryView) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden"; // Prevent scrolling
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto"; // Re-enable scrolling
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
      clearTimeout(progressTimerRef.current);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showStoryView]);
  
  // Improved progress bar animation
  const updateProgressBar = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }
    
    if (!isPaused) {
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = (elapsed / storyDuration) * 100;
      
      // Update progress state
      setProgress(Math.min(newProgress, 100));
      
      // Update progress bar width directly for smoother animation
      if (progressRefs.current[activeStoryIndex]) {
        progressRefs.current[activeStoryIndex].style.width = `${Math.min(newProgress, 100)}%`;
      }
      
      // Check if progress is complete
      if (newProgress >= 100) {
        goToNextStory();
        return;
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(updateProgressBar);
  };
  
  // Handle story view and progress when story changes
  useEffect(() => {
    if (showStoryView && activeGroup && activeGroup.stories[activeStoryIndex]) {
      const currentStory = activeGroup.stories[activeStoryIndex];
      setImageError(false);
      
      // Mark as seen in backend
      dispatch(markStorySeen(currentStory._id));
      
      // Reset progress
      setProgress(0);
      startTimeRef.current = null;
      
      // Reset all progress bars
      progressRefs.current.forEach((ref, index) => {
        if (ref) {
          if (index < activeStoryIndex) {
            ref.style.width = '100%';
          } else if (index === activeStoryIndex) {
            ref.style.width = '0%';
          } else {
            ref.style.width = '0%';
          }
        }
      });
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = requestAnimationFrame(updateProgressBar);
    }
    
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [activeGroup, activeStoryIndex, showStoryView, dispatch, isPaused]);
  
  useEffect(() => {
    if (isPaused) {
      cancelAnimationFrame(animationFrameRef.current);
    } else if (showStoryView && activeGroup) {
      const elapsedTime = (progress / 100) * storyDuration;
      startTimeRef.current = performance.now() - elapsedTime;
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(updateProgressBar);
    }
  }, [isPaused, showStoryView, activeGroup, progress, storyDuration]);
  
  const openStoryView = (groupIndex) => {
    setActiveGroup(sortedStoryGroups[groupIndex]);
    setActiveStoryIndex(0);
    setShowStoryView(true);
    setImageError(false);
    setProgress(0);
    setIsPaused(false);
    startTimeRef.current = null;
    
    // When opening a story group, we'll mark it as seen which will affect sorting
    // This is handled by the markStorySeen action inside the story view effect
  };
  
  const closeStoryView = () => {
    setShowStoryView(false);
    setActiveGroup(null);
    setActiveStoryIndex(0);
    clearTimeout(progressTimerRef.current);
    cancelAnimationFrame(animationFrameRef.current);
    setImageError(false);
    setProgress(0);
    
    // Refresh stories list after closing to ensure proper sorting
    dispatch(listStories());
  };
  
  const goToNextStory = () => {
    if (!activeGroup) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    
    if (activeStoryIndex < activeGroup.stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      const currentGroupIndex = sortedStoryGroups.findIndex(
        (group) => group.user._id === activeGroup.user._id
      );
      if (currentGroupIndex < sortedStoryGroups.length - 1) {
        setActiveGroup(sortedStoryGroups[currentGroupIndex + 1]);
        setActiveStoryIndex(0);
      } else {
        closeStoryView();
      }
    }
    
    setProgress(0);
    startTimeRef.current = null;
  };
  
  const goToPrevStory = () => {
    if (!activeGroup) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      const currentGroupIndex = sortedStoryGroups.findIndex(
        (group) => group.user._id === activeGroup.user._id
      );
      if (currentGroupIndex > 0) {
        const prevGroup = sortedStoryGroups[currentGroupIndex - 1];
        setActiveGroup(prevGroup);
        setActiveStoryIndex(prevGroup.stories.length - 1);
      }
    }
    
    setProgress(0);
    startTimeRef.current = null;
  };
  
  // Pause/resume story progress
  const handleStoryPress = (e) => {
    e.preventDefault();
    setIsPaused(true);
  };
  
  const handleStoryRelease = (e) => {
    e.preventDefault();
    setIsPaused(false);
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const storyDate = new Date(timestamp);
    const diff = Math.floor((now - storyDate) / 1000); 
    
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  const handleDeleteStory = (storyId) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStory(storyId));
      goToNextStory();
    }
  };
  
  const baseURL = 'http://localhost:5000';
  const getMediaUrl = (mediaPath) => {
    if (!mediaPath) return '';
    if (mediaPath.startsWith('http')) {
      return mediaPath;
    }
    const formattedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    const formattedBaseUrl = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    return `${formattedBaseUrl}${formattedPath}`;
  };
  
  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load story media");
    setImageError(true);
  };

  // Initialize ref array for progress bars
  const setProgressRef = (element, index) => {
    progressRefs.current[index] = element;
  };

  // Check if a user has seen all stories in a group
  const hasUserSeenAllStories = (group) => {
    if (!group.stories || !userInfo) return false;
    return !group.stories.some(story => !story.seenBy.includes(userInfo._id));
  };

  return (
    <>
      {/* Stories horizontal list */}
      <div className="flex justify-start h-full items-start overflow-x-auto hide-scrollbar py-2">
        {/* Create story button */}
        <div 
          className="flex flex-col items-center justify-center cursor-pointer mr-3 sm:mr-6 flex-shrink-0"
          onClick={() => setShowUploadModal(true)}
        >
          <div className={`w-24 sm:w-28 md:w-32 h-32 sm:h-36 rounded-lg flex flex-col items-center justify-center border-2 border-dashed ${isDarkMode ? "bg-gray-700 border-gray-400" : "bg-gray-100 border-gray-500"} `}>
            <div className={`${isDarkMode ? "bg-gray-800" : "bg-gray-300"} flex items-center justify-center rounded-full w-8 sm:w-10 h-8 sm:h-10 mb-1`}>
            <span className={`text-xl sm:text-2xl`}>+</span>
            </div>
            
            <span className="text-xs font-medium text-center px-1">Post a Story</span>
          </div>
        </div>
        
        {/* Story thumbnails */}
        {loading ? (
          <div className="flex justify-center items-center w-full h-32 sm:h-36">
            <Loader/>
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm sm:text-base">{error}</div>
        ) : (
          sortedStoryGroups?.map((group, index) => {
            const allStoriesSeen = hasUserSeenAllStories(group);
            
            return (
              <div 
                key={group.user._id} 
                className={`flex flex-col items-center cursor-pointer mr-2 flex-shrink-0 ${allStoriesSeen ? 'opacity-60' : ''}`}
                onClick={() => openStoryView(index)}
              >
                <div 
                  className={`w-20 sm:w-24 md:w-28 h-32 sm:h-36 rounded-lg p-0.5 mb-1 relative ${
                    group.hasUnseenStories 
                      ? "border-2 border-green-500" 
                      : isDarkMode 
                        ? "border-2 border-gray-600" 
                        : "border-2 border-gray-300"
                  }`}
                >
                  <img 
                    src={group.user.profileImage 
                      ? getMediaUrl(group.user.profileImage) 
                      : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                    }
                    alt={group.user.name}
                    className="w-full h-full rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
                    }}
                  />
                  
                  {/* Viewed indicator */}
                  {allStoriesSeen && (
                    <div className="absolute bottom-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-0.5 sm:p-1">
                      <FaEye className="text-white text-xs" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium truncate w-16 text-center">{group.user.name}</span>
              </div>
            );
          })
        )}
      </div>
      
      {/* Full screen story view */}
      {showStoryView && activeGroup && activeGroup.stories[activeStoryIndex] && (
        <div className="fixed inset-0 z-50 bg-black">
          <div 
            ref={storyViewRef} 
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
                src={getMediaUrl(activeGroup.stories[activeStoryIndex].media)}
                alt="Story"
                className="w-full h-full object-contain"
                onError={handleImageError}
                draggable="false"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center flex-col text-white px-4">
                <p className="text-lg sm:text-xl mb-2 text-center">Unable to load media</p>
                <p className="text-xs sm:text-sm text-gray-400 text-center">The story content couldn't be displayed</p>
              </div>
            )}
            
            {/* Debug info - can be removed in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="absolute bottom-20 left-0 right-0 p-4 bg-black bg-opacity-70 text-white text-xs">
                <p>Media Path: {activeGroup.stories[activeStoryIndex].media}</p>
                <p>Full URL: {getMediaUrl(activeGroup.stories[activeStoryIndex].media)}</p>
                <p>Paused: {isPaused ? 'Yes' : 'No'}</p>
                <p>Story Seen: {activeGroup.stories[activeStoryIndex].seenBy.includes(userInfo._id) ? 'Yes' : 'No'}</p>
              </div>
            )}
            
            {/* Story header */}
            <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src={activeGroup.user.profileImage 
                    ? getMediaUrl(activeGroup.user.profileImage) 
                    : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  alt={activeGroup.user.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                  onError={(e) => {
                    e.target.src = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
                  }}
                />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{activeGroup.user.name}</p>
                  <p className="text-gray-300 text-xs">
                    {formatTime(activeGroup.stories[activeStoryIndex].createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                {/* Seen indicator */}
                {activeGroup.stories[activeStoryIndex].seenBy.includes(userInfo._id) && (
                  <div className="text-gray-400 mr-2 sm:mr-4 flex items-center">
                    <FaEye className="mr-1" />
                    <span className="text-xs hidden sm:inline">Viewed</span>
                  </div>
                )}
                
                {/* Delete button (only for own stories) */}
                {activeGroup.user._id === userInfo._id && (
                  <button 
                    onClick={() => handleDeleteStory(activeGroup.stories[activeStoryIndex]._id)}
                    className="text-white mr-2 sm:mr-4 p-1 sm:p-2"
                    aria-label="Delete story"
                  >
                    <FaTrash className="text-sm sm:text-base" />
                  </button>
                )}
                
                {/* Close button */}
                <button 
                  onClick={closeStoryView}
                  className="text-white text-lg sm:text-xl p-1 sm:p-2"
                  aria-label="Close story view"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            {/* Story progress bars */}
            <div className="absolute top-0 left-0 right-0 flex space-x-1 p-1 sm:p-2">
              {activeGroup.stories.map((story, index) => (
                <div 
                  key={story._id}
                  className="h-0.5 sm:h-1 bg-gray-500 flex-1 rounded-full overflow-hidden"
                >
                  <div 
                    ref={(el) => setProgressRef(el, index)}
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
            <button 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-1 sm:p-2 rounded-r-lg"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevStory();
              }}
              aria-label="Previous story"
            >
              <FaChevronLeft className="text-white text-sm sm:text-base" />
            </button>
            
            <button 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-1 sm:p-2 rounded-l-lg"
              onClick={(e) => {
                e.stopPropagation();
                goToNextStory();
              }}
              aria-label="Next story"
            >
              <FaChevronRight className="text-white text-sm sm:text-base" />
            </button>
          </div>
        </div>
      )}
      
      {/* Upload story modal */}
      {showUploadModal && (
        <UploadStory 
          onClose={() => setShowUploadModal(false)} 
          isDarkMode={isDarkMode}
          onUploadSuccess={() => {
            setShowUploadModal(false);
            dispatch(listStories()); // Refresh stories
          }}
        />
      )}
  
      {/* Add CSS for progress bar animation */}
      <style jsx>{`
        .transition-width {
          transition-property: width;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default Stories;