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
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
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
} from "../styles/applicationSurfaces";

const documentColumnWidths = {
  actions: "16%",
  docNumber: "8%",
  description: "22%",
  type: "12%",
  documentName: "28%",
  postedDate: "14%",
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

const getStudentDocumentFieldValue = (doc, field) => {
  switch (field) {
    case "docNumber":
      return toSortableNumber(doc.docID);
    case "description":
      return doc.description ?? "";
    case "type":
      return doc.type ?? "";
    case "documentName":
      return doc.documentName ?? "";
    case "postedDate":
      return toSortableDate(doc.insertDate);
    default:
      return "";
  }
};

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

/**
 * Student documents list for instructors — same layout as InstructorClassMaterialList.
 */
const InstructorStudentDocumentList = ({
  documents,
  onView,
  onDownload,
  onDelete,
  deletingDocument = false,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const rows = useMemo(() => safeDocuments, [safeDocuments]);

  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("postedDate");
  const [sortOrder, setSortOrder] = useState("desc");
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
      sortRows(filteredData, sortField, sortOrder, getStudentDocumentFieldValue),
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
            matchField(doc.description, search, criteria) ||
            matchField(doc.type, search, criteria) ||
            matchField(doc.documentName, search, criteria) ||
            matchField(doc.docID, search, criteria),
        );
      } else {
        filtered = filtered.filter((doc) => {
          let fieldValue = "";
          switch (searchBy) {
            case "DESCRIPTION":
              fieldValue = doc.description;
              break;
            case "TYPE":
              fieldValue = doc.type;
              break;
            case "DOC_NAME":
              fieldValue = doc.documentName;
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
        () => onView(doc.documentName),
        false,
        {},
        `View ${doc.documentName || "document"}`,
      )}
      <Typography component="span" sx={actionDividerSx}>
        /
      </Typography>
      {renderActionLink(
        "Download",
        () => onDownload(doc.documentName),
        false,
        {},
        `Download ${doc.documentName || "document"}`,
      )}
      <Typography component="span" sx={actionDividerSx}>
        /
      </Typography>
      {renderActionLink(
        "Delete",
        () => onDelete(doc),
        deletingDocument,
        adminSessionListTableDeleteLinkSx,
        deletingDocument
          ? "Deleting document…"
          : `Delete ${doc.documentName || "document"}`,
      )}
    </Box>
  );

  const emptyMessage = searchText
    ? "No documents found matching your search."
    : "No documents available.";

  const renderTableBody = () => {
    if (paginatedDocuments.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
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

    return paginatedDocuments.map((doc, index) => (
      <TableRow
        key={doc.documentID || doc.docID || index}
        sx={adminSessionListTableBodyRowSx}
      >
        <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
          {renderDocumentActions(doc)}
        </TableCell>
        <TableCell sx={adminSessionListTableBodyCellSx()}>
          {doc.docID ?? "—"}
        </TableCell>
        {renderEllipsisCell(doc.description)}
        {renderEllipsisCell(doc.type)}
        {renderEllipsisCell(doc.documentName)}
        <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
          {formatDate(doc.insertDate)}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={adminSessionListHeaderBarSx}>
        <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
          Student Documents List
        </Typography>
      </Box>

      <Box className="admin-session-list-search" sx={adminSessionListSearchBarSx}>
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
            <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
              Description
            </MenuItem>
            <MenuItem value="TYPE" sx={adminSessionListMenuItemSx}>
              Type
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
                label="Type"
                field="type"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.type,
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
                label="Posted Date"
                field="postedDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={adminSessionListTableHeadCellSx(
                  documentColumnWidths.postedDate,
                  true,
                )}
              />
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
    </Box>
  );
};

export default InstructorStudentDocumentList;
