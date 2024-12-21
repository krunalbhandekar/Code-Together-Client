import { createSlice } from "@reduxjs/toolkit";
import { onLoadCollabFiles } from "./action";

const collabFilesSlice = createSlice({
  name: "collabFiles",
  initialState: {
    collabFiles: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(onLoadCollabFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(onLoadCollabFiles.fulfilled, (state, action) => {
        const result = action.payload;
        if (result.status === "error") {
          state.error = result.error;
        } else {
          state.collabFiles = result.collabFiles;
        }
        state.loading = false;
      })
      .addCase(onLoadCollabFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default collabFilesSlice.reducer;
