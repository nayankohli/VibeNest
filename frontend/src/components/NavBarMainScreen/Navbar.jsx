import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faMessage,
  faBell,
  faGears,
  faMagnifyingGlass,
  faPlus,
  faBookmark,
  faGlobe,
  faRightFromBracket,
  faSun,
  faMoon,
  faBars,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, setSelectedUser } from "../../actions/UserActions.jsx";
import Search from "./Search/Search.jsx";
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider.js";
import { getSender } from "../../actions/ChatActions.jsx";
import Notifications from "./Notifications.jsx";
import API_CONFIG from "../../config/api-config.js";
import Sidebar from "../HomeScreen/LeftSideBar/Sidebar.jsx";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifiDropdownOpen, setIsNotifiDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isSearchPopupOpen, setIsSearchPopupOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser, notification, setNotification, setSelectedChat } = ChatState();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  useEffect(() => {
    const newSocket = io(`${API_CONFIG.BASE_URL}`);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);
  const handleToggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    dispatch(logout());
    if (socket) socket.disconnect();
    navigate("/login");
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userInfo._id}`);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotifiDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isDropdownOpen || isNotifiDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isNotifiDropdownOpen, isMobileMenuOpen]);

  return (
    <div>
      {/* Main Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border-b-4 border-green-400 h-16 flex items-center z-50 px-8 md:px-10 lg:px-20 xl:px-40`}
      >
        {/* Left section: Logo and Search */}
        <div className="flex items-center gap-3 flex-1">
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg"
            onClick={handleToggleLeftSidebar}
          >
            <FontAwesomeIcon icon={faBars} className={isDarkMode ? "text-white" : "text-gray-800"} />
          </button>

          {/* Logo */}
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <img
              src={`${
                isDarkMode
                  ? `${API_CONFIG.BASE_URL}/uploads/black-white-logo.png`
                  : `${API_CONFIG.BASE_URL}/uploads/logo-no-background.png`
              }`}
              alt="logo"
              className="h-8 md:h-10"
            />
          </div>

          {/* Desktop Search Bar */}
          <div
            className={`hidden md:flex items-center ${
              isDarkMode ? "bg-gray-600" : "bg-gray-200"
            } rounded-lg px-3 py-2 w-full max-w-xl`}
          >
            <button
                    onClick={()=>{setIsSearchPopupOpen(!isSearchPopupOpen)}}
                    className={`${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200'} flex items-center space-x-2 rounded-lg focus:outline-none w-full`}
                  >
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
                    <input
                      type="text"
                      placeholder="Search..."
                      className={`bg-transparent w-full focus:outline-none ${isDarkMode ? 'placeholder-gray-300' : 'placeholder-gray-500'} `}
                      
                    />
                  </button>
          </div>
        </div>

        {/* Right section: Icons and Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            className={`hidden md:block p-2 px-3 text-lg ${
              isDarkMode
                ? "bg-gray-400 text-black hover:bg-gray-500"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            } rounded-lg`}
            onClick={() => navigate("/chats")}
          >
            <FontAwesomeIcon icon={faMessage} />
          </button>
          
          {/* Notifications */}
          <div className="hidden md:block">
            <button
              className={`p-2 px-3 text-lg relative ${
                isDarkMode
                  ? "bg-gray-400 text-black hover:bg-gray-500"
                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
              } rounded-lg`}
              onClick={() => setIsNotifiDropdownOpen(!isNotifiDropdownOpen)}
            >
              <FontAwesomeIcon icon={faBell} />
              {notification.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notification.length}
                </span>
              )}
            </button>
            {isNotifiDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-72 shadow-lg z-50 transform -translate-x-28 md:-translate-x-44 lg:-translate-x-60"
              >
                <Notifications
                  isNotifiDropdownOpen={isNotifiDropdownOpen}
                  setIsNotifiDropdownOpen={setIsNotifiDropdownOpen}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>

          <button
            className={`hidden md:block p-2 px-3 text-lg ${
              isDarkMode
                ? "bg-gray-400 text-black hover:bg-gray-500"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            } rounded-lg`}
            onClick={() => navigate("/settings")}
          >
            <FontAwesomeIcon icon={faGears} />
          </button>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="rounded-lg"
            >
              <img
                src={
                  userInfo.profileImage
                    ?  userInfo?.profileImage
                    : defaultProfileImage
                }
                alt="Profile"
                className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-lg"
              />
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className={`absolute right-0 mt-2 w-60 p-2 shadow-lg rounded-lg border ${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-900"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              >
                {/* User Info */}
                <div className="flex items-center p-3 gap-2 relative">
                  <div className="rounded-full absolute">
                    <img
                      src={
                        userInfo.profileImage
                          ?  userInfo?.profileImage
                          : defaultProfileImage
                      }
                      alt="Profile"
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-[4rem]">
                    <h4 className="font-bold text-lg">
                      {userInfo?.username || "Anonymous User"}
                    </h4>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {userInfo?.jobProfile || "No job Profile."}
                    </p>
                  </div>
                </div>

                {/* View Profile Button */}
                <button
                  className={`w-full px-4 py-2 text-sm font-medium transition ${
                    isDarkMode
                      ? "bg-green-700 text-white hover:bg-green-600"
                      : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                  }`}
                  onClick={handleViewProfile}
                >
                  View Profile
                </button>

                {/* Menu Items */}
                <ul className="mt-2">
                  <li
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      navigate("/saved");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faBookmark} className="mr-3" /> Your
                    Saved
                  </li>
                  <li
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      navigate("/settings");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faGears} className="mr-3" /> Settings
                  </li>
                  <li
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      navigate("/news");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faGlobe} className="mr-3" /> Latest News
                  </li>
                  <li
                    className={`flex items-center px-4 py-2 text-red-500 cursor-pointer ${
                      isDarkMode
                        ? "hover:bg-red-800 hover:text-white"
                        : "hover:bg-red-100"
                    }`}
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon
                      icon={faRightFromBracket}
                      className="mr-3"
                    />
                    Logout
                  </li>
                </ul>

                {/* Dark/Light Mode Switch */}
                <div
                  className={`flex items-center justify-between px-4 py-2 mt-2 rounded-md ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <span className="text-sm font-medium">Mode:</span>
                  <button
                    onClick={() => setIsDarkMode((prev) => !prev)}
                    className="p-2 rounded-full transition"
                  >
                    {isDarkMode ? (
                      <FontAwesomeIcon
                        icon={faSun}
                        className="text-yellow-400 text-xl"
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={faMoon}
                        className="text-gray-800 text-xl"
                      />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar for Small Screens */}
      <div 
        className={`fixed bottom-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-lg flex justify-around items-center md:hidden h-16 z-40 border-t ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <button 
          className="flex flex-col items-center justify-center py-1 flex-1"
          onClick={() => navigate("/home")}
        >
          <FontAwesomeIcon icon={faHome} className="text-xl" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center py-1 flex-1"
          onClick={()=>setIsSearchPopupOpen(true)}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
          <span className="text-xs mt-1">Search</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center py-1 flex-1"
          onClick={() => navigate("/news")}
        >
          <FontAwesomeIcon icon={faGlobe} className="text-xl" />
          <span className="text-xs mt-1">News</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center py-1 flex-1 relative"
          onClick={() => navigate("/chats")}
        >
          <FontAwesomeIcon icon={faMessage} className="text-xl" />
          <span className="text-xs mt-1">Messages</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center py-1 flex-1 relative"
          onClick={() => navigate("/notifications")}
        >
          <FontAwesomeIcon icon={faBell} className="text-xl" />
          {notification.length > 0 && (
            <span className="absolute top-0 right-1/4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {notification.length}
            </span>
          )}
          <span className="text-xs mt-1">Alerts</span>
        </button>
      </div>
      {isLeftSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsLeftSidebarOpen(false)}
          ></div>
          
          {/* Drawer Content */}
          <div 
            className={`absolute top-0 left-0 h-full  shadow-xl transition-transform duration-300  transform ${isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className=" h-full overflow-y-auto">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
      <Search isSearchPopupOpen={isSearchPopupOpen} setIsSearchPopupOpen={setIsSearchPopupOpen}/>
    </div>
    
  );
};

export default Navbar;