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
              onClick={() => navigate("/profile")}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg w-96 shadow-lg text-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <h3 className="text-lg font-semibold mb-3">Create Post</h3>
            <textarea
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
            ></textarea>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="mb-3" />
            <div className="flex justify-between gap-3">
              <button onClick={handlePost} disabled={loading} className="flex-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {loading ? "Posting..." : "Post"}
              </button>
              <button onClick={closePopup} className="flex-1 p-2 bg-gray-300 text-black rounded-md hover:bg-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
