import { createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../lib/api";

export const onLoadMyFiles = createAsyncThunk(
  "myFiles/load",
  async (_, { rejectWithValue }) => {
    try {
      const data = await request({ url: "/file" });
      return data.files ?? [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const onAddMyFile = createAsyncThunk(
  "myFiles/add",
  async ({ name, language = "javascript" }, { rejectWithValue }) => {
    try {
      const data = await request({
        method: "post",
        url: "/file",
        data: { name, language },
      });
      return data.file;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const onDeleteMyFile = createAsyncThunk(
  "myFiles/delete",
  async ({ id }, { rejectWithValue }) => {
    try {
      await request({ method: "delete", url: `/file/${id}` });
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
