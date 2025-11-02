import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  InputAdornment,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  VideoLibrary as VideoIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const DocumentList = ({
  documents,
  onRefresh,
  onView,
  onDownload,
  onDelete,
  onPublish,
  onOpenVideo,
  onAdd,
  canAddDocument,
  canDeleteDocument,
  canPublishDocument,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter documents based on search term
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return documents.filter(
      (doc) =>
        doc.topics?.toLowerCase().includes(lowerSearchTerm) ||
        doc.description?.toLowerCase().includes(lowerSearchTerm) ||
        doc.class?.toLowerCase().includes(lowerSearchTerm) ||
        doc.session?.toLowerCase().includes(lowerSearchTerm) ||
        doc.docName?.toLowerCase().includes(lowerSearchTerm)
    );
  }, [documents, searchTerm]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle delete with confirmation
  const handleDeleteClick = (docID, docName) => {
    if (
      window.confirm(
        `Are you sure you want to delete this document?\n\nDocument: ${docName}`
      )
    ) {
      onDelete(docID, docName);
    }
  };

  // Handle publish with confirmation
  const handlePublishClick = (docID, status, docName) => {
    if (status?.toUpperCase() === "Y") {
      alert("This document is already published.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to publish this document?\n\nDocument: ${docName}`
      )
    ) {
      onPublish(docID);
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

  // Get publish status chip
  const getPublishStatusChip = (status) => {
    const isPublished = status?.toUpperCase() === "Y";
    return (
      <Chip
        label={isPublished ? "Published" : "Draft"}
        size="small"
        sx={{
          fontWeight: 500,
          fontSize: "0.75rem",
          backgroundColor: isPublished ? "#4caf50" : "#ffc107",
          color: "white",
        }}
      />
    );
  };

  // Get class label
  const getClassLabel = (classCode) => {
    const classMap = {
      JB: "Junior Beginner",
      JI: "Junior Intermediate",
      JA: "Junior Advanced",
      SB: "Senior Beginner",
      SI: "Senior Intermediate",
      SA: "Senior Advanced",
      DS: "Data Science",
      AI: "Artificial Intelligence",
      GD: "Game Development",
      AD: "App Development",
      DM: "Data Management",
      ST: "PSAT/SAT",
      AT: "ACT",
    };
    return classMap[classCode] || classCode;
  };

  // Paginated documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredDocuments.slice(startIndex, endIndex);
  }, [filteredDocuments, page, rowsPerPage]);

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          backgroundColor: "#4caf50",
          padding: "12px 16px",
          borderRadius: "4px 4px 0 0",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "white", fontSize: "1rem" }}
          >
            Class Material Management
          </Typography>
          <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem" }}>
            Watch Lecture Notes Video on{" "}
            <a
              href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ffeb3b", fontWeight: 500, textDecoration: "underline" }}
            >
              Agoura Math Circle YouTube Channel
            </a>
            <br />
            Note: Subscription is required for all students. Please subscribe,
            it will help us upload more videos.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Refresh list">
            <IconButton onClick={onRefresh} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {canAddDocument && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                px: 3,
                backgroundColor: "white",
                color: "#4caf50",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Upload Document
            </Button>
          )}
        </Box>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by topics, description, class, session, or document name..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ tableLayout: "auto" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Doc #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Topics
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Document Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Session
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #4caf50",
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Posted Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: "8px 12px",
                }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 4, fontSize: "0.875rem" }}
                >
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm
                      ? "No documents found matching your search."
                      : "No documents available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocuments.map((doc, index) => {
                const isPublished = doc.publish?.toUpperCase() === "Y";
                const rowStyle = !isPublished
                  ? { backgroundColor: "#fff9c4" }
                  : {};

                return (
                  <TableRow key={doc.docID || index} sx={rowStyle} hover>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onView(doc.docName)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onDownload(doc.docName)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {doc.videoURL && (
                          <Tooltip title="Watch Video">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => onOpenVideo(doc.videoURL)}
                            >
                              <VideoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canPublishDocument && !isPublished && (
                          <Tooltip title="Publish">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handlePublishClick(
                                  doc.docID,
                                  doc.publish,
                                  doc.docName
                                )
                              }
                            >
                              <PublishIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canDeleteDocument && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() =>
                                handleDeleteClick(doc.docID, doc.docName)
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {doc.docID}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      <Tooltip title={getClassLabel(doc.class)}>
                        <Chip
                          label={doc.class}
                          size="small"
                          sx={{
                            backgroundColor: "#4caf50",
                            color: "white",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {doc.topics || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {doc.description || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      <Tooltip title={doc.docName}>
                        <span>{doc.docName || "N/A"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {doc.session || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }}
                    >
                      {getPublishStatusChip(doc.publish)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Section */}
      <TablePagination
        component="div"
        count={filteredDocuments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        sx={{ borderTop: "1px solid #e0e0e0" }}
      />

      {/* Summary Section */}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="textSecondary">
          Total Documents: {filteredDocuments.length}
          {searchTerm && ` (filtered from ${documents.length})`}
        </Typography>
      </Box>
    </Box>
  );
};

export default DocumentList;
