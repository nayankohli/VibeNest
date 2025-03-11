import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../NavBarMainScreen/Navbar";
import CreatePost from '../CreatePost/CreatePost';
import Story from "./Stories/Story";
import UploadStory from "./Stories/UploadStory";
import Sidebar from "./LeftSideBar/Sidebar";
import RightSidebar from "./RightSideBar/RightSideBar";
import useGetSuggestedUsers from "./hooks/UseGetAllSuggestedUsers";
const Home = () => {
  useGetSuggestedUsers();
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
    <div className="flex flex-col h-screen bg-green-100">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Grid Container */}
      <div className="flex flex-grow gap-3 p-5 mx-20 mt-16">
        {/* Left Sidebar */}
        <Sidebar/>

        {/* Center Content */}
        <div className="flex-grow flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow-md">
            <UploadStory/>
            <Story></Story>
          </div>
          <div className="bg-white rounded-lg shadow-md p-0">
            <CreatePost />
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 text-center text-gray-500">
            <h4>No recent posts..</h4>
          </div>
        </div>

        {/* Right Sidebar */}
        <RightSidebar/>
      </div>
    </div>
  );
};

export default Home;
