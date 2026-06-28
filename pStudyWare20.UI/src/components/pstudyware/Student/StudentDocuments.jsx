import React, { useState, useEffect, useMemo } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Link,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import documentService, {
  getStudentDocumentDeleteId,
  getStudentDocumentName,
} from "../../../services/documentService";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import { getPortalUsername } from "../../../utils/portalUsername";
import AdminHeader, { AdminRoleHeaderSpacer } from "../Admin/AdminHeader";
import AdminStudentDocumentList from "../Admin/AdminStudentDocumentList";
import InstructorPortalPaginationBar from "../Instructor/InstructorPortalPaginationBar";
import {
  instructorCellBodySx,
  instructorCellBodySxLast,
  instructorCellHeaderSx,
  instructorCellHeaderSxLast,
  instructorFindButtonSx,
  instructorGreenSearchBarSx,
  instructorPageShellSx,
  instructorPageTitleSx,
  instructorSearchLabelSx,
  instructorSearchTextFieldSx,
  instructorSelectOnGreenSx,
  instructorStudentDocumentsColWidthsPx,
  instructorTableBodyRowZebraSx,
  instructorTableHeadRowSx,
  instructorTableSx,
} from "../Instructor/instructorPortalTableStyles";
import {
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTitleSx,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  APPLICATION_SURFACE_BG,
  APPLICATION_SURFACE_BORDER,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import PdfViewerModal from "../../common/PdfViewerModal";
import {
  PORTAL_MODAL_FG,
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

/** Same outer column as <InstructorManagement /> (admin portal). */
const studentDocColumnWidths = {
  actions: "16%",
  docNumber: "8%",
  description: "22%",
  type: "12%",
  documentName: "28%",
  postedDate: "14%",
};

const documentActionDividerSx = {
  fontSize: "0.75rem",
  color: "text.disabled",
  userSelect: "none",
  lineHeight: 1,
};

const adminStudentDocsPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const uploadModalFormRowSx = {
  display: "flex",
  alignItems: { xs: "stretch", sm: "center" },
  flexDirection: { xs: "column", sm: "row" },
  gap: { xs: 0.75, sm: 2 },
};

const uploadModalFormLabelSx = {
  minWidth: { sm: 120 },
  fontWeight: 700,
  fontSize: "0.875rem",
  color: PORTAL_MODAL_FG,
  flexShrink: 0,
};

function matchStudentDocField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

const getUploadDocumentFieldValue = (doc, field) => {
  switch (field) {
    case "docNumber":
      return toSortableNumber(doc.docID);
    case "description":
      return doc.description ?? "";
    case "type":
      return doc.type ?? "";
    case "documentName":
      return doc.documentName ?? "";
    case "postedDate":
      return toSortableDate(doc.insertDate);
    default:
      return "";
  }
};

/** Legacy StudentDocuments.aspx student dropdown value: instructorEmail~studentId~chapterId */
const parseStudentListValue = (value) => {
  const parts = String(value || "").split("~");
  return {
    instructorEmail: parts[0]?.trim() || "",
    studentId: parts[1]?.trim() || "",
    chapterId: (parts[2] || "").trim() || "3",
  };
};

const getUploadErrorMessage = (err, fallback) => {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }
  return data?.errorMessage || data?.message || err?.message || fallback;
};

const StudentDocuments = () => {
  const location = useLocation();
  const isInstructorDocsRoute = location.pathname.includes(
    "/pstudyware/instructor/",
  );
  const isAdminStudentDocsRoute = location.pathname.includes(
    "/pstudyware/admin/student-docs",
  );
  /** Instructor shell + admin Student Docs: grid only (legacy hides upload for I/A). */
  const useStaffDocumentsLayout =
    isInstructorDocsRoute || isAdminStudentDocsRoute;
  const allowDocumentUpload = !useStaffDocumentsLayout;
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadSubmitting, setUploadSubmitting] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    session: "",
    type: "Home Work",
    file: null,
    fileName: "",
  });

  // Search state
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 25;

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load student documents data
  useEffect(() => {
    const loadStudentDocuments = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("StudentDocuments: Fetching student documents");

        // Get student documents list
        const response = await documentService.getStudentDocuments(
          user.email || user.username
        );

        console.log("StudentDocuments: Document data response", response);

        if (response.isSuccess) {
          const docs = response.studentDocuments || [];
          setDocuments(docs);
          setFilteredDocuments(docs);
        } else {
          showMessage(
            response.errorMessage || "Failed to load student documents",
            "error"
          );
        }

        // Load student list and current session for upload
        await loadStudentsForUpload();
      } catch (err) {
        console.error("Error fetching student documents:", err);
        let errorMessage =
          "Error loading student documents. Please refresh the page.";

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

        showMessage(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    loadStudentDocuments();
  }, [isAuthenticated, user]);

  // Legacy currentSession(): AMC_spSelectCurrentSession returns the active session only
  const loadCurrentSessionForUpload = async (chapterId = "3") => {
    try {
      const response = await documentService.getCurrentSession(chapterId);
      if (response.isSuccess) {
        const sessionRows = response.sessions ?? response.Sessions ?? [];
        const currentSession =
          sessionRows[0]?.session ?? sessionRows[0]?.Session ?? "";
        setSessions(currentSession ? [{ session: currentSession }] : []);
        setUploadForm((prev) => ({
          ...prev,
          session: currentSession,
        }));
      } else {
        setSessions([]);
        setUploadForm((prev) => ({ ...prev, session: "" }));
      }
    } catch (err) {
      console.error("Error loading current session:", err);
      setSessions([]);
      setUploadForm((prev) => ({ ...prev, session: "" }));
    }
  };

  const loadStudentsForUpload = async () => {
    try {
      const response = await documentService.getStudentListForDocuments(
        getPortalUsername(user) || user.email || user.username
      );
      if (response?.isSuccess) {
        const studentList =
          response.studentList ?? response.StudentList ?? [];
        setStudents(studentList);
        if (studentList.length > 0) {
          const initial = studentList[0];
          const value = initial.value ?? initial.Value ?? "";
          setSelectedStudent(value);
          const { chapterId } = parseStudentListValue(value);
          await loadCurrentSessionForUpload(chapterId);
        } else {
          setSelectedStudent("");
          setSessions([]);
          setUploadForm((prev) => ({ ...prev, session: "" }));
        }
      } else {
        console.error(
          "Failed to load student list for upload:",
          response?.errorMessage
        );
      }
    } catch (err) {
      console.error("Error loading student list for upload:", err);
    }
  };

  const handleUploadStudentChange = async (event) => {
    const value = event.target.value;
    setSelectedStudent(value);
    const { chapterId } = parseStudentListValue(value);
    await loadCurrentSessionForUpload(chapterId);
  };

  const getSelectedStudentDetails = () => {
    const student = students.find(
      (item) => (item.value ?? item.Value) === selectedStudent
    );
    const { instructorEmail, studentId } = parseStudentListValue(selectedStudent);
    return {
      instructorEmail,
      studentId,
      studentName: student?.text ?? student?.Text ?? user?.firstName ?? "",
    };
  };

  // Handle search (ALL + field filters; criteria matches report-card / class-material)
  const handleSearch = () => {
    const q = searchText.trim();
    let filtered = [...documents];

    if (!q) {
      setFilteredDocuments(documents);
      setCurrentPage(1);
      setGoToPageInput("1");
      return;
    }

    if (searchBy === "ALL") {
      filtered = documents.filter(
        (doc) =>
          matchStudentDocField(doc.description, q, searchCriteria) ||
          matchStudentDocField(doc.type, q, searchCriteria) ||
          matchStudentDocField(doc.documentName, q, searchCriteria) ||
          matchStudentDocField(doc.docID, q, searchCriteria)
      );
    } else {
      filtered = documents.filter((doc) => {
        let fieldValue = "";
        switch (searchBy) {
          case "DESCRIPTION":
            fieldValue = doc.description || "";
            break;
          case "TYPE":
            fieldValue = doc.type || "";
            break;
          case "DOC_NAME":
            fieldValue = doc.documentName || "";
            break;
          default:
            return true;
        }
        return matchStudentDocField(fieldValue, q, searchCriteria);
      });
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  // Handle page change
  const handlePageChange = (page) => {
    const p = Number(page);
    const maxPage = Math.ceil(filteredDocuments.length / pageSize) || 1;
    if (p >= 1 && p <= maxPage) {
      setCurrentPage(p);
      setGoToPageInput(String(p));
    }
  };

  // Handle go to specific page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput);
    const totalPages = Math.ceil(filteredDocuments.length / pageSize);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortedDocuments = useMemo(
    () => sortRows(filteredDocuments, sortField, sortOrder, getUploadDocumentFieldValue),
    [filteredDocuments, sortField, sortOrder]
  );

  // Calculate pagination values
  const totalRecords = sortedDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedDocuments = sortedDocuments.slice(startIndex, endIndex);

  // Show message
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleView = (documentName) => {
    if (!documentName) {
      return;
    }
    setSelectedPdf(documentName);
  };

  const handleClosePdfViewer = () => {
    setSelectedPdf(null);
  };

  // Handle download document
  const handleDownload = async (documentName) => {
    if (!documentName) {
      return;
    }

    try {
      await documentService.downloadStudentDocument(documentName);
    } catch (err) {
      console.error("Error downloading document:", err);
      showMessage(
        err?.message || "Unable to download document. The file may be missing.",
        "error"
      );
    }
  };

  // Open delete confirmation modal
  const handleDeleteClick = (doc) => {
    const documentID = getStudentDocumentDeleteId(doc);

    if (!documentID) {
      showMessage(
        "Unable to delete this document: invalid document ID.",
        "error"
      );
      return;
    }

    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    if (deletingDocument) {
      return;
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  // Confirm delete document
  const handleDeleteConfirm = async () => {
    if (!documentToDelete) {
      return;
    }

    const documentID = getStudentDocumentDeleteId(documentToDelete);
    const documentName = getStudentDocumentName(documentToDelete);

    if (!documentID) {
      showMessage(
        "Unable to delete this document: invalid document ID.",
        "error"
      );
      handleDeleteDialogClose();
      return;
    }

    try {
      setDeletingDocument(true);
      const response = await documentService.deleteStudentDocument(
        documentID,
        documentName
      );

      if (response.isSuccess) {
        showMessage(
          response.message || "Document deleted successfully",
          "success"
        );
        setDeleteDialogOpen(false);
        setDocumentToDelete(null);
        await handleRefresh({ skipLoading: true, quiet: true });
      } else {
        showMessage(
          response.errorMessage || "Failed to delete document",
          "error"
        );
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      showMessage(getUploadErrorMessage(err, "Error deleting document"), "error");
    } finally {
      setDeletingDocument(false);
    }
  };

  // Handle upload dialog open
  const handleUploadDialogOpen = async () => {
    if (students.length > 0) {
      const initial =
        students.find((item) => (item.value ?? item.Value) === selectedStudent) ??
        students[0];
      const value = initial.value ?? initial.Value ?? "";
      if (value !== selectedStudent) {
        setSelectedStudent(value);
      }
      const { chapterId } = parseStudentListValue(value);
      await loadCurrentSessionForUpload(chapterId);
    }
    setUploadDialogOpen(true);
  };

  // Handle upload dialog close
  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setUploadForm((prev) => ({
      ...prev,
      type: "Home Work",
      file: null,
      fileName: "",
    }));
    if (students.length > 0) {
      const initial = students[0];
      const value = initial.value ?? initial.Value ?? "";
      setSelectedStudent(value);
      const { chapterId } = parseStudentListValue(value);
      loadCurrentSessionForUpload(chapterId);
    } else {
      setSelectedStudent("");
      setSessions([]);
      setUploadForm((prev) => ({ ...prev, session: "" }));
    }
  };

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        showMessage("Only PDF files are allowed", "error");
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        showMessage("File size must be less than 2MB", "error");
        return;
      }

      setUploadForm({
        ...uploadForm,
        file: file,
        fileName: file.name,
      });
    }
  };

  // Handle upload submit
  const handleUploadSubmit = async () => {
    try {
      // Validate form
      if (!uploadForm.session) {
        showMessage("Please select a session", "error");
        return;
      }
      if (!uploadForm.file) {
        showMessage("Please select a file", "error");
        return;
      }

      const { studentId, studentName, instructorEmail } =
        getSelectedStudentDetails();
      if (!studentId) {
        showMessage(
          "Unable to determine your student ID. Please refresh the page or contact support.",
          "error"
        );
        return;
      }

      setUploadSubmitting(true);

      // Base64 matches API JSON binding for byte[] (same as admin document uploads)
      const fileContent = await documentService.fileToBase64(uploadForm.file);

      // Prepare request (matches UploadDocumentRequest / legacy AMC_spAddStudentDocument)
      const request = {
        StudentID: studentId,
        StudentName: studentName,
        Session: uploadForm.session,
        Type: uploadForm.type,
        FileName: uploadForm.fileName,
        FileContent: fileContent,
        Username: getPortalUsername(user) || user.email || user.username,
      };

      // Upload document
      const response = await documentService.addStudentDocument(request);

      if (response.isSuccess) {
        showMessage(
          response.message || "Document uploaded successfully",
          "success"
        );

        // Send message to instructor
        const messageData = {
          SendTo: instructorEmail || user.instructorEmail || "",
          SendFrom: user.email || user.username,
          Subject: `You have received the new Documents from ${user.firstName} ${user.lastName}`,
          Message: `Hello Professor,<br/>I have uploaded my ${uploadForm.type} Answer Sheet.<br/>Name: ${studentName || `${user.firstName} ${user.lastName}`}<br/>Type: ${uploadForm.type}<br/>Document Name: ${uploadForm.fileName}<br/>Description: ${uploadForm.session}<br/><br/>Regards<br/><b>${user.firstName} ${user.lastName}</b>`,
          SendBy: studentId,
        };

        try {
          await documentService.updateMessageCenter(messageData);
        } catch (msgErr) {
          console.error("Error sending message:", msgErr);
        }

        handleUploadDialogClose();

        await handleRefresh({ skipLoading: true, quiet: true });
      } else {
        showMessage(
          response.errorMessage || "Failed to upload document",
          "error"
        );
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showMessage(getUploadErrorMessage(err, "Error uploading document"), "error");
    } finally {
      setUploadSubmitting(false);
    }
  };

  // Handle refresh (skipLoading: instructor portal — no full-page spinner)
  const handleRefresh = async (options = {}) => {
    const { skipLoading = false, quiet = false } = options;
    try {
      if (!skipLoading) setLoading(true);
      const response = await documentService.getStudentDocuments(
        user.email || user.username
      );

      if (response.isSuccess) {
        const docs = response.studentDocuments || [];
        setDocuments(docs);
        setFilteredDocuments(docs);
        setCurrentPage(1);
        setGoToPageInput("1");
        if (!quiet) showMessage("Documents refreshed successfully", "success");
      } else {
        showMessage(
          response.errorMessage || "Failed to refresh documents",
          "error"
        );
      }
    } catch (err) {
      console.error("Error refreshing documents:", err);
      showMessage("Error refreshing documents", "error");
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const renderUploadedDocumentActions = (doc) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      <Box
        onClick={() => handleView(doc.documentName)}
        sx={adminSessionListTableActionLinkSx}
      >
        View/Print
      </Box>
      <Typography component="span" sx={documentActionDividerSx}>
        |
      </Typography>
      <Box
        onClick={() => handleDownload(doc.documentName)}
        sx={adminSessionListTableActionLinkSx}
      >
        Download
      </Box>
      <Typography component="span" sx={documentActionDividerSx}>
        |
      </Typography>
      <Box
        onClick={() => !deletingDocument && handleDeleteClick(doc)}
        sx={{
          ...adminSessionListTableDeleteLinkSx,
          opacity: deletingDocument ? 0.5 : 1,
          pointerEvents: deletingDocument ? "none" : "auto",
        }}
      >
        Delete
      </Box>
    </Box>
  );

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
          Loading Student Documents...
        </Typography>
      </Box>
    );
  }

  const staffDocumentsPanel = (
                <Box>
                  <Box
                    sx={{
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={instructorPageTitleSx}>
                        Student Documents List
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        View and manage student-uploaded documents (legacy
                        StudentDocuments.aspx).
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={() =>
                          handleRefresh({ skipLoading: true, quiet: true })
                        }
                        sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                      >
                        Refresh
                      </Button>
                      {allowDocumentUpload && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<UploadIcon fontSize="inherit" />}
                          onClick={handleUploadDialogOpen}
                          sx={portalHeaderActionButtonSx}
                        >
                          Upload Documents
                        </Button>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ ...instructorGreenSearchBarSx, mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={instructorSearchLabelSx}>Search By:</Typography>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        size="small"
                        sx={{ ...instructorSelectOnGreenSx, minWidth: 120 }}
                      >
                        <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
                          -ALL-
                        </MenuItem>
                        <MenuItem
                          value="DESCRIPTION"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Description
                        </MenuItem>
                        <MenuItem value="TYPE" sx={{ fontSize: "0.75rem" }}>
                          Type
                        </MenuItem>
                        <MenuItem value="DOC_NAME" sx={{ fontSize: "0.75rem" }}>
                          Document Name
                        </MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={instructorSearchLabelSx}>Criteria:</Typography>
                      <Select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        size="small"
                        sx={{ ...instructorSelectOnGreenSx, minWidth: 100 }}
                      >
                        <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
                          Equals
                        </MenuItem>
                        <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
                          Contains
                        </MenuItem>
                        <MenuItem
                          value="starts_with"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Starts With
                        </MenuItem>
                      </Select>
                    </Box>
                    <TextField
                      size="small"
                      placeholder="Search Text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      sx={instructorSearchTextFieldSx}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={instructorFindButtonSx}
                    >
                      Find
                    </Button>
                  </Box>

                  <TableContainer
                    component={Paper}
                    sx={{
                      width: "100%",
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    <Table size="small" sx={{ ...instructorTableSx, minWidth: 720 }}>
                      <colgroup>
                        {instructorStudentDocumentsColWidthsPx.map((w, i) => (
                          <col
                            key={i}
                            style={w == null ? undefined : { width: w }}
                          />
                        ))}
                      </colgroup>
                      <TableHead>
                        <TableRow sx={instructorTableHeadRowSx}>
                          <SortableHeader label="Doc #" field="docNumber" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={instructorCellHeaderSx} />
                          <SortableHeader label="Description" field="description" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={instructorCellHeaderSx} />
                          <SortableHeader label="Type" field="type" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={instructorCellHeaderSx} />
                          <SortableHeader label="Document Name" field="documentName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={instructorCellHeaderSx} />
                          <SortableHeader label="Posted Date" field="postedDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={instructorCellHeaderSx} />
                          <TableCell
                            sx={instructorCellHeaderSxLast}
                            align="center"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {displayedDocuments.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              sx={{ fontSize: "0.75rem", py: 3 }}
                            >
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {searchText
                                  ? "No documents found matching your search."
                                  : "No documents found"}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          displayedDocuments.map((doc) => (
                            <TableRow
                              key={doc.documentID}
                              sx={instructorTableBodyRowZebraSx}
                            >
                              <TableCell sx={instructorCellBodySx}>
                                {doc.docID}
                              </TableCell>
                              <TableCell sx={instructorCellBodySx}>
                                {doc.description || "N/A"}
                              </TableCell>
                              <TableCell sx={instructorCellBodySx}>
                                {doc.type || "N/A"}
                              </TableCell>
                              <TableCell sx={instructorCellBodySx}>
                                <Tooltip title={doc.documentName}>
                                  <Typography
                                    noWrap
                                    variant="body2"
                                    sx={{ fontSize: "0.75rem", maxWidth: 220 }}
                                  >
                                    {doc.documentName || "N/A"}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell sx={instructorCellBodySx}>
                                {formatDate(doc.insertDate)}
                              </TableCell>
                              <TableCell
                                sx={instructorCellBodySxLast}
                                align="center"
                              >
                                {renderUploadedDocumentActions(doc)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <InstructorPortalPaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    goToPageInput={goToPageInput}
                    setGoToPageInput={setGoToPageInput}
                    onGoToPage={handleGoToPage}
                  />
                </Box>
  );

  return (
    <>
      {useStaffDocumentsLayout ? (
        <>
          {isAdminStudentDocsRoute ? (
            <Box sx={adminStudentDocsPageSx}>
              <AdminHeader user={user} />
              <AdminRoleHeaderSpacer />
              <Container maxWidth="xl" sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={adminSessionListPanelCardSx}>
                      <CardContent sx={adminSessionListPanelContentSx}>
                        <AdminStudentDocumentList
                          documents={documents}
                          onView={handleView}
                          onDownload={handleDownload}
                          onDelete={handleDeleteClick}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          ) : (
            <Box sx={instructorPageShellSx}>
              <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 1, sm: 2 } }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    {staffDocumentsPanel}
                  </Grid>
                </Grid>
              </Container>
            </Box>
          )}
        </>
      ) : (
        <Box className="student-dashboard">
          <StudentHeader user={user} />
          <StudentRoleHeaderSpacer />
          <Container maxWidth="xl" sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card sx={adminSessionListPanelCardSx}>
                  <CardContent sx={adminSessionListPanelContentSx}>
                    <Box sx={{ width: "100%" }}>
                      <Box sx={adminSessionListHeaderBarSx}>
                        <Typography
                          variant="subtitle1"
                          component="div"
                          sx={adminSessionListTitleSx}
                        >
                          My Documents List
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<UploadIcon fontSize="inherit" />}
                            onClick={handleUploadDialogOpen}
                            sx={portalHeaderActionButtonSx}
                          >
                            Upload Documents
                          </Button>
                        </Box>
                      </Box>

                      <Box sx={adminSessionListSearchBarSx}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={adminSessionListSearchLabelSx}>
                            Search By:
                          </Typography>
                          <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            size="small"
                            sx={adminSessionListSearchSelectSx}
                          >
                            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                              -ALL-
                            </MenuItem>
                            <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
                              Description
                            </MenuItem>
                            <MenuItem value="TYPE" sx={adminSessionListMenuItemSx}>
                              Type
                            </MenuItem>
                            <MenuItem value="DOC_NAME" sx={adminSessionListMenuItemSx}>
                              Document Name
                            </MenuItem>
                          </Select>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={adminSessionListSearchLabelSx}>
                            Criteria:
                          </Typography>
                          <Select
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            size="small"
                            sx={adminSessionListSearchSelectSx}
                          >
                            <MenuItem value="" sx={adminSessionListMenuItemSx}>
                              Select Criteria
                            </MenuItem>
                            <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
                              Equals
                            </MenuItem>
                            <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
                              Contains
                            </MenuItem>
                            <MenuItem value="starts_with" sx={adminSessionListMenuItemSx}>
                              Starts With
                            </MenuItem>
                          </Select>
                        </Box>

                        <TextField
                          size="small"
                          placeholder="Search Text"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          sx={adminSessionListSearchFieldSx}
                        />

                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSearch}
                          sx={adminSessionListFindButtonSx}
                        >
                          Find
                        </Button>
                      </Box>

                      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
                        <Table size="small" sx={adminSessionListGridTableSx}>
                          <TableHead>
                            <TableRow sx={adminSessionListTableHeadRowSx}>
                              <SortableHeader label="Doc #" field="docNumber" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(studentDocColumnWidths.docNumber)} />
                              <SortableHeader label="Description" field="description" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(studentDocColumnWidths.description)} />
                              <SortableHeader label="Type" field="type" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(studentDocColumnWidths.type)} />
                              <SortableHeader label="Document Name" field="documentName" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(studentDocColumnWidths.documentName)} />
                              <SortableHeader label="Posted Date" field="postedDate" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} headCellSx={adminSessionListTableHeadCellSx(studentDocColumnWidths.postedDate)} />
                              <TableCell
                                sx={adminSessionListTableHeadCellSx(studentDocColumnWidths.actions, true)}
                                align="center"
                              >
                                Actions
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {displayedDocuments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    sx={adminSessionListEmptyTextSx}
                                  >
                                    {searchText
                                      ? "No documents found matching your search."
                                      : "No records to display"}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ) : (
                              displayedDocuments.map((doc) => (
                                <TableRow
                                  key={doc.documentID}
                                  sx={adminSessionListTableBodyRowSx}
                                >
                                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                                    {doc.docID ?? "—"}
                                  </TableCell>
                                  <TableCell
                                    sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                                  >
                                    <Tooltip title={doc.description || ""} disableHoverListener={!doc.description}>
                                      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {doc.description || "—"}
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell
                                    sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                                  >
                                    <Tooltip title={doc.type || ""} disableHoverListener={!doc.type}>
                                      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {doc.type || "—"}
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell
                                    sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
                                  >
                                    <Tooltip title={doc.documentName || ""} disableHoverListener={!doc.documentName}>
                                      <Box component="span" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {doc.documentName || "—"}
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                                    {formatDate(doc.insertDate)}
                                  </TableCell>
                                  <TableCell
                                    sx={adminSessionListTableBodyCellSx({ isLast: true, action: true })}
                                  >
                                    {renderUploadedDocumentActions(doc)}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <AdminSessionListPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        pageSize={pageSize}
                        goToPageInput={goToPageInput}
                        onGoToPageInputChange={setGoToPageInput}
                        onPageChange={handlePageChange}
                        onGoToPage={handleGoToPage}
                      />
                    </Box>
                  </CardContent>
                </Card>
          </Grid>
        </Grid>
      </Container>
        </Box>
      )}

      {allowDocumentUpload && (
      <PortalDialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        maxWidth="md"
        disableClose={uploadSubmitting}
        title="Upload Documents (Only PDF < 2 MB)"
        icon={<UploadIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            disabled={
              !uploadForm.file ||
              !uploadForm.session ||
              !selectedStudent ||
              !getSelectedStudentDetails().studentId ||
              uploadSubmitting
            }
            startIcon={
              uploadSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <UploadIcon />
              )
            }
            sx={portalModalSendButtonSx}
          >
            {uploadSubmitting ? "Uploading..." : "Submit"}
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              bgcolor: APPLICATION_SURFACE_BG,
              border: `1px solid ${APPLICATION_SURFACE_BORDER}`,
              borderRadius: 1,
              px: 1.5,
              py: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "error.main" }}>
              File Name must be student First Name (Example: David.PDF). Please
              upload SINGLE PDF file (less than 2 MB). File Upload only for AI
              and Data Science Class. All Math Circle, ACT and PSAT Class need
              to use the{" "}
              <Link
                component={RouterLink}
                to="/pstudyware/student/update-score"
                onClick={handleUploadDialogClose}
                sx={{
                  color: "error.main",
                  fontWeight: 600,
                  textDecorationColor: "error.main",
                }}
              >
                Update Score
              </Link>
              .
            </Typography>
          </Box>

          <Box sx={uploadModalFormRowSx}>
            <Typography sx={uploadModalFormLabelSx}>Student Name</Typography>
            <FormControl
              fullWidth
              size="small"
              sx={portalModalFieldSx}
              disabled={students.length === 0 || uploadSubmitting}
            >
              <InputLabel id="upload-student-name-label">Student Name</InputLabel>
              <PortalModalSelect
                labelId="upload-student-name-label"
                value={selectedStudent}
                onChange={handleUploadStudentChange}
                label="Student Name"
              >
                {students.length === 0 ? (
                  <MenuItem value="" disabled>
                    No students found
                  </MenuItem>
                ) : (
                  students.map((student, index) => (
                    <MenuItem
                      key={`${student.value ?? student.Value}-${index}`}
                      value={student.value ?? student.Value ?? ""}
                    >
                      {student.text ?? student.Text}
                    </MenuItem>
                  ))
                )}
              </PortalModalSelect>
            </FormControl>
          </Box>

          <Box sx={uploadModalFormRowSx}>
            <Typography sx={uploadModalFormLabelSx}>Session</Typography>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel id="upload-session-label">Session</InputLabel>
              <PortalModalSelect
                labelId="upload-session-label"
                value={uploadForm.session}
                label="Session"
                disabled={
                  uploadSubmitting ||
                  sessions.length === 0 ||
                  sessions.length === 1
                }
              >
                {sessions.length === 0 ? (
                  <MenuItem value="" disabled>
                    No current session
                  </MenuItem>
                ) : (
                  sessions.map((session, index) => (
                    <MenuItem
                      key={index}
                      value={session.session ?? session.Session ?? ""}
                    >
                      {session.session ?? session.Session}
                    </MenuItem>
                  ))
                )}
              </PortalModalSelect>
            </FormControl>
          </Box>

          <Box sx={uploadModalFormRowSx}>
            <Typography sx={uploadModalFormLabelSx}>Class</Typography>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel id="upload-class-label">Class</InputLabel>
              <PortalModalSelect
                labelId="upload-class-label"
                value={uploadForm.type}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, type: e.target.value })
                }
                label="Class"
                disabled={uploadSubmitting}
              >
                <MenuItem value="Home Work">Home Work</MenuItem>
              </PortalModalSelect>
            </FormControl>
          </Box>

          <Box sx={uploadModalFormRowSx}>
            <Typography sx={uploadModalFormLabelSx}>Select File</Typography>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="file"
                inputProps={{ accept: ".pdf" }}
                onChange={handleFileChange}
                disabled={uploadSubmitting}
                sx={portalModalFieldSx}
              />
              {uploadForm.fileName && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
                  Selected file: {uploadForm.fileName}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </PortalDialog>
      )}

      <PdfViewerModal
        open={Boolean(selectedPdf)}
        pdfUrl={selectedPdf}
        pdfName={selectedPdf}
        onClose={handleClosePdfViewer}
        apiEndpoint="/Document/ViewStudentDocument"
        downloadEndpoint="/Document/DownloadStudentDocument"
      />

      <AppConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={
          <>
            <Typography component="span" variant="body2">
              Do you want to delete this document?
            </Typography>
            {documentToDelete?.documentName && (
              <Typography
                variant="body2"
                sx={{ mt: 1, fontWeight: 600, color: "text.primary" }}
              >
                {documentToDelete.documentName}
              </Typography>
            )}
          </>
        }
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={deletingDocument}
      />

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StudentDocuments;
