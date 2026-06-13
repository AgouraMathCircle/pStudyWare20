import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  VideoLibrary as VideoIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import InstructorPortalPaginationBar from "./InstructorPortalPaginationBar";
import SortableHeader from "../Common/SortableHeader";
import { sortRows, toSortableDate } from "../../../utils/tableSort";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  INSTRUCTOR_CELL_PADDING,
  instructorCellBodySx,
  instructorCellBodySxLast,
  instructorCellHeaderSx,
  instructorCellHeaderSxLast,
  instructorFindButtonSx,
  instructorGreenSearchBarSx,
  instructorPageTitleSx,
  instructorSearchLabelSx,
  instructorSearchTextFieldSx,
  instructorSelectOnGreenSx,
  instructorClassMaterialColWidthsPx,
  instructorTableBodyRowZebraSx,
  instructorTableHeadRowSx,
  instructorTableSx,
} from "./instructorPortalTableStyles";

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos";

/** Normalize API row (camelCase / PascalCase / legacy column names). */
export function normalizeClassMaterialDoc(raw) {
  if (!raw || typeof raw !== "object") return null;
  const publishRaw =
    raw.publish ?? raw.Publish ?? raw.status ?? raw.Status ?? "";
  return {
    docID: raw.docID ?? raw.DocID ?? raw.mDocID ?? 0,
    topics: raw.topics ?? raw.Topics ?? "",
    docName: raw.docName ?? raw.mDocName ?? "",
    description: raw.description ?? raw.Description ?? "",
    classVal: raw.class ?? raw.Class ?? "",
    session: raw.session ?? raw.mSession ?? "",
    publish: String(publishRaw).trim(),
    videoURL: raw.videoURL ?? raw.mURLName ?? raw.url ?? "",
    uploadedDate:
      raw.uploadedDate ?? raw.UploadedDate ?? raw.insertDate ?? raw.InsertDate,
  };
}

function isPublished(doc) {
  return doc.publish?.toUpperCase() === "Y";
}

function formatDate(date) {
  if (!date) return "-";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}

function matchField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

const getClassMaterialFieldValue = (doc, field) => {
  switch (field) {
    case "classVal":
      return doc.classVal ?? "";
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
    default:
      return "";
  }
};

/**
 * Class material for instructors — same table/search/pagination chrome as report-card.
 */
