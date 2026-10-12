import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../lib/api";
import { clearSession, saveSession } from "../../lib/session";
import { loggedOut } from "./slice";

export const onLogin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await request({
        method: "post",
        url: "/user/login",
        data: { email, password },
      });
      saveSession(data.token, data.user);
      return { token: data.token, user: data.user };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const onLogout = () => (dispatch) => {
  clearSession();
  dispatch(loggedOut());
};
