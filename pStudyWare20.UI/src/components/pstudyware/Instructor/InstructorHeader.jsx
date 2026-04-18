import React, { useCallback, useLayoutEffect, useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import {
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { applicationRoleHeaderBarSx } from "../../../styles/applicationSurfaces";
import instructorHeaderBg from "../../../assets/images/bg.jpg";

/**
 * Fixed band under site navigation (same idea as AdminHeader).
 * `top` and stacking must match real Topbar + AppBar heights — hard-coded 64px
 * sits under the MUI AppBar (z-index 1100) and was invisible.
 */
const InstructorHeader = ({ user }) => {
  const theme = useTheme();
  const [topPx, setTopPx] = useState(72);

  const measureTopOffset = useCallback(() => {
    const topbar = document.querySelector(".topbar-container");
    const appBar =
      document.querySelector("header.MuiAppBar-root") ||
      document.querySelector(".MuiAppBar-root");

    let sum = 0;
    if (topbar) sum += topbar.getBoundingClientRect().height;
    if (appBar) sum += appBar.getBoundingClientRect().height;

    setTopPx(Math.max(Math.ceil(sum), 56));
  }, []);

  useLayoutEffect(() => {
    measureTopOffset();
    window.addEventListener("resize", measureTopOffset);
    const t1 = window.setTimeout(measureTopOffset, 0);
    const t2 = window.setTimeout(measureTopOffset, 150);
    return () => {
      window.removeEventListener("resize", measureTopOffset);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [measureTopOffset]);

  return (
    <Box
      sx={{
        ...applicationRoleHeaderBarSx,
        bgcolor: "transparent",
        backgroundImage: `linear-gradient(rgba(232, 245, 233, 0.88), rgba(232, 245, 233, 0.88)), url(${instructorHeaderBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
              boxShadow: "0 2px 4px rgba(46, 125, 50, 0.1)",
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
              Welcome, {user?.firstName || "Instructor"}
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
              {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InstructorHeader;
