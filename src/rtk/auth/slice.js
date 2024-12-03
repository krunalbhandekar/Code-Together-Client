import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { LOCAL_TOKEN, LOCAL_USER } from "../../constants/auth";
import { disconnectSocket } from "../../constants/socket";
import { onLogin } from "./action";

const token = JSON.parse(localStorage.getItem(LOCAL_TOKEN));
const user = JSON.parse(localStorage.getItem(LOCAL_USER));

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
      localStorage.removeItem(LOCAL_TOKEN);
      localStorage.removeItem(LOCAL_USER);
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
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          const { token, user } = action.payload;
          localStorage.setItem(LOCAL_TOKEN, JSON.stringify(token));
          localStorage.setItem(LOCAL_USER, JSON.stringify(user));
          state.isAuthenticated = true;
          axios.defaults.headers.common.Authorization = token;
          window.location.href = "/";
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
