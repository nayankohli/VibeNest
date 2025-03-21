import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowing } from "../../../../actions/UserActions";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../../../context/ThemeContext";

const Followers = ({ profile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useContext(ThemeContext);
  const followersList = useSelector((state) => state.followersList);
  const { followers } = followersList || { followers: [] }; // Ensure it's always an array
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (profile && profile._id) {
      dispatch(fetchFollowing(profile._id)); // Fetch the following list of the viewed profile
    }
  }, [dispatch, profile]);

  if (!followers || followers.length === 0) {
    return (
      <div className={`p-5 ${isDarkMode ? 'bg-gray-800  text-gray-300' : 'bg-white'}`}>
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>No followers yet...</div>
      </div>
    );
  }

  // Find if logged-in user is in the following list
  const isUserFollower = followers.some((user) => user._id === userInfo?._id);

  // Create a new sorted list where userInfo comes first if they are in the list
  const sortedFollowers = isUserFollower
    ? [
        followers.find((user) => user._id === userInfo?._id), // Logged-in user at top
        ...followers.filter((user) => user._id !== userInfo?._id), // Other users
      ]
    : followers;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className="text-2xl font-semibold mb-4 text-green-600">Followers</h2>

      {sortedFollowers.map((user) => (
        <div key={user?._id} className={`flex items-center justify-between p-4 ${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
          {/* Clickable Profile Section */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => navigate(`/profile/${user?._id}`)}
          >
            <div className="rounded-full">
              <img
                src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : "/default-avatar.png"}
                alt={user?.name || "User"}
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold">{user?.name || "Unknown"}</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{user?.jobProfile || "No job profile"}</p>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>{user?.sharedFollowers || 0} mutual followers</p>
            </div>
          </div>

          {/* Follow/Unfollow Buttons */}
          {userInfo?._id !== user?._id && (
            userInfo?.followers?.includes(user?._id) ? (
              <div className="flex gap-2">
                <button className={`px-4 py-2 ${isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'} rounded-lg ${isDarkMode ? 'hover:bg-red-800 hover:text-white' : 'hover:bg-red-700 hover:text-white'}`}>Remove</button>
                <button className={`px-4 py-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'} rounded-lg ${isDarkMode ? 'hover:bg-green-800 hover:text-white' : 'hover:bg-green-700 hover:text-white'}`}>Message</button>
              </div>
            ) : (
              <button className={`px-4 py-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'} rounded-lg ${isDarkMode ? 'hover:bg-green-800 hover:text-white' : 'hover:bg-green-700 hover:text-white'}`}>Follow</button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Followers;