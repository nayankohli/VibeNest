import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useContext } from "react";
import { fetchAllPosts } from "../../../reducers/PostReducers";
import { setActiveTab } from "../../../reducers/ProfileSlice";
import { ThemeContext } from "../../../context/ThemeContext";
import Loader from "../../Loaders/Loader";
const Media = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  
  // Get posts from Redux store
  const { posts, loading, error } = useSelector((store) => store.post);
  
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};
  
  useEffect(() => {
    dispatch(fetchAllPosts(profile._id)); // Fetch posts when component mounts
  }, [dispatch, profile]);

  // Only show image media (not videos)
  const getImageMediaFromPosts = (posts) => {
    if (!posts || posts.length === 0) return [];
    
    return posts.filter(post => 
      post.media && post.media.length > 0 && 
      post.media.some(media => !media.endsWith(".mp4"))
    );
  };
  
  const postsWithImages = getImageMediaFromPosts(posts);
  
  return (
    <div className={`w-full rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-4 mb-4`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-green-600 font-bold">Photos</h2>
        <button 
          className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'} hover:underline cursor-pointer`}
          onClick={() => dispatch(setActiveTab("media"))}
        >
          See all photos
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-4">
          <Loader/>
        </div>
      )  : postsWithImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {postsWithImages.slice(0, 6).map((post, index) => {
            // Get only image media
            const imageMedia = post.media.filter(media => !media.endsWith(".mp4"));
            
            if (imageMedia.length === 0) return null;
            
            // Display only the first image from each post
            return (
              <div key={`${post._id}-${index}`} className="relative overflow-hidden rounded-md aspect-square">
                <img
                  src={"http://localhost:5000"+imageMedia[0]}
                  alt={`Post ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Image counter badge */}
                {imageMedia.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                    1/{imageMedia.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">No photos to display...</div>
      )}
    </div>
  );
};

export default Media;