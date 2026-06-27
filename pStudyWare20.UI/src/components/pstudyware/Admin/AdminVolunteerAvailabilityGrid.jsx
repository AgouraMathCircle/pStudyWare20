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
  Typography,
} from "@mui/material";
import SortableHeader from "../Common/SortableHeader";
import { sortRows, toSortableDate, toSortableNumber } from "../../../utils/tableSort";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListMenuItemSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
} from "../styles/applicationSurfaces";
import AdminSessionListPagination from "./AdminSessionListPagination";

const COLS = [
  { label: "Instructor #", keys: ["InstructorID", "instructorID"], searchBy: "INSTRUCTOR_ID" },
  { label: "First Name", keys: ["FirstName", "firstName"], searchBy: "FIRST_NAME" },
  { label: "Last Name", keys: ["LastName", "lastName"], searchBy: "LAST_NAME" },
  { label: "Chapter", keys: ["ChapterName", "chapterName"], searchBy: "CHAPTER" },
  { label: "Session", keys: ["Session", "session"], searchBy: "SESSION" },
  { label: "Class", keys: ["Class", "class"], searchBy: "CLASS" },
  { label: "Type", keys: ["InstructorType", "instructorType"], searchBy: "TYPE" },
  { label: "Availability", keys: ["Availability", "availability"], searchBy: "AVAILABILITY" },
  { label: "Comments", keys: ["Comments", "comments"], searchBy: "COMMENTS" },
  { label: "ResponseDate", keys: ["ResponseDate", "responseDate"], searchBy: "RESPONSE_DATE" },
];

const columnWidths = {
  instructorId: "7%",
  firstName: "9%",
  lastName: "9%",
  chapter: "12%",
  session: "7%",
  class: "10%",
  type: "11%",
  availability: "8%",
  comments: "17%",
  responseDate: "10%",
};

const WIDTH_BY_SEARCH = {
  INSTRUCTOR_ID: columnWidths.instructorId,
  FIRST_NAME: columnWidths.firstName,
  LAST_NAME: columnWidths.lastName,
  CHAPTER: columnWidths.chapter,
  SESSION: columnWidths.session,
  CLASS: columnWidths.class,
  TYPE: columnWidths.type,
  AVAILABILITY: columnWidths.availability,
  COMMENTS: columnWidths.comments,
  RESPONSE_DATE: columnWidths.responseDate,
};

function cell(row, keys) {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) {
      const v = row[k];
      if (k === "ResponseDate" || k === "responseDate") {
        try {
          const d = new Date(v);
          return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
        } catch {
          return String(v);
        }
      }
      return String(v);
    }
  }
  return "";
}

function rawCell(row, keys) {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return "";
}

function matchField(fieldValue, search, criteria) {
  const f = String(fieldValue ?? "").toLowerCase();
  const s = String(search ?? "").toLowerCase();
  if (criteria === "equals") return f === s;
  if (criteria === "starts_with") return f.startsWith(s);
  return f.includes(s);
}

function filterRows(rows, searchBy, searchCriteria, searchText) {
  const q = searchText.trim();
  if (!q) return rows;
  return rows.filter((row) => {
    if (searchBy === "ALL") {
      return COLS.some((c) => matchField(cell(row, c.keys), q, searchCriteria));
    }
    const col = COLS.find((c) => c.searchBy === searchBy);
    if (!col) return true;
    return matchField(cell(row, col.keys), q, searchCriteria);
  });
}

const getAvailabilityFieldValue = (row, field) => {
  const col = COLS.find((c) => c.searchBy === field);
  if (!col) return "";
  if (field === "INSTRUCTOR_ID") {
    return toSortableNumber(rawCell(row, col.keys));
  }
  if (field === "RESPONSE_DATE") {
    return toSortableDate(rawCell(row, col.keys));
  }
  return cell(row, col.keys);
};

const AdminVolunteerAvailabilityGrid = ({ rows = [], loading = false, error = null }) => {
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("RESPONSE_DATE");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 25;

  useEffect(() => {
    setFilteredRows(rows);
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [rows]);

  const handleSearch = () => {
    const next = filterRows(rows, searchBy, searchCriteria, searchText);
    setFilteredRows(next);
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

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortField, sortOrder, getAvailabilityFieldValue),
    [filteredRows, sortField, sortOrder],
  );

  const totalRecords = sortedRows.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handlePageChange = (page) => {
    const maxPage = Math.ceil(totalRecords / pageSize) || 1;
    if (page >= 1 && page <= maxPage) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const max = Math.ceil(totalRecords / pageSize);
    if (totalRecords === 0) {
      setGoToPageInput("1");
      return;
    }
    if (!Number.isNaN(page) && page >= 1 && page <= max) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const emptyMessage =
    rows.length > 0 && filteredRows.length === 0
      ? "No availability records matching your search."
      : "No availability records found.";

  return (
    <Box className="admin-volunteer-availability-table-panel">
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
            {COLS.map((c) => (
              <MenuItem key={c.searchBy} value={c.searchBy} sx={adminSessionListMenuItemSx}>
                {c.label}
              </MenuItem>
            ))}
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
        <Button variant="contained" size="small" onClick={handleSearch} sx={adminSessionListFindButtonSx}>
          Find
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        className="admin-volunteer-availability-table-container"
        sx={{ width: "100%" }}
      >
        <Table
          className="admin-volunteer-availability-table"
          sx={adminSessionListGridTableSx}
          size="small"
        >
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              {COLS.map((c, i) => (
                <SortableHeader
                  key={c.label}
                  label={c.label}
                  field={c.searchBy}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(
                    WIDTH_BY_SEARCH[c.searchBy],
                    i === COLS.length - 1,
                  )}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={COLS.length} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    Loading volunteer availability summary…
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLS.length} align="center" sx={adminSessionListEmptyCellSx}>
                  <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pageRows.map((row, idx) => (
                <TableRow key={idx} sx={adminSessionListTableBodyRowSx}>
                  {COLS.map((c, i) => {
                    const isLast = i === COLS.length - 1;
                    const isResponseDate = c.searchBy === "RESPONSE_DATE";
                    const isInstructorId = c.searchBy === "INSTRUCTOR_ID";
                    return (
                      <TableCell
                        key={c.label}
                        sx={adminSessionListTableBodyCellSx({
                          isLast,
                          ellipsis: !isResponseDate && !isInstructorId,
                        })}
                      >
                        <Box
                          component="span"
                          sx={
                            isResponseDate || isInstructorId
                              ? { whiteSpace: "nowrap" }
                              : undefined
                          }
                        >
                          {cell(row, c.keys) || "—"}
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
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
    </Box>
  );
};

export default AdminVolunteerAvailabilityGrid;
