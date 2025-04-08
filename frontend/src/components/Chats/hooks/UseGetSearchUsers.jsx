import axios from "axios";
import { setUsers } from "../../../reducers/ChatSlice";
import API_CONFIG from "../../../config/api-config";
export const fetchSearchUsers = (query) => async (dispatch, getState) => {
  try {
    const { userInfo } = getState().userLogin;

    if (!userInfo || !userInfo.token) {
      console.error("User not authenticated");
      return;
    }
    console.log(query);
    const res = await axios.get(`${API_CONFIG.BASE_URL}/api/message/search?query=${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      withCredentials: true,
    });

    if (res.data.success) {
        console.log(res.data.users);
      dispatch(setUsers(res.data.users));
    } else {
      dispatch(setUsers([])); 
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    dispatch(setUsers([])); 
  }
};
