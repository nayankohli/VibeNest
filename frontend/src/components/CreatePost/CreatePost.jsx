import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFaceSmile, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "sonner";
import { setPosts } from "../../reducers/PostReducers";
import EmojiPicker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import API_CONFIG from "../../config/api-config";
const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const emojiPickerRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  // Get posts from Redux store
  const posts = useSelector((store) => store.post.posts);
  
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [postData, setPostData] = useState({ caption: "", media: [] });
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const addEmoji = (emojiObject) => {
    setPostData((prev) => ({
      ...prev,
      caption: prev.caption + emojiObject.emoji
    }));
  };
  
  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
  };

  const processFiles = (fileList) => {
    const files = Array.from(fileList);
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" exceeds the 50MB size limit`);
        return false;
      }
      return true;
    });
    
    setPostData(prev => ({ 
      ...prev, 
      media: [...prev.media, ...validFiles] 
    }));
  };

  const removeFile = (indexToRemove) => {
    setPostData(prev => ({
      ...prev,
      media: prev.media.filter((_, index) => index !== indexToRemove)
    }));
  };

  const openPopup = () => setIsPopupOpen(true);
  
  const closePopup = () => {
    setIsPopupOpen(false);
    setPostData({ caption: "", media: [] });
    setDragActive(false);
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

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
  
      const res = await axios.post(`${API_CONFIG.BASE_URL}/api/posts/create`, formData, config);
      console.log("API response:", res.data);
      if (res.status === 201 && res.data) {
        console.log("Post created successfully, updating Redux");
        dispatch(setPosts([res.data, ...posts])); 
        toast.success("Your new post is created", {
          style: {
            background: isDarkMode ? "" : "black",
            color: isDarkMode ? "black" : "white",
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
      } else {
        console.log("API response did not indicate success");
        toast.error("Server didn't confirm post creation");
      }
    } catch (error) {
      console.error("Post creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
      setLoading(false);
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

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPopupOpen]);

  return (
    <div className={`relative w-full rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} transition-all duration-300`}>
      {!isPopupOpen && (
        <div className="flex flex-col gap-3 w-full p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <img
              src={userInfo?.profileImage ? `${API_CONFIG.BASE_URL}${userInfo.profileImage}` : defaultProfileImage}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-green-500 transition-all duration-300"
              onClick={() => navigate(`/profile/${userInfo._id}`)}
            />
            <input
              type="text"
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="Share your thoughts..?"
              className={`w-full p-2 sm:p-3 rounded-lg ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"} h-10 sm:h-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 text-sm sm:text-base`}
              onClick={openPopup}
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2">
            <button 
              className={`flex items-center text-xs sm:text-sm font-medium gap-1 sm:gap-2 p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gray-700 text-white hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`} 
              onClick={openPopup}
            >
              <FontAwesomeIcon icon={faImage} className="text-green-500" /> Photo
            </button>
            <button 
              className={`flex items-center text-xs sm:text-sm gap-1 sm:gap-2 font-medium p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gray-700 text-white hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={openPopup}
            >
              <FontAwesomeIcon icon={faVideo} className="text-red-500" /> Video
            </button>
            <button 
              className={`flex items-center text-xs sm:text-sm gap-1 sm:gap-2 font-medium p-2 sm:p-2.5 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? "bg-gray-700 text-white hover:bg-gray-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`} 
              onClick={openPopup}
            >
              <FontAwesomeIcon icon={faFaceSmile} className="text-yellow-500" /> Feeling / Activity
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 p-3 sm:p-4">
          <div 
            className={`p-4 sm:p-6 rounded-xl w-full max-w-xs sm:max-w-md md:max-w-lg shadow-2xl transform transition-all duration-300 ${
              isDarkMode 
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-white text-gray-800 border border-gray-200"
            } max-h-[90vh] overflow-auto`}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center justify-between border-b pb-3">
              Create Post
              <button 
                onClick={closePopup} 
                aria-label="Close"
                className={`rounded-full p-1.5 transition-colors ${
                  isDarkMode 
                    ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </h3>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={userInfo?.profileImage ? `${API_CONFIG.BASE_URL}${userInfo.profileImage}` : defaultProfileImage}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="font-medium text-sm sm:text-base">{userInfo?.name || "User"}</span>
            </div>

            <div className="relative">
              <textarea
                name="caption"
                value={postData.caption}
                onChange={handleInputChange}
                placeholder="What's on your mind?"
                className={`w-full p-3 sm:p-4 border rounded-lg resize-none min-h-24 sm:min-h-28 focus:ring-2 focus:ring-green-500 focus:outline-none mb-4 transition-colors text-sm sm:text-base ${
                  isDarkMode 
                    ? "bg-gray-700 border-gray-600 placeholder-gray-400" 
                    : "bg-white border-gray-300 placeholder-gray-500"
                }`}
              ></textarea>

              <button
                type="button"
                aria-label="Add emoji"
                className={`absolute right-3 bottom-8 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-500 hover:text-gray-700'
                } transition-colors`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <FaSmile size={18} className="sm:text-lg" />
              </button>
            </div>
            
            <div ref={emojiPickerRef} className="relative">
              {showEmojiPicker && (
                <div className={`absolute z-10 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } shadow-lg rounded-lg scale-75 sm:scale-100 origin-bottom-right bottom-0 right-0 sm:bottom-4 sm:right-0`}>
                  <EmojiPicker onEmojiClick={addEmoji} theme={isDarkMode ? 'dark' : 'light'} />
                </div>
              )}
            </div>
            
            <div 
              ref={dropZoneRef}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`mb-4 p-3 sm:p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ${
                dragActive 
                  ? isDarkMode 
                    ? "border-green-500 bg-gray-700" 
                    : "border-green-500 bg-green-50" 
                  : isDarkMode 
                    ? "border-gray-600 hover:border-green-500 hover:bg-gray-700" 
                    : "border-gray-300 hover:border-green-500 hover:bg-gray-50"
              }`}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*" 
                onChange={handleFileChange} 
                className="hidden" 
                id="file-upload"
                aria-label="Upload files"
              />
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center gap-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                  <line x1="16" y1="5" x2="22" y2="5"></line>
                  <line x1="19" y1="2" x2="19" y2="8"></line>
                  <circle cx="9" cy="9" r="2"></circle>
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <div>
                  <p className="font-medium text-sm sm:text-base">Drag and drop files here</p>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>or click to select files</p>
                </div>
              </label>
            </div>
            
            {postData.media.length > 0 && (
              <div className="mb-4 bg-opacity-50 p-2 sm:p-3 rounded-lg transition-all duration-200">
                <p className="text-xs sm:text-sm font-medium mb-2">{postData.media.length} file(s) selected</p>
                <div className="flex flex-wrap gap-2 max-h-24 sm:max-h-32 overflow-y-auto p-1 sm:p-2">
                  {Array.from(postData.media).map((file, index) => (
                    <div 
                      key={index} 
                      className={`relative group rounded-md overflow-hidden ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-100"
                      } px-2 sm:px-3 py-1 sm:py-2 flex items-center`}
                    >
                      <span className="text-xs sm:text-sm truncate max-w-16 sm:max-w-32">
                        {file.name.length > 12 ? file.name.substring(0, 12) + "..." : file.name}
                      </span>
                      <button 
                        onClick={() => removeFile(index)}
                        aria-label={`Remove file ${file.name}`}
                        className={`ml-1 sm:ml-2 rounded-full p-1 transition-colors ${
                          isDarkMode 
                            ? "bg-gray-600 text-gray-300 hover:bg-gray-500" 
                            : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                        }`}
                      >
                        <FontAwesomeIcon icon={faXmark} size="xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-between gap-2 sm:gap-3 mt-3 sm:mt-4">
              <button 
                onClick={closePopup} 
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  isDarkMode 
                    ? "bg-gray-700 hover:bg-gray-600 text-white" 
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancel
              </button>
              <button 
                onClick={handlePost} 
                disabled={loading || (!postData.caption.trim() && postData.media.length === 0)} 
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 text-white rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  loading 
                    ? "bg-green-700 cursor-not-allowed" 
                    : (!postData.caption.trim() && postData.media.length === 0)
                      ? "bg-green-500 opacity-50 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="hidden sm:inline">Posting...</span>
                    <span className="sm:hidden">...</span>
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