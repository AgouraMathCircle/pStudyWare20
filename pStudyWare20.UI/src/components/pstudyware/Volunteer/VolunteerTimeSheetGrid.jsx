import React, { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SortableHeader from "../Common/SortableHeader";
import AdminSessionListPagination from "../Admin/AdminSessionListPagination";
import { useAuth } from "../../../contexts/AuthContext";
import { sortRows, toSortableDate, toSortableNumber } from "../../../utils/tableSort";
import {
  extractTimeSheetApiError,
  isTimeSheetApiSuccess,
  resolveTimeSheetLogId,
} from "../../../utils/timeSheetFormValidation";
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
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

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
  return resolveTimeSheetLogId(row);
}

function displayStartEnd(row) {
  const start = row?.startTime ?? row?.StartTime ?? "—";
  const end = row?.endTime ?? row?.EndTime ?? "—";
  return { start, end };
}

function matchesCriteria(fieldValue, criteria, searchLower) {
  const f = String(fieldValue ?? "").toLowerCase();
  if (criteria === "equals") return f === searchLower;
  if (criteria === "starts_with") return f.startsWith(searchLower);
  return f.includes(searchLower);
}

function rowSearchFieldValues(row) {
  const { start, end } = displayStartEnd(row);
  const vd = row?.volunteerDate ?? row?.VolunteerDate;
  const cd = row?.createdDate ?? row?.CreatedDate;
  return [
    rowId(row),
    row?.username ?? row?.Username ?? row?.name ?? row?.Name,
    row?.taskName ?? row?.TaskName,
    vd ? formatDate(vd) : "",
    start === "—" ? "" : start,
    end === "—" ? "" : end,
    row?.totalHours ?? row?.TotalHours,
    cd ? formatDate(cd) : "",
    row?.taskDescription ?? row?.TaskDescription,
  ];
}

const legacySearchBarSx = {
  backgroundColor: "#4caf50",
  p: 0.5,
  borderRadius: 1,
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  flexWrap: "wrap",
};

const legacySearchFieldSx = {
  minWidth: 150,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    fontSize: "0.75rem",
    height: "30px",
  },
};

const legacyTableCellSx = {
  fontSize: "0.75rem",
  padding: "3px 5px",
  borderRight: "1px solid #4caf50",
};

const legacyTableHeadCellSx = {
  ...legacyTableCellSx,
  fontWeight: 700,
};

const portalColumnWidths = {
  logID: "5%",
  name: "12%",
  taskName: "14%",
  volunteerDate: "10%",
  startTime: "11%",
  endTime: "11%",
  totalHours: "8%",
  createdDate: "11%",
  edit: "7%",
  delete: "7%",
};

