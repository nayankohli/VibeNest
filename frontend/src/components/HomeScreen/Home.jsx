import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../NavBarMainScreen/Navbar";
import CreatePost from '../CreatePost/CreatePost';
import Stories from "./Stories/Story";
import UploadStory from "./Stories/UploadStory";
import Sidebar from "./LeftSideBar/Sidebar";
import RightSidebar from "./RightSideBar/RightSideBar";
import useGetSuggestedUsers from "./hooks/UseGetAllSuggestedUsers";
import { ThemeContext } from "../../context/ThemeContext";
import HomeFeed from "./HomeFeed/HomeFeed";
const Home = () => {
  useGetSuggestedUsers();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { isDarkMode } = useContext(ThemeContext); // Get isDarkMode state
  
  useEffect(() => {
    if (!userInfo) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [navigate, userInfo]);

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-green-100 text-black"}`}>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Grid Container */}
      <div className="flex flex-grow gap-3 p-5 mx-12 mt-16">
        {/* Left Sidebar */}
        <div className="">
        <Sidebar />
        </div>
        

        {/* Center Content */}
        <div className="flex-grow flex flex-col max-w-100 gap-2">
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} p-2 rounded-lg shadow-md`}>
          <Stories isDarkMode={isDarkMode} />
          </div>
          <div className={` rounded-lg shadow-md p-0`}>
            <CreatePost />
          </div>
          <div className={`${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"} rounded-lg shadow-md text-center`}>
            <HomeFeed/>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-70">
        <RightSidebar  />
        </div>
        
      </div>
    </div>
  );
};

export default Home;