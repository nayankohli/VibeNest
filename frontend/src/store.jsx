import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import
import { composeWithDevTools } from 'redux-devtools-extension';
import { userLoginReducer , userRegisterReducer,userUpdateReducer} from './reducers/UserReducers';

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userUpdate:userUpdateReducer
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk]; // Use thunk here

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
