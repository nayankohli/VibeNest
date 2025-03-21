import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProfileNavBar from "../navbar/ProfileNavBar";
import ProfileContent from "../content/ProfileContent";
import Navbar from "../../NavBarMainScreen/Navbar";
import { fetchProfile, followUnfollow } from "../../../actions/UserActions";
import Loading from "../../Loading";
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
      className={`mt-0 h-full ${
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
                <div className="w-full max-w-md">
                  {" "}
                  {/* Control width here */}
                  <PrivateProfileCheck
                    profile={profile}
                    loggedInUser={userInfo}
                    onFollow={handleFollowUnfollow}
                  />
                </div>
              )}
          </div>
        )}

        <div className="grid grid-cols-11 gap-4 max-w-7xl mx-auto my-8">
          <div className="col-span-7 rounded-t-lg pb-0 w-70">
            <div className="pb-0">
              <div className="rounded-t-lg overflow-hidden mt-0">
                <img
                  src={
                    profile?.banner
                      ? "http://localhost:5000" + profile?.banner
                      : defaultBanner
                  }
                  alt="Banner"
                  className="w-full max-h-40 object-cover rounded-t-lg"
                />
              </div>
              <div
                className={`shadow-md flex flex-col gap-4 p-6 -mt-20 w-full py-8 ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        profile?.profileImage
                          ? "http://localhost:5000" + profile?.profileImage
                          : defaultProfileImage
                      }
                      alt="Profile"
                      className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
                    />
                    <div className="flex flex-col gap-4 items-center">
                      <h2 className="text-2xl font-bold mt-14">
                        {profile?.name || "Anonymous User"}
                      </h2>
                      <div className="flex items-center">
                        <div className="text-center px-4">
                          <h4 className="text-lg font-bold">
                            {profile?.posts?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? " text-white" : " text-gray-500"
                            } font-semibold text-sm`}
                          >
                            Posts
                          </p>
                        </div>
                        <div className="text-center px-4 border-x-2">
                          <h4 className="text-lg font-bold">
                            {profile?.followers?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? " text-white" : " text-gray-500"
                            } font-semibold text-sm`}
                          >
                            Followers
                          </p>
                        </div>
                        <div className="text-center px-4">
                          <h4 className="text-lg font-bold">
                            {profile?.following?.length}
                          </h4>
                          <p
                            className={`${
                              isDarkMode ? " text-white" : " text-gray-500"
                            } font-semibold text-sm`}
                          >
                            Following
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {userInfo?._id === profile?._id ? (
                    <button
                      className={`${
                        isDarkMode
                          ? "bg-red-900 text-red-200 hover:bg-red-700 hover:text-white"
                          : "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                      } py-2 px-4 rounded-lg transition`}
                      onClick={handleEditClick}
                    >
                      <FontAwesomeIcon icon={faUserPen} className="mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className={`py-2 px-4 rounded-lg transition ${
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
                        <FontAwesomeIcon className="mr-2" />
                        {isFollowing ? "Message" : ""}
                      </button>
                      <button
                        className={`py-2 px-4 rounded-lg transition ${
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
                        <FontAwesomeIcon className="mr-2" />
                        {isFollowing ? "Unfollow" : "Follow"}
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className={`flex gap-5 mx-auto justify-between ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } font-medium`}
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faBriefcase}
                      className=" mr-2 text-sm"
                    />
                    <span>Job Profile: {profile?.jobProfile}</span>
                  </div>

                  <div>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className=" mr-2 text-sm"
                    />
                    <span>
                      Lives in: <span>{profile?.location}</span>
                    </span>
                  </div>
                  <div>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="mr-2 text-sm"
                    />
                    <span>
                      Joined on:{" "}
                      <strong>
                        {profile.joinedOn &&
                        !isNaN(new Date(profile.joinedOn).getTime())
                          ? format(new Date(profile.joinedOn), "dd MMM yyyy")
                          : "N/A"}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }  rounded-b-lg px-3 border-t-2 w-full mb-2`}
            >
              <ProfileNavBar user={profile} />
            </div>
            <div className="rounded-lg mb-5">
              <ProfileContent activeTab={activeTab} />
            </div>
          </div>
          <div className="col-span-4 space-y-6">
            <div
              className={`${
                isDarkMode ? "bg-gray-800  text-white" : "bg-white "
              } p-6 rounded-lg shadow-md  text-md`}
            >
              {/* Header */}
              <h1
                className={`text-2xl font-bold text-green-600 mb-4`}
              >
                About
              </h1>

              {/* Bio Section */}
              <p
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                } mb-4`}
              >
                {profile?.bio || "No bio available."}
              </p>

              {/* Birthdate */}
              {profile?.dob && (
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-2 mb-2`}
                >
                  <FaBirthdayCake className="text-pink-500" />
                  <span className="font-bold">Born:</span>
                  <span>{format(new Date(profile.dob), "dd MMMM yyyy")}</span>
                </p>
              )}

              {/* Gender */}
              {profile?.gender && (
                <p
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } flex items-center gap-2 mb-2`}
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
                } flex items-center gap-2`}
              >
                <FaEnvelope className="text-green-500" />
                <span className="font-bold">Email:</span>
                <span>{profile?.email}</span>
              </p>
            </div>
            <div className="rounded-lg shadow-md">
              <Media />
            </div>
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
