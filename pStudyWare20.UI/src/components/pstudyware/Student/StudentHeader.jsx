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
        py: 1,
        position: "sticky",
        top: "64px", // Account for Navbar height
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <PersonIcon sx={{ fontSize: 16, color: "#6c757d" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#495057",
                fontWeight: 500,
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
            }}
          >
            <CalendarIcon sx={{ fontSize: 16, color: "#6c757d" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#6c757d",
                display: { xs: "none", sm: "block" },
              }}
            >
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentHeader;
