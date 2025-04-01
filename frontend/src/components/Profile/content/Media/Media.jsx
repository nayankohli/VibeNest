import { FaHeart, FaComment, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useContext } from "react";
import { fetchAllPosts } from "../../../../reducers/PostReducers";
import CommentDialog from "../../displayPosts/CommentDialog/CommentDialog";
import { setSelectedPost } from "../../../../reducers/PostReducers";
import { ThemeContext } from "../../../../context/ThemeContext";
import Loader from '../../../Loaders/Loader'
import API_CONFIG from "../../../../config/api-config";
const Media = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  // Get posts from Redux store
  const { posts, loading, error, selectedPost } = useSelector((store) => store.post);
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};

  useEffect(() => {
    if (profile?._id) {
      dispatch(fetchAllPosts(profile._id)); // Fetch posts when component mounts
    }
  }, [dispatch, profile]);

  const { userInfo } = useSelector((state) => state.userLogin);
  // Process posts to group media by post
  const processedPosts = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const result = [];
    
    posts.forEach(post => {
      if (post.media && post.media.length > 0) {
        // Filter to just image media (no videos)
        const imageMedia = post.media.filter(media => !media.endsWith(".mp4"));
        
        if (imageMedia.length > 0) {
          // Only add the first image from each post
          result.push({
            post,
            mediaItem: imageMedia[0],
            totalImages: imageMedia.length
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
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Photos</h2>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <Loader/>
        </div>
      )}

      {/* Photo Grid */}
      {!loading && !error && processedPosts.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {processedPosts.map((item, index) => (
            <div
              key={`${item.post._id}-${index}`}
              className="relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
              onClick={() => {
                dispatch(setSelectedPost(item.post)); // Store selected post
                setOpen(true); // Open the dialog
              }}
            >
              <img
                src={`${API_CONFIG.BASE_URL}${item.mediaItem}`}
                alt={`Post ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              
              {/* Image counter badge */}
              {item.totalImages > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">
                  1/{item.totalImages}
                </div>
              )}
              
              {/* Post stats */}
              <div className="absolute bottom-2 left-2 flex items-center p-2 space-x-3 text-sm">
                <span className="flex items-center space-x-1">
                  <FaHeart className={`${item.post.likes.includes(userInfo._id)?("text-red-500"):("text-gray-300")} text-xl`} />{" "}
                  <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                    {item.post.likes.length || "0"}
                  </span>
                </span>
                <span className="flex items-center space-x-1">
                  <FaComment className={isDarkMode ? "text-gray-300" : "text-gray-500"} />{" "}
                  <span className={isDarkMode ? 'text-white' : 'text-gray-700'}>
                    {item.post.comments.length || "0"}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : !loading && !error ? (
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'} py-6`}>
          <FaCamera className="mx-auto text-4xl mb-2 opacity-50" />
          No photos to display...
        </div>
      ) : null}

      {/* Render CommentDialog */}
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  );
};

export default Media;