import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../NavBarMainScreen/Navbar";
import CreatePost from '../CreatePost/CreatePost';
import Stories from "./Stories/Story";
import Sidebar from "./LeftSideBar/Sidebar";
import RightSidebar from "./RightSideBar/RightSideBar";
import useGetSuggestedUsers from "./hooks/UseGetAllSuggestedUsers";
import { ThemeContext } from "../../context/ThemeContext";
import HomeFeed from "./HomeFeed/HomeFeed";
import MessageSideDrawer from "./MessageSideBar";

const Home = () => {
  useGetSuggestedUsers();
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const { isDarkMode } = useContext(ThemeContext);
  
  // State to control Message SideDrawer visibility
  const [isMsgSideDrawerOpen, setIsMsgSideDrawerOpen] = useState(false);
  // State to control Left Sidebar Drawer visibility
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const handleMessageButtonClick = () => {
    setIsMsgSideDrawerOpen(true);
  };

  const handleCloseMessageDrawer = () => {
    setIsMsgSideDrawerOpen(false);
  };

  const handleToggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <div className={`flex flex-col min-h-screen w-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-green-100 text-black"}`}>
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full">
        <Navbar />
      </div>

      {/* Main Grid Container */}
      <div className="flex flex-grow pt-20 px-2 md:px-5 mx-auto relative">
        {/* Left Sidebar - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:block w-80 flex-shrink-0 sticky top-20 h-screen overflow-y-auto pb-20">
          <Sidebar />
        </div>
        
        {/* Left Sidebar Hamburger Button - Visible only on mobile/tablet */}
        <button 
          onClick={handleToggleLeftSidebar}
          className="lg:hidden fixed top-20 left-4 z-40 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110"
          style={{
            backgroundColor: isDarkMode ? '#1F2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000'
          }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {/* Center Content - Full width on mobile, constrained on larger screens */}
        <div className="w-full lg:w-[45rem] flex flex-col gap-2 mx-auto px-2 md:px-4">
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} p-2 rounded-lg shadow-md w-full`}>
            <Stories isDarkMode={isDarkMode} />
          </div>
          <div className={`w-full rounded-lg shadow-md p-0`}>
            <CreatePost />
          </div>
          <div className={`${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"} rounded-lg shadow-md text-center w-full mb-16`}>
            <HomeFeed/>
          </div>
        </div>

        {/* Right Sidebar - Only visible on large screens */}
        <div className="hidden lg:block w-80 flex-shrink-0 sticky top-20 h-screen overflow-y-auto pb-20">
          <RightSidebar />
        </div>
      </div>

      {/* Floating Message Button - Only visible on large screens */}
      <button 
        onClick={handleMessageButtonClick}
        className={`
          fixed 
          bottom-6 
          right-6 
          z-50 
          w-14 
          h-14 
          rounded-full 
          shadow-2xl 
          hidden
          lg:flex 
          items-center 
          justify-center 
          transition-all 
          duration-300 
          hover:scale-110 
          ${isDarkMode 
            ? "bg-green-600 text-white hover:bg-green-700" 
            : "bg-green-500 text-white hover:bg-green-600"
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 20l1.3-5.2A9 9 0 1 1 12 21H3z" />
          <path d="M12 12v.01" />
          <path d="M16 12v.01" />
          <path d="M8 12v.01" />
        </svg>
      </button>

      {/* Message SideDrawer */}
      {isMsgSideDrawerOpen && (
        <div className="fixed inset-0 z-[70]">
          <MessageSideDrawer onClose={handleCloseMessageDrawer} />
        </div>
      )}

      {/* Left Sidebar Drawer - Mobile Only */}
      {isLeftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsLeftSidebarOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div 
            className={`absolute top-0 left-0 h-full w-80 shadow-xl transition-transform duration-300 transform ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="p-4 h-full overflow-y-auto pt-20">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;