import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FEEDBACK_URL } from "../../constants/api";

export const onLoadFeedbacks = createAsyncThunk(
  "feedbacks/onLoadFeedbacks",
  async () => {
    try {
      const res = await axios.get(FEEDBACK_URL);
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);

export const onAddMyFeedback = createAsyncThunk(
  "feedbacks/onAddMyFeedback",
  async ({ content }) => {
    try {
      const res = await axios.post(FEEDBACK_URL, { content });
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);
