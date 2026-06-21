import React, { useCallback, useLayoutEffect, useState } from "react";
import { Box, Container, Typography, useTheme } from "@mui/material";
import {
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import {
  applicationRoleHeaderBarSx,
  instructorPortalContentContainerProps,
} from "../styles/applicationSurfaces";
import { useRoleHeaderDateTime } from "../../../hooks/useRoleHeaderDateTime";

/**
 * Fixed band under site navigation — content aligned with dashboard cards (maxWidth xl).
 */
const InstructorHeader = ({ user }) => {
  const theme = useTheme();
  const [topPx, setTopPx] = useState(72);
  const dateTime = useRoleHeaderDateTime();

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
                backgroundColor: "#1565c0",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(21, 101, 192, 0.28)",
                flexShrink: 0,
              }}
            >
              <SchoolIcon sx={{ fontSize: 16 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#0d47a1",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Instructor
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
                border: "1.5px solid #1976d2",
                boxShadow: "0 1px 4px rgba(21, 101, 192, 0.12)",
              }}
            >
              <Typography
                sx={{
                  color: "#0d47a1",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
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
                gap: 0.5,
                backgroundColor: "#e3f2fd",
                px: { xs: 1, sm: 1.25 },
                py: 0.35,
                borderRadius: "999px",
                border: "1px solid #90caf9",
              }}
            >
              <CalendarIcon sx={{ fontSize: 14, color: "#1565c0" }} />
              <Typography
                sx={{
                  color: "#0d47a1",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                }}
              >
                {dateTime}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InstructorHeader;
