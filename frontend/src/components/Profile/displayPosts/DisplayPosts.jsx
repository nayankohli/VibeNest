import React, { useEffect, useState ,useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  likePost,
  deletePost,
} from "../../../actions/PostActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import Post from "./Post";
import { fetchAllPosts } from "../../../reducers/PostReducers";
import { ThemeContext } from "../../../context/ThemeContext";
const getRelativeTime = (createdAt) => {
  const currentTime = new Date();
  const postTime = new Date(createdAt);
  const diffInSeconds = Math.floor((currentTime - postTime) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

  return postTime.toLocaleDateString();
};

const DisplayPosts = () => {
  const dispatch = useDispatch();
  
  // Get posts from Redux store
  const { posts, loading, error } = useSelector((store) => store.post);
  const { isDarkMode} = useContext(ThemeContext);
  
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profile } = fetchProfileState || {};
  useEffect(() => {
    dispatch(fetchAllPosts(profile._id )); // Fetch posts when component mounts
  }, [dispatch,profile]);


  if (posts && posts.length > 0) {
    return (
      <div className="">
        <div className={`flex flex-col gap-2 p-4 ${isDarkMode? "bg-gray-800 text-white" : "bg-white text-black"}  rounded-lg `}>
          {posts?.map((post) => (
            <Post post={post} key={post._id}/>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-5">
        <div className={`text-center ${isDarkMode? "bg-gray-800 text-white" : "bg-white text-black"} text-gray-400`}>No posts yet...</div>
      </div>
    );
  }
};

export default DisplayPosts;
