import { io } from "socket.io-client";
import { BASE_URL } from "./api";

let socket = null;

export const socketInit = (userId) => {
  if (userId && !socket) {
    socket = io(BASE_URL, {
      query: { userId },
      transports: ["websocket", "polling"],
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
