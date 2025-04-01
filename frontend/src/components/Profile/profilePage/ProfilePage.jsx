import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProfileNavBar from "../navbar/ProfileNavBar";
import ProfileContent from "../content/ProfileContent";
import Navbar from "../../NavBarMainScreen/Navbar";
import { fetchProfile, followUnfollow } from "../../../actions/UserActions";
import Loading from "../../Loaders/Loading";
import Media from "./Media";
import Followers from "./Followers";
import { FaBirthdayCake, FaUser, FaEnvelope, FaUserPlus } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import defaultBanner from "./defaultBanner.jpg";
import {
  faUserPen,
  faBriefcase,
  faLocationDot,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { ThemeContext } from "../../../context/ThemeContext";
import PrivateProfileCheck from "./PrivateProfileCheck";
import API_CONFIG from "../../../config/api-config";
function ProfilePage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const followUnfollowState = useSelector((state) => state.followUnfollow);
  const { userInfo } = useSelector((state) => state.userLogin);
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profileLoading, profile } = fetchProfileState || {};
  const activeTab = useSelector((state) => state.profile.activeTab);
  const [isFollowing, setIsFollowing] = useState(false);

  const defaultProfileImage =
    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (id || userInfo?._id) {
      dispatch(fetchProfile(id || userInfo?._id));
    }
  }, [dispatch, id, navigate, userInfo]);

  useEffect(() => {
    if (profile && userInfo) {
      setIsFollowing(profile?.followers?.includes(userInfo?._id));
    }
  }, [profile, userInfo]);

  const handleFollowUnfollow = () => {
    dispatch(followUnfollow(profile?._id, isFollowing));
    window.location.reload();
  };

  useEffect(() => {
    if (profile) {
      const shouldShowModal =
        profile.privacy === "private" &&
        userInfo._id !== profile._id &&
        !profile.followers.some((follower) => follower === userInfo._id);

      if (shouldShowModal) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [profile, userInfo]);

  useEffect(() => {
    if (followUnfollowState.success) {
      setIsFollowing(!isFollowing);
    }
  }, [followUnfollowState.success]);

  const handleEditClick = () => {
    navigate("/settings");
  };

  return (
    <div
      className={`mt-0 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-green-100 text-black"
      }`}
    >
      <div className="sticky top-0 z-50 bg-white shadow">
        <Navbar />
      </div>
      {profileLoading && <Loading />}
      <div>
        {profile && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-40 ${
              profile.privacy === "private" &&
              userInfo._id !== profile._id &&
              !profile.followers.some((follower) => follower === userInfo._id)
                ? "visible bg-black bg-opacity-90"
                : "hidden"
            }`}
          >
            {profile.privacy === "private" &&
              userInfo._id !== profile._id &&
              !profile.followers.some(
                (follower) => follower === userInfo._id
              ) && (
                <div className="w-full max-w-md px-4">
                  <PrivateProfileCheck
                    profile={profile}
                    loggedInUser={userInfo}
                    onFollow={handleFollowUnfollow}
                  />
                </div>
              )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 lg:max-w-7xl lg:mx-auto md:mx-auto  sm:w-full px-2 sm:my-12 my-4 ">
          {/* Main Profile Section - Full width on mobile, 7/11 on large screens */}
          <div className="lg:col-span-7 rounded-lg pb-0 w-full">
            <div className="pb-0">
              <div className="rounded-t-lg overflow-hidden mt-0">
                <img
                  src={
                    profile?.banner
                      ? `${API_CONFIG.BASE_URL}` + profile?.banner
                      : defaultBanner
                  }
                  alt="Banner"
                  className="w-full h-24 sm:h-32 md:h-40 object-cover rounded-t-lg"
                />
              </div>
              <div
                className={`shadow-md flex flex-col gap-4 px-4 -mt-12 sm:-mt-16 md:-mt-20 w-full py-4 sm:py-8 items-center ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                {/* Profile Info Section */}
                <div className="flex flex-col sm:flex-row items-center lg:items-center sm:items-start sm:justify-between sm:gap-2 lg:gap-5">
                  {/* Profile Image and Stats */}
                  <div className="flex  lg:flex-row lg:justify-between items-end  sm:gap-4 lg:gap-8">
                    <img
                      src={
                        profile?.profileImage
                          ? `${API_CONFIG.BASE_URL} `+ profile?.profileImage
                          : defaultProfileImage
                      }
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <div className="flex flex-col items-center sm:items-start md:items-center lg:items-center gap-2">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 sm:mt-2 md:mt-4 lg:mt-0">
                        {profile?.name || "Anonymous User"}
                      </h2>
                      <div className="flex lg:gap-6 items-center">
                        <div className="text-center px-2 sm:px-3">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold">
                            {profile?.posts?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? "text-white" : "text-gray-500"
                            } font-semibold text-xs`}
                          >
                            Posts
                          </p>
                        </div>
                        <div className="text-center lg:px-5 px-3 border-x">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold">
                            {profile?.followers?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? "text-white" : "text-gray-500"
                            } font-semibold text-xs`}
                          >
                            Followers
                          </p>
                        </div>
                        <div className="text-center px-2 sm:px-3">
                          <h4 className="text-sm sm:text-base md:text-lg font-bold">
                            {profile?.following?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? "text-white" : "text-gray-500"
                            } font-semibold text-xs`}
                          >
                            Following
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-3">
                    {userInfo?._id === profile?._id ? (
                      <button
                        className={`${
                          isDarkMode
                            ? "bg-red-900 text-red-200 hover:bg-red-700 hover:text-white"
                            : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                        } py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center  transition lg:text-lg md:text-md sm:text-xs`}
                        onClick={handleEditClick}
                      >
                        <FontAwesomeIcon icon={faUserPen} className="mr-1 sm:mr-2" />Edit Profile
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition lg:text-lg md:text-md sm:text-sm ${
                            isFollowing
                              ? `${
                                  isDarkMode
                                    ? "bg-green-900 text-green-200 hover:bg-green-700"
                                    : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                                }`
                              : ``
                          }`}
                          onClick={() => navigate("/chats")}
                        >
                          <FontAwesomeIcon className="mr-1" />
                          {isFollowing ? "Message" : ""}
                        </button>
                        <button
                          className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition lg:text-lg md:text-md sm:text-sm ${
                            isFollowing
                              ? `${
                                  isDarkMode
                                    ? "bg-red-900 text-red-200 hover:bg-red-700"
                                    : "bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                                }`
                              : `${
                                  isDarkMode
                                    ? "bg-green-900 text-green-200 hover:bg-green-700"
                                    : "bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                                }`
                          }`}
                          onClick={handleFollowUnfollow}
                        >
                          <FontAwesomeIcon className="mr-1" />
                          {isFollowing ? "Unfollow" : "Follow"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* User Info Section */}
                <div
                  className={`flex flex-col sm:flex-row gap-3 mx-auto items-center justify-between sm:justify-between ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } font-medium text-xs sm:text-sm`}
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className="mr-1 sm:mr-2 text-xs"
                    />
                    <span>Job: {profile?.jobProfile || "Not specified"}</span>
                  </div>

                  <div>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="mr-1 sm:mr-2 text-xs"
                    />
                    <span>
                      Lives in: <span>{profile?.location || "Not specified"}</span>
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="mr-1 sm:mr-2 text-xs"
                    />
                    <span>
                      Joined:{" "}
                      <strong>
                        {profile?.joinedOn &&
                        !isNaN(new Date(profile?.joinedOn).getTime())
                          ? format(new Date(profile?.joinedOn), "dd MMM yyyy")
                          : "N/A"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Navigation */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } rounded-b-lg px-1 sm:px-3 border-t-2 w-full mb-2 overflow-x-auto`}
            >
              <ProfileNavBar user={profile} />
            </div>
            
            {/* Profile Content */}
            <div className="rounded-lg mb-5">
              <ProfileContent activeTab={activeTab} />
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:block space-y-4">
            {/* About Section - Visible on all screens */}
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white"
              } p-4 sm:p-6 rounded-lg shadow-md text-sm sm:text-md`}
            >
              {/* Header */}
              <h1 className={`text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4`}>
                About
              </h1>

              {/* Bio Section */}
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                } mb-3 sm:mb-4 text-sm`}
              >
                {profile?.bio || "No bio available."}
              </p>

              {/* Birthdate */}
              {profile?.dob && (
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-1 sm:gap-2 mb-2 text-xs sm:text-sm`}
                >
                  <FaBirthdayCake className="text-pink-500" />
                  <span className="font-bold">Born:</span>
                  <span>{format(new Date(profile?.dob), "dd MMM yyyy")}</span>
                </p>
              )}

              {/* Gender */}
              {profile?.gender && (
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-1 sm:gap-2 mb-2 text-xs sm:text-sm`}
                >
                  <FaUser className="text-blue-500" />
                  <span className="font-bold">Gender:</span>{" "}
                  <span>{profile?.gender}</span>
                </p>
              )}

              {/* Email */}
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } flex items-center gap-1 sm:gap-2 text-xs sm:text-sm break-all`}
              >
                <FaEnvelope className="text-green-500 flex-shrink-0" />
                <span className="font-bold">Email:</span>
                <span>{profile?.email}</span>
              </p>
            </div>

            {/* Media Section - Visible on all screens */}
            <div className="rounded-lg shadow-md">
              <Media />
            </div>

            {/* Followers Section - Visible on all screens */}
            <div className="rounded-lg shadow-md mb-5">
              <Followers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;