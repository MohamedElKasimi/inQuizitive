"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import api, { setAuthToken } from "../utils/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  fileID: number | null;
  setFileID: (id: number | null) => void;
  high_score: number | null;
  setScore: (score: number | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading , setLoading] = useState(true)
  const router = useRouter();
  const [fileID, setFileID] = useState<number | null>(null);
  const [high_score, setScore] = useState<number | null>(null);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post("/users/api/token/", credentials);
      const { access, refresh } = response.data;

      setAccessToken(access);
      setAuthToken(access);
      localStorage.setItem("refreshToken", refresh);

      const decodedUser = JSON.parse(atob(access.split(".")[1]));
      setUser(decodedUser);

      router.push("/dashboard"); // Redirect to dashboard
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refreshToken");
    setAuthToken(null);
    router.push("/login"); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fileID, setFileID, high_score, setScore }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};