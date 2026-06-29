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
} from "@mui/material";
import {
  Search as SearchIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SortableHeader from "../Common/SortableHeader";
import { useAuth } from "../../../contexts/AuthContext";
import { sortRows, toSortableDate, toSortableNumber } from "../../../utils/tableSort";
import {
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
} from "../styles/applicationSurfaces";

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
  const raw = row?.logID ?? row?.LogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const timeSheetHeadCellSx = { fontWeight: 700 };

const getTimeSheetFieldValue = (row, field) => {
  switch (field) {
    case "logID":
      return toSortableNumber(row?.logID ?? row?.LogID ?? row?.mLogID);
    case "username":
      return row?.username ?? row?.Username ?? "";
    case "taskName":
      return row?.taskName ?? row?.TaskName ?? "";
    case "volunteerDate":
      return toSortableDate(row?.volunteerDate ?? row?.VolunteerDate);
    case "totalHours":
      return toSortableNumber(row?.totalHours ?? row?.TotalHours);
    case "createdDate":
      return toSortableDate(row?.createdDate ?? row?.CreatedDate);
    default:
      return "";
  }
};

/**
 * My Time Sheet — Volunteer_Dashboard.aspx kGrid columns (AMC_spSelectTimeTracking).
 */
const VolunteerTimeSheetGrid = ({ rows = [], loading = false, error = null, onEntriesChanged }) => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("volunteerDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });

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

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setPage(0);
  };

  const sorted = useMemo(
    () => sortRows(filtered, sortField, sortOrder, getTimeSheetFieldValue),
    [filtered, sortField, sortOrder],
  );

  const pageRows = useMemo(() => {
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage]);

  const handleDeleteClick = (id) => {
    if (!id) return;
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ open: false, id: null });
    if (!id) return;

    setDeletingId(id);
    try {
      const res = await timeSheetTrackingService.deleteTimeSheetTrackingById(id);
      if (res?.isSuccess === false) {
        setAlertDialog({
          open: true,
          message: res?.errorMessage || res?.message || "Delete failed.",
        });
      } else if (typeof onEntriesChanged === "function") {
        onEntriesChanged();
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        e?.message ??
        "Delete failed.";
      setAlertDialog({ open: true, message: msg });
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
              <SortableHeader
                label="#"
                field="logID"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
              />
              <SortableHeader
                label="Name"
                field="username"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
              />
              <SortableHeader
                label="Task name"
                field="taskName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
              />
              <SortableHeader
                label="Date volunteer"
                field="volunteerDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
              />
              <TableCell sx={timeSheetHeadCellSx}>Start time</TableCell>
              <TableCell sx={timeSheetHeadCellSx}>End time</TableCell>
              <SortableHeader
                label="Total hours"
                field="totalHours"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
                align="right"
              />
              <SortableHeader
                label="Created"
                field="createdDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={timeSheetHeadCellSx}
              />
              <TableCell align="center" sx={timeSheetHeadCellSx}>
                Edit
              </TableCell>
              <TableCell align="center" sx={timeSheetHeadCellSx}>
                Delete
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
                const start = row?.startTime ?? row?.StartTime ?? "—";
                const end = row?.endTime ?? row?.EndTime ?? "—";
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
                        <Box
                          component={RouterLink}
                          to={`${user?.role === "Volunteer" ? "/pstudyware/volunteer/time-sheet" : "/pstudyware/instructor/time-sheet"}?logId=${id}`}
                          sx={adminSessionListTableActionLinkSx}
                        >
                          Edit
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {id ? (
                        <Box
                          onClick={deletingId === id ? undefined : () => handleDeleteClick(id)}
                          sx={{
                            ...adminSessionListTableDeleteLinkSx,
                            opacity: deletingId === id ? 0.5 : 1,
                            pointerEvents: deletingId === id ? "none" : "auto",
                          }}
                        >
                          Delete
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
      <TablePagination
        component="div"
        count={sorted.length}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[10, 20, 50]}
      />

      <AppConfirmDialog
        open={deleteConfirm.open}
        onClose={() => {
          if (!deletingId) {
            setDeleteConfirm({ open: false, id: null });
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Entry"
        message="Do you want to delete this entry?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={Boolean(deletingId)}
      />

      <AppConfirmDialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, message: "" })}
        title="Notice"
        message={alertDialog.message}
      />
    </Paper>
  );
};

export default VolunteerTimeSheetGrid;
