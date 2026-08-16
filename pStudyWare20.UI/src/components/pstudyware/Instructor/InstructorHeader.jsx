import React, { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { instructorPortalContentContainerProps } from "../styles/applicationSurfaces";
import { formatRoleHeaderLoginDateTime } from "../../../hooks/useRoleHeaderDateTime";
import PortalHeaderMessageControls from "../Common/PortalHeaderMessageControls";
import {
  InstructorRoleHeaderSpacer,
  ROLE_HEADER_HEIGHT_VARS,
  compactRoleHeaderBarSx,
  useFixedRoleHeaderLayout,
} from "../Common/roleHeaderLayout";
import "../../../styles/InstructorPortalTables.css";

export { InstructorRoleHeaderSpacer };

const instructorRoleHeaderBarSx = compactRoleHeaderBarSx("#90caf9");

const InstructorHeader = ({ user }) => {
  const headerRef = useRef(null);
  const memberType = user?.memberType?.toUpperCase() || "";
  const userRole = user?.role?.toUpperCase() || "";
  const isCoordinator = memberType === "C" || memberType === "COORDINATOR" || userRole.includes("COORDINATOR");
  const roleLabel = isCoordinator ? "Coordinator" : "Instructor";
  const welcomeFallback = isCoordinator ? "Coordinator" : "Instructor";
  const dateTime = formatRoleHeaderLoginDateTime(user?.loginAt);
  const { fixedSx } = useFixedRoleHeaderLayout(
    headerRef,
    ROLE_HEADER_HEIGHT_VARS.instructor,
    [user?.firstName, user?.loginAt, roleLabel],
  );

  return (
    <Box
      ref={headerRef}
      className="instructor-role-header"
      sx={{
        ...instructorRoleHeaderBarSx,
        ...fixedSx,
      }}
    >
      <Container
        {...instructorPortalContentContainerProps}
        sx={{ py: 0, px: { xs: 2, sm: 3 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            minHeight: 0,
            py: 0.25,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "8px",
                backgroundColor: "#1565c0",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(21, 101, 192, 0.28)",
                flexShrink: 0,
              }}
            >
              <SchoolIcon sx={{ fontSize: 14 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#0d47a1",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {roleLabel}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#ffffff",
                px: { xs: 0.75, sm: 1 },
                py: 0.25,
                borderRadius: "999px",
                border: "1px solid #1976d2",
                boxShadow: "0 1px 3px rgba(21, 101, 192, 0.1)",
              }}
            >
              <Typography
                sx={{
                  color: "#0d47a1",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || welcomeFallback}
              </Typography>
            </Box>

            <PortalHeaderMessageControls user={user} color="#0d47a1" />

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#e3f2fd",
                px: { xs: 0.75, sm: 1 },
                py: 0.25,
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
                  lineHeight: 1,
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
