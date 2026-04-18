import React, { useMemo, useState } from "react";
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
  Paper,
  IconButton,
  Tooltip,
  Chip,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  VideoLibrary as VideoIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../../../styles/applicationSurfaces";

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
  const [orderBy] = useState("uploadedDate");
  const [order] = useState("desc");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const pageSize = 10;

  const matchesCriteria = (value, search, criteria) => {
    const v = String(value ?? "").toLowerCase();
    const s = search.toLowerCase();
    if (criteria === "equals") return v === s;
    if (criteria === "starts_with") return v.startsWith(s);
    return v.includes(s);
  };

  const filteredDocuments = useMemo(() => {
    if (!searchText.trim()) return safeDocuments;
    const search = searchText.trim();
    return safeDocuments.filter((doc) => {
      if (searchBy === "ALL") {
        return (
          matchesCriteria(doc.topics, search, searchCriteria) ||
          matchesCriteria(doc.docName, search, searchCriteria) ||
          matchesCriteria(doc.description, search, searchCriteria) ||
          matchesCriteria(doc.class, search, searchCriteria) ||
          matchesCriteria(doc.session, search, searchCriteria) ||
          matchesCriteria(doc.docID, search, searchCriteria)
        );
      }

      let fieldValue = "";
      switch (searchBy) {
        case "DOC_ID":
          fieldValue = doc.docID;
          break;
        case "CLASS":
          fieldValue = doc.class;
          break;
        case "TOPICS":
          fieldValue = doc.topics;
          break;
        case "DESCRIPTION":
          fieldValue = doc.description;
          break;
        case "DOC_NAME":
          fieldValue = doc.docName;
          break;
        case "SESSION":
          fieldValue = doc.session;
          break;
        default:
          fieldValue = "";
      }
      return matchesCriteria(fieldValue, search, searchCriteria);
    });
  }, [safeDocuments, searchText, searchBy, searchCriteria]);

  // Sort documents
  const sortedDocuments = useMemo(
    () =>
      [...filteredDocuments].sort((a, b) => {
        const aValue = a[orderBy];
        const bValue = b[orderBy];
        if (aValue < bValue) return order === "asc" ? -1 : 1;
        if (aValue > bValue) return order === "asc" ? 1 : -1;
        return 0;
      }),
    [filteredDocuments, orderBy, order],
  );

  const totalRecords = sortedDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDocuments.slice(start, start + pageSize);
  }, [sortedDocuments, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

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
            sx={{ fontWeight: 600, color: APPLICATION_ADMIN_TITLE_COLOR, fontSize: "1rem" }}
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
            sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Search By:
          </Typography>
          <Select
            size="small"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            sx={{
              color: "white",
              minWidth: 100,
              fontSize: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
              -ALL-
            </MenuItem>
            <MenuItem value="DOC_ID" sx={{ fontSize: "0.75rem" }}>
              Doc #
            </MenuItem>
            <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
              Class
            </MenuItem>
            <MenuItem value="TOPICS" sx={{ fontSize: "0.75rem" }}>
              Topics
            </MenuItem>
            <MenuItem value="DESCRIPTION" sx={{ fontSize: "0.75rem" }}>
              Description
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={{ fontSize: "0.75rem" }}>
              Document Name
            </MenuItem>
            <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
              Session
            </MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}
          >
            Criteria:
          </Typography>
          <Select
            size="small"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            sx={{
              color: "white",
              minWidth: 110,
              fontSize: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
              Contains
            </MenuItem>
            <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
              Equals
            </MenuItem>
            <MenuItem value="starts_with" sx={{ fontSize: "0.75rem" }}>
              Starts With
            </MenuItem>
          </Select>
        </Box>
        <TextField
          size="small"
          placeholder="Search Text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            minWidth: 180,
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
                Session
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
                Posted Date
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
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc, index) => {
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages === 0}
          >
            <PrevPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <NextPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
            GoTo
          </Typography>
          <Select
            size="small"
            value={totalPages > 0 ? currentPage : ""}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            disabled={totalPages === 0}
            sx={{
              color: "white",
              minWidth: 50,
              fontSize: "0.75rem",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            {totalPages > 0 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <MenuItem key={p} value={p} sx={{ fontSize: "0.75rem" }}>
                  {p}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                -
              </MenuItem>
            )}
          </Select>
        </Box>
        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Page(s): {totalPages === 0 ? 0 : currentPage} of {Math.max(totalPages, 1)}
        </Typography>
        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Record(s):{" "}
          {totalRecords > 0
            ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(
                currentPage * pageSize,
                totalRecords,
              )}`
            : "0"}{" "}
          of {totalRecords}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
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
            inputProps={{ min: 1, max: Math.max(totalPages, 1) }}
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
  );
};

export default AdminDocumentList;
