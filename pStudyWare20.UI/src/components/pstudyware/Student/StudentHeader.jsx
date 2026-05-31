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
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { applicationRoleHeaderBarSx } from "../../../styles/applicationSurfaces";

const StudentHeader = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Left: portal title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "11px",
                backgroundColor: "#2e7d32",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(46, 125, 50, 0.32)",
              }}
            >
              <DashboardIcon sx={{ fontSize: 19 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#1b5e20",
                letterSpacing: "-0.01em",
                display: { xs: "none", sm: "block" },
              }}
            >
              Student Dashboard
            </Typography>
          </Box>

          {/* Right: welcome + date */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#ffffff",
                pl: 0.5,
                pr: { xs: 0.5, sm: 1.75 },
                py: 0.5,
                borderRadius: "999px",
                border: "2px solid #4caf50",
                boxShadow: "0 2px 6px rgba(46, 125, 50, 0.15)",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                {(user?.firstName || "S").charAt(0).toUpperCase()}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#1b5e20",
                  fontWeight: 700,
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
                gap: 0.75,
                backgroundColor: "#e8f5e9",
                px: { xs: 1.25, sm: 1.75 },
                py: 0.85,
                borderRadius: "999px",
                border: "1px solid #c8e6c9",
              }}
            >
              <CalendarIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#1b5e20",
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
        </Box>
      </Container>
    </Box>
  );
};

export default StudentHeader;
