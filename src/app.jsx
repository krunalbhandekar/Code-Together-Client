import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Home from "./components/Home";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/AppLayout";
import CodeEditor from "./components/CodeEditor";
import ProtectedRoute from "./hoc/ProtectedRoute";
import { initializeSocket } from "./constants/socket";

const App = () => {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  if (token !== null && isAuthenticated && user) {
    initializeSocket(user?._id);
    axios.defaults.headers.common.Authorization = token;
  }

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
};

export default App;
