import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import AdminHeader from "./AdminHeader";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../styles/applicationSurfaces";

const UploadAnswerKey = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: APPLICATION_ADMIN_TITLE_COLOR }}
        >
          Upload Online Exam Answer Key
        </Typography>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography color="text.secondary">
            This page is under development. Upload answer key functionality will be available here.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default UploadAnswerKey;
