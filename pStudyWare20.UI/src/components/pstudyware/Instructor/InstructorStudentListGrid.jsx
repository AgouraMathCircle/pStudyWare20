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
import { useUpdateProfileModal } from "../../../contexts/UpdateProfileModalContext";
import InstructorPortalPaginationBar from "./InstructorPortalPaginationBar";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import { sortRows, toSortableNumber } from "../../../utils/tableSort";
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
} from "../styles/applicationSurfaces";
import {
  instructorCellBodySx,
  instructorCellBodySxLast,
  instructorCellHeaderSx,
  instructorCellHeaderSxLast,
  instructorFindButtonSx,
  instructorGreenSearchBarSx,
  instructorDashboardStudentListColWidthsPx,
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
  { label: "Student #", keys: ["StudentID", "studentID"], searchBy: "STUDENT_ID", ellipsis: false },
  { label: "Student Name", keys: ["StudentName", "studentName"], searchBy: "STUDENT_NAME", ellipsis: true },
  { label: "Class", keys: ["Class", "class"], searchBy: "CLASS", ellipsis: true },
  { label: "Grade", keys: ["Grade", "grade"], searchBy: "GRADE", ellipsis: false },
  { label: "School", keys: ["School", "school"], searchBy: "SCHOOL", ellipsis: true },
  { label: "Parent", keys: ["ParentName", "parentName"], searchBy: "PARENT", ellipsis: true },
  { label: "Session", keys: ["EventSession", "eventSession"], searchBy: "SESSION", ellipsis: true },
  { label: "Location", keys: ["EventLocation", "eventLocation"], searchBy: "LOCATION", ellipsis: true },
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

const DashboardEllipsisCell = ({ value, isLast = false }) => {
  const display = value || "—";
  return (
    <TableCell sx={adminSessionListTableBodyCellSx({ isLast, ellipsis: true })}>
      <Tooltip title={display}>
        <span>{display}</span>
      </Tooltip>
    </TableCell>
  );
};

/**
 * My Student List — dashboard uses student portal table chrome; other routes use instructor green bars.
 */
const InstructorStudentListGrid = ({
  rows = [],
  loading = false,
  error = null,
  dashboardView = false,
  onStudentSaved,
}) => {
  const { openUpdateProfile } = useUpdateProfileModal();
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState(dashboardView ? "" : "contains");
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState(rows);
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("STUDENT_NAME");
  const [sortOrder, setSortOrder] = useState("asc");
  const pageSize = dashboardView ? 25 : 10;

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

  const handleEditProfile = (sid) => {
    openUpdateProfile(sid, onStudentSaved);
  };

  const emptyMessage =
    rows.length > 0 && filteredRows.length === 0
      ? "No students matching your search."
      : "No students found.";

  const renderDashboardTableBody = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              Loading students…
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    if (pageRows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={9} align="center" sx={adminSessionListEmptyCellSx}>
            <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
              {emptyMessage}
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    return pageRows.map((row, idx) => {
      const sid = studentId(row);
      return (
        <TableRow key={sid ?? `row-${idx}`} sx={adminSessionListTableBodyRowSx}>
          <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
            {sid ? (
              <Box onClick={() => handleEditProfile(sid)} sx={adminSessionListTableActionLinkSx}>
                Edit
              </Box>
            ) : (
              "—"
            )}
          </TableCell>
          <TableCell sx={{ ...adminSessionListTableBodyCellSx(), whiteSpace: "nowrap" }}>
            {sid ?? "—"}
          </TableCell>
          <DashboardEllipsisCell value={cell(row, COLS[1].keys)} />
          <DashboardEllipsisCell value={cell(row, COLS[2].keys)} />
          <TableCell sx={adminSessionListTableBodyCellSx()}>
            {cell(row, COLS[3].keys) || "—"}
          </TableCell>
          <DashboardEllipsisCell value={cell(row, COLS[4].keys)} />
          <DashboardEllipsisCell value={cell(row, COLS[5].keys)} />
          <TableCell sx={{ ...adminSessionListTableBodyCellSx(), whiteSpace: "nowrap" }}>
            {cell(row, COLS[6].keys) || "—"}
          </TableCell>
          <TableCell sx={{ ...adminSessionListTableBodyCellSx({ isLast: true }), whiteSpace: "nowrap" }}>
            {cell(row, COLS[7].keys) || "—"}
          </TableCell>
        </TableRow>
      );
    });
  };

  if (dashboardView) {
    return (
      <Box sx={{ width: "100%" }}>
        <Box sx={adminSessionListHeaderBarSx}>
          <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
            My Student List
          </Typography>
        </Box>

        <Box sx={adminSessionListSearchBarSx}>
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
            <colgroup>
              {instructorDashboardStudentListColWidthsPx.map((w, i) => (
                <col key={i} style={w == null ? undefined : { width: w }} />
              ))}
            </colgroup>
            <TableHead>
              <TableRow sx={adminSessionListTableHeadRowSx}>
                <TableCell sx={adminSessionListTableHeadCellSx()}>
                  Actions
                </TableCell>
                {COLS.map((c, index) => (
                  <SortableHeader
                    key={c.searchBy}
                    label={c.label}
                    field={c.searchBy}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    headCellSx={adminSessionListTableHeadCellSx(
                      undefined,
                      index === COLS.length - 1,
                    )}
                  />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{renderDashboardTableBody()}</TableBody>
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
  }

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
                          onClick={() => handleEditProfile(sid)}
                          sx={adminSessionListTableActionLinkSx}
                        >
                          Edit
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
