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
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  VideoLibrary as VideoIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
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
  // Ensure we always have an array to prevent "filter is not a function" etc.
  const safeDocuments = Array.isArray(documents) ? documents : [];
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
  const filteredDocuments = safeDocuments.filter((doc) => {
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
      `Are you sure you want to delete "${doc.docName}"?`,
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
      `Are you sure you want to publish "${doc.docName}"?`,
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
        sx={{ fontSize: "0.7rem" }}
      />
    );
  };

  const cellPadding = "0 8px";

  return (
    <Box>
      {/* Header: title + buttons (same as Document List) */}
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#4caf50", fontSize: "1rem" }}
          >
            Class Material List
          </Typography>
          <Typography variant="caption" color="error" display="block">
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
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
          >
            Refresh
          </Button>
          {canAddDocument && (
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
            >
              Upload Document
            </Button>
          )}
        </Box>
      </Box>

      {/* Search Bar - green (same as Document List) */}
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
        <TextField
          size="small"
          placeholder="Search by topics, name, description, class, session..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), null)}
          sx={{
            minWidth: 220,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              fontSize: "0.75rem",
            },
          }}
        />
        <Button
          variant="contained"
          size="small"
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

      {/* Table - same layout as Document List */}
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table
          sx={{
            width: "100%",
            tableLayout: "fixed",
            "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
          }}
          size="small"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              <TableCell
                sx={{
                  fontWeight: 400,
                  borderRight: "1px solid #4caf50",
                  width: "8%",
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
                Publish
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
                <TableSortLabel
                  active={orderBy === "docID"}
                  direction={orderBy === "docID" ? order : "asc"}
                  onClick={() => handleSort("docID")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Doc #
                </TableSortLabel>
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
                <TableSortLabel
                  active={orderBy === "class"}
                  direction={orderBy === "class" ? order : "asc"}
                  onClick={() => handleSort("class")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Class
                </TableSortLabel>
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
                <TableSortLabel
                  active={orderBy === "topics"}
                  direction={orderBy === "topics" ? order : "asc"}
                  onClick={() => handleSort("topics")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Topics
                </TableSortLabel>
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
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleSort("description")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Description
                </TableSortLabel>
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
                Document Name
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
                <TableSortLabel
                  active={orderBy === "session"}
                  direction={orderBy === "session" ? order : "asc"}
                  onClick={() => handleSort("session")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Session
                </TableSortLabel>
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
                <TableSortLabel
                  active={orderBy === "uploadedDate"}
                  direction={orderBy === "uploadedDate" ? order : "asc"}
                  onClick={() => handleSort("uploadedDate")}
                  sx={{ fontSize: "0.75rem" }}
                >
                  Posted Date
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 400,
                  width: "8%",
                  fontSize: "0.75rem",
                  padding: cellPadding,
                }}
              >
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
                      backgroundColor: !isPublished ? "#fff3cd" : undefined,
                      "&:nth-of-type(odd)": {
                        backgroundColor: !isPublished ? "#fff3cd" : "#f9f9f9",
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
                      <Box
                        sx={{ display: "flex", flexWrap: "nowrap", gap: 0.25 }}
                      >
                        <Tooltip title="View Document">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onView(doc.docName)}
                            sx={{ padding: "2px" }}
                          >
                            <ViewIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => onDownload(doc.docName)}
                            sx={{ padding: "2px" }}
                          >
                            <DownloadIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                        {doc.videoURL && (
                          <Tooltip title="Open Video">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => onOpenVideo(doc.videoURL)}
                              sx={{ padding: "2px" }}
                            >
                              <VideoIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                        verticalAlign: "middle",
                      }}
                    >
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
                              sx={{ padding: "2px" }}
                            >
                              <PublishIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                        verticalAlign: "middle",
                      }}
                    >
                      {canDeleteDocument && (
                        <Tooltip title="Delete Document">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(doc)}
                            sx={{ padding: "2px" }}
                          >
                            <DeleteIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {doc.docID || "-"}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      <Chip
                        label={doc.class || "-"}
                        size="small"
                        sx={{ fontSize: "0.7rem" }}
                      />
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
                      <Tooltip title={doc.topics || "-"}>
                        <span>{doc.topics || "-"}</span>
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
                      <Tooltip title={doc.description || "-"}>
                        <span>{doc.description || "-"}</span>
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
                      <Tooltip title={doc.docName || "-"}>
                        <span>{doc.docName || "-"}</span>
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
                      <Tooltip title={doc.session || "-"}>
                        <span>{doc.session || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #4caf50",
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.75rem",
                        padding: cellPadding,
                      }}
                    >
                      {getPublishStatus(doc)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
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
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer - green bar (same as Document List) */}
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
        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Total: {sortedDocuments.length}
          {searchText ? ` (filtered from ${safeDocuments.length})` : ""} |
          Published:{" "}
          {safeDocuments.filter((d) => d.publish?.toUpperCase() === "Y").length}{" "}
          | Unpublished:{" "}
          {safeDocuments.filter((d) => d.publish?.toUpperCase() !== "Y").length}
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDocumentList;
