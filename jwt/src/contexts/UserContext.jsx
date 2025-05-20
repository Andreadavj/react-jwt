import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    if (token) getProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        setUser({ email: data.email });
        localStorage.setItem("token", data.token);
      } else {
        console.error("No se recibió token:", data);
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        setUser({ email: data.email });
        localStorage.setItem("token", data.token);
      } else {
        console.error("No se recibió token:", data);
      }
    } catch (error) {
      console.error("Error en register:", error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, token, login, register, logout, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};

