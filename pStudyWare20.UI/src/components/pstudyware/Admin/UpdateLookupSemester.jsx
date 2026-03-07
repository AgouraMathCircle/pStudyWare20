import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import AdminHeader from "./AdminHeader";

const UpdateLookupSemester = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Update Lookup Semester
        </Typography>
        <Paper sx={{ p: 3 }} elevation={2}>
          <Typography color="text.secondary">
            This page is under development. Update lookup semester functionality will be available here.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default UpdateLookupSemester;
