import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Link,
} from "@mui/material";
import { Search as SearchIcon, Edit as EditIcon } from "@mui/icons-material";

const COLS = [
  { label: "Student #", keys: ["StudentID", "studentID"] },
  { label: "Student Name", keys: ["StudentName", "studentName"] },
  { label: "Class", keys: ["Class", "class"] },
  { label: "Grade", keys: ["Grade", "grade"] },
  { label: "School", keys: ["School", "school"] },
  { label: "Parent", keys: ["ParentName", "parentName"] },
  { label: "Session", keys: ["EventSession", "eventSession"] },
  { label: "Location", keys: ["EventLocation", "eventLocation"] },
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

/**
 * My Student List — Instructor_Dashboard.aspx kGrid columns (AMC_spSelectStudentList).
 */
const InstructorStudentListGrid = ({ rows = [], loading = false, error = null }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      return COLS.some((c) => cell(row, c.keys).toLowerCase().includes(q));
    });
  }, [rows, search]);

  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          My Student List
        </Typography>
        <TextField
          size="small"
          placeholder="Search…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220 }}
        />
      </Box>

      <TableContainer sx={{ maxWidth: "100%" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {COLS.map((c) => (
                <TableCell key={c.label} sx={{ fontWeight: 700 }}>
                  {c.label}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Profile
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={COLS.length + 1}>
                  <Typography>Loading students…</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={COLS.length + 1}>
                  <Typography color="text.secondary">No students found.</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pageRows.map((row, idx) => {
                const sid = studentId(row);
                return (
                  <TableRow key={sid ?? `row-${idx}`} hover>
                    {COLS.map((c) => (
                      <TableCell key={c.label}>{cell(row, c.keys)}</TableCell>
                    ))}
                    <TableCell align="right">
                      {sid ? (
                        <Link
                          component={RouterLink}
                          to={`/UpdateProfile/${sid}`}
                          underline="hover"
                          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                          Update
                        </Link>
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
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 25, 50]}
      />
    </Paper>
  );
};

export default InstructorStudentListGrid;
