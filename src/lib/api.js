import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "../constants/api";

const api = axios.create({ baseURL: BASE_URL });

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Session expiry: show one message and log out once, however many requests fail.
let onSessionExpired = () => {};
let sessionExpiredHandled = false;

export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

export const resetSessionExpired = () => {
  sessionExpiredHandled = false;
};

export const notifySessionExpired = () => {
  if (sessionExpiredHandled) return;
  sessionExpiredHandled = true;
  toast.error("Your session has expired. Please log in again.");
  onSessionExpired();
};

class SessionExpiredError extends Error {}

// The server answers with HTTP 200 and { status: "unauthorized" } for auth failures.
api.interceptors.response.use(
  (response) => {
    if (response.data?.status === "unauthorized") {
      notifySessionExpired();
      return Promise.reject(new SessionExpiredError("Session expired"));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      notifySessionExpired();
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (err) => {
  if (err?.response?.data?.error) return err.response.data.error;
  if (err?.code === "ERR_NETWORK") {
    return "Can't reach the server. Check your connection and try again.";
  }
  return err?.message || "Something went wrong. Please try again.";
};

// Sends a request and returns the response body when status is "success".
// Throws an Error with a readable message otherwise.
export const request = async (config) => {
  let response;
  try {
    response = await api.request(config);
  } catch (err) {
    throw new Error(getErrorMessage(err), { cause: err });
  }
  if (response.data?.status !== "success") {
    throw new Error(response.data?.error || "Something went wrong. Please try again.");
  }
  return response.data;
};

export default api;
