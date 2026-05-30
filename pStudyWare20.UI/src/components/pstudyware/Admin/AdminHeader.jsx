import React from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { applicationRoleHeaderBarSx } from "../../../styles/applicationSurfaces";

const AdminHeader = ({ user }) => {
  return (
    <Box
      sx={{
        ...applicationRoleHeaderBarSx,
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: "64px", // Position directly below Navbar
        left: 0,
        right: 0,
        zIndex: 1000,
        width: "100%",
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", sm: "flex-end" },
            flexWrap: "wrap",
            gap: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#fce4ec",
              px: { xs: 1.25, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(211, 47, 47, 0.1)",
            }}
          >
            <AdminIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#c62828" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#b71c1c",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Welcome, {user?.firstName || "Administrator"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#fff3e0",
              px: { xs: 1.25, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(255, 152, 0, 0.1)",
            }}
          >
            <CalendarIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: "#f57c00" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#e65100",
                fontWeight: 600,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {new Date().toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminHeader;
