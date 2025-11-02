import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();

        console.log("AuthContext: Initializing auth", {
          currentUser,
          authenticated,
          expiresAt: currentUser?.expiresAt,
        });

        setUser(currentUser);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("AuthContext: Error initializing auth", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const tokenCheckInterval = setInterval(() => {
      const currentUser = authService.getCurrentUser();
      if (currentUser && authService.isTokenExpired()) {
        console.log(
          "AuthContext: Token expired in interval check, logging out"
        );
        logout();
      }
    }, 60000);

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);

      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();

      setUser(currentUser);
      setIsAuthenticated(authenticated);

      window.dispatchEvent(new Event("storage"));

      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setIsRedirecting(false);

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("AuthContext: Error during logout", error);
    }
  };

  const setRedirecting = (redirecting) => {
    setIsRedirecting(redirecting);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isRedirecting,
    login,
    logout,
    setRedirecting,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
