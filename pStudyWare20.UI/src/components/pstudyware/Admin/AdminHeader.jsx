import React, { useCallback, useLayoutEffect, useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import {
  applicationRoleHeaderBarSx,
  instructorPortalContentContainerProps,
} from "../styles/applicationSurfaces";

/**
 * Fixed band under site navigation — content aligned with dashboard cards (maxWidth xl).
 */
const AdminHeader = ({ user }) => {
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
        pt: 1.25,
        pb: 0.35,
        position: "fixed",
        top: `${topPx}px`,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar - 1,
        width: "100%",
      }}
    >
      <Container {...instructorPortalContentContainerProps}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            minHeight: 28,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "9px",
                backgroundColor: "#2e7d32",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.28)",
                flexShrink: 0,
              }}
            >
              <DashboardIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#1b5e20",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Admin
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffffff",
                px: { xs: 1, sm: 1.25 },
                py: 0.35,
                borderRadius: "999px",
                border: "1.5px solid #4caf50",
                boxShadow: "0 1px 4px rgba(46, 125, 50, 0.12)",
              }}
            >
              <Typography
                sx={{
                  color: "#1b5e20",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || "Administrator"}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#e8f5e9",
                px: { xs: 1, sm: 1.25 },
                py: 0.35,
                borderRadius: "999px",
                border: "1px solid #c8e6c9",
              }}
            >
              <CalendarIcon sx={{ fontSize: 14, color: "#2e7d32" }} />
              <Typography
                sx={{
                  color: "#1b5e20",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
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

export default AdminHeader;
