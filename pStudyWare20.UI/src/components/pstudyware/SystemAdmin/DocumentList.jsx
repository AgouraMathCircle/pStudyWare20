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
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SortableHeader from "../Common/SortableHeader";
import { adminPortalTableFontSx, adminSessionListTableActionLinkSx, adminSessionListTableDeleteLinkSx } from "../styles/applicationSurfaces";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const documentTableCellSx = {
  ...adminPortalTableFontSx,
  borderRight: "1px solid #4caf50",
  padding: "8px 12px",
};

const documentHeadCellSx = {
  ...documentTableCellSx,
  fontWeight: 600,
};

const documentHeadCellSxLast = {
  ...adminPortalTableFontSx,
  fontWeight: 600,
  padding: "8px 12px",
};

const documentActionDividerSx = {
  fontSize: "0.75rem",
  color: "text.disabled",
  userSelect: "none",
  lineHeight: 1,
};

const renderDocumentActionLink = (label, onClick, linkSx = {}) => (
  <Box
    onClick={onClick}
    sx={{
      ...adminSessionListTableActionLinkSx,
      ...linkSx,
    }}
  >
    {label}
  </Box>
);

const getDocumentFieldValue = (doc, field) => {
  switch (field) {
    case "docID":
      return toSortableNumber(doc.docID);
    case "class":
      return doc.class ?? "";
    case "topics":
      return doc.topics ?? "";
    case "description":
      return doc.description ?? "";
    case "docName":
      return doc.docName ?? "";
    case "session":
      return doc.session ?? "";
    case "uploadedDate":
      return toSortableDate(doc.uploadedDate);
    case "publish":
      return doc.publish ?? "";
    default:
      return "";
  }
};

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
  const [sortField, setSortField] = useState("uploadedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    docID: null,
    docName: "",
  });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });

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

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setPage(0);
  };

  const handleDeleteClick = (docID, docName) => {
    setConfirmDialog({ open: true, type: "delete", docID, docName });
  };

  const handlePublishClick = (docID, status, docName) => {
    if (status?.toUpperCase() === "Y") {
      setAlertDialog({
        open: true,
        message: "This document is already published.",
      });
      return;
    }

    setConfirmDialog({ open: true, type: "publish", docID, docName });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false, type: null, docID: null, docName: "" });
  };

  const handleConfirmDialogAction = () => {
    const { type, docID, docName } = confirmDialog;
    handleConfirmDialogClose();
    if (type === "delete") {
      onDelete(docID, docName);
    } else if (type === "publish") {
      onPublish(docID);
    }
  };

  const getConfirmDialogContent = () => {
    const { type, docName } = confirmDialog;
    if (type === "delete") {
      return {
        title: "Delete Document",
        message: (
          <>
            Are you sure you want to delete this document?
            <br />
            <br />
            Document: {docName}
          </>
        ),
        confirmLabel: "Delete",
        confirmColor: "error",
        icon: <DeleteIcon sx={{ fontSize: 20 }} />,
      };
    }
    if (type === "publish") {
      return {
        title: "Publish Document",
        message: (
          <>
            Are you sure you want to publish this document?
            <br />
            <br />
            Document: {docName}
          </>
        ),
        confirmLabel: "Publish",
        confirmColor: "primary",
        icon: <PublishIcon sx={{ fontSize: 20 }} />,
      };
    }
    return null;
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
      ED: "Engineering Design",
    };
    return classMap[classCode] || classCode;
  };

  const sortedDocuments = useMemo(
    () => sortRows(filteredDocuments, sortField, sortOrder, getDocumentFieldValue),
    [filteredDocuments, sortField, sortOrder],
  );

  // Paginated documents
  const paginatedDocuments = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedDocuments.slice(startIndex, endIndex);
  }, [sortedDocuments, page, rowsPerPage]);

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
              <TableCell sx={documentHeadCellSx}>Actions</TableCell>
              <SortableHeader
                label="Doc #"
                field="docID"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Document Name"
                field="docName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Posted Date"
                field="uploadedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSx}
              />
              <SortableHeader
                label="Status"
                field="publish"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={documentHeadCellSxLast}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  align="center"
                  sx={{ py: 4, ...adminPortalTableFontSx }}
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
                    <TableCell sx={documentTableCellSx}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "nowrap",
                          gap: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {renderDocumentActionLink("View", () => onView(doc.docName))}
                        <Typography component="span" sx={documentActionDividerSx}>
                          /
                        </Typography>
                        {renderDocumentActionLink("Download", () => onDownload(doc.docName))}
                        {doc.videoURL ? (
                          <>
                            <Typography component="span" sx={documentActionDividerSx}>
                              /
                            </Typography>
                            {renderDocumentActionLink("Video", () => onOpenVideo(doc.videoURL))}
                          </>
                        ) : null}
                        {canPublishDocument && !isPublished ? (
                          <>
                            <Typography component="span" sx={documentActionDividerSx}>
                              /
                            </Typography>
                            {renderDocumentActionLink("Publish", () =>
                              handlePublishClick(doc.docID, doc.publish, doc.docName),
                            )}
                          </>
                        ) : null}
                        {canDeleteDocument ? (
                          <>
                            <Typography component="span" sx={documentActionDividerSx}>
                              /
                            </Typography>
                            {renderDocumentActionLink(
                              "Delete",
                              () => handleDeleteClick(doc.docID, doc.docName),
                              adminSessionListTableDeleteLinkSx,
                            )}
                          </>
                        ) : null}
                      </Box>
                    </TableCell>
                    <TableCell sx={documentTableCellSx}>
                      {doc.docID}
                    </TableCell>
                    <TableCell sx={documentTableCellSx}>
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
                    <TableCell sx={documentTableCellSx}>
                      {doc.topics || "N/A"}
                    </TableCell>
                    <TableCell sx={documentTableCellSx}>
                      {doc.description || "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...documentTableCellSx,
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Tooltip title={doc.docName}>
                        <span>{doc.docName || "N/A"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentTableCellSx}>
                      {doc.session || "N/A"}
                    </TableCell>
                    <TableCell sx={documentTableCellSx}>
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...adminPortalTableFontSx,
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

      {getConfirmDialogContent() && (
        <AppConfirmDialog
          open={confirmDialog.open}
          onClose={handleConfirmDialogClose}
          onConfirm={handleConfirmDialogAction}
          title={getConfirmDialogContent().title}
          message={getConfirmDialogContent().message}
          confirmLabel={getConfirmDialogContent().confirmLabel}
          confirmColor={getConfirmDialogContent().confirmColor}
          icon={getConfirmDialogContent().icon}
        />
      )}

      <AppConfirmDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, message: "" })}
        title="Notice"
        message={alertDialog.message}
      />
    </Box>
  );
};

export default DocumentList;
