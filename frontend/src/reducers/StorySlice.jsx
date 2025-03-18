import {
  STORY_LIST_REQUEST,
  STORY_LIST_SUCCESS,
  STORY_LIST_FAIL,
  STORY_UPLOAD_REQUEST,
  STORY_UPLOAD_SUCCESS,
  STORY_UPLOAD_FAIL,
  STORY_UPLOAD_RESET,
  STORY_SEEN_REQUEST,
  STORY_SEEN_SUCCESS,
  STORY_SEEN_FAIL,
  STORY_DELETE_REQUEST,
  STORY_DELETE_SUCCESS,
  STORY_DELETE_FAIL,
} from "../constants/StoryConstants";

// Reducer for listing stories
export const storyListReducer = (state = { storyGroups: [] }, action) => {
  switch (action.type) {
    case STORY_LIST_REQUEST:
      return { loading: true, storyGroups: [] };
    case STORY_LIST_SUCCESS:
      return { loading: false, storyGroups: action.payload };
    case STORY_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for story upload
export const storyUploadReducer = (state = {}, action) => {
  switch (action.type) {
    case STORY_UPLOAD_REQUEST:
      return { loading: true };
    case STORY_UPLOAD_SUCCESS:
      return { loading: false, success: true, story: action.payload };
    case STORY_UPLOAD_FAIL:
      return { loading: false, error: action.payload };
      case STORY_UPLOAD_RESET:
        return {
          ...state,
          loading: false,
          success: false,
          error: null
        };
    default:
      return state;
  }
};

// Reducer for marking story as seen
export const storySeenReducer = (state = {}, action) => {
  switch (action.type) {
    case STORY_SEEN_REQUEST:
      return { loading: true };
    case STORY_SEEN_SUCCESS:
      return { loading: false, success: true };
    case STORY_SEEN_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Reducer for deleting story
export const storyDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case STORY_DELETE_REQUEST:
      return { loading: true };
    case STORY_DELETE_SUCCESS:
      return { loading: false, success: true };
    case STORY_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};