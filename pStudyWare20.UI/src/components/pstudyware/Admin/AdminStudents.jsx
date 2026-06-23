import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { People as PeopleIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import { APPLICATION_ADMIN_TITLE_COLOR} from "../styles/applicationSurfaces";

const AdminStudents = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <PeopleIcon
              sx={{ fontSize: 80, color: APPLICATION_ADMIN_TITLE_COLOR, mb: 2 }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: APPLICATION_ADMIN_TITLE_COLOR }}
            >
              Students Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include student management
              features such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View all students
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Add/Edit/Delete student records
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Manage student enrollments
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View student performance
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Export student data
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminStudents;
