import React from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import VolunteerHeader from "./VolunteerHeader";

const VolunteerShell = ({ children }) => {
  const { user } = useAuth();

  return (
    <Box className="volunteer-shell" sx={{ minHeight: "50vh" }}>
      <VolunteerHeader user={user} />
      <Box sx={{ height: "48px" }} aria-hidden />
      <Box sx={{ px: { xs: 1, sm: 2 }, py: 2 }} component="main">
        {children}
      </Box>
    </Box>
  );
};

export default VolunteerShell;
