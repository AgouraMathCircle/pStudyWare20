import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import documentService from "../../../services/documentService";
import StudentDocumentList from "./StudentDocumentList";
import StudentHeader from "./StudentHeader";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
} from "../styles/applicationSurfaces";

const ClassMaterial = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load document data
  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("ClassMaterial: Fetching document data");

        // Get documents list
        const response = await documentService.getDocumentsList(
          user.email || user.username
        );

        console.log("ClassMaterial: Document data response", response);

        if (response.isSuccess) {
          // Filter to show only published documents for students
          const publishedDocuments = (response.documents || []).filter(
            (doc) => doc.publish?.toUpperCase() === "Y"
          );
          setDocuments(publishedDocuments);
        } else {
          showMessage(
            response.errorMessage || "Failed to load class materials",
            "error"
          );
        }
      } catch (err) {
        console.error("Error fetching class materials:", err);
        showMessage(
          "Error loading class materials. Please refresh the page.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
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

  // Handle view document - open PDF viewer below table
  const handleView = (docName) => {
    setSelectedPdf(docName);
  };

  // Handle close PDF viewer
  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

  // Handle download document via API (avoids SPA/static path issues)
  const handleDownload = async (docName) => {
    try {
      await documentService.downloadClassMaterial(docName);
    } catch (err) {
      console.error("Error downloading class material:", err);
      showMessage(
        err?.message || "Unable to download document. Please try again.",
        "error"
      );
    }
  };

  // Handle open video
  const handleOpenVideo = (videoURL) => {
    if (videoURL) {
      documentService.openVideo(videoURL);
    } else {
      showMessage("No video URL available for this document.", "warning");
    }
  };

  // Handle refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocumentsList(
        user.email || user.username
      );

      if (response.isSuccess) {
        // Filter to show only published documents for students
        const publishedDocuments = (response.documents || []).filter(
          (doc) => doc.publish?.toUpperCase() === "Y"
        );
        setDocuments(publishedDocuments);
        showMessage("Class materials refreshed!", "success");
      } else {
        showMessage(
          response.errorMessage || "Failed to refresh class materials",
          "error"
        );
      }
    } catch (err) {
      console.error("Error refreshing class materials:", err);
      showMessage("Error refreshing class materials.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Check authentication
  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Alert severity="error">
          Access denied. Please log in to view class materials.
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <Box sx={{ height: "48px" }} aria-hidden />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent
                sx={{
                  ...adminSessionListPanelContentSx,
                  pt: 1,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <StudentDocumentList
                  documents={documents}
                  loading={loading}
                  onRefresh={handleRefresh}
                  onView={handleView}
                  onDownload={handleDownload}
                  onOpenVideo={handleOpenVideo}
                  selectedPdf={selectedPdf}
                  onClosePdfViewer={handleClosePdfViewer}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

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

export default ClassMaterial;
