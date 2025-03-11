import { FaHeart, FaComment, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { fetchAllPosts } from "../../../../reducers/PostReducers";
import CommentDialog from "../../displayPosts/CommentDialog";
import { setSelectedPost } from "../../../../reducers/PostReducers";
const Media = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // Store selected post

  // Get posts from Redux store
  const { posts, loading, error,selectedPost } = useSelector((store) => store.post);
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};

  useEffect(() => {
    if (profile?._id) {
      dispatch(fetchAllPosts(profile._id)); // Fetch posts when component mounts
    }
  }, [dispatch, profile]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold mb-4">Photos</h2>
        
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Add Photo Card */}
        

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
                      <span>{post.likes.length || "0"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <FaComment className="text-gray-300" />{" "}
                      <span>{post.comments.length || "0"}</span>
                    </span>
                  </div>
                </div>
              ))
        )}
      </div>

      {/* Render CommentDialog outside the map */}
      {selectedPost && (
        <CommentDialog open={open} setOpen={setOpen} post={selectedPost} />
      )}
    </div>
  );
};

export default Media;
