import React from "react";
import { Box } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import VolunteerHeader, { VolunteerRoleHeaderSpacer } from "./VolunteerHeader";
import { portalDashboardPageSx } from "../styles/applicationSurfaces";

const VolunteerShell = ({ children }) => {
  const { user } = useAuth();

  return (
    <Box
      className="volunteer-shell"
      sx={{
        ...portalDashboardPageSx,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <VolunteerHeader user={user} />
      <VolunteerRoleHeaderSpacer />
      <Box component="main" sx={{ flex: 1, minWidth: 0, pt: 0, pb: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default VolunteerShell;
