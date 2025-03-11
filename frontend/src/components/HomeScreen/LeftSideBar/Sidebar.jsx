import { FaHome, FaUserFriends, FaGlobe, FaBookmark, FaUsers, FaBell, FaCog,FaComments } from "react-icons/fa";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Sidebar= () => {
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
  
    // Fallback values for profile image and banner
    const defaultProfileImage =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    const defaultBannerImage = "/default-banner.jpg";
  
    useEffect(() => {
      if (!userInfo) {
        navigate("/login"); // Redirect to login if not logged in
      }
    }, [navigate, userInfo]);
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md w-80 h-full overflow-auto">
      {/* Banner Section */}
      <div className="relative flex flex-col top-0">
        <img
          src={"http://localhost:5000"+userInfo?.banner || "defaultBannerImage.jpg"}
          alt="Banner"
          className="w-full h-24 object-cover rounded-t-lg mt-[-16px]"
        />
        {/* Profile Image */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 border-4 border-white rounded-lg">
          <img
            src={"http://localhost:5000"+userInfo?.profileImage || "defaultProfileImage.jpg"}
            alt="Profile"
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-12 flex flex-col items-center text-center px-4">
        <h2 className="text-lg font-semibold">{userInfo?.name}</h2>
        <p className="text-gray-500 text-sm">{userInfo?.jobProfile}</p>
        <p className="text-gray-600 text-sm mt-2">
          {userInfo?.bio}
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex items-center justify-center  py-4 border-b mt-4">
        <div className="text-center px-4">
          <h4 className="text-lg  font-bold">{userInfo?.posts.length}</h4>
          <p className="text-gray-500 font-semibold text-sm">Posts</p>
        </div>
        <div className="text-center px-4 border-x-2">
          <h4 className="text-lg font-bold">{userInfo?.followers.length}</h4>
          <p className="text-gray-500 font-semibold text-sm">Followers</p>
        </div>
        <div className="text-center px-4">
          <h4 className="text-lg  font-bold">{userInfo?.following.length}</h4>
          <p className="text-gray-500 font-semibold text-sm">Following</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col space-y-4 py-4 px-6">
        <SidebarItem icon={<FaHome />} text="Feed" />
        <SidebarItem icon={<FaUserFriends />} text="Followers" />
        <SidebarItem icon={<FaUsers />} text="Following" />
        <SidebarItem icon={<FaComments />} text="Chats" />
        <SidebarItem icon={<FaBookmark />} text="Your Saved" />
        <SidebarItem icon={<FaBell />} text="Notifications" />
        <SidebarItem icon={<FaCog />} text="Settings" />
      </div>
    </div>
  );
};

// Sidebar Menu Item Component
const SidebarItem = ({ icon, text }) => (
  <div className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-blue-600">
    <div className="text-xl text-green-800">{icon}</div>
    <span className="text-base font-bold">{text}</span>
  </div>
);

export default Sidebar;
