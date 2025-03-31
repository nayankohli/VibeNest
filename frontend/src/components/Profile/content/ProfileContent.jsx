import React from 'react';
import { useSelector } from "react-redux";
import './ProfileContent.css';
import DisplayPosts from '../displayPosts/DisplayPosts';
import CreatePost from "../../CreatePost/CreatePost";
import AboutSection from './AboutSec/AboutSection';
import Followers from './FollowersList/Followers';
import Media from './Media/Media';
import Following from './FollowingList/Following';
import { useContext } from 'react';
import { ThemeContext } from "../../../context/ThemeContext";
import Videos from './Videos/Video';
function ProfileContent({ activeTab }) {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin; // Access the user data from context
    const fetchProfileState = useSelector((state) => state.fetchProfile);
    const { loading, error, profile } = fetchProfileState || {}; 
    const { isDarkMode } = useContext(ThemeContext);
    const renderContent = () => {
        switch (activeTab) {
            case 'posts':
                return (
                    <div className='flex flex-col gap-2'>
                        {userInfo?._id === profile?._id && (
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg w-full`}>
                            <CreatePost />
                        </div>
                )}
                        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
                            <DisplayPosts />
                        </div>
                    </div>
                );
            case 'about':
                return <AboutSection profile={profile} loggedInUserId={userInfo._id}/>
            case 'followers':
                return<Followers profile={profile}/>;
            case 'following':
                return<Following profile={profile}/>;
            case 'media':
                return <Media/>;
            case 'videos':
                return <Videos/>
            default:
                return <div className={`${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} p-6 rounded-lg shadow-md text-center`}>Loading...</div>;
        }
    };

    return (
        <div className="flex flex-col  p-0">
            {renderContent()}
        </div>
    );
}

export default ProfileContent;
