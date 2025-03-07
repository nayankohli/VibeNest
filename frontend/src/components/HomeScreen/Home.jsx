import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../NavBarMainScreen/Navbar";
import CreatePost from '../CreatePost/CreatePost';
import Story from "./Stories/Story";
import UploadStory from "./Stories/UploadStory";
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
    <div className="flex flex-col h-screen bg-green-100">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Grid Container */}
      <div className="flex flex-grow gap-5 p-5 mt-16">
        {/* Left Sidebar */}
        <div className="flex flex-col bg-white rounded-lg shadow-md p-0 w-80 h-full overflow-auto">
          <div>
            <img
              src={"http://localhost:5000" + userInfo?.banner || defaultBannerImage}
              alt="Banner"
              className="w-full h-20  object-cover -mt-4"
            />
          </div>
          <div className="flex flex-col items-center -mt-5">
            <img
              src={"http://localhost:5000" + userInfo?.profileImage || defaultProfileImage}
              alt="Profile"
              className="w-20 h-20 rounded-lg border-4 border-white"
            />
            <h2 className="mt-2 text-lg font-semibold">{userInfo?.name || "Anonymous User"}</h2>
            <p className="text-gray-500 text-sm">{userInfo?.bio || "No bio available."}</p>
          </div>
          <div className="flex justify-between m-5 border-t pt-4 ">
            <div className="text-center">
              <h4 className="text-lg font-bold">{userInfo?.posts?.length || 0}</h4>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-bold">{userInfo?.followers?.length || 0}</h4>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-bold">{userInfo?.following?.length || 0}</h4>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-grow flex flex-col gap-5">
          <div className="bg-white rounded-lg shadow-md p-5">
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
        <div className="flex flex-col bg-white rounded-lg shadow-md p-5 w-80 h-full overflow-auto">
          <h2 className="text-lg font-semibold">People you may know</h2>
        </div>
      </div>
    </div>
  );
};

export default Home;
