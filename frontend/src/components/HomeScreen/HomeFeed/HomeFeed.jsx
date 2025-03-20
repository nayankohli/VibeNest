import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useFollowingService } from './useFollowingService'; // Import the hook we created

const HomeFeed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [feedType, setFeedType] = useState('mixed'); // 'following', 'explore', 'mixed'
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);
  
  // Get current user from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  // Use our following service
  const { 
    following, 
    isLoading: isLoadingFollowing, 
    fetchFollowing, 
    isFollowing 
  } = useFollowingService();

  // Initial fetch of following list
  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchFollowing();
    }
  }, [userInfo]);

  // Fetch posts from API
  const fetchPosts = async (pageNum, type) => {
    if (!userInfo || !userInfo.token) return [];
    
    setIsLoading(true);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        params: {
          page: pageNum,
          limit: 10,
          feedType: type
        }
      };

      // Different endpoints or parameters based on feed type
      let endpoint = 'http://localhost:5000/api/posts';
      
      if (type === 'following') {
        endpoint = 'http://localhost:5000/api/posts/following';
      } else if (type === 'explore') {
        endpoint = 'http://localhost:5000/api/posts/explore';
      } else if (type === 'mixed') {
        // For mixed feed, we'll use a special parameter
        config.params.mixed = true;
      }

      const { data } = await axios.get(endpoint, config);
      
      // Check if we've reached the end of available posts
      if (data.posts.length < 10) {
        setHasMore(false);
      }
      
      const processedPosts = data.posts.map(post => ({
        ...post,
        postedBy: {
          ...post.postedBy,
          isFollowing: isFollowing(post.postedBy._id)
        }
      }));
      
      setIsLoading(false);
      return processedPosts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      setIsLoading(false);
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitialPosts = async () => {
      if (userInfo && userInfo.token) {
        const initialPosts = await fetchPosts(1, feedType);
        console.log(initialPosts);
        setPosts(initialPosts);
        setPage(1);
      }
    };
    
    loadInitialPosts();
    
    // Set up intersection observer for infinite scroll
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0
    };
    
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }
    
    return () => observer.disconnect();
  }, [feedType, userInfo, following]);

  // Handle intersection observer callback
  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && !isLoading && hasMore) {
      loadMorePosts();
    }
  };

  // Load more posts when scrolling
  const loadMorePosts = async () => {
    if (!hasMore || isLoading) return;
    
    const nextPage = page + 1;
    const newPosts = await fetchPosts(nextPage, feedType);
    
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    setPage(nextPage);
  };

  // Handle feed type change
  const changeFeedType = async (type) => {
    setFeedType(type);
    setHasMore(true);
    setIsLoading(true);
    
    // Clear existing posts before loading new ones
    setPosts([]);
    
    const newPosts = await fetchPosts(1, type);
    setPosts(newPosts);
    setPage(1);
    setIsLoading(false);
  };

  return (
    <div className={`posts-container w-full rounded-lg p-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Feed type selector */}
      <div className={`sticky top-0 z-10 p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex w-full items-center justify-between space-x-2">
      <button 
        onClick={() => changeFeedType('following')}
        className={`flex items-center justify-center gap-2 px-4 py-2 w-1/3 rounded-full text-sm ${
          feedType === 'following' 
            ? isDarkMode 
            ? "text-green-200 bg-green-800 hover:bg-green-700" 
            : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white" 
            : isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        Following
      </button>
      <button 
        onClick={() => changeFeedType('explore')}
        className={`flex items-center justify-center gap-2 px-4 py-2 w-1/3 rounded-full text-sm ${
          feedType === 'explore' 
            ? isDarkMode 
            ? "text-green-200 bg-green-800 hover:bg-green-700" 
            : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white" 
            : isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        Explore
      </button>
      <button 
        onClick={() => changeFeedType('mixed')}
        className={`flex items-center justify-center gap-2 px-4 py-2 w-1/3 rounded-full text-sm ${
          feedType === 'mixed' 
            ? isDarkMode 
            ? "text-green-200 bg-green-800 hover:bg-green-700" 
            : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white" 
            : isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
          <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
          <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
          <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
        Mixed
      </button>
    </div>
      </div>

      {/* Posts container */}
      <div className="posts-content p-4">
        {isLoadingFollowing && posts.length === 0 ? (
          <div className="flex justify-center p-4">
            <div className={`w-8 h-8 border-4 rounded-full animate-spin ${
              isDarkMode 
                ? 'border-gray-600 border-t-green-400' 
                : 'border-green-200 border-t-green-500'
            }`}></div>
          </div>
        ) : posts.length === 0 && !isLoading ? (
          <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {feedType === 'following' ? 'No posts from users you follow yet.' : 'No posts to display.'}
          </div>
        ) : (
          posts.map(post => (
            <div 
              key={post._id} 
              className={`rounded-lg shadow mb-4 overflow-hidden ${
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
              }`}
            >
              {/* Post header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className='rounded-full'>
                  <img 
                    src={"http://localhost:5000"+post.postedBy.profileImage || `/api/placeholder/40/40`} 
                    alt={`${post.postedBy.username}'s avatar`} 
                    className="w-10 h-10 object-cover rounded-full mr-3"
                  />
                  </div>
                  
                  <div>
                    <p className="font-semibold">{post.postedBy.username}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(post.createdAt).toLocaleDateString()} · 
                      {post.postedBy.isFollowing ? <span className="ml-1 text-green-500">Following</span>:<span className="ml-1 text-green-500">Follow</span>}
                    </p>
                  </div>
                </div>
                <button className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
              
              {/* Post content */}
              <div className="px-4 pb-3">
                <p className="mb-3">{post.caption}</p>
                {post.media && (
                  <div className='rounded-lg'>
                    <img 
                    src={"http://localhost:5000"+post.media} 
                    alt="Post content" 
                    className="w-full object-cover h-80 rounded-lg"
                  />
                  </div>
                  
                )}
              </div>
              
              {/* Post actions */}
              <div className={`px-4 py-2 flex justify-between border-t ${
                isDarkMode ? 'border-gray-600' : 'border-gray-100'
              }`}>
                <div className="flex space-x-6">
                  <button className={`flex items-center ${
                    isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    {post.likes ? post.likes.length : 0}
                  </button>
                  <button className={`flex items-center ${
                    isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    {post.comments ? post.comments.length : 0}
                  </button>
                </div>
                <button className={`flex items-center ${
                  isDarkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
</svg>
                </button>
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center p-4">
            <div className={`w-8 h-8 border-4 rounded-full animate-spin ${
              isDarkMode 
                ? 'border-gray-600 border-t-green-400' 
                : 'border-green-200 border-t-green-500'
            }`}></div>
          </div>
        )}
        
        {/* End of content message */}
        {!hasMore && posts.length > 0 && (
          <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You've reached the end of your feed.
          </div>
        )}
        
        {/* Observer target element */}
        <div ref={loader} className="h-10"></div>
      </div>
    </div>
  );
};

export default HomeFeed;