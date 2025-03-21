import { FaHeart, FaComment, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useContext } from "react";
import { fetchAllPosts } from "../../../../reducers/PostReducers";
import CommentDialog from "../../displayPosts/CommentDialog";
import { setSelectedPost } from "../../../../reducers/PostReducers";
import { ThemeContext } from "../../../../context/ThemeContext";

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

  return (
    <div className={`${isDarkMode ? 'bg-gray-800  text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Photos</h2>
      </div>

      {/* Photo Grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {/* Display Only Image Media */}
          {posts.map(
            (post) =>
              post.media &&
              post.media.length > 0 &&
              post.media
                .filter((mediaItem) => !mediaItem.endsWith(".mp4")) // Exclude videos
                .map((mediaItem, mediaIndex) => (
                  <div
                    key={mediaIndex}
                    className="relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                    onClick={() => {
                      dispatch(setSelectedPost(post)); // Store selected post
                      setOpen(true); // Open the dialog
                    }}
                  >
                    <img
                      src={`http://localhost:5000${mediaItem}`}
                      alt="Post media"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="bottom-2 left-2 flex items-center p-2 space-x-3 text-sm">
                      <span className="flex items-center space-x-1">
                        <FaHeart className="text-red-500" />{" "}
                        <span className={isDarkMode ? 'text-white' : ''}>
                          {post.likes.length || "0"}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FaComment className={isDarkMode ? "text-gray-300" : "text-gray-300"} />{" "}
                        <span className={isDarkMode ? 'text-white' : ''}>
                          {post.comments.length || "0"}
                        </span>
                      </span>
                    </div>
                  </div>
                ))
          )}
        </div>
      ) : (
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
          No photos to display...
        </div>
      )}

      {/* Render CommentDialog outside the map */}
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  );
};

export default Media;