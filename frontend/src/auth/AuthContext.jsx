import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { getAccessToken, clearTokens } from "../auth/tokenStorage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()));
  const [userType, setUserType] = useState(localStorage.getItem("tf-user-type") || null);

  const refreshAuth = useCallback(() => {
    setIsAuthenticated(Boolean(getAccessToken()));
    setUserType(localStorage.getItem("tf-user-type") || null);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    localStorage.removeItem("tf-user-type");
    setUserType(null);
  }, []);

  useEffect(() => {
    refreshAuth();
    const handler = () => refreshAuth();
    window.addEventListener("auth-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("auth-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refreshAuth]);

  const value = useMemo(
    () => ({ isAuthenticated, userType, refreshAuth, logout }),
    [isAuthenticated, userType, refreshAuth, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }
  return ctx;
}
