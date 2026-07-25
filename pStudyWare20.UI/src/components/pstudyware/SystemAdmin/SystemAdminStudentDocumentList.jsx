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
import SystemAdminSessionListPagination from "./SystemAdminSessionListPagination";
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
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListGridTableSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

const studentDocsColWidthsPx = [
  68, // Doc #
  null, // Description
  88, // Type
  null, // Document Name
  96, // Posted Date
  190, // Actions — View / Download / Delete
];

const studentDocsBodyCellSx = (options = {}) => ({
  ...adminSessionListTableBodyCellSx(options),
  verticalAlign: "middle",
});

const studentDocsHeadCellSx = (isLast = false) => ({
  ...adminSessionListTableHeadCellSx(undefined, isLast),
  verticalAlign: "middle",
});

function matchField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

const getStudentDocumentFieldValue = (doc, field) => {
  switch (field) {
    case "docID":
      return toSortableNumber(doc.docID);
    case "description":
      return doc.description ?? "";
    case "type":
      return doc.type ?? "";
    case "documentName":
      return doc.documentName ?? "";
    case "insertDate":
      return toSortableDate(doc.insertDate);
    default:
      return "";
  }
};

const SystemAdminStudentDocumentList = ({
  documents,
  onView,
  onDownload,
  onDelete,
}) => {
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("insertDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 20;

  const filteredDocuments = useMemo(() => {
    const q = searchText.trim();
    if (!q) return safeDocuments;

    if (searchBy === "ALL") {
      return safeDocuments.filter(
        (doc) =>
          matchField(doc.description, q, searchCriteria) ||
          matchField(doc.type, q, searchCriteria) ||
          matchField(doc.documentName, q, searchCriteria) ||
          matchField(doc.docID, q, searchCriteria),
      );
    }

    return safeDocuments.filter((doc) => {
      let fieldValue = "";
      switch (searchBy) {
        case "DESCRIPTION":
          fieldValue = doc.description || "";
          break;
        case "TYPE":
          fieldValue = doc.type || "";
          break;
        case "DOC_NAME":
          fieldValue = doc.documentName || "";
          break;
        default:
          return true;
      }
      return matchField(fieldValue, q, searchCriteria);
    });
  }, [safeDocuments, searchText, searchBy, searchCriteria]);

  const sortedDocuments = useMemo(
    () => sortRows(filteredDocuments, sortField, sortOrder, getStudentDocumentFieldValue),
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

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
    } catch {
      return "-";
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
      <Box onClick={() => onView(doc.documentName)} sx={adminSessionListTableActionLinkSx}>
        View/Print
      </Box>
      <Typography
        component="span"
        sx={{ fontSize: "0.75rem", color: "text.disabled", userSelect: "none", lineHeight: 1 }}
      >
        |
      </Typography>
      <Box
        onClick={() => onDelete(doc)}
        sx={adminSessionListTableDeleteLinkSx}
      >
        Delete
      </Box>
    </Box>
  );

  return (
    <Box>
      <Box sx={adminSessionListHeaderBarSx}>
        <Box>
          <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
            Student Documents List
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            View and manage student-uploaded documents (legacy StudentDocuments.aspx).
          </Typography>
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
        <Table sx={{ ...adminSessionListGridTableSx, minWidth: 720 }} size="small">
          <colgroup>
            {studentDocsColWidthsPx.map((w, i) => (
              <col key={i} style={w == null ? undefined : { width: w }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              <SortableHeader
                label="Doc #"
                field="docID"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={studentDocsHeadCellSx()}
              />
              <SortableHeader
                label="Description"
                field="description"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={studentDocsHeadCellSx()}
              />
              <SortableHeader
                label="Type"
                field="type"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={studentDocsHeadCellSx()}
              />
              <SortableHeader
                label="Document Name"
                field="documentName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={studentDocsHeadCellSx()}
              />
              <SortableHeader
                label="Posted Date"
                field="insertDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={studentDocsHeadCellSx()}
              />
              <TableCell sx={studentDocsHeadCellSx(true)}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map((doc) => (
                <TableRow key={doc.documentID} sx={adminSessionListTableBodyRowSx}>
                  <TableCell sx={studentDocsBodyCellSx()}>{doc.docID ?? "-"}</TableCell>
                  <TableCell sx={studentDocsBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={doc.description || "-"}>
                      <span>{doc.description || "-"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={studentDocsBodyCellSx()}>{doc.type || "-"}</TableCell>
                  <TableCell sx={studentDocsBodyCellSx({ ellipsis: true })}>
                    <Tooltip title={doc.documentName || "-"}>
                      <span>{doc.documentName || "-"}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={studentDocsBodyCellSx()}>{formatDate(doc.insertDate)}</TableCell>
                  <TableCell sx={studentDocsBodyCellSx({ isLast: true, action: true })}>
                    {renderDocumentActions(doc)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    {searchText
                      ? "No documents found matching your search."
                      : "No documents found."}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
    </Box>
  );
};

export default SystemAdminStudentDocumentList;
