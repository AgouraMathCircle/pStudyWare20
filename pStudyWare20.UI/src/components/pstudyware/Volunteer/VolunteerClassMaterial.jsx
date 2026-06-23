import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import documentService from "../../../services/documentService";
import StudentDocumentList from "../Student/StudentDocumentList";
import VolunteerHeader, { VolunteerRoleHeaderSpacer } from "./VolunteerHeader";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../styles/applicationSurfaces";

const VolunteerClassMaterial = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated || !user) return;

      try {
        setLoading(true);
        const response = await documentService.getDocumentsList(
          user.email || user.username
        );

        if (response.isSuccess) {
          const publishedDocuments = (response.documents || []).filter(
            (doc) => `${doc.publish || ""}`.toUpperCase() === "Y"
          );
          setDocuments(publishedDocuments);
        } else {
          showMessage(response.errorMessage || "Failed to load class materials", "error");
        }
      } catch (err) {
        console.error("Error fetching volunteer class materials:", err);
        showMessage("Error loading class materials. Please refresh the page.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [isAuthenticated, user]);

  const showMessage = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  const handleView = (docName) => {
    setSelectedPdf(docName);
  };

  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

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

  const handleOpenVideo = (videoURL) => {
    if (videoURL) {
      documentService.openVideo(videoURL);
    } else {
      showMessage("No video URL available for this document.", "warning");
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocumentsList(
        user.email || user.username
      );

      if (response.isSuccess) {
        const publishedDocuments = (response.documents || []).filter(
          (doc) => `${doc.publish || ""}`.toUpperCase() === "Y"
        );
        setDocuments(publishedDocuments);
        showMessage("Class materials refreshed!", "success");
      } else {
        showMessage(response.errorMessage || "Failed to refresh class materials", "error");
      }
    } catch (err) {
      console.error("Error refreshing class materials:", err);
      showMessage("Error refreshing class materials.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Class Materials...
        </Typography>
      </Box>
    );
  }

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
        <Alert severity="error">Access denied. Please log in to view class materials.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <VolunteerHeader user={user} />
      <VolunteerRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4, pt: 2 }}>
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
              <CardContent sx={{ p: 0 }}>
                <StudentDocumentList
                  documents={documents}
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

export default VolunteerClassMaterial;
