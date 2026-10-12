import { createSlice } from "@reduxjs/toolkit";
import { onAddMyFile, onDeleteMyFile, onLoadMyFiles } from "./action";
import { loggedOut } from "../auth/slice";

const initialState = {
  myFiles: [],
  loading: false, // loading the list
  creating: false,
  deletingId: null,
  loaded: false,
  error: null,
};

const myFilesSlice = createSlice({
  name: "myFiles",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(onLoadMyFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadMyFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.myFiles = action.payload;
      })
      .addCase(onLoadMyFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message;
      })
      .addCase(onAddMyFile.pending, (state) => {
        state.creating = true;
      })
      .addCase(onAddMyFile.fulfilled, (state, action) => {
        state.creating = false;
        state.myFiles.push(action.payload);
      })
      .addCase(onAddMyFile.rejected, (state) => {
        state.creating = false;
      })
      .addCase(onDeleteMyFile.pending, (state, action) => {
        state.deletingId = action.meta.arg.id;
      })
      .addCase(onDeleteMyFile.fulfilled, (state, action) => {
        state.deletingId = null;
        state.myFiles = state.myFiles.filter((file) => file._id !== action.payload);
      })
      .addCase(onDeleteMyFile.rejected, (state) => {
        state.deletingId = null;
      })
      .addCase(loggedOut, () => initialState);
  },
});

export default myFilesSlice.reducer;
