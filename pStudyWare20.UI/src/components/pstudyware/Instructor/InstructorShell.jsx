import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import InstructorHeader from "./InstructorHeader";
import { instructorSubheaderSpacerPx } from "./instructorPortalTableStyles";

/**
 * Instructor layout: fixed welcome bar below main Navbar on every instructor route.
 */
const InstructorShell = () => {
  const { user } = useAuth();

  return (
    <Box className="instructor-shell" sx={{ minHeight: "50vh" }}>
      <InstructorHeader user={user} />
      {/* Spacer for fixed InstructorHeader (does not occupy document flow) */}
      <Box sx={{ height: `${instructorSubheaderSpacerPx}px` }} aria-hidden />
      <Box
        component="main"
        sx={{ flex: 1, minWidth: 0, px: { xs: 1, sm: 2 }, py: 2 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default InstructorShell;
