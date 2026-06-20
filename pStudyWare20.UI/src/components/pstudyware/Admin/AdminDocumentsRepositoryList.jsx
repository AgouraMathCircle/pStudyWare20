import React, { useEffect, useMemo, useState } from "react";
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
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  getClassMaterialDeleteId,
  getRepositoryDocumentName,
} from "../../../services/documentService";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
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
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  adminSessionListToolbarButtonSx,
} from "../styles/applicationSurfaces";

const repositoryColumnWidths = {
  actions: "12%",
  docId: "6%",
  class: "9%",
  topics: "12%",
  description: "11%",
  name: "16%",
  session: "12%",
  postedDate: "10%",
};

const actionDividerSx = {
  fontSize: "0.75rem",
  color: "text.disabled",
  userSelect: "none",
  lineHeight: 1,
};

function matchField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

const getRepositoryFieldValue = (doc, field) => {
  switch (field) {
    case "docID":
      return toSortableNumber(doc.docID || doc.mDocID);
    case "class":
      return doc.class ?? "";
    case "topics":
      return doc.topics ?? "";
    case "description":
      return doc.description ?? "";
    case "docName":
      return doc.docName || doc.mDocName || "";
    case "session":
      return doc.session || doc.mSession || "";
    case "postedDate":
      return toSortableDate(doc.uploadedDate || doc.insertDate);
    default:
      return "";
  }
};

const AdminDocumentsRepositoryList = ({
  documents,
  onView,
  onDelete,
  onUpload,
  canDelete = true,
  canUpload = true,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteDialog, setDeleteDialog] = useState({ open: false, doc: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [safeDocuments]);

  const filteredDocuments = useMemo(() => {
    const q = searchText.trim();
    if (!q) return safeDocuments;

    if (searchBy === "ALL") {
      return safeDocuments.filter(
        (doc) =>
          matchField(doc.class, q, searchCriteria) ||
          matchField(doc.topics, q, searchCriteria) ||
          matchField(doc.description, q, searchCriteria) ||
          matchField(doc.session || doc.mSession, q, searchCriteria) ||
          matchField(doc.docName || doc.mDocName, q, searchCriteria) ||
          matchField(doc.docID || doc.mDocID, q, searchCriteria),
      );
    }

    return safeDocuments.filter((doc) => {
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
          fieldValue = doc.session || doc.mSession || "";
          break;
        case "DOC_NAME":
          fieldValue = doc.docName || doc.mDocName || "";
          break;
        default:
          return true;
      }
      return matchField(fieldValue, q, searchCriteria);
    });
  }, [safeDocuments, searchText, searchBy, searchCriteria]);

  const sortedDocuments = useMemo(
    () => sortRows(filteredDocuments, sortField, sortOrder, getRepositoryFieldValue),
    [filteredDocuments, sortField, sortOrder],
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
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
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

  const getDeleteId = (doc) => getClassMaterialDeleteId(doc);

  const handleDeleteClick = (doc) => {
    const deleteId = getDeleteId(doc);
    if (!deleteId) {
      setAlertDialog({
        open: true,
        message:
          "You cannot delete this document. Document has been posted already.",
      });
      return;
    }
    setDeleteDialog({ open: true, doc });
  };

  const handleDeleteConfirm = () => {
    const { doc } = deleteDialog;
    setDeleteDialog({ open: false, doc: null });
    if (doc) {
      onDelete(getDeleteId(doc), getRepositoryDocumentName(doc));
    }
  };

  const formatDate = (dateString) => {
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
      return "—";
    }
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
      <Box
        onClick={() => onView(doc.docName || doc.mDocName)}
        sx={adminSessionListTableActionLinkSx}
      >
        View/Print
      </Box>
      {canDelete ? (
        <>
          <Typography component="span" sx={actionDividerSx}>
            /
          </Typography>
          <Box
            onClick={() => handleDeleteClick(doc)}
            sx={{
              ...adminSessionListTableActionLinkSx,
              color: "error.main",
              "&:visited": { color: "error.main" },
              "&:hover": { color: "error.dark" },
            }}
          >
            Delete
          </Box>
        </>
      ) : null}
    </Box>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Documents List
        </Typography>
        {canUpload ? (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<UploadIcon />}
            onClick={onUpload}
            sx={adminSessionListToolbarButtonSx}
          >
            Upload Documents
          </Button>
        ) : null}
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
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                sx={adminSessionListTableHeadCellSx(repositoryColumnWidths.actions)}
              >
                Actions
              </TableCell>
              <SortableHeader
                label="Doc #"
                field="docID"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(repositoryColumnWidths.docId)}
              />
              <SortableHeader
                label="Class"
                field="class"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(repositoryColumnWidths.class)}
              />
              <SortableHeader
                label="Topics"
                field="topics"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(repositoryColumnWidths.topics)}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  repositoryColumnWidths.description,
                )}
              />
              <SortableHeader
                label="Name"
                field="docName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(repositoryColumnWidths.name)}
              />
              <SortableHeader
                label="Session"
                field="session"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(repositoryColumnWidths.session)}
              />
              <SortableHeader
                label="Posted Date"
                field="postedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  repositoryColumnWidths.postedDate,
                  true,
                )}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc, index) => (
                <TableRow
                  key={doc.docID || doc.mDocID || index}
                  sx={adminSessionListTableBodyRowSx}
                >
                  <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                    {renderDocumentActions(doc)}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {doc.docID || doc.mDocID || "—"}
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={doc.class ?? "—"}>
                      <span>{doc.class ?? "—"}</span>
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
                    <Tooltip title={doc.docName || doc.mDocName || "—"}>
                      <span>{doc.docName || doc.mDocName || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={doc.session || doc.mSession || "—"}>
                      <span>{doc.session || doc.mSession || "—"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                    {formatDate(doc.uploadedDate || doc.insertDate)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={adminSessionListEmptyTextSx}
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

      <AppConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, doc: null })}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={
          deleteDialog.doc
            ? `Do you want to delete this document? (${deleteDialog.doc.docName || deleteDialog.doc.mDocName})`
            : ""
        }
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
      />

      <AppConfirmDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, message: "" })}
        title="Notice"
        message={alertDialog.message}
      />
    </Box>
  );
};

export default AdminDocumentsRepositoryList;
