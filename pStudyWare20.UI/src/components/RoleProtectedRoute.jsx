import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedMemberTypes = [],
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while auth context is loading
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "16px",
        }}
      >
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no user data, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole =
    allowedRoles.length === 0 || allowedRoles.includes(user.role);

  // Check if user has the required member type
  const hasRequiredMemberType =
    allowedMemberTypes.length === 0 ||
    (user.memberType &&
      allowedMemberTypes.includes(user.memberType.toUpperCase()));

  // If user doesn't have required role or member type, redirect to appropriate dashboard
  if (!hasRequiredRole && !hasRequiredMemberType) {
    // Redirect based on user's actual role/member type
    if (user.memberType) {
      const memberType = user.memberType.toUpperCase();
      switch (memberType) {
        case "A":
          return <Navigate to="/admin/dashboard" replace />;
        case "I":
          return <Navigate to="/instructor/dashboard" replace />;
        case "S":
          return <Navigate to="/pstudyware/student/dashboard" replace />;
        case "V":
          return <Navigate to="/volunteer/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    } else if (user.role) {
      switch (user.role) {
        case "Admin":
          return <Navigate to="/admin/dashboard" replace />;
        case "Instructor":
          return <Navigate to="/instructor/dashboard" replace />;
        case "Student":
          return <Navigate to="/pstudyware/student/dashboard" replace />;
        case "Volunteer":
          return <Navigate to="/volunteer/dashboard" replace />;
        default:
          return <Navigate to="/dashboard" replace />;
      }
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute;
