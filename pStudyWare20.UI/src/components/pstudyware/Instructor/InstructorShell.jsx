import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import InstructorHeader, { InstructorRoleHeaderSpacer } from "./InstructorHeader";
import { portalDashboardPageSx } from "../styles/applicationSurfaces";

/**
 * Instructor layout: fixed welcome bar below main Navbar on every instructor route.
 */
const InstructorShell = () => {
  const { user } = useAuth();

  return (
    <Box
      className="instructor-shell"
      sx={{
        ...portalDashboardPageSx,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <InstructorHeader user={user} />
      {/* Spacer for fixed InstructorHeader (does not occupy document flow) */}
      <InstructorRoleHeaderSpacer />
      <Box component="main" sx={{ flex: 1, minWidth: 0, pt: 0, pb: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default InstructorShell;
