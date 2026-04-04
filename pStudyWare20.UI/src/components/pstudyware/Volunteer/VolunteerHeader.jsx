import React from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  VolunteerActivism as VolunteerIcon,
} from "@mui/icons-material";

const VolunteerHeader = ({ user }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#faf8fc",
        borderBottom: "2px solid #ede7f6",
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: "64px",
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(81, 45, 168, 0.12)",
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
              backgroundColor: "#ede7f6",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(81, 45, 168, 0.15)",
            }}
          >
            <VolunteerIcon sx={{ fontSize: 18, color: "#5e35b1" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#4527a0",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Volunteer
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#e8eaf6",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(57, 73, 171, 0.1)",
            }}
          >
            <PersonIcon sx={{ fontSize: 18, color: "#3949ab" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#283593",
                fontWeight: 600,
                display: { xs: "none", sm: "block" },
              }}
            >
              Welcome, {user?.firstName || user?.email || "Volunteer"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              backgroundColor: "#f3e5f5",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(142, 36, 170, 0.1)",
            }}
          >
            <CalendarIcon sx={{ fontSize: 18, color: "#8e24aa" }} />
            <Typography
              variant="body2"
              sx={{
                color: "#6a1b9a",
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

export default VolunteerHeader;
