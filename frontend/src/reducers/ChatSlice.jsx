import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [],
        conversationDate: null,
        users:[] // Added initial state for conversation date
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        setConversationDate: (state, action) => {
            state.conversationDate = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
    }
});

// Export all reducers
export const { setOnlineUsers, setMessages, setConversationDate,setUsers } = ChatSlice.actions;
export default ChatSlice.reducer;
