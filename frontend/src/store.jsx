import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Fix: Default import
import { composeWithDevTools } from "@redux-devtools/extension";
import { userLoginReducer, userRegisterReducer, userUpdateReducer,userSearchReducer,fetchProfileReducer,followUnfollowReducer,followerFetchReducer,selectedUser, followingFetchReducer,authReducer,userPrivacyUpdateReducer } from './reducers/UserReducer';
import PostSlice from './reducers/PostReducers'; // Import post reducer
import ChatSlice from './reducers/ChatSlice'; // Import ChatSlice reducer
import SocketSlice from './reducers/SocketSlice';
import StorySlice from './reducers/StorySlice';
import ProfileSlice from './reducers/ProfileSlice' 
const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdate: userUpdateReducer,
  post: PostSlice, // Add post reducer
  userSearch: userSearchReducer,
  fetchProfile: fetchProfileReducer,
  followUnfollow: followUnfollowReducer,
  followersList: followerFetchReducer,
  followingList:followingFetchReducer,
  selectedUser,
  chat: ChatSlice,
  socketio:SocketSlice,
  stories:StorySlice,
  profile:ProfileSlice,// Added chat reducer
  auth:authReducer,
  userPrivacyUpdate: userPrivacyUpdateReducer,
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
