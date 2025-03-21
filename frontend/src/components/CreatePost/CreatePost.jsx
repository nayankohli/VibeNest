import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [postData, setPostData] = useState({ caption: "", media: [] });
  const [loading, setLoading] = useState(false);
  
  const { posts, setPosts } = useSelector((store) => store.post);
  
  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPostData({ ...postData, media: Array.from(e.target.files) });
  };

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setPostData({ caption: "", media: [] });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = new FormData();
      formData.append("caption", postData.caption);
      postData.media.forEach((file) => formData.append("media", file));

      const res = await axios.post("http://localhost:5000/api/posts/create", formData, config);

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        alert(res.data.message);
        navigate("/");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
      closePopup();
    }
  };

  return (
    <div className={`relative p- max-w-full rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {!isPopupOpen && (
        <div className="flex flex-col gap-3 w-full p-6">
          <div className="flex items-start gap-2">
            <img
              src={userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={() => navigate(`/profile/${userInfo._id}`)}
            />
            <input
              type="text"
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="Share your thoughts..?"
              className={`w-full p-2 rounded-md ${isDarkMode ? "bg-gray-700" : "bg-white"}  h-12  focus:outline-none`}
            />
          </div>
          <div className="flex gap-3">
            <button className={`flex items-center  text-sm font-medium gap-2 p-2 ${isDarkMode ? "bg-gray-400 text-black hover:bg-gray-500" : "bg-gray-200 text-gray-500 hover:bg-gray-300"} rounded-md `} onClick={openPopup}>
              <FontAwesomeIcon icon={faImage} className="text-green-600" /> Photo
            </button>
            <button className={`flex items-center text-sm gap-2 font-medium p-2 ${isDarkMode ? "bg-gray-400 text-black hover:bg-gray-500" : "bg-gray-200 text-gray-500 hover:bg-gray-300"} rounded-md ` }onClick={openPopup}>
              <FontAwesomeIcon icon={faVideo} className="text-red-600" /> Video
            </button>
            <button className={`flex items-center  text-sm gap-2 font-medium p-2  rounded-md ${isDarkMode ? "bg-gray-400 text-black hover:bg-gray-500" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`} onClick={openPopup}>
              <FontAwesomeIcon icon={faFaceSmile} className="text-yellow-600" /> Feeling/Activity
            </button>
          </div>
        </div>
      )}

{isPopupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-200">
    <div className={`p-6 rounded-lg w-full max-w-md shadow-xl transform transition-all duration-200 ${isDarkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-800 border border-gray-200"}`}>
      <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
        Create Post
        <button onClick={closePopup} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </h3>
      
      <textarea
        name="caption"
        value={postData.caption}
        onChange={handleInputChange}
        placeholder="What's on your mind?"
        className={`w-full p-3 border rounded-lg resize-none min-h-24 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 ${isDarkMode ? "bg-gray-700 border-gray-600 placeholder-gray-400" : "bg-white border-gray-300 placeholder-gray-500"}`}
      ></textarea>
      
      <label className={`block mb-4 p-3 border border-dashed rounded-lg text-center cursor-pointer hover:bg-opacity-50 transition-colors ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-gray-100"}`}>
        <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
            <line x1="16" y1="5" x2="22" y2="5"></line>
            <line x1="19" y1="2" x2="19" y2="8"></line>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
          Add Photos/Videos
        </span>
      </label>
      
      <div className="flex justify-between gap-3 mt-2">
        <button 
          onClick={closePopup} 
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
        >
          Cancel
        </button>
        <button 
          onClick={handlePost} 
          disabled={loading} 
          className="flex-1 py-2.5 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Posting...
            </span>
          ) : "Post"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default CreatePost;
