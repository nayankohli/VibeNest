import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "sonner"; // Import Toaster as well
import { setPosts } from "../../reducers/PostReducers";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const emojiPickerRef = useRef(null);
  // Get posts from Redux store
  const posts = useSelector((store) => store.post.posts);
  
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [postData, setPostData] = useState({ caption: "", media: [] });
  const [loading, setLoading] = useState(false);
  
  // Test toast on component mount to verify Sonner is working
  useEffect(() => {
    // Uncomment this to test if toasts are working at all
    // toast.success("Component mounted");
  }, []);

  const addEmoji = (emojiObject) => {
    setPostData((prev) => prev + emojiObject.emoji);
  };
  
  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" exceeds the 50MB size limit`);
        return false;
      }
      return true;
    });
    
    setPostData({ ...postData, media: validFiles });
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
      console.log("Attempting to create post");
      
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
      console.log("API response:", res.data);
      if (res.status === 201 && res.data) {
        console.log("Post created successfully, updating Redux");
        dispatch(setPosts([res.data, ...posts])); 
        toast.success("Your new post is created", {
          style: {
            background: isDarkMode 
            ? "" 
            : "black",
            color: isDarkMode 
            ? "black" 
            : "white",
            fontWeight: "bold",
            padding: "14px 20px",
            boxShadow: isDarkMode 
              ? "0px 6px 15px rgba(5, 150, 105, 0.4)" 
              : "0px 6px 15px rgba(22, 163, 74, 0.3)",
            borderRadius: "12px",
            border: isDarkMode 
              ? "2px solid #0ea5e9" 
              : "2px solid #38bdf8",
          },
          position: "top-center",
          duration: 3000,
        });
        closePopup();
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      } else {
        console.log("API response did not indicate success");
        toast.error("Server didn't confirm post creation");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
      setLoading(false);
      closePopup();
    }
  };

  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
          setShowEmojiPicker(false);
        }
      };
  
      if (showEmojiPicker) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showEmojiPicker]);

  return (
    <div className={`relative max-w-full rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {/* Include Toaster component to render toast notifications */}
      
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
              onClick={openPopup}
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
            <button
                            type="button"
                            className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} absolute flex right-8 top-24 justify-self-end mx-2`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          >
                            <FaSmile size={20} className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-300 hover:text-gray-500'}`} />
                          </button>
                          
                          {/* Emoji Picker Dropdown */}
                          <div ref={emojiPickerRef} className="relative">
                            {showEmojiPicker && (
                              <div className={`absolute bottom-12 right-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md rounded-lg`}>
                                <EmojiPicker onEmojiClick={addEmoji} theme={isDarkMode ? 'dark' : 'light'} />
                              </div>
                            )}
                          </div>
            <textarea
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              className={`w-full p-3 border rounded-lg resize-none min-h-24 focus:ring-2 focus:ring-green-500 focus:outline-none mb-4 ${isDarkMode ? "bg-gray-700 border-gray-600 placeholder-gray-400" : "bg-white border-gray-300 placeholder-gray-500"}`}
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
            
            {postData.media.length > 0 && (
              <div className="mb-4">
                <p className="text-sm mb-2">{postData.media.length} file(s) selected</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(postData.media).map((file, index) => (
                    <div key={index} className="relative">
                      <div className={`px-2 py-1 rounded text-xs ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        {file.name.length > 15 ? file.name.substring(0, 15) + "..." : file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between gap-3 mt-2">
              <button 
                onClick={closePopup} 
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
              >
                Cancel
              </button>
              <button 
                onClick={handlePost} 
                disabled={loading || (!postData.caption.trim() && postData.media.length === 0)} 
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