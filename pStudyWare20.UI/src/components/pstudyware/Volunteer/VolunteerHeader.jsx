import React from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { applicationRoleHeaderBarSx } from "../styles/applicationSurfaces";

const VolunteerHeader = ({ user }) => {
  return (
    <Box
      sx={{
        ...applicationRoleHeaderBarSx,
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: "64px",
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
          {/* Volunteer Badge on the left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "11px",
                backgroundColor: "#5e35b1", // Purple theme
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(94, 53, 177, 0.32)",
              }}
            >
              <DashboardIcon sx={{ fontSize: 19 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "1.05rem",
                color: "#4527a0",
                letterSpacing: "-0.01em",
                display: { xs: "none", sm: "block" },
              }}
            >
              Volunteer
            </Typography>
          </Box>

          {/* Welcome & Date on the right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            {/* Welcome Pill */}
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
                border: "2px solid #7e57c2", // Purple theme border
                boxShadow: "0 2px 6px rgba(94, 53, 177, 0.15)",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #512da8 0%, #7e57c2 100%)", // Purple gradient
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  flexShrink: 0,
                }}
              >
                {(user?.firstName || "V").charAt(0).toUpperCase()}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#4527a0",
                  fontWeight: 700,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || "Volunteer"}
              </Typography>
            </Box>

            {/* Date Pill */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                backgroundColor: "#f3e5f5", // Light purple theme background
                px: { xs: 1.25, sm: 1.75 },
                py: 0.85,
                borderRadius: "999px",
                border: "1px solid #e1bee7",
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
        </Box>
      </Container>
    </Box>
  );
};

export default VolunteerHeader;
