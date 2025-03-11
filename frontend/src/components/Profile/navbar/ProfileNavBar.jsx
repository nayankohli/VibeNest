import { useSelector, useDispatch } from "react-redux";
import { setActiveTab } from "../../../reducers/ProfileSlice";
import './ProfileNavBar.css';

function ProfileNavBar({ user = {} }) { // ✅ Default value to prevent undefined errors
    const activeTab = useSelector((state) => state.profile.activeTab);
    const dispatch = useDispatch();

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
                        <span className='text-green-600 font-bold p-1 px-2 rounded-lg ml-2 bg-green-100'>
                            {user?.followers?.length || 0}  {/* ✅ Safe access */}
                        </span>
                    )}
                    
                    {tab === 'following' && (
                        <span className='text-green-600 font-bold p-1 px-2 rounded-lg ml-2 bg-green-100'>
                            {user?.following?.length || 0}  {/* ✅ Safe access */}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

export default ProfileNavBar;
