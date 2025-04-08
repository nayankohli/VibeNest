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
    SET_SELECTED_USER ,
    USER_UPDATE_PRIVACY_REQUEST,
  USER_UPDATE_PRIVACY_SUCCESS,
  USER_UPDATE_PRIVACY_FAIL,
  USER_UPDATE_PRIVACY_RESET,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
  USER_PASSWORD_UPDATE_RESET
  } from "../constants/UserConstants";
  import axios from "axios";
  import API_CONFIG from "../config/api-config";
  export const login = (email, password) => async (dispatch) => {
    try {
      dispatch({ type: USER_LOGIN_REQUEST });
  
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
  
      const { data } = await axios.post(
        `${API_CONFIG.BASE_URL}/api/users/login`,
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
  localStorage.removeItem('userInfo'); 
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
        `${API_CONFIG.BASE_URL}/api/users/register`,
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
          "Content-Type": "multipart/form-data", 
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.put(
        `${API_CONFIG.BASE_URL}/api/users/edit-profile`,
        formData,
        config
      );
  
      dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data)); 
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
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.get(
        `${API_CONFIG.BASE_URL}/api/users/search?query=${query}`,
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
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/users/profile/${id}`,
        config
      ); 
  
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
        `${API_CONFIG.BASE_URL}/api/users/followUnfollow/${userId}`,
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
            Authorization: `Bearer ${userInfo.token}`, 
          },
        };
      const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/users/followers/${id}`,
          config
      ); 
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
                Authorization: `Bearer ${userInfo.token}`,
              },
            };
          const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/users/following/${id}`,
              config
          ); 
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
      
      export const updatePrivacy = (privacyStatus) => async (dispatch, getState) => {
        try {
          dispatch({ type: USER_UPDATE_PRIVACY_REQUEST });
          const {
            userLogin: { userInfo },
          } = getState();
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token}`,
            },
          };
          const { data } = await axios.put(
            `${API_CONFIG.BASE_URL}/api/users/privacy`,
            { privacy: privacyStatus },
            config
          );
      
          dispatch({ type: USER_UPDATE_PRIVACY_SUCCESS, payload: data });
          
          localStorage.setItem("userInfo", JSON.stringify(data));
          dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      
        } catch (error) {
          dispatch({
            type: USER_UPDATE_PRIVACY_FAIL,
            payload:
              error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
          });
        }
      };
    
      export const resetPrivacyUpdate = () => (dispatch) => {
        dispatch({ type: USER_UPDATE_PRIVACY_RESET });
      };

      export const changePassword = (passwordData) => async (dispatch, getState) => {
        try {
          dispatch({ type: USER_PASSWORD_UPDATE_REQUEST })
      
          const { userLogin: { userInfo } } = getState()
      
          const config = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`
            }
          }
      
          const { data } = await axios.put(`${API_CONFIG.BASE_URL}/api/users/change-password`, passwordData, config)
      
          dispatch({ 
            type: USER_PASSWORD_UPDATE_SUCCESS, 
            payload: data 
          })
        } catch (error) {
          dispatch({ 
            type: USER_PASSWORD_UPDATE_FAIL, 
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message 
          })
        }
      }
      export const resetPasswordUpdate = () => (dispatch) => {
        dispatch({ type: USER_PASSWORD_UPDATE_RESET })
      }