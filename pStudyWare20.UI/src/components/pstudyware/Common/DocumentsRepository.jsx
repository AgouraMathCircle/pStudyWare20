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
import AdminHeader from "../Admin/AdminHeader";
import AdminDocumentsRepositoryList from "../Admin/AdminDocumentsRepositoryList";
import DocumentRepositoryUploadForm from "../Admin/DocumentRepositoryUploadForm";
import documentService, {
  getDocumentApiList,
  isDocumentApiSuccess,
} from "../../../services/documentService";
import { getPublicDocumentUrl } from "../../../utils/config";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  portalRoleSubheaderSpacerPx,
} from "../styles/applicationSurfaces";

const DocumentsRepository = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [listRefreshToken, setListRefreshToken] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const memberType = user?.memberType?.toUpperCase() || "";
  const isStudent = memberType === "S";
  const username = user?.email || user?.username || "";

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDocuments();
    }
  }, [isAuthenticated, user]);

  const loadDocuments = async ({ showPageLoader = true } = {}) => {
    try {
      if (showPageLoader) setLoading(true);
      const response = await documentService.getDocumentsRepository(username);

      if (isDocumentApiSuccess(response)) {
        setDocuments(getDocumentApiList(response));
        return true;
      }

      showMessage(
        response?.errorMessage ||
          response?.ErrorMessage ||
          "Failed to load documents",
        "error",
      );
      return false;
    } catch (error) {
      console.error("Error loading documents:", error);
      showMessage("Error loading documents. Please refresh the page.", "error");
      return false;
    } finally {
      if (showPageLoader) setLoading(false);
    }
  };

  const handleView = (docName) => {
    if (docName) {
      window.open(getPublicDocumentUrl(`AMC_Docs/${docName}`), "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = async (docID, docName) => {
    try {
      const response = await documentService.deleteDocument(
        docID.toString(),
        docName,
      );

      if (isDocumentApiSuccess(response)) {
        showMessage("Document deleted successfully", "success");
        await loadDocuments({ showPageLoader: false });
        setListRefreshToken((token) => token + 1);
      } else {
        showMessage(
          response?.errorMessage ||
            response?.ErrorMessage ||
            "Failed to delete document",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      showMessage("Error deleting document. Please try again.", "error");
    }
  };

  const handleUploadSubmit = async (uploadData) => {
    try {
      setUploading(true);
      const response = await documentService.uploadRepositoryDocument(uploadData);

      if (isDocumentApiSuccess(response)) {
        showMessage("Document uploaded successfully", "success");
        setUploadFormOpen(false);
        const refreshed = await loadDocuments({ showPageLoader: false });
        if (refreshed) {
          setListRefreshToken((token) => token + 1);
        }
        return { ...response, isSuccess: true };
      }

      showMessage(
        response?.errorMessage ||
          response?.ErrorMessage ||
          "Failed to upload document",
        "error",
      );
      return { ...response, isSuccess: false };
    } catch (error) {
      console.error("Error uploading document:", error);
      const message =
        error?.response?.data?.errorMessage ||
        error?.response?.data?.message ||
        error?.message ||
        "Error uploading document. Please try again.";
      showMessage(message, "error");
    } finally {
      setUploading(false);
    }
  };

  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box>
        <AdminHeader user={user} />
        <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} aria-hidden />
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
            Loading Documents...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Box>
        <AdminHeader user={user} />
        <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} aria-hidden />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <Alert severity="error">
            Access denied. Please log in to view documents.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: `${portalRoleSubheaderSpacerPx}px` }} aria-hidden />
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
                <AdminDocumentsRepositoryList
                  key={listRefreshToken}
                  documents={documents}
                  onView={handleView}
                  onDelete={handleDelete}
                  onUpload={() => setUploadFormOpen(true)}
                  canDelete={!isStudent}
                  canUpload={!isStudent}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <DocumentRepositoryUploadForm
        open={uploadFormOpen}
        onClose={() => setUploadFormOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={uploading}
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

export default DocumentsRepository;
