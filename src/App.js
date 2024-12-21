import { Route, Routes } from "react-router-dom";
import Login from "./views/auth/Login";
import Signup from "./views/auth/Signup";
import AppLayout from "./views/app/AppLayout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<AppLayout />} />
    </Routes>
  );
}

export default App;
