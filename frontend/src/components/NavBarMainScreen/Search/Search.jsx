import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { searchUsers } from "../../../actions/UserActions";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import API_CONFIG from "../../../config/api-config";

const Search = ({ isSearchPopupOpen, setIsSearchPopupOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSearch = useSelector((state) => state.userSearch);
  const { loading, users, error } = userSearch;
  const popupRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);
  
  const openPopup = () => setIsSearchPopupOpen(true);
  const closePopup = () => {
    setIsSearchPopupOpen(false);
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

    if (isSearchPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchPopupOpen]);

  return (
    <div>
      {isSearchPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div 
            ref={popupRef} 
            className={`w-full max-w-4xl rounded-lg shadow-lg relative `}
          >
            <button
              onClick={closePopup}
              className={`absolute top-3 right-3 z-10 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faMagnifyingGlass} 
                className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } absolute top-1/2 left-4 transform -translate-y-1/2`} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search...."
                className={`w-full p-3 pl-10 pr-4 border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } rounded-full focus:ring-2 focus:ring-green-600 focus:outline-none`}
              />
            </div>
<div className="flex flex-col items-center w-full">
<div className="mt-4 max-h-96   overflow-y-auto">
              {loading ? (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>Loading...</p>
              ) : error ? (
                <p className="text-red-500 text-center py-4">{error}</p>
              ) : users && users.length > 0 ? (
                users.map((user) => (
                  <div
                    key={user._id}
                    className={`flex items-center py-3 px-52  hover:bg-green-400/20 cursor-pointer rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      closePopup();
                      navigate(`/profile/${user._id}`);
                    }}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <img
                        src={user.profileImage ?user.profileImage : defaultProfileImage}
                        alt={user.username}
                        className="h-10 w-10 object-cover rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} text-base truncate block`}>
                          {user.username}
                        </span>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim() !== "" ? (
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center py-4`}>No users found</p>
              ) : null}
            </div>
</div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;