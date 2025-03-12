import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../../reducers/ProfileSlice";
import './ProfileNavBar.css';
import React, {  useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
function ProfileNavBar({ user = {} }) { // ✅ Default value to prevent undefined errors
    const activeTab = useSelector((state) => state.profile.activeTab);
    const dispatch = useDispatch();
    const { isDarkMode } = useContext(ThemeContext);
    return (
        <div className="profile-nav-bar">
            {['posts', 'about', 'followers', 'following', 'media', 'videos'].map(tab => (
                <button
                    key={tab}
                    className={`nav-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => dispatch(setActiveTab(tab))}
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    
                    {tab === 'followers' && (
                        <span className={` font-bold p-1 px-2 rounded-lg ml-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
                            {user?.followers?.length || 0}  {/* ✅ Safe access */}
                        </span>
                    )}
                    
                    {tab === 'following' && (
                        <span className={` font-bold p-1 px-2 rounded-lg ml-2 ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-600'}`}>
                            {user?.following?.length || 0}  {/* ✅ Safe access */}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export default ProfileNavBar;
