import axios from "axios";
import {
  STORY_LIST_REQUEST,
  STORY_LIST_SUCCESS,
  STORY_LIST_FAIL,
  STORY_UPLOAD_REQUEST,
  STORY_UPLOAD_SUCCESS,
  STORY_UPLOAD_FAIL,
  STORY_SEEN_REQUEST,
  STORY_SEEN_SUCCESS,
  STORY_SEEN_FAIL,
  STORY_DELETE_REQUEST,
  STORY_DELETE_SUCCESS,
  STORY_DELETE_FAIL,
  STORY_UPLOAD_RESET, // Add this constant
} from "../constants/StoryConstants";
import API_CONFIG from "../config/api-config";
// List all stories
export const listStories = () => async (dispatch, getState) => {
  try {
    dispatch({ type: STORY_LIST_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const baseURL = `${API_CONFIG.BASE_URL}`;
    const { data } = await axios.get(`${baseURL}/api/stories`, config);
    
    dispatch({
      type: STORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Upload a new story
export const uploadStory = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORY_UPLOAD_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();
    
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const baseURL = `${API_CONFIG.BASE_URL}`;
    const { data } = await axios.post(`${baseURL}/api/stories`, formData, config);
    
    dispatch({
      type: STORY_UPLOAD_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: STORY_UPLOAD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Reset story upload state
export const resetUploadSuccess = () => (dispatch) => {
  dispatch({ type: STORY_UPLOAD_RESET });
};

// Mark a story as seen
export const markStorySeen = (storyId) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORY_SEEN_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const baseURL = `${API_CONFIG.BASE_URL}`;
    await axios.post(`${baseURL}/api/stories/${storyId}/seen`, {}, config);
    
    dispatch({
      type: STORY_SEEN_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: STORY_SEEN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Delete a story
export const deleteStory = (storyId) => async (dispatch, getState) => {
  try {
    dispatch({ type: STORY_DELETE_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();
    
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    
    const baseURL =  `${API_CONFIG.BASE_URL}`;
    await axios.delete(`${baseURL}/api/stories/${storyId}`, config);
    
    dispatch({
      type: STORY_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: STORY_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};