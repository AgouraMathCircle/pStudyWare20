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
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";

function formatClock(hour, min, type) {
  if (hour === undefined || hour === null || hour === "") return "—";
  const m = min !== undefined && min !== null && min !== "" ? String(min).padStart(2, "0") : "00";
  const t = type ? ` ${type}` : "";
  return `${hour}:${m}${t}`;
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-US");
  } catch {
    return String(value);
  }
}

function formatHours(v) {
  if (v === undefined || v === null || v === "") return "—";
  const n = typeof v === "number" ? v : parseFloat(v);
  if (!Number.isFinite(n)) return String(v);
  return n.toFixed(2);
}

function rowId(row) {
  const id = row?.logID ?? row?.LogID ?? row?.mLogID;
  const n = parseInt(id, 10);
  return Number.isFinite(n) ? n : null;
}

/**
 * My Time Sheet — Volunteer_Dashboard.aspx kGrid columns (AMC_spSelectTimeTracking).
 */
const VolunteerTimeSheetGrid = ({ rows = [], loading = false, error = null, onEntriesChanged }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((row) => {
      const blob = [
        row?.taskName,
        row?.username,
        row?.taskDescription,
        row?.volunteerDate,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [rows, search]);

  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm("Do you want to delete this entry?");
    if (!ok) return;
    setDeletingId(id);
    try {
      const res = await timeSheetTrackingService.deleteTimeSheetTrackingById(id);
      if (res?.isSuccess === false) {
        window.alert(res?.errorMessage || res?.message || "Delete failed.");
      } else if (typeof onEntriesChanged === "function") {
        onEntriesChanged();
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ?? e?.response?.data?.error ?? e?.message ?? "Delete failed.";
      window.alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

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
          My Time Sheet
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
              <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Task name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date volunteer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Start time</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>End time</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Total hours
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Created</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }} colSpan={2}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography>Loading time sheet…</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={10}>
                  <Typography color="text.secondary">No entries yet.</Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              pageRows.map((row, idx) => {
                const id = rowId(row);
                const start = formatClock(row?.startHour, row?.startMin, row?.startType);
                const end = formatClock(row?.endHour, row?.endMin, row?.endType);
                return (
                  <TableRow key={id ?? `row-${idx}`} hover>
                    <TableCell>{id ?? "—"}</TableCell>
                    <TableCell>{row?.username ?? row?.Username ?? "—"}</TableCell>
                    <TableCell>{row?.taskName ?? row?.TaskName ?? "—"}</TableCell>
                    <TableCell>{formatDate(row?.volunteerDate ?? row?.VolunteerDate)}</TableCell>
                    <TableCell>{start}</TableCell>
                    <TableCell>{end}</TableCell>
                    <TableCell align="right">{formatHours(row?.totalHours ?? row?.TotalHours)}</TableCell>
                    <TableCell>{formatDate(row?.createdDate ?? row?.CreatedDate)}</TableCell>
                    <TableCell align="center">
                      {id ? (
                        <Tooltip title="Edit">
                          <IconButton
                            component={RouterLink}
                            to={`/pstudyware/volunteer/time-sheet?logId=${id}`}
                            size="small"
                            color="primary"
                            aria-label="Edit entry"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {id ? (
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              color="error"
                              aria-label="Delete entry"
                              disabled={deletingId === id}
                              onClick={() => handleDelete(id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
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
        rowsPerPageOptions={[10, 20, 50]}
      />
    </Paper>
  );
};

export default VolunteerTimeSheetGrid;
