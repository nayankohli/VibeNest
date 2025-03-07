import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch stories from backend
export const fetchStories = createAsyncThunk(
  "stories/fetchStories",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        userLogin: { userInfo },
      } = getState();

      const { data } = await axios.get("http://localhost:5000/api/stories/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        withCredentials: true,
      });

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Upload a new story
export const uploadStory = createAsyncThunk(
  "stories/uploadStory",
  async (file, { dispatch, getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("media", file);

      const {
        userLogin: { userInfo },
      } = getState();

      const { data } = await axios.post(
        "http://localhost:5000/api/stories/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );

      dispatch(addStory(data.story)); // Add to state instantly
      return data.story;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const StorySlice = createSlice({
  name: "stories",
  initialState: { stories: [], loading: false, error: null },
  reducers: {
    addStory: (state, action) => {
      state.stories.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load stories";
      });
  },
});

export const { addStory } = StorySlice.actions;
export default StorySlice.reducer;
