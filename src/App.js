import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";
import ProtectedRoute from "./hoc/ProtectedRoute";
import Home from "./components/Home";
import CodeEditor from "./components/CodeEditor";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

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
