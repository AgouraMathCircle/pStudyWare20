import React from "react";
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";

const StudentHeader = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "2px solid #e9ecef",
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: "64px", // Position directly below Navbar
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
          }}
        >
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
              Welcome, {user?.firstName || "Student"}
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
              {new Date().toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentHeader;
