// profileSlice.js
import { createSlice } from "@reduxjs/toolkit";

const ProfileSlice = createSlice({
    name: "profile",
    initialState: { activeTab: "posts" },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        }
    }
});

export const { setActiveTab } = ProfileSlice.actions;
export default ProfileSlice.reducer;
