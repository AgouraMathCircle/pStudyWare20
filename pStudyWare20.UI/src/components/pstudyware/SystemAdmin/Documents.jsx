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
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import documentService, {
  getClassMaterialActionPayload,
} from "../../../services/documentService";
import systemAdminDashboardService from "../../../services/systemAdminDashboardService";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import SystemAdminDocumentList from "./SystemAdminDocumentList";
import DocumentUploadForm from "./DocumentUploadForm";
import InstructorClassMaterialList from "../Instructor/InstructorClassMaterialList";
import PdfViewerModal from "../../common/PdfViewerModal";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  instructorPortalContentContainerProps,
} from "../styles/applicationSurfaces";
import "../../../styles/InstructorClassMaterial.css";

const Documents = () => {
  const location = useLocation();
  const hideRoleHeader = location.pathname.includes("/pstudyware/instructor/");
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listRefreshing, setListRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canAddDocument: false,
    canDeleteDocument: false,
    canPublishDocument: false,
  });

  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

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
          systemAdminDashboardService.checkSystemAdminPrivileges(),
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
            const docs = response.documents ?? response.Documents ?? [];
            setDocuments(Array.isArray(docs) ? docs : []);
          } else {
            showSnackbar(
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

  // Handle view document — open PDF via API storage (legacy static /pstudyware/Documents/ is not used for uploads)
  const handleView = (docName) => {
    setSelectedPdf(docName);
  };

  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

  // Handle download document via API blob
  const handleDownload = async (docName) => {
    try {
      await documentService.downloadClassMaterial(docName);
    } catch (err) {
      console.error("Error downloading class material:", err);
      showSnackbar(
        err?.message || "Unable to download document. Please try again.",
        "error",
      );
    }
  };

  const refreshDocumentsList = async ({ quiet = false } = {}) => {
    try {
      setListRefreshing(true);
      const username = user.email || user.username;
      documentService.clearDocumentsListCache(username);
      const response = await getDocumentsListWithRetry(username);

      if (response.isSuccess) {
        const docs = response.documents ?? response.Documents ?? [];
        setDocuments(Array.isArray(docs) ? docs : []);
        if (!quiet) showSnackbar("Documents refreshed!", "success");
      } else {
        showSnackbar(
          response.errorMessage || "Failed to refresh documents",
          "error",
        );
      }
    } catch (err) {
      console.error("Error refreshing documents:", err);
      showSnackbar("Error refreshing documents.", "error");
    } finally {
      setListRefreshing(false);
    }
  };

  // Handle delete document
  const handleDelete = async (docID, docName) => {
    try {
      setListRefreshing(true);
      const response = await documentService.deleteDocument(docID, docName);

      if (response.isSuccess) {
        showSnackbar("Document deleted successfully!", "success");
        await refreshDocumentsList({ quiet: true });
      } else {
        setListRefreshing(false);
        showSnackbar(
          response.errorMessage || "Failed to delete document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setListRefreshing(false);
      showSnackbar(
        err?.response?.data?.message ||
          err?.response?.data?.errorMessage ||
          err?.message ||
          "Error deleting document. Please try again.",
        "error",
      );
    }
  };

  // Handle publish document
  const handlePublish = async (docID) => {
    try {
      setListRefreshing(true);
      const response = await documentService.publishDocument(docID);

      if (response.isSuccess) {
        showSnackbar("Document published successfully!", "success");
        await refreshDocumentsList({ quiet: true });
      } else {
        setListRefreshing(false);
        showSnackbar(
          response.errorMessage || "Failed to publish document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error publishing document:", err);
      setListRefreshing(false);
      showSnackbar("Error publishing document. Please try again.", "error");
    }
  };

  // Handle unpublish document
  const handleUnpublish = async (doc) => {
    try {
      setListRefreshing(true);
      const response = await documentService.unpublishDocument(
        getClassMaterialActionPayload(doc),
      );

      if (response.isSuccess) {
        showSnackbar("Document unpublished successfully!", "success");
        await refreshDocumentsList({ quiet: true });
      } else {
        setListRefreshing(false);
        showSnackbar(
          response.errorMessage || "Failed to unpublish document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error unpublishing document:", err);
      setListRefreshing(false);
      showSnackbar("Error unpublishing document. Please try again.", "error");
    }
  };

  // Handle open video
  const handleOpenVideo = (videoURL) => {
    if (videoURL) {
      documentService.openVideo(videoURL);
    } else {
      showSnackbar("No video URL available for this document.", "warning");
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
        showSnackbar("Document uploaded successfully!", "success");
        setUploadFormOpen(false);
        await refreshDocumentsList({ quiet: true });
      } else {
        showSnackbar(
          response.errorMessage || "Failed to upload document",
          "error",
        );
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showSnackbar("Error uploading document. Please try again.", "error");
    } finally {
      setUploading(false);
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

  if (!isAuthenticated || !user) {
    return <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />;
  }

  return (
    <Box className={hideRoleHeader ? "instructor-class-material" : undefined}>
      {!hideRoleHeader && <SystemAdminHeader user={user} />}
      {!hideRoleHeader && (
        <SystemAdminRoleHeaderSpacer />
      )}
      <Container
        {...(hideRoleHeader ? instructorPortalContentContainerProps : { maxWidth: "xl" })}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {hideRoleHeader ? (
              <Card sx={adminSessionListPanelCardSx}>
                <CardContent
                  sx={{
                    ...adminSessionListPanelContentSx,
                    pt: 1,
                    "&:last-child": { pb: 1.5 },
                  }}
                >
                  <InstructorClassMaterialList
                    documents={documents}
                    refreshing={listRefreshing}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onOpenVideo={handleOpenVideo}
                    onAdd={handleAdd}
                    canAddDocument={adminPrivileges.canAddDocument}
                    canDeleteDocument={adminPrivileges.canDeleteDocument}
                    canPublishDocument={adminPrivileges.canPublishDocument}
                    selectedPdf={selectedPdf}
                    onClosePdfViewer={handleClosePdfViewer}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card sx={adminSessionListPanelCardSx}>
                <CardContent
                  sx={{
                    ...adminSessionListPanelContentSx,
                    pt: 1,
                    "&:last-child": { pb: 1.5 },
                  }}
                >
                  <SystemAdminDocumentList
                    documents={documents}
                    refreshing={listRefreshing}
                    onView={handleView}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
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

      {!hideRoleHeader && (
        <PdfViewerModal
          open={Boolean(selectedPdf)}
          pdfUrl={selectedPdf}
          pdfName={selectedPdf}
          onClose={handleClosePdfViewer}
        />
      )}

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default Documents;
