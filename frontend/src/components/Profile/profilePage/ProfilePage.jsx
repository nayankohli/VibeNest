import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ProfileNavBar from "../navbar/ProfileNavBar";
import ProfileContent from "../content/ProfileContent";
import Navbar from "../../NavBarMainScreen/Navbar";
import { fetchProfile,followUnfollow } from "../../../actions/UserActions";
import Loading from "../../Loading";
import "./ProfilePage.css";
import Media from "./Media";
import Followers from "./Followers";
import { FaBirthdayCake, FaUser, FaEnvelope } from "react-icons/fa";
import { format } from "date-fns";
function ProfilePage() {
  const { id } = useParams(); // Get user ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const followUnfollowState = useSelector((state) => state.followUnfollow);
  const { userInfo } = useSelector((state) => state.userLogin);
  const fetchProfileState = useSelector((state) => state.fetchProfile);
  const { profileLoading, profileError, profile } = fetchProfileState || {}; // Avoid destructuring undefined

  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);

  const defaultProfileImage =
  "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (id || userInfo._id) {
      dispatch(fetchProfile(id || userInfo._id));
    }
  }, [dispatch, id, navigate, userInfo]);

  useEffect(() => {
    if (profile && userInfo) {
      setIsFollowing(profile?.followers?.includes(userInfo._id));
    }
  }, [profile, userInfo]);

  const handleFollowUnfollow = () => {
    dispatch(followUnfollow(profile._id, isFollowing));
  };

  useEffect(() => {
    if (followUnfollowState.success) {
      setIsFollowing(!isFollowing);
    }
  }, [followUnfollowState.success]);
  const handleEditClick = () => {
    navigate("/settings");
  };


  return (
    
    <div className="mt-0 bg-green-100 h-full">
      {profileLoading && <Loading />}
      {/* Main Navbar */}
      <div className="sticky top-0 z-10 bg-white shadow">
        <Navbar />
      </div>
      <div className="grid grid-cols-11 gap-4 max-w-7xl mx-auto my-8">
  {/* 1st Column (60%) */}
  <div className="col-span-7 rounded-t-lg pb-0 w-70 bg-green-100">
    <div className="pb-0">
      {/* Banner */}
      <div className="rounded-t-lg overflow-hidden mt-0">
        <img
          src={"http://localhost:5000" + profile?.banner || "/default-banner.jpg"}
          alt="Banner"
          className="w-full max-h-40 object-cover rounded-t-lg"
        />
      </div>

      {/* Profile Info */}
      <div className="bg-white shadow-md p-6 -mt-20 w-full py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={"http://localhost:5000" + profile?.profileImage || defaultProfileImage}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h2 className="text-xl font-bold mt-4">{profile?.name || "Anonymous User"}</h2>
              <p className="text-sm text-gray-600">
                Followers: {profile?.followers?.length || 0} | Posts: {profile?.posts?.length || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">{profile?.bio || "No bio available."}</p>
            </div>
          </div>
          {userInfo?._id === profile?._id ? (
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          ) : isFollowing ? (
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                Message
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                onClick={handleFollowUnfollow}
              >
                Unfollow
              </button>
            </div>
          ) : (
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              onClick={handleFollowUnfollow}
            >
              Follow
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Navigation Tabs */}
    <div className="bg-white rounded-b-lg px-3 border-y-2 w-full mb-2">
      <ProfileNavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>

    {/* Profile Content */}
    <div className="rounded-lg mb-5">
      <ProfileContent activeTab={activeTab} />
    </div>
  </div>

  {/* 2nd Column (40%) */}
  <div className="col-span-4 space-y-6">
    {/* About Section */}
    <div className="bg-white p-6 rounded-lg shadow-md border text-md border-gray-200">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-4">About</h1>

      {/* Bio Section */}
      <p className="text-gray-700 mb-4">
        {profile?.bio || "No bio available."}
      </p>

      {/* Birthdate */}
      {profile?.dob && (
        <p className=" text-gray-600 flex items-center gap-2 mb-2">
          <FaBirthdayCake className="text-pink-500" />
          <span className="font-bold">Born:</span>
          <span>{format(new Date(profile.dob), "dd MMMM yyyy")}</span>
        </p>
      )}

      {/* Gender */}
      {profile?.gender && (
        <p className=" text-gray-600 flex items-center gap-2 mb-2">
          <FaUser className="text-blue-500" />
          <span className="font-bold">Gender:</span> <span>{profile.gender}</span>
        </p>
      )}

      {/* Email */}
      <p className=" text-gray-600 flex items-center gap-2">
        <FaEnvelope className="text-green-500" />
        <span className="font-bold">Email:</span>
        <span>{profile.email}</span>
      </p>
    </div>

    {/* Media Section */}
    <div className="rounded-lg shadow-md">
      <Media />
    </div>

    {/* Followers Section */}
    <div className="rounded-lg shadow-md mb-5">
      <Followers/>
    </div>
  </div>
</div>

        </div>
  );
}

export default ProfilePage;
