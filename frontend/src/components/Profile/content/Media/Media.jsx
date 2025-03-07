import { FaHeart, FaComment, FaCamera } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { fetchAllPosts } from "../../../../reducers/PostReducers";

const Media = () => {
  const dispatch = useDispatch();
  
  // Get posts from Redux store
  const { posts, loading, error } = useSelector((store) => store.post);
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
        <h1 className="text-xl font-bold">Photos</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          + Create album
        </button>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Add Photo Card */}
        <div className="flex items-center justify-center border-2 border-dashed rounded-lg h-40">
          <div className="text-center">
            <FaCamera className="text-blue-500 text-3xl mx-auto mb-2" />
            <p className="text-gray-600">Add photo</p>
          </div>
        </div>

        {/* Display Only Image Media */}
        {posts.map((post) =>
          post.media &&
          post.media.length > 0 &&
          post.media
            .filter((mediaItem) => !mediaItem.endsWith(".mp4")) // Exclude videos
            .map((mediaItem, mediaIndex) => (
              <div
                key={mediaIndex}
                className="relative rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={`http://localhost:5000${mediaItem}`}
                  alt="Post media"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className=" bottom-2 left-2 flex items-center p-2 space-x-3  text-sm">
                  <span className="flex items-center space-x-1">
                    <FaHeart className="text-red-500" /> <span>{post.likes.length || "0"}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FaComment className="text-gray-300" /> <span>{post.comments.length|| "0"}</span>
                  </span>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Media;
