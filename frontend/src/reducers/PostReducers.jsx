import {
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_CREATE_FAIL,
    POST_LIKE_REQUEST,
    POST_LIKE_SUCCESS,
    POST_LIKE_FAIL,
    POST_COMMENT_REQUEST,
    POST_COMMENT_SUCCESS,
    POST_COMMENT_FAIL,
    POST_FETCH_ALL_REQUEST,
    POST_FETCH_ALL_SUCCESS,
    POST_FETCH_ALL_FAIL,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAIL,
  } from "../constants/PostConstants";
  
  export const postCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_CREATE_REQUEST:
        return { loading: true };
      case POST_CREATE_SUCCESS:
        return { loading: false, postInfo: action.payload, success: true };
      case POST_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const postLikeReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_LIKE_REQUEST:
        return { loading: true };
      case POST_LIKE_SUCCESS:
        return { loading: false, success: true, postInfo: action.payload };
      case POST_LIKE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const postCommentReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_COMMENT_REQUEST:
        return { loading: true };
      case POST_COMMENT_SUCCESS:
        return { loading: false, success: true, commentInfo: action.payload };
      case POST_COMMENT_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const postFetchAllReducer = (state = { posts: [] }, action) => {
    switch (action.type) {
      case POST_FETCH_ALL_REQUEST:
        return { loading: true, posts: [] };
      case POST_FETCH_ALL_SUCCESS:
        return { loading: false, posts: action.payload };
      case POST_FETCH_ALL_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const postDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case POST_DELETE_REQUEST:
        return { loading: true };
      case POST_DELETE_SUCCESS:
        return { loading: false, success: true };
      case POST_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  