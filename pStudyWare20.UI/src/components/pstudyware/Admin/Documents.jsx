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
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import documentService from "../../../services/documentService";
import adminDashboardService from "../../../services/adminDashboardService";
import AdminHeader from "./AdminHeader";
import AdminDocumentList from "./AdminDocumentList";
import DocumentUploadForm from "./DocumentUploadForm";
import InstructorClassMaterialList from "../Instructor/InstructorClassMaterialList";
import { instructorPageShellSx } from "../Instructor/instructorPortalTableStyles";

const Documents = () => {
  const location = useLocation();
  const hideRoleHeader = location.pathname.includes("/pstudyware/instructor/");
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddDocument: false,
    canDeleteDocument: false,
    canPublishDocument: false,
  });

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const getDocumentsListWithRetry = async (username) => {
    return await documentService.getDocumentsList(username);
  };

  // Load document data
  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("Documents: Fetching document data");

        const username = user.email || user.username;
        const isInstructor =
          user.memberType?.toUpperCase() === "I" || user.role === "Instructor";

        // Load privileges and documents in parallel; do not fail the page if
        // privilege check is slow or times out.
        const [privilegesResult, documentsResult] = await Promise.allSettled([
          adminDashboardService.checkAdminPrivileges(),
          getDocumentsListWithRetry(username),
        ]);

        if (privilegesResult.status === "fulfilled") {
          const privilegesResponse = privilegesResult.value;
          const isAdmin = privilegesResponse?.isAdmin === true;
          const isSystemAdmin = privilegesResponse?.isSystemAdmin === true;

          setAdminPrivileges({
            isAdmin,
            isSystemAdmin,
            canAddDocument: isSystemAdmin || (isAdmin && user.chapterID === "1"),
            canDeleteDocument: isAdmin,
            canPublishDocument: isAdmin || isInstructor,
          });
        } else {
          console.warn(
            "Documents: privilege check failed, using role fallback",
            privilegesResult.reason,
          );
          const isAdmin = user.memberType?.toUpperCase() === "A";
          setAdminPrivileges({
            isAdmin,
            isSystemAdmin: false,
            canAddDocument: false,
            canDeleteDocument: isAdmin,
            canPublishDocument: isAdmin || isInstructor,
          });
        }

        if (documentsResult.status === "fulfilled") {
          const response = documentsResult.value;
          console.log("Documents: Document data response", response);

          if (response.isSuccess) {
            const docs = response.documents;
            setDocuments(Array.isArray(docs) ? docs : []);
          } else {
            showMessage(
              response.errorMessage || "Failed to load documents list",
              "error",
            );
          }
        } else {
          throw documentsResult.reason;
        }
      } catch (err) {
        console.error("Error fetching document data:", err);
        let errorMessage =
          "Error loading document data. Please refresh the page.";

        // Provide more specific error messages
        if (err.code === "ECONNABORTED") {
          errorMessage =
            "The server is taking longer than usual. Please try Refresh in a few seconds.";
        } else if (err.response?.status === 500) {
          errorMessage =
            "Server error while loading documents. Please contact support if this persists.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }

        showMessage(errorMessage, "error");
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

  // Handle view document
  const handleView = (docName) => {
    documentService.viewDocument(docName);
  };

  // Handle download document
  const handleDownload = (docName) => {
    documentService.downloadDocument(docName);
  };

  // Handle delete document
  const handleDelete = async (docID, docName) => {
    try {
      setLoading(true);
      const response = await documentService.deleteDocument(docID, docName);

      if (response.isSuccess) {
        showMessage("Document deleted successfully!", "success");
        // Refresh document list
        await handleRefresh();
      } else {
        showMessage(
          response.errorMessage || "Failed to delete document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      showMessage("Error deleting document. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle publish document
  const handlePublish = async (docID) => {
    try {
      setLoading(true);
      const response = await documentService.publishDocument(docID);

      if (response.isSuccess) {
        showMessage("Document published successfully!", "success");
        // Refresh document list
        await handleRefresh();
      } else {
        showMessage(
          response.errorMessage || "Failed to publish document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error publishing document:", err);
      showMessage("Error publishing document. Please try again.", "error");
    } finally {
      setLoading(false);
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

  // Handle add document
  const handleAdd = () => {
    setUploadFormOpen(true);
  };

  // Handle upload document
  const handleUploadSubmit = async (uploadData) => {
    try {
      setUploading(true);
      const response = await documentService.uploadDocument(uploadData);

      if (response.isSuccess) {
        showMessage("Document uploaded successfully!", "success");
        setUploadFormOpen(false);
        // Refresh document list
        await handleRefresh();
      } else {
        showMessage(
          response.errorMessage || "Failed to upload document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showMessage("Error uploading document. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Handle refresh data (quiet: no toast; skipFullPageLoading: list-only refresh — instructor view)
  const handleRefresh = async (options = {}) => {
    const { quiet = false, skipFullPageLoading = false } = options;
    try {
      if (!skipFullPageLoading) setLoading(true);
      const response = await getDocumentsListWithRetry(
        user.email || user.username,
      );

      if (response.isSuccess) {
        const docs = response.documents;
        setDocuments(Array.isArray(docs) ? docs : []);
        if (!quiet) showMessage("Documents refreshed!", "success");
      } else {
        showMessage(
          response.errorMessage || "Failed to refresh documents",
          "error",
        );
      }
    } catch (err) {
      console.error("Error refreshing documents:", err);
      showMessage("Error refreshing documents.", "error");
    } finally {
      if (!skipFullPageLoading) setLoading(false);
    }
  };

  // Show loading while fetching data
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
          Loading Documents...
        </Typography>
      </Box>
    );
  }

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
          Access denied. Please log in to view documents.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={hideRoleHeader ? instructorPageShellSx : undefined}>
      {!hideRoleHeader && <AdminHeader user={user} />}
      {!hideRoleHeader && (
        <Box sx={{ height: "48px" }} aria-hidden />
      )}
      <Container
        maxWidth="xl"
        sx={
          hideRoleHeader
            ? { mb: 4, px: { xs: 1, sm: 2 } }
            : {
                mb: 4,
                px: { xs: 1, sm: 2 },
                maxWidth: "100% !important",
              }
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {hideRoleHeader ? (
              <Box sx={{ width: "100%", minWidth: 0 }}>
                <InstructorClassMaterialList
                  documents={documents}
                  onRefresh={() =>
                    handleRefresh({ quiet: true, skipFullPageLoading: true })
                  }
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onOpenVideo={handleOpenVideo}
                  onAdd={handleAdd}
                  canAddDocument={adminPrivileges.canAddDocument}
                  canDeleteDocument={adminPrivileges.canDeleteDocument}
                  canPublishDocument={adminPrivileges.canPublishDocument}
                />
              </Box>
            ) : (
              <Card
                sx={{
                  backgroundColor: "white",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <AdminDocumentList
                    documents={documents}
                    onRefresh={handleRefresh}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onOpenVideo={handleOpenVideo}
                    onAdd={handleAdd}
                    canAddDocument={adminPrivileges.canAddDocument}
                    canDeleteDocument={adminPrivileges.canDeleteDocument}
                    canPublishDocument={adminPrivileges.canPublishDocument}
                  />
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Document Upload Form Dialog */}
      <DocumentUploadForm
        open={uploadFormOpen}
        onClose={() => setUploadFormOpen(false)}
        onSubmit={handleUploadSubmit}
        loading={uploading}
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

export default Documents;
