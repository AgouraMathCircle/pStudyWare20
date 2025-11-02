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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import documentService from "../../../services/documentService";
import StudentHeader from "./StudentHeader";

const StudentDocuments = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    session: "",
    type: "Home Work",
    file: null,
    fileName: "",
  });

  // Search state
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const pageSize = 10;

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

        // Load sessions
        await loadSessions();
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

  // Load sessions
  const loadSessions = async () => {
    try {
      const response = await documentService.getScheduleLookup(
        user.email || user.username
      );
      if (response.isSuccess) {
        setSessions(response.sessions || []);
      }
    } catch (err) {
      console.error("Error loading sessions:", err);
    }
  };

  // Handle search
  const handleSearch = () => {
    let filtered = [...documents];

    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = filtered.filter((doc) => {
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

        fieldValue = fieldValue.toString().toLowerCase();
        const search = searchText.toLowerCase();

        switch (searchCriteria) {
          case "equals":
            return fieldValue === search;
          case "contains":
            return fieldValue.includes(search);
          case "starts_with":
            return fieldValue.startsWith(search);
          default:
            return fieldValue.includes(search);
        }
      });
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= Math.ceil(filteredDocuments.length / pageSize)) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
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

  // Calculate pagination values
  const totalRecords = filteredDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedDocuments = filteredDocuments.slice(startIndex, endIndex);

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

  // Handle view document
  const handleView = (documentName) => {
    if (documentName) {
      documentService.viewStudentDocument(documentName);
    }
  };

  // Handle download document
  const handleDownload = (documentName) => {
    if (documentName) {
      documentService.downloadStudentDocument(documentName);
    }
  };

  // Handle delete document
  const handleDelete = async (documentID, documentName) => {
    if (!window.confirm("Do you want to delete this document?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await documentService.deleteStudentDocument(
        documentID.toString(),
        documentName
      );

      if (response.isSuccess) {
        showMessage(
          response.message || "Document deleted successfully",
          "success"
        );
        // Reload documents
        const documentsResponse = await documentService.getStudentDocuments(
          user.email || user.username
        );
        if (documentsResponse.isSuccess) {
          const docs = documentsResponse.studentDocuments || [];
          setDocuments(docs);
          setFilteredDocuments(docs);
        }
      } else {
        showMessage(
          response.errorMessage || "Failed to delete document",
          "error"
        );
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      showMessage(
        err.response?.data?.message || "Error deleting document",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle upload dialog open
  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  // Handle upload dialog close
  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setUploadForm({
      session: "",
      type: "Home Work",
      file: null,
      fileName: "",
    });
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

      setLoading(true);

      // Convert file to byte array
      const byteArray = await documentService.fileToByteArray(uploadForm.file);

      // Get student ID from user object
      const studentID = user.studentID || user.memberId || "";

      // Prepare request
      const request = {
        StudentID: studentID,
        Session: uploadForm.session,
        Type: uploadForm.type,
        FileName: uploadForm.fileName,
        FileContent: byteArray,
        Username: user.email || user.username,
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
          SendTo: user.instructorEmail || "",
          SendFrom: user.email || user.username,
          Subject: `You have received the new Documents from ${user.firstName} ${user.lastName}`,
          Message: `Hello Professor,<br/>I have uploaded my ${uploadForm.type} Answer Sheet.<br/>Name: ${user.firstName} ${user.lastName}<br/>Type: ${uploadForm.type}<br/>Document Name: ${uploadForm.fileName}<br/>Description: ${uploadForm.session}<br/><br/>Regards<br/><b>${user.firstName} ${user.lastName}</b>`,
          SendBy: studentID,
        };

        try {
          await documentService.updateMessageCenter(messageData);
        } catch (msgErr) {
          console.error("Error sending message:", msgErr);
        }

        handleUploadDialogClose();

        // Reload documents
        const documentsResponse = await documentService.getStudentDocuments(
          user.email || user.username
        );
        if (documentsResponse.isSuccess) {
          const docs = documentsResponse.studentDocuments || [];
          setDocuments(docs);
          setFilteredDocuments(docs);
        }
      } else {
        showMessage(
          response.errorMessage || "Failed to upload document",
          "error"
        );
      }
    } catch (err) {
      console.error("Error uploading document:", err);
      showMessage(
        err.response?.data?.message || "Error uploading document",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await documentService.getStudentDocuments(
        user.email || user.username
      );

      if (response.isSuccess) {
        const docs = response.studentDocuments || [];
        setDocuments(docs);
        setFilteredDocuments(docs);
        setCurrentPage(1);
        setGoToPageInput("1");
        showMessage("Documents refreshed successfully", "success");
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
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
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

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      {/* Spacer to account for fixed StudentHeader */}
      <Box sx={{ height: "80px" }} />
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
                {/* Title Section with gray background */}
                <Box sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#4caf50",
                        fontSize: "1.1rem",
                      }}
                    >
                      My Documents List
                    </Typography>
                    <Box>
                      <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleUploadDialogOpen}
                        sx={{
                          mr: 1,
                          backgroundColor: "#4caf50",
                          fontSize: "0.875rem",
                          textTransform: "none",
                          px: 2,
                          py: 0.75,
                          "&:hover": { backgroundColor: "#45a049" },
                        }}
                      >
                        Upload Documents
                      </Button>
                      <Tooltip title="Refresh">
                        <IconButton
                          onClick={handleRefresh}
                          sx={{ color: "#4caf50", padding: "6px" }}
                        >
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>

                {/* Green Search Bar */}
                <Box
                  sx={{
                    backgroundColor: "#4caf50",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Search By:
                    </Typography>
                    <Select
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                      size="small"
                      sx={{
                        color: "white",
                        fontSize: "0.75rem",
                        minWidth: 120,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
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
                    <Typography
                      sx={{
                        color: "white",
                        fontSize: "0.75rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Criteria:
                    </Typography>
                    <Select
                      value={searchCriteria}
                      onChange={(e) => setSearchCriteria(e.target.value)}
                      size="small"
                      sx={{
                        color: "white",
                        fontSize: "0.75rem",
                        minWidth: 100,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
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
                    sx={{
                      minWidth: 150,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        fontSize: "0.75rem",
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSearch}
                    sx={{
                      backgroundColor: "white",
                      color: "#4caf50",
                      fontSize: "0.75rem",
                      textTransform: "none",
                      px: 1.5,
                      py: 0.25,
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    Find
                  </Button>
                </Box>

                {/* Documents Table */}
                <TableContainer sx={{ width: "100%" }}>
                  <Table sx={{ width: "100%", tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #4caf50",
                            width: "8%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
                        >
                          Doc #
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #4caf50",
                            width: "20%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #4caf50",
                            width: "12%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
                        >
                          Type
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #4caf50",
                            width: "25%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
                        >
                          Document Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            borderRight: "1px solid #4caf50",
                            width: "15%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
                        >
                          Posted Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            width: "20%",
                            fontSize: "0.75rem",
                            padding: "2px 3px",
                          }}
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
                            sx={{ padding: "20px" }}
                          >
                            <Typography variant="body1" color="textSecondary">
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
                            sx={{
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#f9f9f9",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                              }}
                            >
                              {doc.docID}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                              }}
                            >
                              {doc.description || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                              }}
                            >
                              {doc.type || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={doc.documentName}>
                                <span>{doc.documentName || "N/A"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                              }}
                            >
                              {formatDate(doc.insertDate)}
                            </TableCell>
                            <TableCell
                              sx={{
                                fontSize: "0.75rem",
                                padding: "3px 4px",
                              }}
                              align="center"
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 0.5,
                                  justifyContent: "center",
                                }}
                              >
                                <Tooltip title="View/Print">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleView(doc.documentName)}
                                    sx={{ color: "#4caf50", padding: "1px" }}
                                  >
                                    <ViewIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDownload(doc.documentName)
                                    }
                                    sx={{ color: "#2196f3", padding: "1px" }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDelete(
                                        doc.documentID,
                                        doc.documentName
                                      )
                                    }
                                    sx={{ color: "#f44336", padding: "1px" }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Green Pagination Bar */}
                <Box
                  sx={{
                    backgroundColor: "#4caf50",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                  >
                    <IconButton
                      size="small"
                      sx={{ color: "white", padding: "2px" }}
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <FirstPageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "white", padding: "2px" }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <PrevPageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "white", padding: "2px" }}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <NextPageIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ color: "white", padding: "2px" }}
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <LastPageIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                  >
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      GoTo
                    </Typography>
                    <Select
                      size="small"
                      value={currentPage}
                      onChange={(e) => handlePageChange(e.target.value)}
                      sx={{
                        color: "white",
                        minWidth: 50,
                        fontSize: "0.75rem",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "white",
                        },
                        "& .MuiSelect-icon": { color: "white" },
                      }}
                    >
                      {Array.from(
                        { length: totalPages || 1 },
                        (_, i) => i + 1
                      ).map((page) => (
                        <MenuItem
                          key={page}
                          value={page}
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {page}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                    Page(s): {currentPage} of {totalPages || 1}
                  </Typography>

                  <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                    Record(s):{" "}
                    {totalRecords > 0
                      ? `${startIndex + 1} - ${Math.min(
                          endIndex,
                          totalRecords
                        )}`
                      : "0"}{" "}
                    of {totalRecords}
                  </Typography>

                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                  >
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      Go to Page Number:
                    </Typography>
                    <TextField
                      size="small"
                      type="number"
                      value={goToPageInput}
                      onChange={(e) => setGoToPageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleGoToPage();
                        }
                      }}
                      sx={{
                        width: 50,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.75rem",
                        },
                      }}
                      inputProps={{ min: 1, max: totalPages || 1 }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleGoToPage}
                      sx={{
                        backgroundColor: "white",
                        color: "#4caf50",
                        fontSize: "0.75rem",
                        px: 1,
                        py: 0.25,
                        minWidth: "auto",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      Go
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={handleUploadDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              * File Name must be your First Name (Example: David.PDF). Please
              upload SINGLE PDF file (less than 2 MB). File Upload only for AI
              and Data Science Class.
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Session</InputLabel>
              <Select
                value={uploadForm.session}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, session: e.target.value })
                }
                label="Session"
              >
                {sessions.map((session, index) => (
                  <MenuItem key={index} value={session.session}>
                    {session.session}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={uploadForm.type}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, type: e.target.value })
                }
                label="Type"
              >
                <MenuItem value="Home Work">Home Work</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="file"
              inputProps={{ accept: ".pdf" }}
              onChange={handleFileChange}
              helperText="Only PDF files less than 2MB"
              sx={{ mb: 2 }}
            />

            {uploadForm.fileName && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {uploadForm.fileName}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            color="primary"
            disabled={!uploadForm.file || !uploadForm.session}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default StudentDocuments;
