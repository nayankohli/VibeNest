import { setSuggestedUsers } from "../../../reducers/UserReducer";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API_CONFIG from "../../../config/api-config";
const useGetSuggestedUsers = () => {  // ✅ Hook names must start with lowercase "use"
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                if (!userInfo?.token) return; // ✅ Prevent API call if no token
                const res = await axios.get(`${API_CONFIG.BASE_URL}/api/users/suggested`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.error("Error fetching suggested users:", error);
            }
        };
        fetchSuggestedUsers();
    }, [dispatch, userInfo]); // ✅ Added dependencies

};

export default useGetSuggestedUsers;  // ✅ Lowercase "u" to follow React hook conventions
