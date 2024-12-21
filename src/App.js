import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Home from "./components/Home";
import CodeEditor from "./components/CodeEditor";
import { useSelector } from "react-redux";
import axios from "axios";
import { getSocket, socketInit } from "./constants/socket";
import { useEffect } from "react";
import { message } from "antd";

function App() {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);
  const socket = getSocket();

  if (token !== null && isAuthenticated && user) {
    socketInit(user?._id);
    axios.defaults.headers.common.Authorization = token;
  }

  useEffect(() => {
    socket.on("collaborator-update", ({ message: msg }) => {
      message.success(msg);
    });

    socket.on("invitation-update", ({ message: msg }) => {
      message.success(msg);
    });
  }, []);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<Navigate to="/" />}
            elseComp={<Login />}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<Navigate to="/" />}
            elseComp={<Signup />}
          />
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute
            cond={isAuthenticated}
            ifComp={<AppLayout />}
            elseComp={<Navigate to="/login" />}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/:fileId" element={<CodeEditor />} />
      </Route>
    </Routes>
  );
}

export default App;
