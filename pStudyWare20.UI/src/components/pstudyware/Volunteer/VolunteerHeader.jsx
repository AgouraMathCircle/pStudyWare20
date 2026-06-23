import React, { useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { instructorPortalContentContainerProps } from "../styles/applicationSurfaces";
import { formatRoleHeaderLoginDateTime } from "../../../hooks/useRoleHeaderDateTime";
import PortalHeaderMessageControls from "../Common/PortalHeaderMessageControls";
import {
  VolunteerRoleHeaderSpacer,
  ROLE_HEADER_HEIGHT_VARS,
  compactRoleHeaderBarSx,
  useFixedRoleHeaderLayout,
} from "../Common/roleHeaderLayout";

export { VolunteerRoleHeaderSpacer };

const volunteerRoleHeaderBarSx = compactRoleHeaderBarSx("#e1bee7");

const VolunteerHeader = ({ user }) => {
  const headerRef = useRef(null);
  const dateTime = formatRoleHeaderLoginDateTime(user?.loginAt);
  const { fixedSx } = useFixedRoleHeaderLayout(
    headerRef,
    ROLE_HEADER_HEIGHT_VARS.volunteer,
    [user?.firstName, user?.loginAt],
  );

  return (
    <Box
      ref={headerRef}
      className="volunteer-role-header"
      sx={{
        ...volunteerRoleHeaderBarSx,
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
                backgroundColor: "#5e35b1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(94, 53, 177, 0.28)",
                flexShrink: 0,
              }}
            >
              <DashboardIcon sx={{ fontSize: 14 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#4527a0",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              Volunteer
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
                border: "1px solid #7e57c2",
                boxShadow: "0 1px 3px rgba(94, 53, 177, 0.1)",
              }}
            >
              <Typography
                sx={{
                  color: "#4527a0",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || "Volunteer"}
              </Typography>
            </Box>

            <PortalHeaderMessageControls user={user} color="#4527a0" />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#f3e5f5",
                px: { xs: 0.75, sm: 1 },
                py: 0.25,
                borderRadius: "999px",
                border: "1px solid #e1bee7",
              }}
            >
              <CalendarIcon sx={{ fontSize: 14, color: "#8e24aa" }} />
              <Typography
                sx={{
                  color: "#6a1b9a",
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

export default VolunteerHeader;
