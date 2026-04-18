import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import instructorService from "../../../services/instructorService";
import AdminHeader from "./AdminHeader";
import InstructorList from "./InstructorList";
import InstructorForm from "./InstructorForm";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";

const instructorManagementPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const InstructorManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Admin privileges state
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddInstructor: false,
    canExportData: false,
  });

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load instructor data
  useEffect(() => {
    const loadInstructors = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("InstructorManagement: Fetching instructor data");

        // Check admin privileges
        const memberType = user.memberType?.toUpperCase();
        const chapterID = user.chapterID || "1";
        const isAdmin = memberType === "A";
        const isSystemAdmin = isAdmin && chapterID === "1";

        setAdminPrivileges({
          isAdmin,
          isSystemAdmin,
          canAddInstructor: isSystemAdmin,
          canExportData: isAdmin,
        });

        // Get instructor list
        const response = await instructorService.getInstructorList(
          user.email || user.username
        );

        console.log("InstructorManagement: Instructor data response", response);

        if (response.isSuccess) {
          setInstructors(response.instructorList || []);
        } else {
          showMessage(
            response.errorMessage || "Failed to load instructor list",
            "error"
          );
        }

        // Load chapters for dropdown (you may need to add a chapter service)
        // For now, using hardcoded chapters
        setChapters([
          { value: "1", label: "Agoura Hills" },
          { value: "2", label: "Charlotte" },
          { value: "3", label: "Other Chapter" },
        ]);
      } catch (err) {
        console.error("Error fetching instructor data:", err);
        showMessage(
          "Error loading instructor data. Please refresh the page.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, [isAuthenticated, user]);

  // Helper function to show messages
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Helper function to close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle add instructor
  const handleAdd = () => {
    setSelectedInstructor(null);
    setIsEdit(false);
    setFormOpen(true);
  };

  // Handle edit instructor
  const handleEdit = (instructor) => {
    setSelectedInstructor(instructor);
    setIsEdit(true);
    setFormOpen(true);
  };

  // Handle delete instructor
  const handleDelete = async (instructorID) => {
    try {
      console.log("InstructorManagement: Deleting instructor", instructorID);
      showMessage("Deleting instructor...", "info");

      const response = await instructorService.deleteInstructor(instructorID);

      if (response.isSuccess) {
        showMessage(
          response.message || "Instructor deleted successfully!",
          "success"
        );
        // Refresh instructor list
        await refreshInstructors();
      } else {
        showMessage(
          response.errorMessage || "Failed to delete instructor.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error deleting instructor:", err);
      showMessage("Error deleting instructor. Please try again.", "error");
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      console.log("InstructorManagement: Submitting instructor", formData);
      showMessage(
        isEdit ? "Updating instructor..." : "Adding instructor...",
        "info"
      );

      const response = await instructorService.addOrUpdateInstructor(formData);

      if (response.isSuccess) {
        showMessage(
          response.message ||
            (isEdit
              ? "Instructor updated successfully!"
              : "Instructor added successfully!"),
          "success"
        );
        // Refresh instructor list
        await refreshInstructors();
        setFormOpen(false);
      } else {
        showMessage(
          response.errorMessage || "Failed to save instructor.",
          "error"
        );
        throw new Error(response.errorMessage);
      }
    } catch (err) {
      console.error("Error saving instructor:", err);
      throw err;
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      console.log("InstructorManagement: Exporting to Excel");
      showMessage("Generating Excel file...", "info");

      const blob = await instructorService.exportInstructorListToExcel(
        user.email || user.username
      );

      // Download the file
      instructorService.downloadExcelFile(
        blob,
        `InstructorList_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      showMessage("Excel file downloaded successfully!", "success");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      showMessage("Error exporting to Excel. Please try again.", "error");
    }
  };

  // Handle refresh data
  const handleRefresh = async () => {
    await refreshInstructors();
    showMessage("Instructor list refreshed!", "success");
  };

  // Refresh instructor list
  const refreshInstructors = async () => {
    try {
      const response = await instructorService.getInstructorList(
        user.email || user.username
      );

      if (response.isSuccess) {
        setInstructors(response.instructorList || []);
      } else {
        showMessage(
          response.errorMessage || "Failed to refresh instructor list",
          "error"
        );
      }
    } catch (err) {
      console.error("Error refreshing instructor list:", err);
      showMessage("Error refreshing instructor list.", "error");
    }
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <Box
        sx={{
          ...instructorManagementPageSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Instructor Management...
        </Typography>
      </Box>
    );
  }

  // Check authentication
  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          ...instructorManagementPageSx,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error">
          Access denied. Please log in as an administrator.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={instructorManagementPageSx}>
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: PORTAL_CARD_BOX_SHADOW,
                overflow: "hidden",
                ...portalCardAntiLiftSx,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <InstructorList
                  instructors={instructors}
                  onExportToExcel={handleExportToExcel}
                  canExportData={adminPrivileges.canExportData}
                  onRefresh={handleRefresh}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAdd={handleAdd}
                  canAddInstructor={adminPrivileges.canAddInstructor}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <InstructorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        instructor={selectedInstructor}
        chapters={chapters}
        isEdit={isEdit}
      />

      {/* Global Snackbar for Success/Error Messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InstructorManagement;
