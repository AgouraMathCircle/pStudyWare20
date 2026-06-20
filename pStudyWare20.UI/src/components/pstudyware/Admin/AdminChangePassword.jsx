import React from "react";
import { Box, Container, Card, CardContent, Typography } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import UpdatePassword from "../Common/UpdatePassword";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminSessionListTitleSx,
  portalRoleSubheaderSpacerPx,
} from "../styles/applicationSurfaces";

const AdminChangePassword = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} />
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Card
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            boxShadow: PORTAL_CARD_BOX_SHADOW,
            overflow: "hidden",
            width: "fit-content",
            maxWidth: "100%",
            ...portalCardAntiLiftSx,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              component="h2"
              variant="subtitle1"
              sx={{
                ...adminSessionListTitleSx,
                mb: 2,
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Update Password
            </Typography>
            <UpdatePassword embedded />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminChangePassword;
