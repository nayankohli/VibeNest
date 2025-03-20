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
  faLock,
  faRightFromBracket,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout, setSelectedUser } from "../../actions/UserActions.jsx";
import Search from "./Search/Search.jsx"; // Import the Search component
import { ThemeContext } from "../../context/ThemeContext";
import { ChatState } from "../../context/ChatProvider.js";
import { getSender} from "../../actions/ChatActions.jsx";
import Notifications from "./Notifications.jsx";
const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifiDropdownOpen, setIsNotifiDropdownOpen] = useState(false);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setUser, notification, setNotification, setSelectedChat } =
    ChatState();
  const dropdownRef = useRef(null);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    dispatch(logout());
    if (socket) socket.disconnect();
    navigate("/login")
   // window.location.href = "/login";
  };
  const handleViewProfile = () => {
    navigate(`/profile/${userInfo._id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsNotifiDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isNotifiDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isNotifiDropdownOpen]);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 right-0 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } border-b-4  justify-between border-green-400 h-16 flex items-center  px-40 z-50 md:relative`}
      >
        {/* Logo */}
        <div className="flex gap-3">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <img
              src={`${
                isDarkMode
                  ? "http://localhost:5000/uploads/black-white-logo.png"
                  : "http://localhost:5000/uploads/logo-no-background.png"
              }`}
              alt="logo"
              className="h-8 md:h-10"
            />
          </div>

          {/* Search Bar */}
          <div
            className={`hidden md:flex items-center ${
              isDarkMode ? "bg-gray-600" : "bg-gray-200"
            } rounded-lg px-3 py-2 w-[30rem]`}
          >
            <Search /> {/* Use Search component directly */}
          </div>
        </div>

        {/* Icons and Profile */}
        <div className="flex items-center gap-3">
          <button
            className={`hidden md:block p-2 px-3 text-lg  ${
              isDarkMode
                ? "bg-gray-400 text-black hover:bg-gray-500"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            } rounded-lg `}
            onClick={() => navigate("/chats")}
          >
            <FontAwesomeIcon icon={faMessage} />
          </button>
          <div>
  <button
    className={`hidden md:block p-2 px-3 text-lg relative ${
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
      className="absolute right-60 mt-2 w-72 shadow-lg z-50"
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
            className={`hidden md:block p-2 px-3 text-lg  ${
              isDarkMode
                ? "bg-gray-400 text-black hover:bg-gray-500"
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            } rounded-lg `}
            onClick={() => navigate("/settings")}
          >
            <FontAwesomeIcon icon={faGears} />
          </button>
          <div className="relative">
            <button
              onClick={() => {
                toggleDropdown();
              }}
              className="rounded-lg"
            >
              <img
                src={
                  userInfo.profileImage?
                  "http://localhost:5000" + userInfo?.profileImage :
                  defaultProfileImage
                }
                alt="Profile"
                className="w-11 h-11 object-cover rounded-lg"
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
                        userInfo.profileImage?
                        "http://localhost:5000" + userInfo?.profileImage :
                        defaultProfileImage
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
                      {userInfo?.jobProfile || "No bio available."}
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
                  >
                    <FontAwesomeIcon icon={faBookmark} className="mr-3" /> Your
                    Saved
                  </li>
                  <li
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={faGears} className="mr-3" /> Settings
                  </li>
                  <li
                    className={`flex items-center px-4 py-2 cursor-pointer ${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-3" /> Security
                    & Privacy
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
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg flex justify-around items-center md:hidden h-16">
        <button>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
        </button>
        <button>
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
        </button>
        <button>
          <FontAwesomeIcon icon={faMessage} className="text-xl" />
        </button>
        <button>
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
