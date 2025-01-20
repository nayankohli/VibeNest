import React, { useState } from "react";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faVideo, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { createPost } from "../../actions/PostActions"; // Import createPost action

const CreatePost = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [postData, setPostData] = useState({
    caption: "",
    media: null,
  });

  const handleInputChange = (e) => {
    setPostData({
      ...postData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setPostData({
      ...postData,
      media: e.target.files,
    });
  };

  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setPostData({ caption: "", media: null }); // Reset form data
  };

  const handlePost = () => {
    if (!postData.caption && !postData.media) {
      alert("Please add some content to your post.");
      return;
    }

    const mediaFiles = postData.media ? Array.from(postData.media) : [];

    // Dispatch the createPost action with caption and media
    dispatch(createPost(postData.caption, mediaFiles));

    closePopup();
  };

  return (
    <div className="create-post-container">
      {/* Collapsed State */}
      {!isPopupOpen && (
        <div className="create-post-box">
          <div className="first-row">
            <div
              className="profileImage"
              onClick={() => navigate('/profile')}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={
                  userInfo?.profileImage
                    ? `http://localhost:5000${userInfo.profileImage}`
                    : defaultProfileImage
                }
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

      {/* Expanded State (Popup) */}
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
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <div className="popup-actions">
              <button onClick={handlePost}>Post</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
