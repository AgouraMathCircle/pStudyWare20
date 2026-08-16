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
  AdminRoleHeaderSpacer as SystemAdminRoleHeaderSpacer,
  ROLE_HEADER_HEIGHT_VARS,
  compactRoleHeaderBarSx,
  useFixedRoleHeaderLayout,
} from "../Common/roleHeaderLayout";
import "../../../styles/SystemAdminPortalTables.css";

export { SystemAdminRoleHeaderSpacer };

const systemAdminRoleHeaderBarSx = compactRoleHeaderBarSx("#c8e6c9");

const SystemAdminHeader = ({ user }) => {
  const headerRef = useRef(null);
  const dateTime = formatRoleHeaderLoginDateTime(user?.loginAt);
  const { fixedSx } = useFixedRoleHeaderLayout(
    headerRef,
    ROLE_HEADER_HEIGHT_VARS.admin,
    [user?.firstName, user?.loginAt],
  );

  return (
    <Box
      ref={headerRef}
      className="systemadmin-role-header"
      sx={{
        ...systemAdminRoleHeaderBarSx,
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
                backgroundColor: "#2e7d32",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(46, 125, 50, 0.28)",
                flexShrink: 0,
              }}
            >
              <DashboardIcon sx={{ fontSize: 14 }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#1b5e20",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              System Administrator
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
                border: "1px solid #4caf50",
                boxShadow: "0 1px 3px rgba(46, 125, 50, 0.1)",
              }}
            >
              <Typography
                sx={{
                  color: "#1b5e20",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  lineHeight: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Welcome, {user?.firstName || "Administrator"}
              </Typography>
            </Box>

            <PortalHeaderMessageControls user={user} />

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 0.5,
                backgroundColor: "#e8f5e9",
                px: { xs: 0.75, sm: 1 },
                py: 0.25,
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

export default SystemAdminHeader;
