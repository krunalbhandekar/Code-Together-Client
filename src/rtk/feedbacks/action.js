import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../lib/api";

export const onLoadFeedbacks = createAsyncThunk(
  "feedbacks/load",
  async (_, { rejectWithValue }) => {
    try {
      const data = await request({ url: "/feedback" });
      return data.feedbacks ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const onAddMyFeedback = createAsyncThunk(
  "feedbacks/add",
  async ({ content }, { getState, rejectWithValue }) => {
    try {
      const data = await request({
        method: "post",
        url: "/feedback",
        data: { content },
      });
      // The server returns createdBy as an id only; fill in the author for display.
      const { user } = getState().auth;
      return {
        ...data.feedback,
        createdBy: { _id: user?._id, name: user?.name, designation: user?.designation },
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
