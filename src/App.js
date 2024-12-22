import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Home from "./components/Home";
import CodeEditor from "./components/CodeEditor";
import { useSelector } from "react-redux";
import axios from "axios";
import { socketInit } from "./constants/socket";

function App() {
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  if (token !== null && isAuthenticated && user) {
    socketInit(user?._id);
    axios.defaults.headers.common.Authorization = token;
  }

  return (
    <Routes>
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
