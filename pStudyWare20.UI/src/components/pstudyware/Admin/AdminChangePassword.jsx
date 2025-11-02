import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";

const AdminChangePassword = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: "72px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <LockIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include password
              management features such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Change current password
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Password strength validation
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Password history tracking
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Security question management
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Two-factor authentication setup
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminChangePassword;
