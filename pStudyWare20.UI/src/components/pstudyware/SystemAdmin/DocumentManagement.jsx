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
import { useAppSnackbar } from "../Common/useAppSnackbar";
import AppSnackbar from "../Common/AppSnackbar";
import { useAuth } from "../../../contexts/AuthContext";
import documentService from "../../../services/documentService";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import DocumentList from "./DocumentList";
import DocumentForm from "./DocumentForm";

const DocumentManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // Admin privileges state
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddDocument: false,
    canDeleteDocument: false,
    canPublishDocument: false,
  });

  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  // Load document data
  useEffect(() => {
    const loadDocuments = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("DocumentManagement: Fetching document data");

        // Check admin privileges
        const memberType = user.memberType?.toUpperCase();
        const chapterID = user.chapterID || "1";
        const isAdmin = memberType === "A";
        const isInstructor = memberType === "I";
        const isSystemAdmin = isAdmin && chapterID === "1";

        setAdminPrivileges({
          isAdmin,
          isSystemAdmin,
          canAddDocument: isSystemAdmin,
          canDeleteDocument: isAdmin,
          canPublishDocument: isAdmin || isInstructor,
        });

        // Get documents list
        const response = await documentService.getDocumentsList(
          user.email || user.username
        );

        console.log("DocumentManagement: Document data response", response);

        if (response.isSuccess) {
          setDocuments(response.documents || []);
        } else {
          showSnackbar(
            response.errorMessage || "Failed to load documents list",
            "error"
          );
        }
      } catch (err) {
        console.error("Error fetching document data:", err);
        let errorMessage =
          "Error loading document data. Please refresh the page.";

        // Provide more specific error messages
        if (err.code === "ECONNABORTED") {
          errorMessage =
            "Request timeout. The server is taking too long to respond. Please try again.";
        } else if (err.response?.status === 500) {
          errorMessage =
            "Server error while loading documents. Please contact support if this persists.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = `Error: ${err.message}`;
        }

        showSnackbar(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user)) {
      showSnackbar("Access denied. Please log in to view documents.", "error");
    }
  }, [loading, isAuthenticated, user, showSnackbar]);

  // Handle add document
  const handleAdd = () => {
    setSelectedDocument(null);
    setIsEdit(false);
    setFormOpen(true);
  };

  // Handle edit document (not used for documents, but kept for consistency)
  const handleEdit = (document) => {
    setSelectedDocument(document);
    setIsEdit(true);
    setFormOpen(true);
  };

  // Handle delete document
  const handleDelete = async (docID, docName) => {
    try {
      console.log("DocumentManagement: Deleting document", docID, docName);
      showSnackbar("Deleting document...", "info");

      const response = await documentService.deleteDocument(
        docID.toString(),
        docName
      );

      if (response.isSuccess) {
        showSnackbar(
          response.message || "Document deleted successfully!",
          "success"
        );
        // Refresh documents list
        await refreshDocuments();
      } else {
        showSnackbar(
          response.errorMessage || "Failed to delete document.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      showSnackbar("Error deleting document. Please try again.", "error");
    }
  };

  // Handle publish document
  const handlePublish = async (docID) => {
    try {
      console.log("DocumentManagement: Publishing document", docID);
      showSnackbar("Publishing document...", "info");

      const response = await documentService.publishDocument(docID);

      if (response.isSuccess) {
        showSnackbar(
          response.message || "Document published successfully!",
          "success"
        );
        // Refresh documents list
        await refreshDocuments();
      } else {
        showSnackbar(
          response.errorMessage || "Failed to publish document.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error publishing document:", err);
      showSnackbar("Error publishing document. Please try again.", "error");
    }
  };

  // Handle view document
  const handleView = (docName) => {
    documentService.viewDocument(docName);
  };

  // Handle download document
  const handleDownload = (docName) => {
    documentService.downloadDocument(docName);
  };

  // Handle open video
  const handleOpenVideo = (videoURL) => {
    if (videoURL) {
      documentService.openVideo(videoURL);
    } else {
      showSnackbar("No video URL available for this document.", "warning");
    }
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      console.log("DocumentManagement: Uploading document", formData);
      showSnackbar("Uploading document...", "info");

      const response = await documentService.uploadDocument(formData);

      if (response.isSuccess) {
        showSnackbar(
          response.message || "Document uploaded successfully!",
          "success"
        );
        // Refresh documents list
        await refreshDocuments();
        setFormOpen(false);
      } else {
        showSnackbar(
          response.errorMessage || "Failed to upload document.",
          "error"
        );
        throw new Error(response.errorMessage);
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      throw err;
    }
  };

  // Handle refresh data
  const handleRefresh = async () => {
    await refreshDocuments();
    showSnackbar("Documents list refreshed!", "success");
  };

  // Refresh documents list
  const refreshDocuments = async () => {
    try {
      const response = await documentService.getDocumentsList(
        user.email || user.username
      );

      if (response.isSuccess) {
        setDocuments(response.documents || []);
      } else {
        showSnackbar(
          response.errorMessage || "Failed to refresh documents list",
          "error"
        );
      }
    } catch (err) {
      console.error("Error refreshing documents list:", err);
      showSnackbar("Error refreshing documents list.", "error");
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
          Loading Document Management...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />;
  }

  return (
    <Box>
      <SystemAdminHeader user={user} />
      <SystemAdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <DocumentList
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
          </Grid>
        </Grid>
      </Container>

      {/* Document Upload Form Dialog */}
      <DocumentForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        document={selectedDocument}
        isEdit={isEdit}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default DocumentManagement;
