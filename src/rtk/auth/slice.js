import { createSlice } from "@reduxjs/toolkit";
import { loadStoredSession } from "../../lib/session";

const { token, user } = loadStoredSession();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    isAuthenticated: Boolean(token && user),
    token,
    user,
    error: null,
  },
  reducers: {
    loggedOut: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("auth/login/pending", (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase("auth/login/fulfilled", (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase("auth/login/rejected", (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      });
  },
});

export const { loggedOut } = authSlice.actions;
export default authSlice.reducer;
