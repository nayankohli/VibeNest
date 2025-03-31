import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../../../reducers/PostReducers";
import { ThemeContext } from "../../../context/ThemeContext";
import Loader from "../../Loader";
import Post from "./Post";

const DisplayPosts = () => {
  const dispatch = useDispatch();
  
  // Get posts from Redux store
  const { posts, loading } = useSelector((store) => store.post);
  const { isDarkMode } = useContext(ThemeContext);
  
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};

  useEffect(() => {
    if (profile && profile._id) {
      dispatch(fetchAllPosts(profile._id)); // Fetch posts when component mounts or profile changes
    }
  }, [dispatch, profile]);

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center p-4">
          <Loader />
        </div>
      ) : posts && posts.length > 0 ? (
        <div className={`flex flex-col gap-2 p-4 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-lg`}>
          {posts.map((post) => (
            <Post post={post} key={post._id} />
          ))}
        </div>
      ) : (
        <div className="p-5">
          <div className={`text-center ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} text-gray-400`}>
            No posts yet...
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayPosts;