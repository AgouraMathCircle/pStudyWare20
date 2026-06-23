import React from "react";
import { Box, Container, Card, CardContent } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import UpdatePassword from "../Common/UpdatePassword";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
} from "../styles/applicationSurfaces";

const StudentChangePassword = () => {
  const { user } = useAuth();

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <StudentRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            ...adminSessionListPanelCardSx,
            width: "100%",
            maxWidth: 560,
            mx: "auto",
          }}
        >
          <CardContent
            sx={{
              ...adminSessionListPanelContentSx,
              pt: 1,
              "&:last-child": { pb: 1.5 },
            }}
          >
            <UpdatePassword embedded />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default StudentChangePassword;