const InstructorClassMaterialList = ({
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
  const rows = useMemo(
    () => safeDocuments.map(normalizeClassMaterialDoc).filter(Boolean),
    [safeDocuments]
  );

  const [sortField, setSortField] = useState("uploadedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    doc: null,
  });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });
  const pageSize = 10;

  const handleSort = (property) => {
    const isAsc = sortField === property && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(property);
  };

  const filtered = useMemo(() => {
    if (!searchText.trim()) return rows;
    const search = searchText.trim();
    if (searchBy === "ALL") {
      return rows.filter(
        (doc) =>
          matchField(doc.topics, search, searchCriteria) ||
          matchField(doc.docName, search, searchCriteria) ||
          matchField(doc.description, search, searchCriteria) ||
          matchField(doc.classVal, search, searchCriteria) ||
          matchField(doc.session, search, searchCriteria) ||
          matchField(doc.docID, search, searchCriteria)
      );
    }
    return rows.filter((doc) => {
      let fieldValue = "";
      switch (searchBy) {
        case "DOC_ID":
          fieldValue = doc.docID;
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
        case "CLASS":
          fieldValue = doc.classVal;
          break;
        case "SESSION":
          fieldValue = doc.session;
          break;
        default:
          return true;
      }
      return matchField(fieldValue, search, searchCriteria);
    });
  }, [rows, searchText, searchBy, searchCriteria]);

  const sorted = useMemo(
    () => sortRows(filtered, sortField, sortOrder, getClassMaterialFieldValue),
    [filtered, sortField, sortOrder]
  );

  const totalRecords = sorted.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;

  const paged = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const total = Math.ceil(totalRecords / pageSize);
    if (total === 0) return;
    if (page >= 1 && page <= total) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const total = Math.ceil(totalRecords / pageSize);
    if (total === 0) return;
    if (!Number.isNaN(page) && page >= 1 && page <= total) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const handleDeleteClick = (doc) => {
    const id = doc.docID;
    if (id === 0 || id === "0") {
      setAlertDialog({
        open: true,
        message:
          "You cannot delete this document. Document has posted already.",
      });
      return;
    }
    setConfirmDialog({ open: true, type: "delete", doc });
  };

  const handlePublishClick = (doc) => {
    if (isPublished(doc)) {
      setAlertDialog({
        open: true,
        message:
          "You cannot publish this document. Document has published already.",
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
        message: `Do you want to publish this document "${doc?.docName}"?`,
        confirmLabel: "Publish",
        confirmColor: "primary",
        icon: <PublishIcon sx={{ fontSize: 20 }} />,
      };
    }
    return null;
  };

  const renderPostedCell = (doc) => {
    if (isPublished(doc)) {
      return (
        <Typography
          variant="body2"
          sx={{ fontSize: "0.75rem", fontWeight: 600 }}
        >
          Published
        </Typography>
      );
    }
    if (!canPublishDocument)
      return <Typography variant="caption">—</Typography>;
    return (
      <Tooltip title="Publish">
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={() => handlePublishClick(doc)}
          sx={{ textTransform: "none", fontSize: "0.7rem", py: 0.25 }}
        >
          Publish
        </Button>
      </Tooltip>
    );
  };

  const headCell = (sxLast, children) => (
    <TableCell sx={sxLast ? instructorCellHeaderSxLast : instructorCellHeaderSx}>
      {children}
    </TableCell>
  );

  const publishedCount = rows.filter((d) => isPublished(d)).length;

  return (
    <Box>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: { xs: 0.75, sm: 1.5 },
              columnGap: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ ...instructorPageTitleSx, mb: 0, lineHeight: 1.35 }}
            >
              Class Material List
            </Typography>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "baseline",
                flexWrap: "wrap",
                gap: 0.25,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                lineHeight: 1.45,
              }}
            >
              <Typography
                component="span"
                variant="body1"
                sx={{
                  color: "error.main",
                  fontWeight: 600,
                  fontSize: "inherit",
                }}
              >
                Watch Lecture Notes Video{" "}
              </Typography>
              <Link
                href={YOUTUBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  fontSize: "inherit",
                  textDecoration: "underline",
                  "&:hover": { color: "primary.dark" },
                }}
              >
                Agoura Math Circle YouTube Channel
              </Link>
            </Box>
          </Box>
          <Typography
            variant="body1"
            display="block"
            sx={{
              color: "error.main",
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              lineHeight: 1.35,
              mt: 0.25,
              mb: 0,
              fontWeight: 500,
            }}
          >
            Note: Subscription is required for all students. Please subscribe;
            it will help us to upload more videos.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="primary"
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
            <MenuItem value="DOC_ID" sx={{ fontSize: "0.75rem" }}>
              Doc #
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
            <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
              Class
            </MenuItem>
            <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
              Session
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
        sx={{ width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <Table size="small" sx={{ ...instructorTableSx, minWidth: 1040 }}>
          <colgroup>
            {instructorClassMaterialColWidthsPx.map((w, i) => (
              <col
                key={i}
                style={w == null ? undefined : { width: w }}
              />
            ))}
          </colgroup>
          <TableHead>
            <TableRow sx={instructorTableHeadRowSx}>
              {headCell(false, "View")}
              {headCell(false, "Download")}
              {headCell(false, "Delete")}
              {headCell(false, "Video")}
              {headCell(false, "Doc #")}
              <SortableHeader
                label="Class"
                field="classVal"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              <SortableHeader
                label="Name"
                field="docName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              <SortableHeader
                label="Posted Date"
                field="uploadedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={instructorCellHeaderSx}
              />
              {headCell(true, "Posted")}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ fontSize: "0.75rem", py: 3 }}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {searchText
                      ? "No documents matching your search."
                      : "No documents available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((doc, index) => {
                const pub = isPublished(doc);
                return (
                  <TableRow
                    key={doc.docID || index}
                    sx={{
                      ...(pub
                        ? instructorTableBodyRowZebraSx
                        : { backgroundColor: "#fffde7" }),
                      ...(!pub
                        ? {
                            "&:nth-of-type(even)": {
                              backgroundColor: "#fff9c4",
                            },
                          }
                        : {}),
                    }}
                  >
                    <TableCell
                      sx={{ ...instructorCellBodySx, verticalAlign: "middle" }}
                    >
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          onClick={() => onView(doc.docName)}
                          sx={{ padding: "2px" }}
                        >
                          <ViewIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{ ...instructorCellBodySx, verticalAlign: "middle" }}
                    >
                      <Tooltip title="Download">
                        <IconButton
                          size="small"
                          onClick={() => onDownload(doc.docName)}
                          sx={{ padding: "2px" }}
                        >
                          <DownloadIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      sx={{ ...instructorCellBodySx, verticalAlign: "middle" }}
                    >
                      {canDeleteDocument ? (
                        <Tooltip
                          title={
                            doc.docID === 0 ? "Cannot delete" : "Delete"
                          }
                        >
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              disabled={doc.docID === 0}
                              onClick={() => handleDeleteClick(doc)}
                              sx={{ padding: "2px" }}
                            >
                              <DeleteIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{ ...instructorCellBodySx, verticalAlign: "middle" }}
                    >
                      {doc.videoURL ? (
                        <Tooltip title="Video">
                          <IconButton
                            size="small"
                            onClick={() => onOpenVideo(doc.videoURL)}
                            sx={{ padding: "2px" }}
                          >
                            <VideoIcon sx={{ fontSize: "1rem" }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.disabled">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>{doc.docID}</TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      <Chip
                        label={doc.classVal || "—"}
                        size="small"
                        sx={{ height: 22, fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      <Tooltip title={doc.topics || ""}>
                        <Typography
                          noWrap
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {doc.topics || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      <Tooltip title={doc.description || ""}>
                        <Typography
                          noWrap
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {doc.description || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      <Tooltip title={doc.docName || ""}>
                        <Typography
                          noWrap
                          variant="body2"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {doc.docName || "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      {doc.session || "—"}
                    </TableCell>
                    <TableCell sx={instructorCellBodySx}>
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                    <TableCell sx={instructorCellBodySxLast}>
                      {renderPostedCell(doc)}
                    </TableCell>
                  </TableRow>
                );
              })
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
        extraInfo={`Published: ${publishedCount} | Unpublished: ${rows.length - publishedCount}`}
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

export default InstructorClassMaterialList;
