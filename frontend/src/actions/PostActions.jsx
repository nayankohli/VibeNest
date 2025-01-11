import {
    POST_CREATE_FAIL,
    POST_CREATE_REQUEST,
    POST_CREATE_SUCCESS,
    POST_LIKE_FAIL,
    POST_LIKE_REQUEST,
    POST_LIKE_SUCCESS,
    POST_COMMENT_FAIL,
    POST_COMMENT_REQUEST,
    POST_COMMENT_SUCCESS,
    POST_FETCH_ALL_FAIL,
    POST_FETCH_ALL_REQUEST,
    POST_FETCH_ALL_SUCCESS,
    POST_DELETE_FAIL,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
  } from "../constants/PostConstants";
  import axios from "axios";
  
  // Create Post
  export const createPost = (title, content) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_CREATE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(
        "http://localhost:5000/api/posts/create",
        { title, content },
        config
      );
  
      dispatch({ type: POST_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: POST_CREATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Like Post
  export const likePost = (postId) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_LIKE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/like/${postId}`,
        {},
        config
      );
  
      dispatch({ type: POST_LIKE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: POST_LIKE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Comment on Post
  export const commentOnPost = (postId, comment) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_COMMENT_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/comment/${postId}`,
        { comment },
        config
      );
  
      dispatch({ type: POST_COMMENT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: POST_COMMENT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Fetch All Posts
  export const fetchAllPosts = () => async (dispatch) => {
    try {
      dispatch({ type: POST_FETCH_ALL_REQUEST });
  
      const { data } = await axios.get("http://localhost:5000/api/posts");
  
      dispatch({ type: POST_FETCH_ALL_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: POST_FETCH_ALL_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Delete Post
  export const deletePost = (postId) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_DELETE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      await axios.delete(`http://localhost:5000/api/posts/delete/${postId}`, config);
  
      dispatch({ type: POST_DELETE_SUCCESS, payload: postId });
    } catch (error) {
      dispatch({
        type: POST_DELETE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  