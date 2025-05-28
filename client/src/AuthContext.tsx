// src/pages/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


interface AuthContextType {
  token: string | null;
  userId: number | null; // 👈
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null, // 👈
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userId, setUserId] = useState<number | null>(null);

  // 👇 Декодирай userId от JWT токена (ако има токен)
  useEffect(() => {
    if (token) {
        try {
        const decoded: any = jwtDecode(token);
        setUserId(Number(decoded.sub) || Number(decoded.user_id) || null);
        } catch {
        setUserId(null);
        }
    } else {
        setUserId(null);
    }
    }, [token]);

  // Сетва token и localStorage
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout — чисти token и localStorage
  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
  };

  // Ако токенът в localStorage се смени от друг таб — update!
  useEffect(() => {
    const handler = () => {
      const t = localStorage.getItem("token");
      setToken(t);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
