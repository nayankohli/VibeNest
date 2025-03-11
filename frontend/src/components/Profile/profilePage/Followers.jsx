import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchFollowers } from "../../../actions/UserActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck,faMessage } from "@fortawesome/free-solid-svg-icons";
import { setActiveTab } from "../../../reducers/ProfileSlice";
const Followers = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchProfileState = useSelector((state) => state.fetchProfile);
      const { profileLoading, profileError, profile } = fetchProfileState || {};
  const followersList = useSelector((state) => state.followersList);
  const { followers, loading, error } = followersList;
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
      if (profile && profile._id) {
        dispatch(fetchFollowers(profile._id)); // Pass the profile ID
      }
    }, [dispatch, profile]);
  if (followers && followers.length > 0) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className=" font-bold"><span className="text-2xl">Followers</span> <span className="text-green-600 text-lg  bg-green-100 p-2 rounded-lg ">{followers.length}</span></h1>
        <span 
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={() => dispatch(setActiveTab("followers"))}
                >
                    See all followers
                </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {followers.map((follower, index) => (
          <div key={index} className="bg-white relative p-4 cursor-pointer rounded-lg shadow  transition-transform duration-200 hover:scale-105 hover:shadow-lg">
            <div className="flex flex-col items-center "
            onClick={()=>{
                navigate(`/profile/${follower._id}`);
              }}>
                <div className="rounded-full">
                <img
                src={"http://localhost:5000"+follower.profileImage || "/default-avatar.png"}
                alt={follower.username}
                className="w-16 h-16 object-cover rounded-full border-2 border-blue-500"
              />
                </div>
              
              <h2 className="mt-2 font-semibold">{follower.name}</h2>
              <p className="text-sm text-center text-gray-600">{follower.mutualConnections} mutual connections</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 px-3 rounded">
                <FontAwesomeIcon icon={faMessage} />
                </button>
                <button className="bg-red-500 text-white p-2 px-3 hover:bg-red-700 rounded">
                <FontAwesomeIcon icon={faUserCheck} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
};

export default Followers;
