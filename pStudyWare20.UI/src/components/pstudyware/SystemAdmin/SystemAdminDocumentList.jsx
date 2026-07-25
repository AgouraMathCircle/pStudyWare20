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
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishIcon,
} from "@mui/icons-material";
import SystemAdminSessionListPagination from "./SystemAdminSessionListPagination";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import { getClassMaterialDeleteId, isClassMaterialPublished } from "../../../services/documentService";
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
  studentPortalIntroTextSx,
  studentPortalLinkSx,
} from "../styles/applicationSurfaces";

/** Column layout aligned with legacy pStudayWare/Documents.aspx kGrid. */
const documentListColumnWidths = {
  actions: "14%",
  docId: "5%",
  class: "9%",
  topics: "10%",
  description: "10%",
  name: "11%",
  session: "12%",
  postedDate: "9%",
  posted: "5%",
};

const actionDividerSx = {
  color: "text.secondary",
  fontSize: "0.75rem",
  userSelect: "none",
};

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
    ED: "Engineering Design",
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

const SystemAdminDocumentList = ({
  documents,
  onView,
  onDownload,
  onDelete,
  onPublish,
  onUnpublish,
  onOpenVideo,
  onAdd,
  canAddDocument,
  canDeleteDocument,
  canPublishDocument,
  refreshing = false,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [orderBy, setOrderBy] = useState("uploadedDate");
  const [order, setOrder] = useState("desc");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
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

  const filteredDocuments = useMemo(() => {
    if (!safeDocuments.length) return [];

    let filtered = safeDocuments;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = safeDocuments.filter((doc) => {
        let fieldValue = "";
        switch (searchBy) {
          case "DOC_ID":
            fieldValue = doc.docID?.toString() || "";
            break;
          case "CLASS":
            fieldValue = doc.class || "";
            break;
          case "TOPICS":
            fieldValue = doc.topics || "";
            break;
          case "DESCRIPTION":
            fieldValue = doc.description || "";
            break;
          case "DOC_NAME":
            fieldValue = doc.docName || "";
            break;
          case "SESSION":
            fieldValue = doc.session || "";
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

    return filtered;
  }, [safeDocuments, searchBy, searchCriteria, searchText]);

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
    if (!canDeleteDocument) {
      setAlertDialog({
        open: true,
        message: "You cannot delete this document.",
      });
      return;
    }
    if (isClassMaterialPublished(doc)) {
      setAlertDialog({
        open: true,
        message:
          "You cannot delete this document while it is published. Unpublish it first.",
      });
      return;
    }
    if (!getClassMaterialDeleteId(doc)) {
      setAlertDialog({
        open: true,
        message: "You cannot delete this document.",
      });
      return;
    }
    setConfirmDialog({ open: true, type: "delete", doc });
  };

  const handlePublishClick = (doc) => {
    if (isClassMaterialPublished(doc)) {
      setAlertDialog({
        open: true,
        message:
          "You cannot publish this document. Document has published already.",
      });
      return;
    }
    setConfirmDialog({ open: true, type: "publish", doc });
  };

  const handleUnpublishClick = (doc) => {
    if (!isClassMaterialPublished(doc)) {
      setAlertDialog({
        open: true,
        message: "This document is not published.",
      });
      return;
    }
    setConfirmDialog({ open: true, type: "unpublish", doc });
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
      onDelete(getClassMaterialDeleteId(doc), doc.docName);
    } else if (type === "publish") {
      onPublish(getClassMaterialDeleteId(doc));
    } else if (type === "unpublish") {
      onUnpublish(doc);
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
    if (type === "unpublish") {
      return {
        title: "Unpublish Document",
        message: `Are you sure you want to unpublish "${doc?.docName}"? Students will no longer see this document.`,
        confirmLabel: "Unpublish",
        confirmColor: "warning",
        icon: <UnpublishIcon sx={{ fontSize: 20 }} />,
      };
    }
    return null;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return "—";
      return parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const renderActionLink = (label, onClick, disabled = false, linkSx = {}) => (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        ...adminSessionListTableActionLinkSx,
        ...linkSx,
        ...(disabled
          ? { color: "text.disabled", cursor: "not-allowed", pointerEvents: "none" }
          : {}),
      }}
    >
      {label}
    </Box>
  );

  const renderDocumentActions = (doc) => {
    const published = isClassMaterialPublished(doc);
    const canDeleteRow =
      canDeleteDocument && !published && Boolean(getClassMaterialDeleteId(doc));
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        {renderActionLink("View", () => onView(doc.docName))}
        <Typography component="span" sx={actionDividerSx}>
          /
        </Typography>
        {renderActionLink("Download", () => onDownload(doc.docName))}
        {canDeleteDocument ? (
          <>
            <Typography component="span" sx={actionDividerSx}>
              /
            </Typography>
            {renderActionLink(
              "Delete",
              () => handleDeleteClick(doc),
              !canDeleteRow,
              {
                color: "error.main",
                "&:visited": { color: "error.main" },
                "&:hover": { color: "error.dark" },
              },
            )}
          </>
        ) : null}
        {doc.videoURL ? (
          <>
            <Typography component="span" sx={actionDividerSx}>
              /
            </Typography>
            {renderActionLink("Video", () => onOpenVideo(doc.videoURL))}
          </>
        ) : null}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Class Material List
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
          flexWrap: "nowrap",
        }}
      >
        <Typography
          component="div"
          sx={{
            ...studentPortalIntroTextSx,
            mb: 0,
            flex: 1,
            whiteSpace: "nowrap",
            fontSize: "calc(1rem - 1pt)",
            lineHeight: 1.25,
            overflow: "hidden",
          }}
        >
          {" Lecture Notes Video "}
          <Box
            component="a"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...studentPortalLinkSx,
              fontSize: "inherit",
              display: "inline",
            }}
          >
            Agoura Math Circle YouTube Channel
          </Box>
          {
            " Note: Subscription is required for all students. Please subscribe, it will help us to upload more videos."
          }
        </Typography>
        {canAddDocument && (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<UploadIcon fontSize="inherit" />}
            onClick={onAdd}
            sx={{
              ...adminSessionListFindButtonSx,
              backgroundColor: "#4caf50",
              color: "white",
              flexShrink: 0,
              px: 1.5,
              "&:hover": { backgroundColor: "#43a047" },
              "& .MuiButton-startIcon": {
                mr: 0.5,
                "& > *:first-of-type": { fontSize: "0.875rem" },
              },
            }}
          >
            Upload Documents
          </Button>
        )}
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

      <Box sx={{ position: "relative", width: "100%" }}>
        {refreshing ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.65)",
            }}
          >
            <CircularProgress size={32} />
          </Box>
        ) : null}
        <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table sx={adminSessionListGridTableSx} size="small">
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <TableCell sx={adminSessionListTableHeadCellSx(documentListColumnWidths.actions)}>
                Actions
              </TableCell>
              <SortableHeader
                label="Doc #"
                field="docID"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.docId)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.class)}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.topics)}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.description)}
              />
              <SortableHeader
                label="Name"
                field="docName"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.name)}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.session)}
              />
              <SortableHeader
                label="Posted Date"
                field="uploadedDate"
                sortField={orderBy}
                sortOrder={order}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(documentListColumnWidths.postedDate)}
              />
              <TableCell
                sx={{
                  ...adminSessionListTableHeadCellSx(documentListColumnWidths.posted, true),
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  px: 0.5,
                }}
              >
                Posted
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc, index) => {
                const isPublished = isClassMaterialPublished(doc);
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
                    <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                      {renderDocumentActions(doc)}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()}>
                      {doc.docID || "—"}
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={getClassLabel(doc.class)}>
                        <span>{getClassLabel(doc.class)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.topics || "—"}>
                        <span>{doc.topics || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.description || "—"}>
                        <span>{doc.description || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.docName || "—"}>
                        <span>{doc.docName || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                      <Tooltip title={doc.session || "—"}>
                        <span>{doc.session || "—"}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={adminSessionListTableBodyCellSx()}>
                      {formatDate(doc.uploadedDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...adminSessionListTableBodyCellSx({ action: true, isLast: true }),
                        whiteSpace: "nowrap",
                        textAlign: "center",
                        px: 0.5,
                      }}
                    >
                      {isPublished ? (
                        canPublishDocument ? (
                          renderActionLink("Unpublish", () =>
                            handleUnpublishClick(doc),
                          )
                        ) : (
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#2e7d32",
                            }}
                          >
                            Published
                          </Typography>
                        )
                      ) : canPublishDocument ? (
                        renderActionLink("Publish", () => handlePublishClick(doc))
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    {searchText
                      ? "No documents found matching your search criteria."
                      : "No document data available."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </TableContainer>
      </Box>

      <SystemAdminSessionListPagination
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

export default SystemAdminDocumentList;
