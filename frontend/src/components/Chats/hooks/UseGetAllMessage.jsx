import { setMessages,setConversationDate } from "../../../reducers/ChatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API_CONFIG from "../../../config/api-config";
const UseGetAllMessage = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userLogin);
    const selectedUser = useSelector((state) => state.selectedUser?.selectedUser);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${API_CONFIG.BASE_URL}/api/message/all/${selectedUser?._id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    withCredentials: true
                });
                if (res.data.success) {  
                    dispatch(setMessages(res.data.messages));
                    dispatch(setConversationDate(res.data.conversationDate));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllMessage();
    }, [selectedUser]);
};
export default UseGetAllMessage;