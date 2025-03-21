import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import Post from "../Profile/displayPosts/Post";
import Loader from "../Loader"; 
import Navbar from "../NavBarMainScreen/Navbar";

const SavedPosts = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isDarkMode } = useContext(ThemeContext);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/users/saved-posts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          setSavedPosts(res.data.savedPosts);
        } else {
          setError("Failed to fetch saved posts");
        }
      } catch (error) {
        console.error("Error fetching saved posts:", error);
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userInfo && userInfo.token) {
      fetchSavedPosts();
    }
  }, [userInfo]);

  const removeFromSaved = async (postId) => {
    try {
      // Optimistic UI update
      setSavedPosts(savedPosts.filter(post => post._id !== postId));
      
      const res = await axios.get(
        `http://localhost:5000/api/posts/${postId}/bookmark`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        // Revert if failed
        const res = await axios.get(
          "http://localhost:5000/api/users/saved-posts",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
            withCredentials: true,
          }
          
        );
        setSavedPosts(res.data.savedPosts);
      }
    } catch (error) {
      console.error("Error removing post from saved:", error);
      // Fetch posts again to ensure UI is in sync
      const res = await axios.get(
        "http://localhost:5000/api/users/saved-posts",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
      setSavedPosts(res.data.savedPosts);
    }
  };

  return (
    <div className={`min-h-screen  ${isDarkMode ? "bg-gray-900 text-white" : "bg-green-100 text-gray-900"} flex flex-col gap-3 justify-center items-center`}>
        <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <div className={`container p-20 pt-10 rounded-lg ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}  w-[80rem] mt-20 mb-10`}>
        <h1 className={`text-3xl font-bold mb-6  ${isDarkMode ? " text-white" : " text-green-600"} `}>Your Saved Posts 
            <span className={`font-bold p-1 px-2 text-xl rounded-lg ml-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
                {savedPosts?.length || 0}</span></h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900" : "bg-red-100"} ${isDarkMode ? "text-red-200" : "text-red-800"} mb-4`}>
            {error}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className={`p-6 rounded-lg text-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
            <p className="text-lg mb-4">You haven't saved any posts yet.</p>
            <p>When you save posts, they'll appear here for easy access later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {savedPosts.map((post) => (
              <Post 
                key={post._id} 
                post={post} 
                onRemoveFromSaved={() => removeFromSaved(post._id)}
                showRemoveOption={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPosts;