import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants/api";

const useSocket = () => {
  const { user } = useSelector((state) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      socketRef.current = io(BASE_URL, { query: { userId: user._id } });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return socketRef.current;
};

export default useSocket;
