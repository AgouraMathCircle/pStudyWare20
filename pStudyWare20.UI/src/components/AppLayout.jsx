import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import {
  applicationMainSx,
  authenticatedPortalShellSx,
} from "../styles/applicationSurfaces";
import portalBackgroundImg from "../assets/images/bg.jpg";
import Topbar from "./Topbar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import { authService } from "../services";
import useScrollToTop from "../hooks/useScrollToTop";

const AppLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useScrollToTop();

  // Initialize authentication state on component mount
  useEffect(() => {
    const initializeAuthState = () => {
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();

      console.log("AppLayout: Initializing auth state");
      console.log("AppLayout: Current user:", currentUser);
      console.log("AppLayout: Is authenticated:", authenticated);

      setUser(currentUser);
      setIsAuthenticated(authenticated);
    };

    initializeAuthState();
  }, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const authenticated = authService.isAuthenticated();

    setUser(currentUser);
    setIsAuthenticated(authenticated);
  }, [location.pathname]);

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("AppLayout: Storage change detected");
      const currentUser = authService.getCurrentUser();
      const authenticated = authService.isAuthenticated();
      console.log("AppLayout: Current user after storage change:", currentUser);
      console.log(
        "AppLayout: Is authenticated after storage change:",
        authenticated
      );

      setUser(currentUser);
      setIsAuthenticated(authenticated);
    };

    const handleLogoutEvent = () => {
      console.log("AppLayout: Logout event received");
      setUser(null);
      setIsAuthenticated(false);
      console.log("AppLayout: Authentication state cleared");
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authLogout", handleLogoutEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authLogout", handleLogoutEvent);
    };
  }, []);

  const showAuthenticatedPortalChrome = isAuthenticated;

  const authenticatedPortalSx = {
    ...authenticatedPortalShellSx,
    backgroundImage: `url(${portalBackgroundImg})`,
  };

  // Render appropriate navigation based on authentication and route
  const renderNavigation = () => {
    // Show main navigation for all pages (Topbar and Navbar handle their own visibility logic)
    return (
      <>
        <Topbar />
        <Navbar />
      </>
    );
  };

  return (
    <div className="App">
      {renderNavigation()}
      <Box component="main" sx={applicationMainSx}>
        {showAuthenticatedPortalChrome ? (
          <Box sx={authenticatedPortalSx}>{children}</Box>
        ) : (
          children
        )}
      </Box>
      {/* Marketing footer only for visitors; hide for any logged-in session */}
      {!isAuthenticated ? <Footer /> : null}
      {/* Scroll to top button - show on all pages */}
      <ScrollToTop />
    </div>
  );
};

export default AppLayout;
