import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "../Admin/AdminHeader";
import AdminDocumentsRepositoryList from "../Admin/AdminDocumentsRepositoryList";
import DocumentRepositoryUploadForm from "../Admin/DocumentRepositoryUploadForm";
import AppSnackbar from "./AppSnackbar";
import { useAppSnackbar } from "./useAppSnackbar";
import documentService, {
  getDocumentApiList,
  isDocumentApiSuccess,
} from "../../../services/documentService";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
} from "../styles/applicationSurfaces";

const DocumentsRepository = () => {
  const { user, isAuthenticated } = useAuth();
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [listRefreshToken, setListRefreshToken] = useState(0);

  const memberType = user?.memberType?.toUpperCase() || "";
  const isStudent = memberType === "S";
  const username = user?.email || user?.username || "";

  useEffect(() => {
    if (isAuthenticated && user) {
      loadDocuments();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      showSnackbar("Access denied. Please log in to view documents.", "error");
    }
  }, [loading, isAuthenticated, user, showSnackbar]);

  const loadDocuments = async ({ showPageLoader = true } = {}) => {
    try {
      if (showPageLoader) setLoading(true);
      const response = await documentService.getDocumentsRepository(username);

      if (isDocumentApiSuccess(response)) {
        setDocuments(getDocumentApiList(response));
        return true;
      }

        showSnackbar(
        response?.errorMessage ||
          response?.ErrorMessage ||
          "Failed to load documents",
          "error",
        );
      return false;
    } catch (error) {
      console.error("Error loading documents:", error);
      showSnackbar("Error loading documents. Please refresh the page.", "error");
      return false;
    } finally {
      if (showPageLoader) setLoading(false);
    }
  };

  const handleView = (docName) => {
    if (!docName) {
      return;
    }

    const isPdf = documentService.isPdfDocumentName(docName);
    const previewWindow = isPdf ? window.open("about:blank", "_blank") : null;

    if (isPdf && !previewWindow) {
      showSnackbar(
        "Unable to open document. Please allow popups for this site.",
        "error",
      );
      return;
    }

    if (previewWindow) {
      previewWindow.document.title = docName;
      previewWindow.document.body.innerHTML =
        '<p style="font-family:sans-serif;padding:16px;">Loading document...</p>';
    }

    documentService.viewRepositoryDocument(docName, previewWindow).catch((error) => {
      console.error("Error opening repository document:", error);
      showSnackbar(
        error?.message || "Unable to open document. Please try again.",
        "error",
      );
    });
  };

  const handleDelete = async (docID, docName) => {
    try {
      const response = await documentService.deleteDocument(
        docID.toString(),
        docName,
      );

      if (isDocumentApiSuccess(response)) {
        showSnackbar("Document deleted successfully", "success");
        await loadDocuments({ showPageLoader: false });
        setListRefreshToken((token) => token + 1);
      } else {
        showSnackbar(
          response?.errorMessage ||
            response?.ErrorMessage ||
            "Failed to delete document",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      showSnackbar("Error deleting document. Please try again.", "error");
    }
  };

  const handleUploadSubmit = async (uploadData) => {
    try {
      setUploading(true);
      const response = await documentService.uploadRepositoryDocument(uploadData);

      if (isDocumentApiSuccess(response)) {
        showSnackbar("Document uploaded successfully", "success");
        setUploadFormOpen(false);
        const refreshed = await loadDocuments({ showPageLoader: false });
        if (refreshed) {
          setListRefreshToken((token) => token + 1);
        }
        return { ...response, isSuccess: true };
      }

        showSnackbar(
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
      showSnackbar(message, "error");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <>
      <Box>
        <AdminHeader user={user} />
        <AdminRoleHeaderSpacer />
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
      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
      </>
    );
  }

  if (!isAuthenticated || !user) {
  return (
    <>
    <Box>
      <AdminHeader user={user} />
        <AdminRoleHeaderSpacer />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        />
        </Box>
      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
      </>
    );
  }

  return (
    <>
    <Box>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
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

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
    </>
  );
};

export default DocumentsRepository;
