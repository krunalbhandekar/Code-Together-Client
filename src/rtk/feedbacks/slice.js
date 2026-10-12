import { createSlice } from "@reduxjs/toolkit";
import { onAddMyFeedback, onLoadFeedbacks } from "./action";

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: {
    feedbacks: [],
    loading: false,
    loaded: false,
    submitting: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(onLoadFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.feedbacks = action.payload;
      })
      .addCase(onLoadFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(onAddMyFeedback.pending, (state) => {
        state.submitting = true;
      })
      .addCase(onAddMyFeedback.fulfilled, (state, action) => {
        state.submitting = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(onAddMyFeedback.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export default feedbackSlice.reducer;
