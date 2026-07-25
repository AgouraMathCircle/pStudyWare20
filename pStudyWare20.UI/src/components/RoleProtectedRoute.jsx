import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPortalDashboardPath } from "../utils/routeUtils";

const RoleProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedMemberTypes = [],
  deniedRoles = [],
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (deniedRoles.length > 0 && deniedRoles.includes(user.role)) {
    return <Navigate to={getPortalDashboardPath(user)} replace />;
  }

  const hasRoleConstraint = allowedRoles.length > 0;
  const hasMemberConstraint = allowedMemberTypes.length > 0;
  const memberType = String(user.memberType ?? "")
    .trim()
    .toUpperCase();

  const roleMatch = hasRoleConstraint && allowedRoles.includes(user.role);
  const memberMatch =
    hasMemberConstraint &&
    !!memberType &&
    allowedMemberTypes.includes(memberType);

  let allowed = true;
  if (hasRoleConstraint || hasMemberConstraint) {
    allowed = roleMatch || memberMatch;
  }

  if (!allowed) {
    return <Navigate to={getPortalDashboardPath(user)} replace />;
  }

  // Keep SystemAdmin portal on /systemadmin and Admin on /admin
  if (
    user.role === "SystemAdmin" &&
    location.pathname.startsWith("/pstudyware/admin")
  ) {
    const systemAdminPath = location.pathname.replace(
      "/pstudyware/admin",
      "/pstudyware/systemadmin",
    );
    return <Navigate to={systemAdminPath} replace />;
  }

  if (
    user.role !== "SystemAdmin" &&
    location.pathname.startsWith("/pstudyware/systemadmin")
  ) {
    return <Navigate to={getPortalDashboardPath(user)} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
