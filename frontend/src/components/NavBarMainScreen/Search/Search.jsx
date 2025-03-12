import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { searchUsers } from "../../../actions/UserActions";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";

const Search = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSearch = useSelector((state) => state.userSearch);
  const { loading, users, error } = userSearch;
  const popupRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);
  
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => {
    setIsPopupOpen(false);
    setSearchQuery("");
  };
  
  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      return;
    }

    dispatch(searchUsers(query));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <div>
      <button
        onClick={openPopup}
        className={`${isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200'} flex items-center space-x-2 rounded-lg focus:outline-none w-full`}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={isDarkMode ? "text-gray-300" : "text-gray-500"} />
        <input
          type="text"
          placeholder="Search..."
          className={`bg-transparent w-full focus:outline-none ${isDarkMode ? 'placeholder-gray-300' : 'placeholder-gray-500'} `}
          onFocus={openPopup}
        />
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <div ref={popupRef} className={` w-[50rem] rounded-lg shadow-lg relative`}>
            <button
              onClick={closePopup}
              className={`absolute top-3 right-3 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              className={`${isDarkMode ? 'text-gray-900' : 'text-gray-500'} top-5 left-5 absolute`} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search...."
              className={`w-full p-3 px-5 border ${isDarkMode ? 'bg-gray-500 border-gray-600 text-white placeholder-gray-900' : 'border-gray-300'} rounded-3xl focus:ring-2 focus:ring-green-600 focus:outline-none`}
            />

            <div className="mt-4">
              {loading ? (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex space-x-4 p-2 items-center justify-center hover:bg-green-400/30 cursor-pointer rounded-lg"
                    onClick={()=>{
                      closePopup(); // Close the popup before navigating
                      navigate(`/profile/${user._id}`);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`http://localhost:5000${user.profileImage}` || defaultProfileImage}
                        alt={user.username}
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base`}>{user.username}</span>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.name}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>No users found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;