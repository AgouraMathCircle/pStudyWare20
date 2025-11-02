import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  VideoLibrary as VideoIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const AdminDocumentList = ({
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
  const [orderBy, setOrderBy] = useState("uploadedDate");
  const [order, setOrder] = useState("desc");
  const [searchText, setSearchText] = useState("");

  // Handle sort
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter documents based on search
  const filteredDocuments = documents.filter((doc) => {
    if (!searchText) return true;
    const search = searchText.toLowerCase();
    return (
      doc.topics?.toLowerCase().includes(search) ||
      doc.docName?.toLowerCase().includes(search) ||
      doc.description?.toLowerCase().includes(search) ||
      doc.class?.toLowerCase().includes(search) ||
      doc.session?.toLowerCase().includes(search)
    );
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Handle delete with confirmation
  const handleDeleteClick = (doc) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${doc.docName}"?`
    );
    if (confirmed) {
      onDelete(doc.docID, doc.docName);
    }
  };

  // Handle publish with confirmation
  const handlePublishClick = (doc) => {
    if (doc.publish?.toUpperCase() === "Y") {
      alert("This document is already published.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to publish "${doc.docName}"?`
    );
    if (confirmed) {
      onPublish(doc.docID);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  // Get publish status
  const getPublishStatus = (doc) => {
    const isPublished = doc.publish?.toUpperCase() === "Y";
    return (
      <Chip
        label={isPublished ? "Published" : "Unpublished"}
        color={isPublished ? "success" : "warning"}
        size="small"
      />
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
            Class Material List
          </Typography>
          <Typography variant="caption" color="error">
            Watch Lecture Notes Video -{" "}
            <a
              href="https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#d32f2f" }}
            >
              Agoura Math Circle YouTube Channel
            </a>
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            size="small"
          >
            Refresh
          </Button>
          {canAddDocument && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
            >
              Upload Document
            </Button>
          )}
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 2, backgroundColor: "#fafafa" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by topics, document name, description, class, or session..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                Actions
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "docID"}
                  direction={orderBy === "docID" ? order : "asc"}
                  onClick={() => handleSort("docID")}
                >
                  Doc #
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "class"}
                  direction={orderBy === "class" ? order : "asc"}
                  onClick={() => handleSort("class")}
                >
                  Class
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "topics"}
                  direction={orderBy === "topics" ? order : "asc"}
                  onClick={() => handleSort("topics")}
                >
                  Topics
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleSort("description")}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                Document Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "session"}
                  direction={orderBy === "session" ? order : "asc"}
                  onClick={() => handleSort("session")}
                >
                  Session
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                <TableSortLabel
                  active={orderBy === "uploadedDate"}
                  direction={orderBy === "uploadedDate" ? order : "asc"}
                  onClick={() => handleSort("uploadedDate")}
                >
                  Posted Date
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, backgroundColor: "#e3f2fd" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDocuments.length > 0 ? (
              sortedDocuments.map((doc, index) => {
                const isPublished = doc.publish?.toUpperCase() === "Y";
                return (
                  <TableRow
                    key={doc.docID || index}
                    sx={{
                      backgroundColor: !isPublished ? "#fff3cd" : "inherit",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="View Document">
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
                            color="info"
                            onClick={() => onDownload(doc.docName)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {doc.videoURL && (
                          <Tooltip title="Open Video">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => onOpenVideo(doc.videoURL)}
                            >
                              <VideoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {canPublishDocument && (
                          <Tooltip
                            title={
                              isPublished
                                ? "Already Published"
                                : "Publish Document"
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handlePublishClick(doc)}
                                disabled={isPublished}
                              >
                                <PublishIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                        {canDeleteDocument && (
                          <Tooltip title="Delete Document">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(doc)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{doc.docID || "-"}</TableCell>
                    <TableCell>
                      <Chip label={doc.class || "-"} size="small" />
                    </TableCell>
                    <TableCell>{doc.topics || "-"}</TableCell>
                    <TableCell>{doc.description || "-"}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Tooltip title={doc.docName || "-"}>
                        <span>{doc.docName || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{doc.session || "-"}</TableCell>
                    <TableCell>{formatDate(doc.uploadedDate)}</TableCell>
                    <TableCell>{getPublishStatus(doc)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    {searchText
                      ? "No documents found matching your search."
                      : "No documents available."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer Info */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Total Documents: {sortedDocuments.length}
          {searchText && ` (filtered from ${documents.length})`}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Published:{" "}
          {documents.filter((d) => d.publish?.toUpperCase() === "Y").length} |
          Unpublished:{" "}
          {documents.filter((d) => d.publish?.toUpperCase() !== "Y").length}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDocumentList;
