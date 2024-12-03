import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";
import myFilesReducer from "./myFiles/slice";
import collabFilesReducer from "./collabFiles/slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    myFiles: myFilesReducer,
    collabFiles: collabFilesReducer,
  },
});

export default store;
