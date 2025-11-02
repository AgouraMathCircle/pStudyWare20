import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { Assessment as ReportIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";

const AdminReports = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: "72px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <ReportIcon sx={{ fontSize: 80, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include reporting features
              such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Student enrollment reports
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Attendance reports
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Grade distribution analytics
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Financial reports
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Custom report builder
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Export to PDF/Excel
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminReports;
