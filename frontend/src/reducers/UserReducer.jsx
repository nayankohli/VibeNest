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
    SET_SELECTED_USER
  } from "../constants/UserConstants";
  
  export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_LOGIN_REQUEST:
        return { loading: true };
      case USER_LOGIN_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_LOGIN_FAIL:
        return { loading: false, error: action.payload };
      case USER_LOGOUT:
        return {};
      default:
        return state;
    }
  };
  
  export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_REGISTER_REQUEST:
        return { loading: true };
      case USER_REGISTER_SUCCESS:
        return { loading: false, userInfo: action.payload };
      case USER_REGISTER_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
      case USER_UPDATE_REQUEST:
        return { loading: true };
      case USER_UPDATE_SUCCESS:
        return { loading: false, userInfo: action.payload, success: true };
      case USER_UPDATE_FAIL:
        return { loading: false, error: action.payload, success: false };
      case USER_UPDATE_RESET:  // ✅ Reset the state
        return {};
      default:
        return state;
    }
  };
  
  
  export const userSearchReducer = (state = { users: [] }, action) => {
    switch (action.type) {
      case USER_SEARCH_REQUEST:
        return { loading: true, users: [] };
      case USER_SEARCH_SUCCESS:
        return { loading: false, users: action.payload };
      case USER_SEARCH_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const fetchProfileReducer = (state = { profile: {} }, action) => {
    switch (action.type) {
      case FETCH_PROFILE_REQUEST:
        return { profileLoading: true, profile: {} };
      case FETCH_PROFILE_SUCCESS:
        return { profileLoading: false, profile: action.payload };
      case FETCH_PROFILE_FAIL:
        return { profileLoading: false, profileError: action.payload };
      default:
        return state;
    }
  };
  export const suggestedUsersReducer = (state = { suggestedUsers: [] }, action) => {
    switch (action.type) {
      case "SET_SUGGESTED_USERS":
        return {
          ...state,
          suggestedUsers: action.payload,
        };
      default:
        return state;
    }
  };
  
  export const followUnfollowReducer = (state = {}, action) => {
    switch (action.type) {
      case FOLLOW_USER_REQUEST:
        return { followUnfollowloading: true };
      case UNFOLLOW_USER_REQUEST:
        return { followUnfollowloading: true };
  
      case FOLLOW_USER_SUCCESS:
        return { followUnfollowloading: false, success: true, user: action.payload };
  
      case UNFOLLOW_USER_SUCCESS:
        return { followUnfollowloading: false, success: true, user: action.payload };
  
      case FOLLOW_USER_FAIL:
        return { followUnfollowloading: false, followUnfollowError: action.payload };
      case UNFOLLOW_USER_FAIL:
        return { followUnfollowloading: false, followUnfollowError: action.payload };
  
      default:
        return state;
    }
  };
  
  export const followerFetchReducer = (state = { followers: [] }, action) => {
    switch (action.type) {
      case FOLLOWER_FETCH_REQUEST:
        return { loading: true, followers: [] };
      case FOLLOWER_FETCH_SUCCESS:
        return { loading: false, followers: action.payload }; // Success returns an array of followers
      case FOLLOWER_FETCH_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };

  const initialState = {
    selectedUser: null,  // Ensure this exists initially
};

export const selectedUser = (state = initialState, action) => {
  switch (action.type) {
    case SET_SELECTED_USER:
      return { ...state, selectedUser: action.payload };
    default:
      return state;
  }
};
