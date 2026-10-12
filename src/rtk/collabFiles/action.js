import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../lib/api";

export const onLoadCollabFiles = createAsyncThunk(
  "collabFiles/load",
  async (_, { rejectWithValue }) => {
    try {
      const data = await request({ url: "/file/collab" });
      return data.collabFiles ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
