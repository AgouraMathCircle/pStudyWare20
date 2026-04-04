import React from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
} from "@mui/icons-material";

const InstructorHeader = ({ user }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #e9ecef",
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
        width: "100%",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#e8f5e9",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(46, 125, 50, 0.12)",
            }}
          >
            <SchoolIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#1b5e20",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Instructor
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#e3f2fd",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(25, 118, 210, 0.1)",
            }}
          >
            <PersonIcon sx={{ fontSize: 18, color: "#1976d2" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#1565c0",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Welcome, {user?.firstName || user?.email || "Instructor"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#fff3e0",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(255, 152, 0, 0.1)",
            }}
          >
            <CalendarIcon sx={{ fontSize: 18, color: "#f57c00" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#e65100",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "numeric",
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

export default InstructorHeader;
