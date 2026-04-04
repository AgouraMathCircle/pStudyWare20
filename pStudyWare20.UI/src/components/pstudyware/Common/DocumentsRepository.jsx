import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Container,
  Grid,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "../Admin/AdminHeader";
import documentService from "../../../services/documentService";
import PdfViewer from "../../common/PdfViewer";

const DocumentsRepository = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    topics: "",
    file: null,
    description: "Quiz",
    session: "Fall Session 1",
    class: "Junior Beginner",
    publish: "0",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const pageSize = 10;
  const memberType = user?.memberType?.toUpperCase() || "";
  const isStudent = memberType === "S";
  const username = user?.email || user?.username || "";

  // Load documents on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDocuments();
    }
  }, [isAuthenticated, user]);

  // Apply search filter
  useEffect(() => {
    handleSearch();
  }, [documents, searchBy, searchCriteria, searchText]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocumentsRepository(username);

      if (response?.isSuccess && response?.documents) {
        setDocuments(response.documents);
      } else {
        showMessage(
          response?.errorMessage || "Failed to load documents",
          "error",
        );
      }
    } catch (error) {
      console.error("Error loading documents:", error);
      showMessage("Error loading documents. Please refresh the page.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...documents];

    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = filtered.filter((doc) => {
        let fieldValue = "";

        switch (searchBy) {
          case "CLASS":
            fieldValue = doc.class || "";
            break;
          case "TOPICS":
            fieldValue = doc.topics || "";
            break;
          case "DESCRIPTION":
            fieldValue = doc.description || "";
            break;
          case "SESSION":
            fieldValue = doc.session || "";
            break;
          case "DOC_NAME":
            fieldValue = doc.docName || "";
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

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(filteredDocuments.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput);
    const totalPages = Math.ceil(filteredDocuments.length / pageSize);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const handleView = (docName) => {
    if (docName) {
      const url = `AMC_Docs/${docName}`;
      window.open(url, "_blank");
    }
  };

  const handleDeleteClick = (docID, docName) => {
    if (!docID || docID === 0) {
      showMessage(
        "You cannot delete this document. Document has been posted already.",
        "error",
      );
      return;
    }
    setDocumentToDelete({ docID, docName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      const response = await documentService.deleteDocument(
        documentToDelete.docID.toString(),
        documentToDelete.docName,
      );

      if (response?.isSuccess) {
        showMessage("Document deleted successfully", "success");
        await loadDocuments();
      } else {
        showMessage(
          response?.errorMessage || "Failed to delete document",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      showMessage("Error deleting document. Please try again.", "error");
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleUploadFormChange = (field, value) => {
    setUploadForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validExtensions = [".doc", ".docx", ".xls", ".xlsx", ".ppt"];
      const fileName = file.name.toLowerCase();
      const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

      if (!isValid) {
        showMessage(
          "Sorry, we can accept only Word, Excel and PowerPoint files.",
          "error",
        );
        event.target.value = "";
        return;
      }

      setUploadForm((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.file) {
      showMessage("Please select a file to upload", "error");
      return;
    }

    try {
      // Convert file to base64
      const base64File = await documentService.fileToBase64(uploadForm.file);

      const uploadData = {
        Topics: uploadForm.topics,
        DocName: uploadForm.file.name,
        Description: uploadForm.description,
        Class: uploadForm.class,
        Session: uploadForm.session,
        Publish: uploadForm.publish,
        DocType: "W",
        FileContent: base64File,
      };

      const response = await documentService.uploadDocument(uploadData);

      if (response?.isSuccess) {
        showMessage("Document uploaded successfully", "success");
        setShowUploadForm(false);
        setUploadForm({
          topics: "",
          file: null,
          description: "Quiz",
          session: "Fall Session 1",
          class: "Junior Beginner",
          publish: "0",
        });
        await loadDocuments();
      } else {
        showMessage(
          response?.errorMessage || "Failed to upload document",
          "error",
        );
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      showMessage("Error uploading document. Please try again.", "error");
    }
  };

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
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate pagination
  const totalRecords = filteredDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const displayedData = filteredDocuments.slice(startIndex, endIndex);

  const cellPadding = "0 8px";

  return (
    <Box>
      <AdminHeader user={user} />
      <Box sx={{ height: "50px" }} />

      {!isAuthenticated || !user ? (
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
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Container maxWidth="xl" sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box>
                {/* Header: title + buttons */}
                <Box sx={{ height: "18px" }} />
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
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#4caf50", mb: 1 }}
                  >
                    Documents List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={loadDocuments}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Refresh
                    </Button>
                    {!isStudent && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<UploadIcon />}
                        onClick={() => setShowUploadForm(true)}
                        sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                      >
                        Upload Documents
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Search Bar */}
                <Box
                  sx={{
                    backgroundColor: "#4caf50",
                    p: 0.5,
                    borderRadius: 1,
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
                        Select Column
                      </MenuItem>
                      <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
                        Class
                      </MenuItem>
                      <MenuItem value="TOPICS" sx={{ fontSize: "0.75rem" }}>
                        Topics
                      </MenuItem>
                      <MenuItem
                        value="DESCRIPTION"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Description
                      </MenuItem>
                      <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
                        Session
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
                      minHeight: 32,
                      py: 0,
                      px: 1,
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    Find
                  </Button>
                </Box>

                {/* Table */}
                <TableContainer component={Paper} sx={{ width: "100%" }}>
                  <Table
                    sx={{
                      width: "100%",
                      tableLayout: "fixed",
                      "& .MuiTableCell-root": {
                        paddingTop: 0,
                        paddingBottom: 0,
                      },
                    }}
                    size="small"
                  >
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "5%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          View
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "5%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Delete
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "6%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Doc #
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "8%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Class
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "12%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Topics
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "10%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "18%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            borderRight: "1px solid #4caf50",
                            width: "12%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Session
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 400,
                            width: "8%",
                            fontSize: "0.75rem",
                            padding: cellPadding,
                          }}
                        >
                          Posted Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            align="center"
                            sx={{
                              fontSize: "0.75rem",
                              padding: cellPadding,
                              py: 3,
                            }}
                          >
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              sx={{ fontSize: "0.75rem" }}
                            >
                              {searchText
                                ? "No documents found matching your search."
                                : "No documents available."}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        displayedData.map((doc, index) => (
                          <TableRow
                            key={doc.docID || index}
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
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
                            >
                              <Tooltip title="View/Print">
                                <IconButton
                                  size="small"
                                  onClick={() => handleView(doc.docName)}
                                  sx={{ padding: "2px" }}
                                >
                                  <ViewIcon sx={{ fontSize: "1rem" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                verticalAlign: "middle",
                              }}
                            >
                              {!isStudent ? (
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleDeleteClick(
                                        doc.docID || doc.documentID,
                                        doc.docName,
                                      )
                                    }
                                    sx={{ padding: "2px" }}
                                  >
                                    <DeleteIcon sx={{ fontSize: "1rem" }} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                "–"
                              )}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              {doc.docID || doc.mDocID || "N/A"}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={doc.class ?? "-"}>
                                <span>{doc.class ?? "-"}</span>
                              </Tooltip>
                            </TableCell>
                            {/* <TableCell
                            sx={{
                              borderRight: "1px solid #4caf50",
                              fontSize: "0.75rem",
                              padding: cellPadding,
                            }}
                          >
                            <Chip
                              label={doc.class || "N/A"}
                              size="small"
                              sx={{
                                backgroundColor: "#4caf50",
                                color: "white",
                                fontSize: "0.7rem",
                              }}
                            />
                          </TableCell> */}
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={doc.topics || "N/A"}>
                                <span>{doc.topics || "N/A"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip title={doc.description || "N/A"}>
                                <span>{doc.description || "N/A"}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip
                                title={doc.docName || doc.mDocName || "N/A"}
                              >
                                <span>
                                  {doc.docName || doc.mDocName || "N/A"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{
                                borderRight: "1px solid #4caf50",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <Tooltip
                                title={doc.session || doc.mSession || "N/A"}
                              >
                                <span>
                                  {doc.session || doc.mSession || "N/A"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            <TableCell
                              sx={{ fontSize: "0.75rem", padding: cellPadding }}
                            >
                              {formatDate(doc.uploadedDate || doc.insertDate)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination Bar */}
                <Box
                  sx={{
                    backgroundColor: "#4caf50",
                    p: 0.5,
                    borderRadius: 1,
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
                  <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                    Page(s): {currentPage} of {totalPages}
                  </Typography>
                  <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                    Record(s):{" "}
                    {totalRecords > 0
                      ? `${startIndex + 1} - ${Math.min(endIndex, totalRecords)}`
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
                        if (e.key === "Enter") handleGoToPage();
                      }}
                      sx={{
                        width: 50,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.75rem",
                        },
                      }}
                      inputProps={{ min: 1, max: totalPages }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={handleGoToPage}
                      sx={{
                        backgroundColor: "white",
                        color: "#4caf50",
                        fontSize: "0.75rem",
                        minHeight: 32,
                        py: 0,
                        px: 0.75,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      Go
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      )}

      {/* Upload Form Dialog */}
      <Dialog
        open={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Class Material (Only Word/Excel Documents)
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Topics"
              value={uploadForm.topics}
              onChange={(e) => handleUploadFormChange("topics", e.target.value)}
              fullWidth
              inputProps={{ maxLength: 100 }}
            />

            <FormControl fullWidth>
              <InputLabel>Select File</InputLabel>
              <input
                type="file"
                accept=".doc,.docx,.xls,.xlsx,.ppt"
                onChange={handleFileChange}
                style={{ marginTop: "8px" }}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Description</InputLabel>
              <Select
                value={uploadForm.description}
                onChange={(e) =>
                  handleUploadFormChange("description", e.target.value)
                }
              >
                <MenuItem value="Quiz">Quiz</MenuItem>
                <MenuItem value="Quiz Solution">Quiz Solution</MenuItem>
                <MenuItem value="Lecture Notes">Lecture Notes</MenuItem>
                <MenuItem value="Class Work">Class Work</MenuItem>
                <MenuItem value="Class Work Solution">
                  Class Work Solution
                </MenuItem>
                <MenuItem value="Home Work">Home Work</MenuItem>
                <MenuItem value="Home Work Solution">
                  Home Work Solution
                </MenuItem>
                <MenuItem value="Answer Key">Answer Key</MenuItem>
                <MenuItem value="Placement Test">Placement Test</MenuItem>
                <MenuItem value="AMC 8 PreTest">AMC 8 PreTest</MenuItem>
                <MenuItem value="Math Kangaroo PreTest">
                  Math Kangaroo PreTest
                </MenuItem>
                <MenuItem value="Math Count PreTest">
                  Math Count PreTest
                </MenuItem>
                <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                <MenuItem value="Final Exam">Final Exam</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Session</InputLabel>
              <Select
                value={uploadForm.session}
                onChange={(e) =>
                  handleUploadFormChange("session", e.target.value)
                }
              >
                {[
                  "Fall Session 1",
                  "Fall Session 2",
                  "Fall Session 3",
                  "Fall Session 4",
                  "Fall Session 5",
                  "Fall Session 6",
                  "Fall Session 7",
                  "Fall Session 8",
                  "Fall Session 9",
                  "Spring Session 1",
                  "Spring Session 2",
                  "Spring Session 3",
                  "Spring Session 4",
                  "Spring Session 5",
                  "Spring Session 6",
                  "Spring Session 7",
                  "Spring Session 8",
                  "Spring Session 9",
                  "Spring Session 10",
                  "Miscellanous",
                ].map((session) => (
                  <MenuItem key={session} value={session}>
                    {session}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                value={uploadForm.class}
                onChange={(e) =>
                  handleUploadFormChange("class", e.target.value)
                }
              >
                <MenuItem value="Junior Beginner">Junior Beginner</MenuItem>
                <MenuItem value="Junior Intermediate">
                  Junior Intermediate
                </MenuItem>
                <MenuItem value="Junior Advanced">Junior Advanced</MenuItem>
                <MenuItem value="Senior Beginner">Senior Beginner</MenuItem>
                <MenuItem value="Senior Intermediate">
                  Senior Intermediate
                </MenuItem>
                <MenuItem value="Senior Advanced">Senior Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Publish</InputLabel>
              <Select
                value={uploadForm.publish}
                onChange={(e) =>
                  handleUploadFormChange("publish", e.target.value)
                }
              >
                <MenuItem value="0">No</MenuItem>
                <MenuItem value="1">Yes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadForm(false)}>Cancel</Button>
          <Button
            onClick={handleUploadSubmit}
            variant="contained"
            sx={{ backgroundColor: "#4caf50" }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to delete this document? ({documentToDelete?.docName})
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentsRepository;
