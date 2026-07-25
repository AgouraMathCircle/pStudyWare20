import React from "react";
import { Container, Box, Card, CardContent, Typography } from "@mui/material";
import { VolunteerActivism as VolunteerIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import { APPLICATION_ADMIN_TITLE_COLOR} from "../styles/applicationSurfaces";

const SystemAdminVolunteers = () => {
  const { user } = useAuth();

  return (
    <Box>
      <SystemAdminHeader user={user} />
      <SystemAdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Card elevation={3}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <VolunteerIcon
              sx={{ fontSize: 80, color: APPLICATION_ADMIN_TITLE_COLOR, mb: 2 }}
            />
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: APPLICATION_ADMIN_TITLE_COLOR }}
            >
              Volunteers Management
            </Typography>
            <Typography variant="body1" color="textSecondary">
              This page is under development. It will include volunteer
              management features such as:
            </Typography>
            <Box sx={{ mt: 3, textAlign: "left", maxWidth: 600, mx: "auto" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • View all volunteers
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Approve/Reject volunteer applications
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Manage volunteer assignments
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Track volunteer hours
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Generate volunteer reports
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default SystemAdminVolunteers;
