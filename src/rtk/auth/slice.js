import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { onLogin } from "./action";
import { disconnectSocket } from "../../constants/socket";

const LS_TOKEN = "ct-token";
const LS_USER = "ct-user";

const token = JSON.parse(localStorage.getItem(LS_TOKEN));
const user = JSON.parse(localStorage.getItem(LS_USER));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: token !== null && user !== null,
    token,
    user,
    error: null,
  },
  reducers: {
    onLogout: (state) => {
      localStorage.removeItem(LS_TOKEN);
      localStorage.removeItem(LS_USER);
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
      disconnectSocket();
      axios.defaults.headers.common.Authorization = null;
      window.location.href = "/login";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(onLogin.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(onLogin.fulfilled, (state, action) => {
        const { status, token, user, error = null } = action.payload;
        if (status === "error") {
          state.error = error;
        } else {
          localStorage.setItem(LS_TOKEN, JSON.stringify(token));
          localStorage.setItem(LS_USER, JSON.stringify(user));
          state.isAuthenticated = true;
          axios.defaults.headers.common.Authorization = token;
          window.location.href = "/app";
        }
        state.loading = false;
      })
      .addCase(onLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload.message;
      });
  },
});

export const { onLogout } = authSlice.actions;
export default authSlice.reducer;
