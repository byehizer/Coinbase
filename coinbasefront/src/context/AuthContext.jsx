import { createContext, useContext, useEffect, useState } from "react";
import { decodeToken } from "../utils/jwt";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [User, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (!token) {
      setUser(null);
      return;
    }
    const decodedToken = decodeToken(token);

    if (!decodedToken) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    if (decodedToken.exp < Date.now() / 1000) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    setToken(token);
    setUser(decodedToken);
  }, []);

  const isTokenExpired = () => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;
    return decoded.exp * 1000 < Date.now(); 
  };

  const login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      setUser(decodeToken(data.token));
      setToken(data.token);
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ User, login, logout, token, isTokenExpired}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
