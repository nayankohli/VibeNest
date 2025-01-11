import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faBell,
  faGears,
  faMagnifyingGlass,
  faBookmark,
  faLock,
  faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/UserActions.jsx";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const handleFocus = () => setIsInputFocused(true);
  const handleBlur = () => setIsInputFocused(false);

  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Replace with your server URL if needed
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
    if (socket) socket.disconnect();
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="navbar">
      <div
        className="logo"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="http://localhost:5000/uploads/logo-no-background.png"
          alt="logo"
        />
      </div>
      <div className="search-bar">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <input
          type="text"
          placeholder="Search..."
          className={`input ${isInputFocused ? "active" : ""}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      <div className="nav-options">
        <button>
          <FontAwesomeIcon icon={faMessage} />
        </button>
        <button>
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button>
          <FontAwesomeIcon icon={faGears} />
        </button>
      </div>
      <div className="account">
        <button onClick={toggleDropdown}>
          <img
            src={
              "http://localhost:5000" + userInfo?.profileImage ||
              defaultProfileImage
            }
            alt="Profile"
            className="profile-photo"
          />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <ul>
                <div className="profileImage">
                  <img
                    src={
                      "http://localhost:5000" + userInfo?.profileImage ||
                      defaultProfileImage
                    }
                    alt="Profile"
                    className="profile-photo"
                  />
                  <div className="profile-details">
                  <h4>{userInfo.name || 'Anonymous User'}</h4>
                  <p className="profile-bio">{userInfo.bio || 'No bio available.'}</p>
                  </div>
                </div>
                <button onClick={handleViewProfile}>View Profile</button>
              <li><FontAwesomeIcon icon={faBookmark} />Your Saved</li>
              <li><FontAwesomeIcon icon={faGears} />Settings</li>
              <li><FontAwesomeIcon icon={faLock} />Security & Privacy</li>
              <li onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} />Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
