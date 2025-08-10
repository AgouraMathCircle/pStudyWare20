import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services";

const StudentHeader = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left side - User Info */}
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

          {/* Right side - Logout Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderColor: "#dc3545",
              color: "#dc3545",
              "&:hover": {
                borderColor: "#c82333",
                backgroundColor: "#dc3545",
                color: "#ffffff",
              },
              fontSize: "0.875rem",
              px: 2,
              py: 0.5,
            }}
          >
            {isMobile ? "Logout" : "Sign Out"}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default StudentHeader;
