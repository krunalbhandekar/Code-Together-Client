import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_URL } from "../../constants/api";

export const onLogin = createAsyncThunk(
  "login",
  async ({ email, password }) => {
    try {
      const res = await axios.post(`${USER_URL}/login`, { email, password });
      return res.data;
    } catch (err) {
      return { status: "error", error: err?.message };
    }
  }
);
