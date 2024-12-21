import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onLogin } from "../../rtk/auth/action";
import { message } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: null, password: null });
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(onLogin(form));
    setForm({ email: "", password: "" });
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%" }}
            className="relative flex items-center justify-center px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            )}
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            className="text-indigo-500 hover:underline"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
