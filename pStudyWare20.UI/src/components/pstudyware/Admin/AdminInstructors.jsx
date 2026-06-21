import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import { APPLICATION_ADMIN_TITLE_COLOR, portalRoleSubheaderSpacerPx} from "../styles/applicationSurfaces";

const AdminInstructors = () => {
  const { user } = useAuth();

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <SchoolIcon
              sx={{ fontSize: 80, color: APPLICATION_ADMIN_TITLE_COLOR, mb: 2 }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: APPLICATION_ADMIN_TITLE_COLOR }}
            >
              Instructors Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include instructor
              management features such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View all instructors
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Add/Edit/Delete instructor records
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Assign classes to instructors
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Manage instructor schedules
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View instructor performance metrics
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminInstructors;
