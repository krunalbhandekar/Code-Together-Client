import { resetSessionExpired, setAuthToken } from "./api";
import { disconnectSocket, socketInit } from "../constants/socket";

const LS_TOKEN = "ct-token";
const LS_USER = "ct-user";

const readJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const loadStoredSession = () => {
  const token = readJson(LS_TOKEN);
  const user = readJson(LS_USER);
  return token && user ? { token, user } : { token: null, user: null };
};

// Points the API client and socket at the logged-in user.
export const applySession = (token) => {
  setAuthToken(token);
  resetSessionExpired();
  socketInit(token);
};

export const saveSession = (token, user) => {
  localStorage.setItem(LS_TOKEN, JSON.stringify(token));
  localStorage.setItem(LS_USER, JSON.stringify(user));
  applySession(token);
};

export const clearSession = () => {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
  setAuthToken(null);
  disconnectSocket();
};
