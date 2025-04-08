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
  import API_CONFIG from "../config/api-config";
  export const createPost = (caption, mediaFiles) => async (dispatch, getState) => {
    try {
      dispatch({ type: POST_CREATE_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const formData = new FormData();
      formData.append('caption', caption);
      mediaFiles.forEach((file) => formData.append('media', file));
  
      const { data } = await axios.post(
        `${API_CONFIG.BASE_URL}/api/posts/create`,
        formData,
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
        `${API_CONFIG.BASE_URL}/api/posts/like/${postId}`,
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
        `${API_CONFIG.BASE_URL}/api/posts/comment/${postId}`,
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
export const fetchAllPosts = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: POST_FETCH_ALL_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/posts/all/${id}`, config);

    dispatch({ type: POST_FETCH_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: POST_FETCH_ALL_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
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
  
      await axios.delete(`${API_CONFIG.BASE_URL}/api/posts/delete/${postId}`, config);
  
      dispatch({ type: POST_DELETE_SUCCESS, payload: postId });
    } catch (error) {
      dispatch({
        type: POST_DELETE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  