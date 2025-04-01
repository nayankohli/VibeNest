// This could be a separate hook or service
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_CONFIG from '../../../config/api-config';
export const useFollowingService = () => {
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const fetchFollowing = async () => {
    if (!userInfo || !userInfo.token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/users/following/`+userInfo._id, config);
      setFollowing(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to follow a user
  const followUser = async (userId) => {
    if (!userInfo || !userInfo.token) return;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`${API_CONFIG.BASE_URL}/api/user/followUnfollow/${userId}`, config);
      
      // Refresh following list
      fetchFollowing();
      
      return true;
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      return false;
    }
  };
  const unfollowUser = async (userId) => {
    if (!userInfo || !userInfo.token) return;
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`${API_CONFIG.BASE_URL}/api/user/followUnfollow/${userId}`, config);
      fetchFollowing();
      
      return true;
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      return false;
    }
  };

  // Check if a user is being followed
  const isFollowing = (userId) => {
    return following.some(user => user._id === userId);
  };

  return {
    following,
    isLoading,
    error,
    fetchFollowing,
    followUser,
    unfollowUser,
    isFollowing,
  };
};