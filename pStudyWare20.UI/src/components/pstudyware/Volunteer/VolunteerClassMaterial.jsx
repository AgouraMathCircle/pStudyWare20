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

import PdfViewerModal from "../../common/PdfViewerModal";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
} from "../styles/applicationSurfaces";
import "../../../styles/StudentClassMaterial.css";

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
    <Box className="student-class-material">
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
                  onView={handleView}
                  onDownload={handleDownload}
                  onOpenVideo={handleOpenVideo}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <PdfViewerModal
        open={Boolean(selectedPdf)}
        pdfUrl={selectedPdf}
        pdfName={selectedPdf}
        onClose={handleClosePdfViewer}
      />
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
