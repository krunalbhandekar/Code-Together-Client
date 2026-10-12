import { io } from "socket.io-client";
import { BASE_URL } from "./api";
import { notifySessionExpired } from "../lib/api";

let socket = null;

export const socketInit = (token) => {
  if (!token) return null;
  if (socket) return socket;

  socket = io(BASE_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  // The server rejects connections whose token is missing, invalid or expired.
  socket.on("connect_error", (err) => {
    if (err?.message === "Unauthorized") {
      notifySessionExpired();
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