const getTimeSheetFieldValue = (row, field) => {
  switch (field) {
    case "logID":
      return toSortableNumber(row?.logID ?? row?.LogID ?? row?.mLogID);
    case "username":
      return row?.username ?? row?.Username ?? row?.name ?? row?.Name ?? "";
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

const timeSheetPathForUser = (user) =>
  user?.role === "Volunteer"
    ? "/pstudyware/volunteer/time-sheet"
    : "/pstudyware/instructor/time-sheet";

/**
 * My Time Sheet — Volunteer_Dashboard.aspx kGrid columns (AMC_spSelectTimeTracking).
 */
const VolunteerTimeSheetGrid = ({
  rows = [],
  loading = false,
  error = null,
  onEntriesChanged,
  usePortalStyle = false,
  hideTitle = false,
}) => {
  const { user } = useAuth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(usePortalStyle ? 25 : 20);
  const [search, setSearch] = useState("");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState("volunteerDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [alertDialog, setAlertDialog] = useState({ open: false, message: "" });

  const pageSize = usePortalStyle ? 25 : rowsPerPage;

  const filtered = useMemo(() => {
    if (usePortalStyle) {
      const q = searchText.trim();
      if (!q) return rows;
      const searchLower = q.toLowerCase();

      if (searchBy === "ALL") {
        return rows.filter((row) => {
          const vals = rowSearchFieldValues(row);
          if (searchCriteria === "contains") {
            return vals.some((v) => String(v).toLowerCase().includes(searchLower));
          }
          if (searchCriteria === "equals") {
            return vals.some((v) => String(v).toLowerCase() === searchLower);
          }
          return vals.some((v) => String(v).toLowerCase().startsWith(searchLower));
        });
      }

      return rows.filter((row) => {
        let fieldValue = "";
        const { start, end } = displayStartEnd(row);
        const vd = row?.volunteerDate ?? row?.VolunteerDate;
        const cd = row?.createdDate ?? row?.CreatedDate;
        switch (searchBy) {
          case "LOG_ID":
            fieldValue = String(rowId(row) ?? "");
            break;
          case "NAME":
            fieldValue = row?.username ?? row?.Username ?? row?.name ?? row?.Name ?? "";
            break;
          case "TASK":
            fieldValue = row?.taskName ?? row?.TaskName ?? "";
            break;
          case "DATE":
            fieldValue = vd ? formatDate(vd) : "";
            break;
          case "START":
            fieldValue = start === "—" ? "" : start;
            break;
          case "END":
            fieldValue = end === "—" ? "" : end;
            break;
          case "HOURS":
            fieldValue = String(row?.totalHours ?? row?.TotalHours ?? "");
            break;
          case "CREATED":
            fieldValue = cd ? new Date(cd).toLocaleString() : "";
            break;
          case "DESCRIPTION":
            fieldValue = row?.taskDescription ?? row?.TaskDescription ?? "";
            break;
          default:
            return true;
        }
        return matchesCriteria(fieldValue, searchCriteria, searchLower);
      });
    }

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
  }, [rows, search, searchBy, searchCriteria, searchText, usePortalStyle]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    if (usePortalStyle) {
      setCurrentPage(1);
      setGoToPageInput("1");
    } else {
      setPage(0);
    }
  };

  const sorted = useMemo(
    () => sortRows(filtered, sortField, sortOrder, getTimeSheetFieldValue),
    [filtered, sortField, sortOrder],
  );

  const totalRecords = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const pageRows = useMemo(() => {
    if (usePortalStyle) {
      const start = (currentPage - 1) * pageSize;
      return sorted.slice(start, start + pageSize);
    }
    const start = page * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, page, rowsPerPage, currentPage, pageSize, usePortalStyle]);

  const handleLegacyPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage - 1);
    }
  };

  const handlePortalPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setGoToPageInput(String(newPage));
    }
  };

  const handlePortalGoToPage = () => {
    const pageNum = parseInt(goToPageInput, 10);
    if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const handlePortalSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

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
      if (!isTimeSheetApiSuccess(res)) {
        setAlertDialog({
          open: true,
          message:
            res?.errorMessage ??
            res?.ErrorMessage ??
            res?.message ??
            res?.Message ??
            "Delete failed.",
        });
      } else if (typeof onEntriesChanged === "function") {
        onEntriesChanged();
      }
    } catch (e) {
      setAlertDialog({
        open: true,
        message: extractTimeSheetApiError(e, "Delete failed."),
      });
    } finally {
      setDeletingId(null);
    }
  };

  const editPath = timeSheetPathForUser(user);

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (usePortalStyle) {
    const emptyMessage = searchText.trim()
      ? "No entries found matching your search."
      : "No entries yet.";

    return (
      <Box className="instructor-time-sheet-table-panel" sx={{ width: "100%" }}>
        {!hideTitle ? (
          <Box sx={adminSessionListHeaderBarSx}>
            <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
              My Time Sheet
            </Typography>
          </Box>
        ) : null}

        <Box className="admin-session-list-search" sx={adminSessionListSearchBarSx}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
            <Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              size="small"
              sx={adminSessionListSearchSelectSx}
            >
              <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>-ALL-</MenuItem>
              <MenuItem value="LOG_ID" sx={adminSessionListMenuItemSx}>#</MenuItem>
              <MenuItem value="NAME" sx={adminSessionListMenuItemSx}>Name</MenuItem>
              <MenuItem value="TASK" sx={adminSessionListMenuItemSx}>Task Name</MenuItem>
              <MenuItem value="DATE" sx={adminSessionListMenuItemSx}>Date Volunteer</MenuItem>
              <MenuItem value="START" sx={adminSessionListMenuItemSx}>Start Time</MenuItem>
              <MenuItem value="END" sx={adminSessionListMenuItemSx}>End Time</MenuItem>
              <MenuItem value="HOURS" sx={adminSessionListMenuItemSx}>Total Hours</MenuItem>
              <MenuItem value="CREATED" sx={adminSessionListMenuItemSx}>Created Date</MenuItem>
              <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>Task Details</MenuItem>
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
              <MenuItem value="contains" sx={adminSessionListMenuItemSx}>Contains</MenuItem>
              <MenuItem value="equals" sx={adminSessionListMenuItemSx}>Equals</MenuItem>
              <MenuItem value="starts_with" sx={adminSessionListMenuItemSx}>Starts With</MenuItem>
            </Select>
          </Box>
          <TextField
            size="small"
            placeholder="Search Text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePortalSearch()}
            sx={adminSessionListSearchFieldSx}
          />
          <Button variant="contained" size="small" onClick={handlePortalSearch} sx={adminSessionListFindButtonSx}>
            Find
          </Button>
        </Box>

        <TableContainer component={Paper} sx={adminSessionListTableContainerSx}>
          <Table size="small" sx={adminSessionListGridTableSx}>
            <TableHead>
              <TableRow sx={adminSessionListTableHeadRowSx}>
                <SortableHeader
                  label="#"
                  field="logID"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.logID)}
                />
                <SortableHeader
                  label="Name"
                  field="username"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.name)}
                />
                <SortableHeader
                  label="Task Name"
                  field="taskName"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.taskName)}
                />
                <SortableHeader
                  label="Date Volunteer"
                  field="volunteerDate"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.volunteerDate)}
                />
                <TableCell sx={adminSessionListTableHeadCellSx(portalColumnWidths.startTime)}>
                  Start Time
                </TableCell>
                <TableCell sx={adminSessionListTableHeadCellSx(portalColumnWidths.endTime)}>
                  End Time
                </TableCell>
                <SortableHeader
                  label="Total Hours"
                  field="totalHours"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.totalHours)}
                />
                <SortableHeader
                  label="Created Date"
                  field="createdDate"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  headCellSx={adminSessionListTableHeadCellSx(portalColumnWidths.createdDate)}
                />
                <TableCell sx={adminSessionListTableHeadCellSx(portalColumnWidths.edit)}>
                  Edit
                </TableCell>
                <TableCell sx={adminSessionListTableHeadCellSx(portalColumnWidths.delete, true)}>
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                    <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                      Loading time sheet…
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading && pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                    <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                pageRows.map((row, idx) => {
                  const id = rowId(row);
                  const { start, end } = displayStartEnd(row);
                  return (
                    <TableRow key={id ?? `row-${idx}`} sx={adminSessionListTableBodyRowSx}>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>{id ?? "—"}</TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                        {row?.username ?? row?.Username ?? row?.name ?? row?.Name ?? "—"}
                      </TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                        {row?.taskName ?? row?.TaskName ?? "—"}
                      </TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>
                        {formatDate(row?.volunteerDate ?? row?.VolunteerDate)}
                      </TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>{start}</TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>{end}</TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>
                        {formatHours(row?.totalHours ?? row?.TotalHours)}
                      </TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx()}>
                        {formatDate(row?.createdDate ?? row?.CreatedDate)}
                      </TableCell>
                      <TableCell sx={adminSessionListTableBodyCellSx({ action: true })}>
                        {id ? (
                          <Box
                            component={RouterLink}
                            to={`${editPath}?logId=${id}`}
                            sx={adminSessionListTableActionLinkSx}
                          >
                            Edit
                          </Box>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell
                        className="time-sheet-delete-cell"
                        sx={adminSessionListTableBodyCellSx({ isLast: true, action: true })}
                      >
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

        <AdminSessionListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          goToPageInput={goToPageInput}
          onGoToPageInputChange={setGoToPageInput}
          onPageChange={handlePortalPageChange}
          onGoToPage={handlePortalGoToPage}
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
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ width: "100%", overflow: "hidden" }}>
      <Box sx={legacySearchBarSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
            Search By:
          </Typography>
          <Select
            value="ALL"
            size="small"
            sx={{
              color: "white",
              fontSize: "0.75rem",
              minWidth: 100,
              height: "30px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>-ALL-</MenuItem>
          </Select>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
            Criteria:
          </Typography>
          <Select
            value="Contains"
            size="small"
            sx={{
              color: "white",
              fontSize: "0.75rem",
              minWidth: 100,
              height: "30px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <MenuItem value="Contains" sx={{ fontSize: "0.75rem" }}>Contains</MenuItem>
          </Select>
        </Box>
        <TextField
          size="small"
          placeholder="Search Text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={legacySearchFieldSx}
        />
        <Box
          component="button"
          onClick={() => setPage(0)}
          sx={{
            backgroundColor: "white",
            color: "#4caf50",
            fontSize: "0.75rem",
            textTransform: "none",
            px: 2,
            py: 0.5,
            border: "none",
            borderRadius: 1,
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          Find
        </Box>
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
                headCellSx={legacyTableHeadCellSx}
              />
              <SortableHeader
                label="Name"
                field="username"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={legacyTableHeadCellSx}
              />
              <SortableHeader
                label="Task name"
                field="taskName"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={legacyTableHeadCellSx}
              />
              <SortableHeader
                label="Date volunteer"
                field="volunteerDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={legacyTableHeadCellSx}
              />
              <TableCell sx={legacyTableHeadCellSx}>Start time</TableCell>
              <TableCell sx={legacyTableHeadCellSx}>End time</TableCell>
              <SortableHeader
                label="Total hours"
                field="totalHours"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={legacyTableHeadCellSx}
                align="right"
              />
              <SortableHeader
                label="Created"
                field="createdDate"
                sortField={sortField}
                sortOrder={sortOrder}
                onSort={handleSort}
                headCellSx={legacyTableHeadCellSx}
              />
              <TableCell align="center" sx={legacyTableHeadCellSx}>
                Edit
              </TableCell>
              <TableCell align="center" sx={legacyTableHeadCellSx}>
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
                const { start, end } = displayStartEnd(row);
                return (
                  <TableRow key={id ?? `row-${idx}`} hover>
                    <TableCell sx={legacyTableCellSx}>{id ?? "—"}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{row?.username ?? row?.Username ?? "—"}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{row?.taskName ?? row?.TaskName ?? "—"}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{formatDate(row?.volunteerDate ?? row?.VolunteerDate)}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{start}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{end}</TableCell>
                    <TableCell sx={legacyTableCellSx} align="right">{formatHours(row?.totalHours ?? row?.TotalHours)}</TableCell>
                    <TableCell sx={legacyTableCellSx}>{formatDate(row?.createdDate ?? row?.CreatedDate)}</TableCell>
                    <TableCell align="center" sx={legacyTableCellSx}>
                      {id ? (
                        <Box
                          component={RouterLink}
                          to={`${editPath}?logId=${id}`}
                          sx={adminSessionListTableActionLinkSx}
                        >
                          Edit
                        </Box>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell align="center" sx={legacyTableCellSx}>
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
      <Box
        sx={{
          backgroundColor: "#4caf50",
          p: 0.5,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            disabled={page === 0 || totalRecords === 0}
            onClick={() => handleLegacyPageChange(1)}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            disabled={page === 0 || totalRecords === 0}
            onClick={() => handleLegacyPageChange(page)}
          >
            <PrevPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            disabled={page >= totalPages - 1 || totalRecords === 0}
            onClick={() => handleLegacyPageChange(page + 2)}
          >
            <NextPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: "white", padding: "2px" }}
            disabled={page >= totalPages - 1 || totalRecords === 0}
            onClick={() => handleLegacyPageChange(totalPages)}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
            GoTo
          </Typography>
          <Select
            value={page + 1}
            onChange={(e) => handleLegacyPageChange(e.target.value)}
            size="small"
            sx={{
              color: "white",
              fontSize: "0.75rem",
              minWidth: 60,
              height: "24px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            {Array.from({ length: totalPages || 1 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1} sx={{ fontSize: "0.75rem" }}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Page(s): {page + 1} of {totalPages || 1}
        </Typography>
        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
          Record(s): {totalRecords === 0 ? 0 : page * rowsPerPage + 1} -{" "}
          {Math.min((page + 1) * rowsPerPage, totalRecords)} of {totalRecords}
        </Typography>
      </Box>

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
