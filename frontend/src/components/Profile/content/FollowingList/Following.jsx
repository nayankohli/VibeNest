import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowing } from "../../../../actions/UserActions";
import { useNavigate } from "react-router-dom";

const Following = ({ profile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const followingList = useSelector((state) => state.followingList);
  const { following } = followingList || { following: [] }; // Ensure it's always an array
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (profile && profile._id) {
      dispatch(fetchFollowing(profile._id)); // Fetch the following list of the viewed profile
    }
  }, [dispatch, profile]);

  if (!following || following.length === 0) {
    return (
      <div className="p-5 bg-white">
        <div className="text-center text-gray-400">No following yet...</div>
      </div>
    );
  }

  // Find if logged-in user is in the following list
  const isUserFollowing = following.some((user) => user._id === userInfo?._id);

  // Create a new sorted list where userInfo comes first if they are in the list
  const sortedFollowing = isUserFollowing
    ? [
        following.find((user) => user._id === userInfo?._id), // Logged-in user at top
        ...following.filter((user) => user._id !== userInfo?._id), // Other users
      ]
    : following;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Following</h2>

      {sortedFollowing.map((user) => (
        <div key={user?._id} className="flex items-center justify-between p-4 border-t">
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
              <p className="text-sm text-gray-500">{user?.jobProfile || "No job profile"}</p>
              <p className="text-xs text-gray-400">{user?.sharedFollowers || 0} mutual followers</p>
            </div>
          </div>

          {/* Follow/Unfollow Buttons */}
          {userInfo?._id !== user?._id && (
            userInfo?.following?.includes(user?._id) ? (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white">Remove</button>
                <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white">Message</button>
              </div>
            ) : (
              <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white">Follow</button>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Following;
