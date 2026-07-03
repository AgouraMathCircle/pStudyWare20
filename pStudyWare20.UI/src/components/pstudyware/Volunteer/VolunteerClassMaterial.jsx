import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
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
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");
  const accessDeniedShownRef = useRef(false);

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
          showSnackbar(response.errorMessage || "Failed to load class materials", "error");
        }
      } catch (err) {
        console.error("Error fetching volunteer class materials:", err);
        showSnackbar("Error loading class materials. Please refresh the page.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user) && !accessDeniedShownRef.current) {
      accessDeniedShownRef.current = true;
      showSnackbar("Access denied. Please log in to view class materials.", "error");
    }
  }, [loading, isAuthenticated, user, showSnackbar]);

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
      showSnackbar(
        err?.message || "Unable to download document. Please try again.",
        "error"
      );
    }
  };

  const handleOpenVideo = (videoURL) => {
    if (videoURL) {
      documentService.openVideo(videoURL);
    } else {
      showSnackbar("No video URL available for this document.", "warning");
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
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
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
      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default VolunteerClassMaterial;
