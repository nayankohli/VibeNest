import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useContext } from "react";
import { fetchAllPosts } from "../../../reducers/PostReducers";
import { setActiveTab } from "../../../reducers/ProfileSlice";
import { ThemeContext } from "../../../context/ThemeContext";

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
  
  // Array of user's uploaded photos
  return (
    <div className={`${isDarkMode ? 'bg-gray-800  text-white' : 'bg-white'} p-4 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Photos</h1>
        <span
          className={`${isDarkMode ? 'text-blue-300' : 'text-blue-500'} hover:underline cursor-pointer`}
          onClick={() => dispatch(setActiveTab("media"))}
        >
          See all photos
        </span>
      </div>
      
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {posts.slice(0, 5).map((post, index) => (
            <div key={index} className="mb-0">
              {post.media && post.media.length > 0 && (
                <div className="">
                  {post.media
                    .filter((mediaItem) => !mediaItem.endsWith(".mp4")) // Exclude videos
                    .map((mediaItem, mediaIndex) => (
                      <div
                        key={mediaIndex}
                        className="rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        <img
                          src={`http://localhost:5000${mediaItem}`}
                          alt="Post media"
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center ${isDarkMode ? 'text-gray-400 border' : 'text-gray-400'}`}>
          No photos to display...
        </div>
      )}
    </div>
  );
};

export default Media;