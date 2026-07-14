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
import { sortRows, toSortableDate, toSortableNumber } from "../../../utils/tableSort";
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
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

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

const COL_WIDTHS = {
  instructorId: "8%",
  firstName: "10%",
  lastName: "10%",
  chapter: "12%",
  session: "8%",
  class: "12%",
  type: "12%",
  availability: "10%",
  comments: "10%",
  responseDate: "8%",
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

const widthForCol = (searchBy) => {
  switch (searchBy) {
    case "INSTRUCTOR_ID":
      return COL_WIDTHS.instructorId;
    case "FIRST_NAME":
      return COL_WIDTHS.firstName;
    case "LAST_NAME":
      return COL_WIDTHS.lastName;
    case "CHAPTER":
      return COL_WIDTHS.chapter;
    case "SESSION":
      return COL_WIDTHS.session;
    case "CLASS":
      return COL_WIDTHS.class;
    case "TYPE":
      return COL_WIDTHS.type;
    case "AVAILABILITY":
      return COL_WIDTHS.availability;
    case "COMMENTS":
      return COL_WIDTHS.comments;
    case "RESPONSE_DATE":
      return COL_WIDTHS.responseDate;
    default:
      return undefined;
  }
};

const InstructorVolunteerAvailabilityGrid = ({
  rows = [],
  loading = false,
  error = null,
  hideTitle = false,
}) => {
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("RESPONSE_DATE");
  const [sortOrder, setSortOrder] = useState("desc");
  const pageSize = 10;

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
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (totalRecords === 0) {
      setGoToPageInput("1");
      return;
    }
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
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

  const renderEllipsisCell = (value, isLast = false) => {
    const display = value || "—";
    return (
      <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true, isLast })}>
        <Tooltip title={display} arrow>
          <span>{display}</span>
        </Tooltip>
      </TableCell>
    );
  };

  return (
    <Box className="instructor-dashboard-volunteer-availability-table" sx={{ width: "100%" }}>
      {!hideTitle && (
        <Box sx={adminSessionListHeaderBarSx}>
          <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
            Volunteers Availability List for upcoming class
          </Typography>
        </Box>
      )}

      <Box className="admin-session-list-search" sx={adminSessionListSearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
          <Select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            size="small"
            sx={adminSessionListSearchSelectSx}
            disabled={loading}
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
            disabled={loading}
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
          disabled={loading}
        />

        <Button
          variant="contained"
          size="small"
          onClick={handleSearch}
          sx={adminSessionListFindButtonSx}
          disabled={loading}
        >
          Find
        </Button>
      </Box>

      <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
        <Table size="small" sx={adminSessionListGridTableSx}>
          <TableHead>
            <TableRow sx={adminSessionListTableHeadRowSx}>
              {COLS.map((c, index) => (
                <SortableHeader
                  key={c.searchBy}
                  label={c.label}
                  field={c.searchBy}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(
                    widthForCol(c.searchBy),
                    index === COLS.length - 1,
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
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {cell(row, COLS[0].keys) || "—"}
                  </TableCell>
                  {renderEllipsisCell(cell(row, COLS[1].keys))}
                  {renderEllipsisCell(cell(row, COLS[2].keys))}
                  {renderEllipsisCell(cell(row, COLS[3].keys))}
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {cell(row, COLS[4].keys) || "—"}
                  </TableCell>
                  {renderEllipsisCell(cell(row, COLS[5].keys))}
                  {renderEllipsisCell(cell(row, COLS[6].keys))}
                  <TableCell sx={adminSessionListTableBodyCellSx()}>
                    {cell(row, COLS[7].keys) || "—"}
                  </TableCell>
                  {renderEllipsisCell(cell(row, COLS[8].keys))}
                  <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true })}>
                    {cell(row, COLS[9].keys) || "—"}
                  </TableCell>
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

export default InstructorVolunteerAvailabilityGrid;
