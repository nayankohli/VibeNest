import { createSlice } from "@reduxjs/toolkit";
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
    SET_SELECTED_USER,
    FOLLOWING_FETCH_REQUEST,
    FOLLOWING_FETCH_SUCCESS,
    FOLLOWING_FETCH_FAIL
} from "../constants/UserConstants";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        suggestedUsers: [],
    },
    reducers: {
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        }
    }
});

export const { setSuggestedUsers } = authSlice.actions;
export const authReducer = authSlice.reducer;

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
        case USER_UPDATE_RESET:
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

export const followUnfollowReducer = (state = {}, action) => {
    switch (action.type) {
        case FOLLOW_USER_REQUEST:
        case UNFOLLOW_USER_REQUEST:
            return { followUnfollowloading: true };
        case FOLLOW_USER_SUCCESS:
        case UNFOLLOW_USER_SUCCESS:
            return { followUnfollowloading: false, success: true, user: action.payload };
        case FOLLOW_USER_FAIL:
        case UNFOLLOW_USER_FAIL:
            return { followUnfollowloading: false, followUnfollowError: action.payload };
        default:
            return state;
    }
};

export const followerFetchReducer = (state = { followers: [] }, action) => {
    switch (action.type) {
        case FOLLOWER_FETCH_REQUEST:
            return { followersLoading: true, followers: [] };
        case FOLLOWER_FETCH_SUCCESS:
            return { followersLoading: false, followers: action.payload };
        case FOLLOWER_FETCH_FAIL:
            return { followersLoading: false, error: action.payload };
        default:
            return state;
    }
};

export const followingFetchReducer = (state = { following: [] }, action) => {
    switch (action.type) {
        case FOLLOWING_FETCH_REQUEST:
            return { followingLoading: true, following: [] };
        case FOLLOWING_FETCH_SUCCESS:
            return { followingLoading: false, following: action.payload };
        case FOLLOWING_FETCH_FAIL:
            return { followingLoading: false, error: action.payload };
        default:
            return state;
    }
};

const initialState = {
    selectedUser: null,
};

export const selectedUser = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_USER:
            return { ...state, selectedUser: action.payload };
        default:
            return state;
    }
};
