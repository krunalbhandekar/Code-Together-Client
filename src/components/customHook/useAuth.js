import { useEffect, useState } from "react";
import { LOCAL_TOKEN } from "../../constants/auth";

const token = !!JSON.parse(localStorage.getItem(LOCAL_TOKEN));

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(token);

  useEffect(() => {
    setIsAuthenticated(token);
  }, []);

  return isAuthenticated;
};

export default useAuth;
