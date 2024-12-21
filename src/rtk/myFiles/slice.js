import { createSlice } from "@reduxjs/toolkit";
import { onAddMyFile, onLoadMyFiles } from "./action";

const myFilesSlice = createSlice({
  name: "myFiles",
  initialState: {
    myFiles: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // fetch my files
      .addCase(onLoadMyFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadMyFiles.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          state.myFiles = result.files;
        }
        state.loading = false;
      })
      .addCase(onLoadMyFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // add file
      .addCase(onAddMyFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onAddMyFile.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          state.myFiles.push(result.file);
        }
        state.loading = false;
      })
      .addCase(onAddMyFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default myFilesSlice.reducer;
