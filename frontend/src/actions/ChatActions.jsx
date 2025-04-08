import axios from "axios";
import {
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAIL,
  ACCESS_CHAT_REQUEST,
  ACCESS_CHAT_SUCCESS,
  ACCESS_CHAT_FAIL,
  CREATE_GROUP_CHAT_REQUEST,
  CREATE_GROUP_CHAT_SUCCESS, 
  CREATE_GROUP_CHAT_FAIL,
  SET_SELECTED_CHAT, 
  CLEAR_SELECTED_CHAT, 
  SET_CHATS,
  SELECTED_CHAT,
  SET_MESSAGES,
  LOADING_MESSAGES,
  NEW_MESSAGE,
  SET_TYPING,
  SET_SOCKET_CONNECTED,
  SET_IS_TYPING,
  SET_NOTIFICATION,
  SET_FETCH_AGAIN,
  SET_NEW_MESSAGE,
  ADD_MESSAGE 
} from "../constants/ChatConstants";
import API_CONFIG from "../config/api-config";

export const setSelectedChat = (chat) => ({
  type: SET_SELECTED_CHAT,
  payload: chat,
});

export const clearSelectedChat = () => ({
  type: CLEAR_SELECTED_CHAT,
});

export const setChats = (chats) => ({
  type: SET_CHATS,
  payload: chats,
});

export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender._id === m.sender._id &&
      messages[i].sender._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender._id !== userId)
    )
      return 0;
    else return "auto";
  };
  
  export const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 &&
      (messages[i + 1].sender._id !== m.sender._id ||
        messages[i + 1].sender._id === undefined) &&
      messages[i].sender._id !== userId
    );
  };
  
  export const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender._id !== userId &&
      messages[messages.length - 1].sender._id
    );
  };
  
  export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };
  export const getSender = (loggedUser, participants) => {
    if (!participants || participants.length < 2) return { name: "Unknown", profileImage: "" };
  
    return participants[0]?._id === loggedUser?._id
      ? { _id:participants[1]._id,username:participants[1].username,name: participants[1].name, profileImage: participants[1].profileImage }
      : { _id:participants[0]._id,username:participants[0].username,name: participants[0].name, profileImage: participants[0].profileImage };
  };
  
  
  export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1] : users[0];
  };

  export const createGroupChat = (groupName, selectedUsers) => async (dispatch, getState) => {
    try {
      dispatch({ type: CREATE_GROUP_CHAT_REQUEST });
  
      const {
        userLogin: { userInfo },
      } = getState();
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
  
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );
  
      dispatch({ type: CREATE_GROUP_CHAT_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: CREATE_GROUP_CHAT_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
      });
    }
  };

export const searchUsers = (searchQuery, token) => async (dispatch,getState) => {
  try {
    dispatch({ type: SEARCH_USER_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/users/search?query=${searchQuery}`, config);

    dispatch({
      type: SEARCH_USER_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_USER_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const accessChat = (userId, token) => async (dispatch) => {
  try {
    dispatch({ type: ACCESS_CHAT_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
console.log("frontend user id:"+userId);
    const { data } = await axios.post(`${API_CONFIG.BASE_URL}/api/chat/`, { userId }, config);

    console.log("data is:"+data);

    dispatch({ type: ACCESS_CHAT_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: ACCESS_CHAT_FAIL,
      payload: error.response?.data?.message || error.message,
    });
    console.error("Error accessing chat:", error);
    return null;
  }
};


export const selectChat = (chat) => {
  return {
    type: SELECTED_CHAT,
    payload: chat,
  };
};

export const setMessages = (messages) => {
  return {
    type: SET_MESSAGES,
    payload: messages,
  };
};

export const loadingMessages = (loading) => {
  return {
    type: LOADING_MESSAGES,
    payload: loading,
  };
};

export const newMessage = (message) => {
  return {
    type: NEW_MESSAGE,
    payload: message,
  };
};

export const setTyping = (typing) => {
  return {
    type: SET_TYPING,
    payload: typing,
  };
};

export const setSocketConnected = (socketConnected) => {
  return {
    type: SET_SOCKET_CONNECTED,
    payload: socketConnected,
  };
};

export const setIsTyping = (isTyping) => {
  return {
    type: SET_IS_TYPING,
    payload: isTyping,
  };
};

export const setNotification = (notification) => {
  return {
    type: SET_NOTIFICATION,
    payload: notification,
  };
};

export const setFetchAgain = (fetchAgain) => {
  return {
    type: SET_FETCH_AGAIN,
    payload: fetchAgain,
  };
};

export const setNewMessage = (newMessage) => {
  return {
    type: SET_NEW_MESSAGE,
    payload: newMessage,
  };
};

export const addMessage = (message) => ({
  type: ADD_MESSAGE,
  payload: message,
});