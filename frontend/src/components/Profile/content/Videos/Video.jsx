import { FaHeart, FaComment, FaVideo } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useContext } from "react";
import { fetchAllPosts } from "../../../../reducers/PostReducers";
import CommentDialog from "../../displayPosts/CommentDialog";
import { setSelectedPost } from "../../../../reducers/PostReducers";
import { ThemeContext } from "../../../../context/ThemeContext";
import Loader from '../../../Loader'

const Videos = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  // Get posts from Redux store
  const { posts, loading, error, selectedPost } = useSelector((store) => store.post);
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (profile?._id) {
      dispatch(fetchAllPosts(profile._id)); // Fetch posts when component mounts
    }
  }, [dispatch, profile]);

  // Process posts to filter only those with video media
  const processedVideos = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    
    const result = [];
    
    posts.forEach(post => {
      if (post.media && post.media.length > 0) {
        // Filter to just video media
        const videoMedia = post.media.filter(media => media.endsWith(".mp4"));
        
        if (videoMedia.length > 0) {
          videoMedia.forEach(videoUrl => {
            result.push({
              post,
              videoUrl
            });
          });
        }
      }
    });
    
    return result;
  }, [posts]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Videos</h2>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <Loader/>
        </div>
      )}

      {/* Video Grid */}
      {!loading && !error && processedVideos.length > 0 ? (
        <div className="grid grid-cols-2 gap-6">
          {processedVideos.map((item, index) => (
            <div
              key={`${item.post._id}-${index}`}
              className="relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => {
                dispatch(setSelectedPost(item.post)); // Store selected post
                setOpen(true); // Open the dialog
              }}
            >
              <div className="relative">
                <video
                  src={`http://localhost:5000${item.videoUrl}`}
                  className="w-full h-48 object-cover rounded-lg"
                  preload="metadata"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-10 transition-opacity duration-200">
                  <div className="bg-white bg-opacity-80 p-2 rounded-full">
                    <FaVideo className="text-green-600 text-xl" />
                  </div>
                </div>
              </div>
              
              {/* Post stats */}
              <div className="absolute bottom-2 left-2 flex items-center p-2 space-x-3 text-sm">
                <span className="flex items-center space-x-1">
                  <FaHeart className={`${item.post.likes.includes(userInfo._id)?("text-red-500"):("text-gray-300")} text-xl`} />{" "}
                  <span className="text-white">
                    {item.post.likes.length || "0"}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaComment className="text-white" />{" "}
                  <span className="text-white">
                    {item.post.comments.length || "0"}
                  </span>
                </span>
              </div>
              
              {/* Video duration - this would require additional backend support */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                Video
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} py-6`}>
          <FaVideo className="mx-auto text-4xl mb-2 opacity-50" />
          No videos to display...
        </div>
      ) : null}

      {/* Error state */}
      {error && (
        <div className="text-center text-red-500 py-4">
          Error loading videos. Please try again later.
        </div>
      )}

      {/* Render CommentDialog */}
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  );
};

export default Videos;