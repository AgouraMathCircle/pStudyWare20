import React, { useState, useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Typography,
  Button,
  TextField,
  Box,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  Link,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const StudentList = ({
  students,
  onExportToExcel,
  canExportData,
  onRefresh,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    if (!students || students.length === 0) return [];

    const q = search.trim().toLowerCase();
    if (!q) return students;

    return students.filter((s) => {
      const haystack = [
        s.studentID,
        s.studentName,
        s.class,
        s.grade,
        s.school,
        s.parentName,
        s.phoneNumber,
        s.emailAddress,
        s.eventSession,
        s.eventLocation,
      ]
        .filter((v) => v != null && String(v).trim() !== "")
        .map((v) => String(v).toLowerCase())
        .join(" ");
      return haystack.includes(q);
    });
  }, [students, search]);

  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredStudents.slice(start, start + rowsPerPage);
  }, [filteredStudents, page, rowsPerPage]);

  return (
    <Paper elevation={1} sx={{ width: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          Current Session Student List
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
        {canExportData && (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<DownloadIcon />}
            onClick={onExportToExcel}
            sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
          >
            Export Excel
          </Button>
        )}
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={onRefresh}
          sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer sx={{ maxWidth: "100%" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Student #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Class</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>School</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Parent</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Session</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Contact #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Profile
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11}>
                  <Typography color="text.secondary">
                    {search.trim()
                      ? "No students found matching your search."
                      : "No student data available."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((student, index) => {
                const sid = student.studentID;
                return (
                  <TableRow key={sid ?? `row-${index}`} hover>
                    <TableCell>{sid ?? "—"}</TableCell>
                    <TableCell>{student.studentName || "—"}</TableCell>
                    <TableCell>{student.class || "—"}</TableCell>
                    <TableCell>{student.grade || "—"}</TableCell>
                    <TableCell>{student.school || "—"}</TableCell>
                    <TableCell>{student.parentName || "—"}</TableCell>
                    <TableCell>{student.eventSession || "—"}</TableCell>
                    <TableCell>{student.eventLocation || "—"}</TableCell>
                    <TableCell>{student.phoneNumber || "—"}</TableCell>
                    <TableCell>
                      <Tooltip title={student.emailAddress || ""}>
                        <span
                          style={{
                            display: "inline-block",
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            verticalAlign: "bottom",
                          }}
                        >
                          {student.emailAddress || "—"}
                        </span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      {sid ? (
                        <Link
                          component={RouterLink}
                          to={`/UpdateProfile/${sid}`}
                          underline="hover"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
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
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredStudents.length}
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

export default StudentList;
