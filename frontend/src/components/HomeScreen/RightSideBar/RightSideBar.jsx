import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import React, { useContext, useState } from "react";
import { ThemeContext } from "../../../context/ThemeContext"; // Make sure the path is correct
import { useNavigate } from "react-router-dom";

const RightSidebar = () => {
  // Get dark mode state
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { suggestedUsers } = useSelector((store) => store.auth);
  const { userInfo } = useSelector((state) => state.userLogin);
  
  // State to track how many users to display
  const [usersToShow, setUsersToShow] = useState(5);
  
  const defaultProfileImage = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  const newsArticles = [
    { title: "Ten questions you should answer truthfully", time: "2hr" },
    { title: "Five unbelievable facts about money", time: "" },
  ];

  // Get only the users we want to display
  const displayedUsers = suggestedUsers.slice(0, usersToShow);
  
  // Handle view more button click
  const handleViewMore = () => {
    setUsersToShow(usersToShow + 5);
  };

  return (
    <div className="w-70 h-auto space-y-6">
      {/* Who to Follow Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-4 shadow-md`}>
        <h2 className="text-2xl font-bold mb-3 text-green-600">Who to follow</h2>
        <div className="flex flex-col gap-0">
          {displayedUsers.map((user, index) => (
            <div key={user._id || index} className={`flex items-center justify-between rounded-lg p-2 ${isDarkMode?"hover:bg-gray-600":"hover:bg-gray-200"}`}>
              {/* Profile Image */}
              <div className={`flex items-center space-x-3 cursor-pointer`}
              onClick={()=>navigate(`/profile/${user._id}`)}>
                <div className="rounded-full">
                <img
                  src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : defaultProfileImage}
                  alt={user.name}
                  className={`w-12 h-12 rounded-full object-cover ${
                    userInfo.following.includes(user._id) ? "border-2 border-blue-600 p-0.5" : ""
                  }`}
                />
                </div>
                
                <div>
                  <h4 className="font-medium">{user.username}</h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user.jobProfile}</p>
                </div>
              </div>
              {/* Follow Button */}
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  userInfo.following.includes(user._id) 
                    ? "bg-green-600 text-white hover:bg-green-700" 
                    : isDarkMode 
                      ? "bg-green-300 text-green-600 hover:bg-green-200" 
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {userInfo.following.includes(user._id) ? <FaUserCheck size={18} /> : <FaUserPlus size={18} />}
              </button>
            </div>
          ))}
        </div>
        
        {/* Only show the View More button if there are more users to display */}
        {suggestedUsers.length > usersToShow && (
          <button 
            className={`w-full font-normal mt-3 py-2 ${
              isDarkMode 
                ? "text-green-200 bg-green-800 hover:bg-green-700" 
                : "text-green-600 bg-green-100 hover:bg-green-600 hover:text-white"
            }`}
            onClick={handleViewMore}
          >
            View more
          </button>
        )}
      </div>

      {/* Today's News Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg p-4 shadow-md`}>
        <h2 className="text-2xl font-bold mb-3 text-green-600">Today's news</h2>
        <div className="space-y-2">
          {newsArticles.map((article, index) => (
            <NewsItem key={index} article={article} isDarkMode={isDarkMode} />
          ))}
        </div>
      </div>
    </div>
  );
};

// News Item Component
const NewsItem = ({ article, isDarkMode }) => (
  <div>
    <h4 className={`text-sm font-medium hover:underline cursor-pointer ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {article.title}
    </h4>
    {article.time && <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{article.time}</p>}
  </div>
);

export default RightSidebar;