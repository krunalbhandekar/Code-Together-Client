import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Home from "./components/Home";
import CodeEditor from "./components/CodeEditor";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socketInit } from "./constants/socket";
import Landing from "./components/Landing";
import { useEffect } from "react";
import { onLoadMyFiles } from "./rtk/myFiles/action";
import { onLoadCollabFiles } from "./rtk/collabFiles/action";
import { onLoadFeedbacks } from "./rtk/feedbacks/action";
import { onLogout } from "./rtk/auth/slice";
import { message } from "antd";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  if (token !== null && isAuthenticated && user) {
    socketInit(user?._id);
    axios.defaults.headers.common.Authorization = token;
  }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(onLoadMyFiles());
      dispatch(onLoadCollabFiles());
    }
    dispatch(onLoadFeedbacks());
  }, [isAuthenticated]);

  axios.interceptors.response.use(
    (response) => {
      if (response.data.status === "unauthorized") {
        message.error("Session expired. Logging out...");
        dispatch(onLogout());
      }
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        message.error("Session expired. Logging out...");
        setTimeout(() => {
          dispatch(onLogout());
        }, 2000);
      } else {
        return Promise.reject(error);
      }
    }
  );

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<Navigate to="/app" />}
            elseComp={<Login />}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<Navigate to="/app" />}
            elseComp={<Signup />}
          />
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<AppLayout />}
            elseComp={<Navigate to="/login" />}
          />
        }
      >
        <Route index element={<Home />} />
        <Route path=":fileId" element={<CodeEditor />} />
      </Route>
    </Routes>
  );
}

export default App;
