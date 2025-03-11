import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_RESET,
    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAIL,
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAIL,
    FOLLOW_USER_REQUEST,
    FOLLOW_USER_SUCCESS,
    FOLLOW_USER_FAIL,
    UNFOLLOW_USER_REQUEST,
    UNFOLLOW_USER_SUCCESS,
    UNFOLLOW_USER_FAIL,
    FOLLOWER_FETCH_REQUEST,
    FOLLOWER_FETCH_SUCCESS,
    FOLLOWER_FETCH_FAIL,
    FOLLOWING_FETCH_REQUEST,
    FOLLOWING_FETCH_SUCCESS,
    FOLLOWING_FETCH_FAIL,
    SET_SELECTED_USER 
  } from "../constants/UserConstants";
  import axios from "axios";
  
  export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        config
      );
  
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  export const logout = () => (dispatch) => {
    localStorage.removeItem("userInfo");
    dispatch({ type: USER_LOGOUT });
  };
  
  export const register = (username, email, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_REGISTER_REQUEST });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        "http://localhost:5000/api/users/register",
        { username, email, password },
        config
      );
  
      dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: USER_REGISTER_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  export const updateProfile = (formData) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_UPDATE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure to use multipart/form-data for file uploads
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.put(
        "http://localhost:5000/api/users/edit-profile",
        formData,
        config
      );
  
      dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data)); // Update the localStorage with new user data
    } catch (error) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const resetUserUpdate = () => (dispatch) => {
    dispatch({ type: USER_UPDATE_RESET });
  };
  
  
  export const searchUsers = (query) => async (dispatch, getState) => {
    try {
      dispatch({ type: USER_SEARCH_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Include token if the route is protected
        },
      };
  
      const { data } = await axios.get(
        `http://localhost:5000/api/users/search?query=${query}`,
        config
      );
  
      dispatch({ type: USER_SEARCH_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: USER_SEARCH_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  
  export const fetchProfile = (id) => async (dispatch,getState) => {
    try {
      dispatch({ type: FETCH_PROFILE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`, // Include token if the route is protected
        },
      };
  
      const { data } = await axios.get(`http://localhost:5000/api/users/profile/${id}`,
        config
      ); // Replace with your actual API route
  
      dispatch({ type: FETCH_PROFILE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
  
  export const setSuggestedUsers = (payload) => ({
    type: "SET_SUGGESTED_USERS",
    payload,
  });
  
  export const followUnfollow = (userId, isFollowing) => async (dispatch, getState) => {
    try {
      dispatch({ type: isFollowing ? UNFOLLOW_USER_REQUEST : FOLLOW_USER_REQUEST });
  
      const { userLogin: { userInfo } } = getState();
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(
        `http://localhost:5000/api/users/followUnfollow/${userId}`,
        {},
        config
      );
  
      dispatch({
        type: isFollowing ? UNFOLLOW_USER_SUCCESS : FOLLOW_USER_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: isFollowing ? UNFOLLOW_USER_FAIL : FOLLOW_USER_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };
  
  export const fetchFollowers= (id) => async (dispatch,getState) => {
    try {
      dispatch({ type:FOLLOWER_FETCH_REQUEST});
          const {
            userLogin: { userInfo },
          } = getState();
  
      const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`, // Include token if the route is protected
          },
        };
      const { data } = await axios.get("http://localhost:5000/api/users/followers/"+id,
          config
      ); // Your API route
      dispatch({ type: FOLLOWER_FETCH_SUCCESS, payload: data });
        } catch (error) {
          dispatch({
            type: FOLLOWER_FETCH_FAIL,
            payload: error.response?.data?.message || error.message,
          });
        }
      };

      export const fetchFollowing= (id) => async (dispatch,getState) => {
        try {
          dispatch({ type:FOLLOWING_FETCH_REQUEST});
              const {
                userLogin: { userInfo },
              } = getState();
      
          const config = {
              headers: {
                Authorization: `Bearer ${userInfo.token}`, // Include token if the route is protected
              },
            };
          const { data } = await axios.get("http://localhost:5000/api/users/following/"+id,
              config
          ); // Your API route
          dispatch({ type: FOLLOWING_FETCH_SUCCESS, payload: data });
            } catch (error) {
              dispatch({
                type: FOLLOWING_FETCH_FAIL,
                payload: error.response?.data?.message || error.message,
              });
            }
          };
      export const setSelectedUser = (user) => ({
        type: SET_SELECTED_USER,
        payload: user,
      });
      