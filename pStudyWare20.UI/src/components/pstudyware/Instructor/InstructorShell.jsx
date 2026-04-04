import React from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import InstructorHeader from "./InstructorHeader";

/**
 * Fixed welcome header below main site navbar (navigation uses Navbar instructor items).
 */
const InstructorShell = ({ children }) => {
  const { user } = useAuth();

  return (
    <Box className="instructor-shell" sx={{ minHeight: "50vh" }}>
      <InstructorHeader user={user} />
      <Box sx={{ height: "48px" }} aria-hidden />
      <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }} component="main">
        {children}
      </Box>
    </Box>
  );
};

export default InstructorShell;
