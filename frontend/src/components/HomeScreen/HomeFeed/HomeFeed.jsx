import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import { useSelector } from "react-redux";
import axios from 'axios';
import { useFollowingService } from './useFollowingService'; // Import the hook we created
import Post from '../../Profile/displayPosts/Post';
import Loader from '../../Loaders/Loader';
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
          ""
        ) : posts.length === 0 && !isLoading ? (
          <div className={`text-center py-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {feedType === 'following' ? 'No posts from users you follow yet.' : 'No posts to display.'}
          </div>
        ) : (
          posts?.map((post) => (
            <Post post={post} key={post._id}/>
          ))
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center p-4">
            <Loader/>
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