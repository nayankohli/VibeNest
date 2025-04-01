import { setComments} from "../../../../reducers/PostReducers";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API_CONFIG from "../../../../config/api-config";

const UseGetAllComments = () => {
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userLogin);
    const { selectedPost } = useSelector((store) => store.post);
    useEffect(() => {
        const fetchAllComments = async () => {
            try {
                console.log("selected post id is"+selectedPost._id);
                const res = await axios.get(`${API_CONFIG.BASE_URL}/api/posts/${selectedPost?._id}/comment/all`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    withCredentials: true
                });
                if (res.data.success) {  
                    dispatch(setComments(res.data.comments));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllComments();
    }, [selectedPost]);
};
export default UseGetAllComments;