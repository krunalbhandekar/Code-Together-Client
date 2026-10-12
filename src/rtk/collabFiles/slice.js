import { createSlice } from "@reduxjs/toolkit";
import { onLoadCollabFiles } from "./action";
import { loggedOut } from "../auth/slice";

const initialState = {
  collabFiles: [],
  loading: false,
  loaded: false,
  error: null,
};

const collabFilesSlice = createSlice({
  name: "collabFiles",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onLoadCollabFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadCollabFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.collabFiles = action.payload;
      })
      .addCase(onLoadCollabFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(loggedOut, () => initialState);
  },
});

export default collabFilesSlice.reducer;
