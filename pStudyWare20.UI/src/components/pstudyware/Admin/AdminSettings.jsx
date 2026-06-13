import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../styles/applicationSurfaces";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <SettingsIcon
              sx={{ fontSize: 80, color: APPLICATION_ADMIN_TITLE_COLOR, mb: 2 }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: APPLICATION_ADMIN_TITLE_COLOR }}
            >
              System Settings
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include system
              configuration features such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Update lookup tables
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Manage semesters and sessions
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Configure system parameters
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Email template management
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • User role permissions
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • System backup and maintenance
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminSettings;
