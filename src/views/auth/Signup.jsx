import React, { useState } from "react";
import { message, Tag } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER_URL } from "../../constants/api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: null,
    designation: null,
    email: null,
    password: null,
    otp: null,
  });
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!isOtpSent) {
        const res = await axios.post(`${USER_URL}/register`, {
          name: form.name,
          designation: form.designation,
          email: form.email,
          password: form.password,
        });
        if (res.data.status === "success") {
          setIsOtpSent(true);
          message.success(`Otp has been sent to ${form.email}`);
        } else {
          message.error(res.data.error);
        }
      } else {
        const res = await axios.post(`${USER_URL}/verify-otp`, {
          email: form.email,
          otp: form.otp,
        });
        if (res.data.status === "success") {
          message.success("Signup Successful");
          navigate("/login");
        } else {
          message.error(res.data.error);
        }
      }
    } catch (err) {
      message.error(err?.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex justify-center items-center bg-cover bg-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
              Name
            </label>
            <input
              disabled={isOtpSent}
              type="text"
              id="name"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="designation"
            >
              Designation
            </label>
            <input
              disabled={isOtpSent}
              type="text"
              id="designation"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
              value={form.designation}
              onChange={(e) =>
                setForm({ ...form, designation: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              disabled={isOtpSent}
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
              disabled={isOtpSent}
              type="password"
              id="password"
              className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {isOtpSent && (
            <>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="otp"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 px-4 py-2 w-full border border-gray-300 rounded-md"
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-center mb-3">
                <Tag color="red">
                  Email is likely to appear in the <b>Spam</b> folder
                </Tag>
              </div>
            </>
          )}
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
            {isOtpSent ? "Verify Otp" : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <button
            className="text-indigo-500 hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
