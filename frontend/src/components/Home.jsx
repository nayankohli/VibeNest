import React, { useEffect } from "react";
import "./css/Home.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import CreatePost from './CreatePost';

const Home = () => {
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Fallback values for profile image and banner
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const defaultBannerImage = "/default-banner.jpg";

  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate, userInfo]);

  return (
    <div className="dashboard">
        <div className="navbar-container">
          <Navbar />
        </div>
      <div className="grid-container">
        <div className="left-sidebar">
          <div className="profile-page">
            <div className="profile-banner">
              <img
                src={"http://localhost:5000"+userInfo?.banner || defaultBannerImage}
                alt="Banner"
                className="banner-photo"
              />
            </div>
            <div className="profile-info-container">
              <img
                src={"http://localhost:5000"+userInfo?.profileImage || defaultProfileImage}
                alt="Profile"
                className="profile-photo"
              />
              <div className="profile-details">
                <h2>{userInfo?.name || "Anonymous User"}</h2>
                <p className="profile-bio">
                  {userInfo?.bio || "No bio available."}
                </p>
                <div className="stats">
                  <div className="posts">
                    <h4>{userInfo?.posts?.length || 0}</h4>
                    <p>Posts</p>
                  </div>
                  <div className="followers">
                    <h4>{userInfo?.followers?.length || 0}</h4>
                    <p>Followers</p>
                  </div>
                  <div className="following">
                    <h4>{userInfo?.following?.length || 0}</h4>
                    <p>Following</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="center-content">
        <div className="additional-item-1">
          <h1>Welcome to Your Dashboard</h1>
        </div>
        <div className="additional-item-2">
        <CreatePost />
        </div>
        <div className="main-content">
          <h4>No recent posts..</h4>
        </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <h2>People you may Know</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
