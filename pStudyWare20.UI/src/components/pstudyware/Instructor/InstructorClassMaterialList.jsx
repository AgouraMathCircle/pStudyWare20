import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
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
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import PdfViewerModal from "../../common/PdfViewerModal";
import config from "../../../utils/config";
import { getClassMaterialDeleteId } from "../../../services/documentService";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  portalHeaderActionButtonSx,
  studentPortalIntroTextSx,
  studentPortalLinkSx,
} from "../styles/applicationSurfaces";

const YOUTUBE_URL =
  "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/videos";

const documentColumnWidths = {
  actions: "20%",
  docNumber: "5%",
  className: "7%",
  topics: "11%",
  description: "12%",
  documentName: "14%",
  session: "10%",
  postedDate: "12%",
  posted: "9%",
};

const actionDividerSx = {
  fontSize: "0.75rem",
  color: "text.disabled",
  userSelect: "none",
  lineHeight: 1,
};

/** Normalize API row (camelCase / PascalCase / legacy column names). */
export function normalizeClassMaterialDoc(raw) {
  if (!raw || typeof raw !== "object") return null;
  const publishRaw =
    raw.publish ?? raw.Publish ?? raw.status ?? raw.Status ?? "";
  return {
    docID: raw.docID ?? raw.DocID ?? raw.mDocID ?? 0,
    documentID: raw.documentID ?? raw.DocumentID ?? 0,
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

function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

const getClassMaterialFieldValue = (doc, field) => {
  switch (field) {
    case "docNumber":
      return toSortableNumber(doc.docID);
    case "className":
      return doc.classVal ?? "";
    case "topics":
      return doc.topics ?? "";
    case "description":
      return doc.description ?? "";
    case "documentName":
      return doc.docName ?? "";
    case "session":
      return doc.session ?? "";
    case "postedDate":
      return toSortableDate(doc.uploadedDate);
    default:
      return "";
  }
};

/**
 * Class material for instructors — same layout as StudentDocumentList with extra admin actions.
 */
const InstructorClassMaterialList = ({
  documents,
  onView,
  onDownload,
  onDelete,
  onPublish,
  onOpenVideo,
  onAdd,
  canAddDocument,
  canDeleteDocument,
  canPublishDocument,
  selectedPdf,
  onClosePdfViewer,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const rows = useMemo(
    () => safeDocuments.map(normalizeClassMaterialDoc).filter(Boolean),
    [safeDocuments],
  );

  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: null,
    doc: null,
  });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });
  const pageSize = 25;

  useEffect(() => {
    setFilteredData(rows);
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [rows]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const sortedDocuments = useMemo(
    () =>
      sortRows(filteredData, sortField, sortOrder, getClassMaterialFieldValue),
    [filteredData, sortField, sortOrder],
  );

  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedDocuments.slice(start, start + pageSize);
  }, [sortedDocuments, currentPage, pageSize]);

  const handleSearch = () => {
    let filtered = [...rows];

    if (searchText.trim()) {
      if (searchBy === "ALL") {
        const search = searchText.trim().toLowerCase();
        const criteria = searchCriteria || "contains";
        filtered = filtered.filter(
          (doc) =>
            matchField(doc.topics, search, criteria) ||
            matchField(doc.docName, search, criteria) ||
            matchField(doc.description, search, criteria) ||
            matchField(doc.classVal, search, criteria) ||
            matchField(doc.session, search, criteria) ||
            matchField(doc.docID, search, criteria),
        );
      } else {
        filtered = filtered.filter((doc) => {
          let fieldValue = "";
          switch (searchBy) {
            case "DOC_ID":
              fieldValue = doc.docID;
              break;
            case "CLASS":
              fieldValue = doc.classVal;
              break;
            case "TOPICS":
              fieldValue = doc.topics;
              break;
            case "DESCRIPTION":
              fieldValue = doc.description;
              break;
            case "SESSION":
              fieldValue = doc.session;
              break;
            case "DOC_NAME":
              fieldValue = doc.docName;
              break;
            default:
              return true;
          }
          return matchField(
            fieldValue,
            searchText.trim().toLowerCase(),
            searchCriteria || "contains",
          );
        });
      }
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
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

  const handleDeleteClick = (doc) => {
    if (!getClassMaterialDeleteId(doc)) {
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
    if (!doc) return;
    if (type === "delete") {
      onDelete(getClassMaterialDeleteId(doc), doc.docName);
    } else if (type === "publish") {
      onPublish(getClassMaterialDeleteId(doc));
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

  const renderActionLink = (
    label,
    onClick,
    disabled = false,
    linkSx = {},
    tooltip = label,
  ) => (
    <Tooltip title={tooltip} arrow>
      <Box
        component="span"
        onClick={disabled ? undefined : onClick}
        sx={{
          ...adminSessionListTableActionLinkSx,
          ...linkSx,
          display: "inline-flex",
          ...(disabled ? { color: "text.disabled", cursor: "not-allowed" } : {}),
        }}
      >
        {label}
      </Box>
    </Tooltip>
  );

  const renderEllipsisCell = (value, options = {}) => {
    const display = value || "—";
    return (
      <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true, ...options })}>
        <Tooltip title={display} arrow>
          <span>{display}</span>
        </Tooltip>
      </TableCell>
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
      {renderActionLink(
        "View",
        () => onView(doc.docName),
        false,
        {},
        `View ${doc.docName || "document"}`,
      )}
      <Typography component="span" sx={actionDividerSx}>
        /
      </Typography>
      {renderActionLink(
        "Download",
        () => onDownload(doc.docName),
        false,
        {},
        `Download ${doc.docName || "document"}`,
      )}
      {doc.videoURL ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          {renderActionLink(
            "Video",
            () => onOpenVideo(doc.videoURL),
            false,
            {},
            "Open lecture video",
          )}
        </>
      ) : null}
      {canDeleteDocument ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          {renderActionLink(
            "Delete",
            () => handleDeleteClick(doc),
            !getClassMaterialDeleteId(doc),
            adminSessionListTableDeleteLinkSx,
            getClassMaterialDeleteId(doc)
              ? `Delete ${doc.docName || "document"}`
              : "Published documents cannot be deleted",
          )}
        </>
      ) : null}
      {canPublishDocument && !isPublished(doc) ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          {renderActionLink(
            "Publish",
            () => handlePublishClick(doc),
            false,
            {},
            `Publish ${doc.docName || "document"}`,
          )}
        </>
      ) : null}
    </Box>
  );

  const emptyMessage = searchText
    ? "No documents found matching your search."
    : "No documents available.";

  const renderPostedStatus = (doc) => {
    const pub = isPublished(doc);
    return (
      <Typography
        component="span"
        variant="body2"
        sx={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: pub ? "#2e7d32" : "#ed6c02",
        }}
      >
        {pub ? "Published" : "Unpublished"}
      </Typography>
    );
  };

  const renderTableBody = () => {
    if (paginatedDocuments.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={adminSessionListEmptyTextSx}
            >
              {emptyMessage}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return paginatedDocuments.map((doc, index) => {
      const pub = isPublished(doc);
      return (
        <TableRow
          key={doc.docID || index}
          className={pub ? undefined : "class-material-row-unpublished"}
          sx={pub ? adminSessionListTableBodyRowSx : undefined}
        >
          <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
            {renderDocumentActions(doc)}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {doc.docID ?? "—"}
          </TableCell>
          {renderEllipsisCell(doc.classVal)}
          {renderEllipsisCell(doc.topics)}
          {renderEllipsisCell(doc.description)}
          {renderEllipsisCell(doc.docName)}
          {renderEllipsisCell(doc.session)}
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {formatDate(doc.uploadedDate)}
          </TableCell>
          <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
            {renderPostedStatus(doc)}
          </TableCell>
        </TableRow>
      );
    });
  };

  const confirmContent = getConfirmDialogContent();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Class Material List
        </Typography>
        {canAddDocument ? (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              startIcon={<UploadIcon fontSize="inherit" />}
              onClick={onAdd}
              sx={portalHeaderActionButtonSx}
            >
              Upload Documents
            </Button>
          </Box>
        ) : null}
      </Box>

      <Typography component="div" sx={{ ...studentPortalIntroTextSx, mb: 1 }}>
        {" Lecture Notes Video "}
        <a
          href={YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={studentPortalLinkSx}
        >
          Agoura Math Circle YouTube Channel
        </a>
        {
          " Note: Subscription is required for all students. Please subscribe, it will help us to upload more videos."
        }
      </Typography>

      <Box sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
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
            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
              Session
            </MenuItem>
            <MenuItem value="DOC_NAME" sx={adminSessionListMenuItemSx}>
              Document Name
            </MenuItem>
          </Select>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Criteria:</Typography>
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
              <TableCell
                sx={adminSessionListTableHeadCellSx(documentColumnWidths.actions)}
              >
                Actions
              </TableCell>
              <SortableHeader
                label="Doc #"
                field="docNumber"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.docNumber,
                )}
              />
              <SortableHeader
                label="Class"
                field="className"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.className,
                )}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.topics,
                )}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.description,
                )}
              />
              <SortableHeader
                label="Document Name"
                field="documentName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.documentName,
                )}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.session,
                )}
              />
              <SortableHeader
                label="Posted Date"
                field="postedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.postedDate,
                )}
              />
              <TableCell
                sx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.posted,
                  true,
                )}
              >
                Posted
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableBody()}</TableBody>
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

      {confirmContent && (
        <AppConfirmDialog
          open={confirmDialog.open}
          onClose={handleConfirmDialogClose}
          onConfirm={handleConfirmDialogAction}
          title={confirmContent.title}
          message={confirmContent.message}
          confirmLabel={confirmContent.confirmLabel}
          confirmColor={confirmContent.confirmColor}
          icon={confirmContent.icon}
        />
      )}

      <AppConfirmDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, message: "" })}
        title="Notice"
        message={alertDialog.message}
      />

      <PdfViewerModal
        open={Boolean(selectedPdf)}
        pdfUrl={selectedPdf}
        pdfName={selectedPdf}
        onClose={onClosePdfViewer}
        basePath={config.paths.publicDocuments}
      />
    </Box>
  );
};

function matchField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

export default InstructorClassMaterialList;
