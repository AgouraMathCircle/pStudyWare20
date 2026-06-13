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
  Tooltip,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import AdminSessionListPagination from "./AdminSessionListPagination";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListGridTableSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
} from "../styles/applicationSurfaces";

const documentListColWidthsPx = [
  210, // View — horizontal View / Download / Video links
  58, // Publish
  58, // Delete
  64, // Doc #
  140, // Class — full labels e.g. Artificial Intelligence
  null, // Topics
  null, // Description
  null, // Document Name
  76, // Session
  96, // Posted Date
  104, // Status
];

const documentListBodyCellSx = (options = {}) => ({
  ...adminSessionListTableBodyCellSx(options),
  verticalAlign: "middle",
});

const documentListHeadCellSx = (isLast = false) => ({
  ...adminSessionListTableHeadCellSx(undefined, isLast),
  verticalAlign: "middle",
});

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos";

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
  return classMap[classCode] || classCode || "-";
};

const getAdminDocumentFieldValue = (doc, field) => {
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
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [orderBy, setOrderBy] = useState("uploadedDate");
  const [order, setOrder] = useState("desc");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    doc: null,
  });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });
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

  const sortedDocuments = useMemo(
    () => sortRows(filteredDocuments, orderBy, order, getAdminDocumentFieldValue),
    [filteredDocuments, orderBy, order],
  );

  const totalRecords = sortedDocuments.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDocuments.slice(start, start + pageSize);
  }, [sortedDocuments, currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    if (totalPages === 0) return;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (totalPages === 0) return;
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const handleDeleteClick = (doc) => {
    setConfirmDialog({ open: true, type: "delete", doc });
  };

  const handlePublishClick = (doc) => {
    if (doc.publish?.toUpperCase() === "Y") {
      setAlertDialog({
        open: true,
        message: "This document is already published.",
      });
      return;
    }
    setConfirmDialog({ open: true, type: "publish", doc });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({ open: false, type: null, doc: null });
  };

  const handleConfirmDialogAction = () => {
    const { type, doc } = confirmDialog;
    handleConfirmDialogClose();
    if (!doc) {
      return;
    }
    if (type === "delete") {
      onDelete(doc.docID, doc.docName);
    } else if (type === "publish") {
      onPublish(doc.docID);
    }
  };

  const getConfirmDialogContent = () => {
    const { type, doc } = confirmDialog;
    if (type === "delete") {
      return {
        title: "Delete Document",
        message: `Are you sure you want to delete "${doc?.docName}"?`,
        confirmLabel: "Delete",
        confirmColor: "error",
        icon: <DeleteIcon sx={{ fontSize: 20 }} />,
      };
    }
    if (type === "publish") {
      return {
        title: "Publish Document",
        message: `Are you sure you want to publish "${doc?.docName}"?`,
        confirmLabel: "Publish",
        confirmColor: "primary",
        icon: <PublishIcon sx={{ fontSize: 20 }} />,
      };
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getPublishStatus = (doc) => {
    const isPublished = doc.publish?.toUpperCase() === "Y";
    return (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          px: 1,
          py: 0.35,
          borderRadius: 0.5,
          fontSize: "0.7rem",
          fontWeight: 600,
          lineHeight: 1.2,
          color: "#fff",
          whiteSpace: "nowrap",
          backgroundColor: isPublished ? "#2e7d32" : "#424242",
        }}
      >
        {isPublished ? "Published" : "Unpublished"}
      </Box>
    );
  };

  const renderDocumentActions = (doc) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 0.5,
        whiteSpace: "nowrap",
      }}
    >
      <Box onClick={() => onView(doc.docName)} sx={adminSessionListTableActionLinkSx}>
        View
      </Box>
      <Typography
        component="span"
        sx={{ fontSize: "0.75rem", color: "text.disabled", userSelect: "none", lineHeight: 1 }}
      >
        /
      </Typography>
      <Box onClick={() => onDownload(doc.docName)} sx={adminSessionListTableActionLinkSx}>
        Download
      </Box>
      {doc.videoURL ? (
        <>
          <Typography
            component="span"
            sx={{ fontSize: "0.75rem", color: "text.disabled", userSelect: "none", lineHeight: 1 }}
          >
            /
          </Typography>
          <Box onClick={() => onOpenVideo(doc.videoURL)} sx={adminSessionListTableActionLinkSx}>
            Video
          </Box>
        </>
      ) : null}
    </Box>
  );

  return (
    <Box>
      <Box sx={adminSessionListHeaderBarSx}>
        <Box>
          <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
            Class Material List
          </Typography>
          <Typography variant="caption" color="error" display="block">
            Watch Lecture Notes Video -{" "}
            <a
              href={YOUTUBE_URL}
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
            color="primary"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            sx={adminSessionListToolbarButtonSx}
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
              sx={adminSessionListToolbarButtonSx}
            >
              Upload Document
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            size="small"
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            sx={adminSessionListSearchSelectSx}
          >
            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
              -ALL-
            </MenuItem>
            <MenuItem value="DOC_ID" sx={adminSessionListMenuItemSx}>
              Doc #
            </MenuItem>
            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
              Class
            </MenuItem>
            <MenuItem value="TOPICS" sx={adminSessionListMenuItemSx}>
              Topics
            </MenuItem>
            <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
              Description
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={adminSessionListMenuItemSx}>
              Document Name
            </MenuItem>
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
              Session
            </MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
          <Select
            size="small"
            value={searchCriteria}
            onChange={(e) => setSearchCriteria(e.target.value)}
            sx={adminSessionListSearchSelectSx}
          >
            <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
              Contains
            </MenuItem>
            <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
              Equals
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
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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

      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ ...adminSessionListGridTableSx, minWidth: 1040 }} size="small">
          <colgroup>
            {documentListColWidthsPx.map((w, i) => (
              <col key={i} style={w == null ? undefined : { width: w }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <TableCell sx={documentListHeadCellSx()}>View</TableCell>
              <TableCell sx={documentListHeadCellSx()}>Publish</TableCell>
              <TableCell sx={documentListHeadCellSx()}>Delete</TableCell>
              <SortableHeader
                label="Doc #"
                field="docID"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Document Name"
                field="docName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Posted Date"
                field="uploadedDate"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx()}
              />
              <SortableHeader
                label="Status"
                field="publish"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={documentListHeadCellSx(true)}
              />
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
                      ...adminSessionListTableBodyRowSx,
                      ...(!isPublished
                        ? {
                            backgroundColor: "#fff3cd",
                            "&:nth-of-type(odd)": { backgroundColor: "#fff3cd" },
                            "&:nth-of-type(even)": { backgroundColor: "#fff3cd" },
                          }
                        : {}),
                    }}
                  >
                    <TableCell sx={documentListBodyCellSx({ action: true })}>
                      {renderDocumentActions(doc)}
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ action: true })}>
                      {canPublishDocument && !isPublished ? (
                        <Box
                          onClick={() => handlePublishClick(doc)}
                          sx={adminSessionListTableActionLinkSx}
                        >
                          Publish
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ action: true })}>
                      {canDeleteDocument ? (
                        <Box
                          onClick={() => handleDeleteClick(doc)}
                          sx={adminSessionListTableActionLinkSx}
                        >
                          Delete
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx()}>{doc.docID || "-"}</TableCell>
                    <TableCell sx={documentListBodyCellSx()}>
                      <Tooltip title={getClassLabel(doc.class)}>
                        <span>{getClassLabel(doc.class)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.topics || "-"}>
                        <span>{doc.topics || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.description || "-"}>
                        <span>{doc.description || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.docName || "-"}>
                        <span>{doc.docName || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.session || "-"}>
                        <span>{doc.session || "-"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={documentListBodyCellSx()}>{formatDate(doc.uploadedDate)}</TableCell>
                    <TableCell sx={documentListBodyCellSx({ isLast: true })}>
                      {getPublishStatus(doc)}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
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

export default AdminDocumentList;
