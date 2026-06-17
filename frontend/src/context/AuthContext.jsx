// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Automatically check for an active user session upon app mounting
  useEffect(() => {
    const initializeAuth = async () => {
      const localToken = localStorage.getItem("token");
      
      if (!localToken) {
        try {
          // Silent inline catch to swallow background guest 401 console logs
          const refreshResponse = await api.post("/auth/refresh").catch(() => null);
          
          if (!refreshResponse) {
            setUser(null);
            setLoading(false);
            return;
          }

          localStorage.setItem("token", refreshResponse.data.token);
          
          const profileResponse = await api.get("/auth/me");
          setUser(profileResponse.data.user);
        } catch (err) {
          setUser(null);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        const profileResponse = await api.get("/auth/me");
        setUser(profileResponse.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const registerUser = async (name, email, phone, password, referralCode = "") => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, phone, password, referralCode });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Registration encountered an error" };
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Invalid credentials provided" };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleCredentialToken) => {
    setLoading(true);
    try {
      // 🔥 PATCH: Changed payload key payload property from idToken to token to handshake seamlessly with authController
      const res = await api.post("/auth/google", { token: googleCredentialToken });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Google Authentication failed" };
    } finally {
      setLoading(false);
    }
  };

  // Clears both customer and back-office tokens on sign-out to prevent session mixing
  const logoutUser = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("perfectmoto_admin_token"); 
      setUser(null);
      setLoading(false);
    }
  };

  const contextPayload = {
    user,
    loading,
    loginUser,
    registerUser,
    loginWithGoogle,
    logoutUser, 
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return (
    <AuthContext.Provider value={contextPayload}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be evaluated inside a valid AuthProvider wrapper element");
  }
  return context;
};