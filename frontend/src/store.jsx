import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Fix: Default import
import { composeWithDevTools } from "@redux-devtools/extension";
import { userLoginReducer, userRegisterReducer, userUpdateReducer, userSearchReducer, fetchProfileReducer, followUnfollowReducer, followerFetchReducer, selectedUser, followingFetchReducer, authReducer, userPrivacyUpdateReducer, userPasswordUpdateReducer } from './reducers/UserReducer';
import PostSlice from './reducers/PostReducers'; // Import post reducer
import ChatSlice from './reducers/ChatSlice'; 
import { storyListReducer, storyDeleteReducer, storySeenReducer, storyUploadReducer } from './reducers/StorySlice'; // Correct import path
import ProfileSlice from './reducers/ProfileSlice';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdate: userUpdateReducer,
  post: PostSlice, // Add post reducer
  userSearch: userSearchReducer,
  fetchProfile: fetchProfileReducer,
  followUnfollow: followUnfollowReducer,
  followersList: followerFetchReducer,
  followingList: followingFetchReducer,
  selectedUser,
  chat: ChatSlice,
  storyList: storyListReducer,
  storyUpload: storyUploadReducer,
  storySeen: storySeenReducer,
  storyDelete: storyDeleteReducer,
  profile: ProfileSlice,
  auth: authReducer,
  userPrivacyUpdate: userPrivacyUpdateReducer,
  userPasswordUpdate:userPasswordUpdateReducer
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk]; // Middleware setup

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
