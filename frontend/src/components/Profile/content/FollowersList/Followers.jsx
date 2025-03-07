import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchFollowers } from "../../../../actions/UserActions";
import { useNavigate } from "react-router-dom";
const Followers = ({profile}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Followers</h2>
      {followers?.map((user) => (
  <div key={user._id} className="flex items-center justify-between p-4 border-b">
    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate(`/profile/${user._id}`)}>
      <img src={"http://localhost:5000"+user.profileImage} alt={user.name} className="w-12 h-12 rounded-full" />
      <div>
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500">{user.jobProfile}</p>
        <p className="text-xs text-gray-400">{user.sharedFollowers} shared followers</p>
      </div>
    </div>
    <div className="flex space-x-2">
      <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg">Remove</button>
      <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Message</button>
    </div>
  </div>
))}
    </div>
  );
} else {
    return (
      <div className="p-5">
        <div className="text-center text-gray-400">No followers yet...</div>
      </div>
    );
  }
};

export default Followers;
