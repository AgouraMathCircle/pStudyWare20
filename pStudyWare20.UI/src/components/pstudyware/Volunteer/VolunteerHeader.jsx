import React, { useCallback, useLayoutEffect, useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  VolunteerActivism as VolunteerIcon,
} from "@mui/icons-material";
import { applicationRoleHeaderBarSx } from "../../../styles/applicationSurfaces";

const VolunteerHeader = ({ user }) => {
  const theme = useTheme();
  const [topPx, setTopPx] = useState(64);

  const measureTopOffset = useCallback(() => {
    let sum = 0;
    const topbar = document.querySelector(".topbar-container");
    const appBar =
      document.querySelector("header.MuiAppBar-root") ||
      document.querySelector(".MuiAppBar-root");

    if (topbar) sum += topbar.getBoundingClientRect().height;
    if (appBar) sum += appBar.getBoundingClientRect().height;

    setTopPx(Math.max(Math.ceil(sum), 56));
  }, []);

  useLayoutEffect(() => {
    measureTopOffset();
    window.addEventListener("resize", measureTopOffset);
    const timeout1 = window.setTimeout(measureTopOffset, 0);
    const timeout2 = window.setTimeout(measureTopOffset, 150);

    return () => {
      window.removeEventListener("resize", measureTopOffset);
      window.clearTimeout(timeout1);
      window.clearTimeout(timeout2);
    };
  }, [measureTopOffset]);

  return (
    <Box
      sx={{
        ...applicationRoleHeaderBarSx,
        pt: 2,
        pb: 0.5,
        position: "fixed",
        top: `${topPx}px`,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar - 1,
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
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "11px",
                backgroundColor: "#6a1b9a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(81, 45, 168, 0.32)",
              }}
            >
              <VolunteerIcon sx={{ fontSize: 19 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "1.05rem",
                color: "#4a148c",
                letterSpacing: "-0.01em",
                display: { xs: "none", sm: "block" },
              }}
            >
              Volunteer Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#ede7f6",
                pl: 0.5,
                pr: { xs: 0.5, sm: 1.75 },
                py: 0.5,
                borderRadius: "999px",
                border: "2px solid #6a1b9a",
                boxShadow: "0 2px 6px rgba(81, 45, 168, 0.15)",
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)",
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
                  color: "#4a148c",
                  fontWeight: 700,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || "Volunteer"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                backgroundColor: "#ede7f6",
                pl: 0.5,
                pr: { xs: 0.5, sm: 1.75 },
                py: 0.5,
                borderRadius: "999px",
                border: "2px solid #6a1b9a",
                boxShadow: "0 2px 6px rgba(81, 45, 168, 0.15)",
              }}
            >
              <CalendarIcon sx={{ fontSize: 18, color: "#6a1b9a" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#4a148c",
                  fontWeight: 700,
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
