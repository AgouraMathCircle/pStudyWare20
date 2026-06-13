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
import InstructorPortalPaginationBar from "./InstructorPortalPaginationBar";
import SortableHeader from "../Common/SortableHeader";
import { sortRows, toSortableDate, toSortableNumber } from "../../../utils/tableSort";
import {
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
  instructorTableBodyRowZebraSx,
  instructorTableHeadRowSx,
  instructorTableSx,
} from "./instructorPortalTableStyles";

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

const COL_WIDTHS = [
  80,   // Instructor #
  100,  // First Name
  100,  // Last Name
  null, // Chapter (flexible)
  80,   // Session
  120,  // Class
  140,  // Type
  85,   // Availability
  null, // Comments (flexible)
  150,  // ResponseDate
];

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

const InstructorVolunteerAvailabilityGrid = ({ rows = [], loading = false, error = null }) => {
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
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
    <Box>
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
          <Typography variant="subtitle1" sx={instructorPageTitleSx}>
            Volunteers Availability List for upcoming class
          </Typography>
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
            {COLS.map((c) => (
              <MenuItem key={c.searchBy} value={c.searchBy} sx={{ fontSize: "0.75rem" }}>
                {c.label}
              </MenuItem>
            ))}
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
        <Button variant="contained" size="small" onClick={handleSearch} sx={instructorFindButtonSx}>
          Find
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table size="small" sx={{ ...instructorTableSx, minWidth: 1000 }}>
          <colgroup>
            {COL_WIDTHS.map((w, i) => (
              <col key={i} style={w == null ? undefined : { width: w }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow sx={instructorTableHeadRowSx}>
              {COLS.map((c, i) => (
                <SortableHeader
                  key={c.label}
                  label={c.label}
                  field={c.searchBy}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={
                    i === COLS.length - 1 ? instructorCellHeaderSxLast : instructorCellHeaderSx
                  }
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={COLS.length} align="center" sx={{ fontSize: "0.75rem", py: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                    Loading volunteer availability summary…
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLS.length} align="center" sx={{ fontSize: "0.75rem", py: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pageRows.map((row, idx) => (
                <TableRow key={idx} sx={instructorTableBodyRowZebraSx}>
                  {COLS.map((c, i) => (
                    <TableCell
                      key={c.label}
                      sx={i === COLS.length - 1 ? instructorCellBodySxLast : instructorCellBodySx}
                    >
                      {cell(row, c.keys)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
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
      />
    </Box>
  );
};

export default InstructorVolunteerAvailabilityGrid;
