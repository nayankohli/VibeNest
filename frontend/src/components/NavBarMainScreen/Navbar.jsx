import React, { useState, useEffect, useRef } from "react";
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
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/UserActions.jsx";
import Search from "./Search/Search.jsx"; // Import the Search component

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    dispatch(logout());
    navigate("/login");
    if (socket) socket.disconnect();
  };

  const handleViewProfile = () => {
    navigate(`/profile/${userInfo._id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div>
      {/* Top Navbar for Medium and Larger Screens */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b-4 border-green-400 h-16 flex items-center justify-between px-5 z-50 md:relative">
        {/* Logo */}
        <div className="cursor-pointer"onClick={() => navigate("/home")}>
          <img
            src="http://localhost:5000/uploads/logo-no-background.png"
            alt="logo"
            className="h-8 md:h-10"
          />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-200 rounded px-3 py-2 w-80">
          <Search /> {/* Use Search component directly */}
        </div>

        {/* Icons and Profile */}
        <div className="flex items-center space-x-2">
          <button className="hidden md:block p-2 text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300" onClick={()=>navigate("/chats")}>
            <FontAwesomeIcon icon={faMessage} />
          </button>
          <button className="hidden md:block p-2 text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="hidden md:block p-2 text-gray-500 bg-gray-200 rounded-full hover:bg-gray-300" onClick={()=>navigate("/settings")}>
            <FontAwesomeIcon icon={faGears} />
          </button>
          <div className="relative">
            <button onClick={toggleDropdown} className="rounded-full">
              <img
                src={"http://localhost:5000" + userInfo?.profileImage || defaultProfileImage}
                alt="Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
            </button>
            {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute right-0 mt-2 w-60 p-2 bg-white shadow-lg rounded-lg border border-gray-200">
              <div className="flex items-center p-3 gap-2 relative">
                <div className="rounded-full absolute">
                <img
                  src={
                    "http://localhost:5000" + userInfo?.profileImage ||
                    defaultProfileImage
                  }
                  alt="Profile"
                  className="w-12 h-12 object-cover rounded-full"
                />
                </div>
                <div className="ml-[4rem]">
                  <h4 className="font-bold text-lg">
                    {userInfo?.name || "Anonymous User"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {userInfo?.jobProfile || "No bio available."}
                  </p>
                </div>
              </div>
              <button
                className="w-full px-4 py-2 bg-green-100 text-green-600 text-sm font-medium hover:bg-green-600 hover:text-white transition"
                onClick={handleViewProfile}
              >
                View Profile
              </button>
              <ul className="mt-2 text-gray-500 text-md">
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FontAwesomeIcon icon={faBookmark} className="mr-3" /> Your
                  Saved
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FontAwesomeIcon icon={faGears} className="mr-3" /> Settings
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <FontAwesomeIcon icon={faLock} className="mr-3" /> Security &
                  Privacy
                </li>
                <li
                  className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer "
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="mr-3" />
                  Logout
                </li>
              </ul>
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
