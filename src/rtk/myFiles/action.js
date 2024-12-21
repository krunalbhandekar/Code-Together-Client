import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FILE_URL } from "../../constants/api";

export const onLoadMyFiles = createAsyncThunk(
  "myFiles/onLoadMyFiles",
  async () => {
    try {
      const res = await axios.get(FILE_URL);
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);

export const onAddMyFile = createAsyncThunk(
  "myFiles/onAddMyFile",
  async ({ name, language }) => {
    try {
      const res = await axios.post(FILE_URL, { name, language });
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);
