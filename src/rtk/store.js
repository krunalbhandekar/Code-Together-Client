import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import myFilesReducer from "./myFiles/slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    myFiles: myFilesReducer,
  },
});

export default store;
