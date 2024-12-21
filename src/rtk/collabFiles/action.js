import { createAsyncThunk } from "@reduxjs/toolkit";
import { FILE_URL } from "../../constants/api";
import axios from "axios";

export const onLoadCollabFiles = createAsyncThunk(
  "collabFiles/onLoadCollabFiles",
  async () => {
    try {
      const res = await axios.get(`${FILE_URL}/collab`);
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);
