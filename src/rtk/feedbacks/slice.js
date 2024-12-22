import { createSlice } from "@reduxjs/toolkit";
import { onAddMyFeedback, onLoadFeedbacks } from "./action";

const feedbackSlice = createSlice({
  name: "feedbacks",
  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      //fetch all feedbacks
      .addCase(onLoadFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadFeedbacks.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          state.feedbacks = result.feedbacks;
        }
        state.loading = false;
      })
      .addCase(onLoadFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      //add feedback
      .addCase(onAddMyFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onAddMyFeedback.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          state.feedbacks.push(result.feedback);
        }
        state.loading = false;
      })
      .addCase(onAddMyFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default feedbackSlice.reducer;
