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
import { Edit as EditIcon } from "@mui/icons-material";
import { useUpdateProfileModal } from "../../../contexts/UpdateProfileModalContext";
import InstructorPortalPaginationBar from "./InstructorPortalPaginationBar";
import SortableHeader from "../Common/SortableHeader";
import { sortRows, toSortableNumber } from "../../../utils/tableSort";
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
  instructorStudentListColWidthsPx,
  instructorTableBodyRowZebraSx,
  instructorTableHeadRowSx,
  instructorTableSx,
} from "./instructorPortalTableStyles";

const COLS = [
  { label: "Student #", keys: ["StudentID", "studentID"], searchBy: "STUDENT_ID" },
  { label: "Student Name", keys: ["StudentName", "studentName"], searchBy: "STUDENT_NAME" },
  { label: "Class", keys: ["Class", "class"], searchBy: "CLASS" },
  { label: "Grade", keys: ["Grade", "grade"], searchBy: "GRADE" },
  { label: "School", keys: ["School", "school"], searchBy: "SCHOOL" },
  { label: "Parent", keys: ["ParentName", "parentName"], searchBy: "PARENT" },
  { label: "Session", keys: ["EventSession", "eventSession"], searchBy: "SESSION" },
  { label: "Location", keys: ["EventLocation", "eventLocation"], searchBy: "LOCATION" },
];

function cell(row, keys) {
  if (!row || typeof row !== "object") return "";
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) {
      const v = row[k];
      return typeof v === "object" ? String(v) : String(v);
    }
  }
  return "";
}

function studentId(row) {
  const raw = cell(row, ["StudentID", "studentID"]);
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
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

const getStudentListFieldValue = (row, field) => {
  const col = COLS.find((c) => c.searchBy === field);
  if (!col) return "";
  const val = cell(row, col.keys);
  if (field === "STUDENT_ID") return toSortableNumber(val);
  return val;
};

/**
 * My Student List — same table/search/pagination chrome as instructor student-documents.
 */
const InstructorStudentListGrid = ({ rows = [], loading = false, error = null }) => {
  const { openUpdateProfile } = useUpdateProfileModal();
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("STUDENT_NAME");
  const [sortOrder, setSortOrder] = useState("asc");
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
    () => sortRows(filteredRows, sortField, sortOrder, getStudentListFieldValue),
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
      ? "No students matching your search."
      : "No students found.";

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
            My Student List
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Students in your chapter (AMC_spSelectStudentList).
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
            <MenuItem value="STUDENT_ID" sx={{ fontSize: "0.75rem" }}>
              Student #
            </MenuItem>
            <MenuItem value="STUDENT_NAME" sx={{ fontSize: "0.75rem" }}>
              Student Name
            </MenuItem>
            <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>
              Class
            </MenuItem>
            <MenuItem value="GRADE" sx={{ fontSize: "0.75rem" }}>
              Grade
            </MenuItem>
            <MenuItem value="SCHOOL" sx={{ fontSize: "0.75rem" }}>
              School
            </MenuItem>
            <MenuItem value="PARENT" sx={{ fontSize: "0.75rem" }}>
              Parent
            </MenuItem>
            <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>
              Session
            </MenuItem>
            <MenuItem value="LOCATION" sx={{ fontSize: "0.75rem" }}>
              Location
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
        <Table size="small" sx={{ ...instructorTableSx, minWidth: 960 }}>
          <colgroup>
            {instructorStudentListColWidthsPx.map((w, i) => (
              <col key={i} style={w == null ? undefined : { width: w }} />
            ))}
          </colgroup>
          <TableHead>
            <TableRow sx={instructorTableHeadRowSx}>
              {COLS.map((c) => (
                <SortableHeader
                  key={c.label}
                  label={c.label}
                  field={c.searchBy}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={instructorCellHeaderSx}
                />
              ))}
              <TableCell sx={instructorCellHeaderSxLast} align="right">
                Profile
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ fontSize: "0.75rem", py: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                    Loading students…
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ fontSize: "0.75rem", py: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pageRows.map((row, idx) => {
                const sid = studentId(row);
                return (
                  <TableRow key={sid ?? `row-${idx}`} sx={instructorTableBodyRowZebraSx}>
                    {COLS.map((c) => (
                      <TableCell key={c.label} sx={instructorCellBodySx}>
                        {cell(row, c.keys)}
                      </TableCell>
                    ))}
                    <TableCell sx={instructorCellBodySxLast} align="right">
                      {sid ? (
                        <Box
                          onClick={() => openUpdateProfile(sid)}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            fontSize: "0.75rem",
                            color: "#0000ee",
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": { color: "#551a8b" },
                          }}
                        >
                          <EditIcon sx={{ fontSize: "1rem" }} />
                          Update
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
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

export default InstructorStudentListGrid;
