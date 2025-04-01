import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import API_CONFIG from "../config/api-config";
export const fetchAllPosts = createAsyncThunk(
  "post/fetchAllPosts",
  async (id, { getState, rejectWithValue }) => {
    try {
      console.log(id);
      const {
        userLogin: { userInfo },
      } = getState(); // Get user token from state

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_CONFIG.BASE_URL}/api/posts/all/${id}`, config);
      return data; // Return data for fulfilled case
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const PostSlice = createSlice({
    name: 'post',
    initialState: {
        posts: [],
        selectedPost: null,
        comments: [],
        replies:[],
        loading: false,
        error: null,
    },
    reducers: {
      setPosts:(state,action) => {
        state.posts = action.payload;
    },
        setSelectedPost: (state, action) => {
            state.selectedPost = action.payload;
        },
        setComments: (state, action) => {
          state.comments = action.payload;
      },
      setReplies: (state, action) => {
        state.replies = action.payload;
    }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload; // Store fetched posts
            })
            .addCase(fetchAllPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSelectedPost,setPosts,setComments, setReplies } = PostSlice.actions;
export default PostSlice.reducer;
