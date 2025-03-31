import { FaHome, FaUserFriends, FaGlobe, FaBookmark, FaUsers, FaBell, FaCog, FaComments } from "react-icons/fa";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../../context/ThemeContext"; // Make sure this path is correct
import defaultBanner from '../defaultBanner.jpg';
import { setActiveTab } from "../../../reducers/ProfileSlice";
const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch=useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const { isDarkMode } = useContext(ThemeContext);
  
    // Fallback values for profile image and banner
    const defaultProfileImage =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  
    useEffect(() => {
      if (!userInfo) {
        navigate("/login"); // Redirect to login if not logged in
      }
    }, [navigate, userInfo]);
    
  return (
    <div className={`flex flex-col ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-md w-full h-auto overflow-hidden`}>
      {/* Banner Section */}
      <div className="relative flex flex-col top-0">
        <img
          src={
            userInfo.banner?
            "http://localhost:5000" + userInfo?.banner :
            defaultBanner
          }
          alt="Banner"
          className="w-full h-24 object-cover rounded-t-lg mt-[-16px]"
        />
        {/* Profile Image */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 -bottom-10 border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'} rounded-lg`}
        onClick={()=>navigate(`/profile/${userInfo._id}`)}>
          <img
            src={
              userInfo.profileImage?
              "http://localhost:5000" + userInfo?.profileImage :
              defaultProfileImage
            }
            alt="Profile"
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-12 flex flex-col items-center text-center px-4 w-full mx-auto">
  <h2 className="text-lg font-semibold">{userInfo?.name}</h2>
  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-xs`}>
    {userInfo?.jobProfile}
  </p>
  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-md mt-2 whitespace-pre-line`}>
    {userInfo?.bio}
  </p>
</div>


      {/* Stats Section */}
      <div className={`flex items-center justify-center py-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b mt-4`}>
        <div className="text-center px-4">
          <h4 className="text-lg font-bold">{userInfo?.posts.length}</h4>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} font-semibold text-sm`}>Posts</p>
        </div>
        <div className={`text-center px-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-x-2`}>
          <h4 className="text-lg font-bold">{userInfo?.followers.length}</h4>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} font-semibold text-sm`}>Followers</p>
        </div>
        <div className="text-center px-4">
          <h4 className="text-lg font-bold">{userInfo?.following.length}</h4>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} font-semibold text-sm`}>Following</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className="flex flex-col space-y-4 py-4 px-6">
        <SidebarItem icon={<FaHome />} text="Feed" isDarkMode={isDarkMode} 
        onClick={()=>navigate("/home")}/>
        <SidebarItem icon={<FaUserFriends />} text="Followers" isDarkMode={isDarkMode} 
        onClick={()=>{
          navigate(`/profile/${userInfo._id}`);
          dispatch(setActiveTab("followers"));
        }}/>
        <SidebarItem icon={<FaUsers />} text="Following" isDarkMode={isDarkMode}
        onClick={()=>{
          navigate(`/profile/${userInfo._id}`);
          dispatch(setActiveTab("following"));
        }} />
        <SidebarItem icon={<FaComments />} text="Chats" isDarkMode={isDarkMode}
        onClick={()=>navigate("/chats")} />
        <SidebarItem icon={<FaBookmark />} text="Your Saved" isDarkMode={isDarkMode}
        onClick={()=>navigate("/saved")} />
        <SidebarItem icon={<FaGlobe />} text="Latest News" isDarkMode={isDarkMode}
        onClick={()=>navigate("/news")}  />
        <SidebarItem icon={<FaBell />} text="Notifications" isDarkMode={isDarkMode} />
        <SidebarItem icon={<FaCog />} text="Settings" isDarkMode={isDarkMode} 
        onClick={()=>navigate("/settings")}/>
      </div>
    </div>
  );
};

// Sidebar Menu Item Component
const SidebarItem = ({ icon, text, isDarkMode, onClick }) => (
  <div className={`flex items-center space-x-3 ${isDarkMode ? 'text-gray-200 hover:text-blue-400' : 'text-gray-700 hover:text-blue-600'} cursor-pointer`}
  onClick={onClick}>
    <div className={`text-xl ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>{icon}</div>
    <span className="text-base font-bold">{text}</span>
  </div>
);

export default Sidebar;