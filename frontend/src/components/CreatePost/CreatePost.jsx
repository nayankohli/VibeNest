import React, { useState } from "react";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import axios from "axios"; // Ensure this is correctly imported

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [postData, setPostData] = useState({ caption: "", media: [] });
  const [loading, setLoading] = useState(false);
  
  const {posts,setPosts} = useSelector((store) => store.post);
  const error = useSelector((store) => store.post.error);

  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPostData({ ...postData, media: Array.from(e.target.files) }); // Convert FileList to Array
  };

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setPostData({ caption: "", media: [] }); // Reset form data
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
    <div className="create-post-container">
      {!isPopupOpen && (
        <div className="create-post-box">
          <div className="first-row">
            <div
              className="profileImage"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={userInfo?.profileImage ? `http://localhost:5000${userInfo.profileImage}` : defaultProfileImage}
                alt="Profile"
                className="profile-photo"
              />
            </div>
            <input
              type="text"
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
              className={`caption-input ${isInputFocused ? "active" : ""}`}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className="button-group">
            <button onClick={openPopup}>
              <FontAwesomeIcon icon={faImage} style={{ color: "green" }} />
              Photo
            </button>
            <button onClick={openPopup}>
              <FontAwesomeIcon icon={faVideo} style={{ color: "red" }} />
              Video
            </button>
            <button onClick={openPopup}>
              <FontAwesomeIcon icon={faFaceSmile} style={{ color: "blue" }} />
              Feeling/Activity
            </button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="create-post-popup">
          <div className="popup-content">
            <h3>Create Post</h3>
            <textarea
              name="caption"
              value={postData.caption}
              onChange={handleInputChange}
              placeholder="What's on your mind?"
            ></textarea>
            <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} />
            <div className="popup-actions">
              <button onClick={handlePost} disabled={loading}>
                {loading ? "Posting..." : "Post"}
              </button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
