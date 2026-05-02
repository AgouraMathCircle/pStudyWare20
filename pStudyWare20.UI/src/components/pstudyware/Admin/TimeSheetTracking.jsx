import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";

const timeSheetTrackingPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const cellPadding = "0 8px";

/** Legacy TimeSheetTracking.aspx — ddlTaskName */
const TASK_OPTIONS = [
  "Administrative Work",
  "Document Preparation",
  "Tutoring",
  "Class Coordinator",
  "Facility Inspection",
  "Grading",
  "Yard Duty",
  "Operational Support",
  "Miscellaneous Work",
];

/** Legacy hour dropdown: placeholder + 00–12 */
const HOUR_OPTIONS = [
  { value: "", label: "Select Hour" },
  ...["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map(
    (h) => ({ value: h, label: h }),
  ),
];

const MIN_OPTIONS = [
  { value: "", label: "Select Minutes" },
  { value: "00", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

const AMPM_OPTIONS = ["AM", "PM"];

function toDateInputValue(isoOrDate) {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

function pad2(v) {
  const s = String(v ?? "").trim();
  if (!s) return "00";
  return s.padStart(2, "0");
}

function displayStartEnd(row) {
  const st =
    row.startTime ??
    row.StartTime ??
    (row.startHour != null || row.StartHour != null
      ? `${pad2(row.startHour ?? row.StartHour)}:${pad2(row.startMin ?? row.StartMin)} ${row.startType ?? row.StartType ?? ""}`.trim()
      : "");
  const et =
    row.endTime ??
    row.EndTime ??
    (row.endHour != null || row.EndHour != null
      ? `${pad2(row.endHour ?? row.EndHour)}:${pad2(row.endMin ?? row.EndMin)} ${row.endType ?? row.EndType ?? ""}`.trim()
      : "");
  return { start: st || "—", end: et || "—" };
}

/** Values used for Search By = ALL (any-field match). */
function rowSearchFieldValues(row) {
  const { start, end } = displayStartEnd(row);
  const vd = row.volunteerDate ?? row.VolunteerDate;
  const cd = row.createdDate ?? row.CreatedDate;
  return [
    String(row.logID ?? row.LogID ?? row.mLogID ?? ""),
    String(row.name ?? row.Name ?? ""),
    String(row.taskName ?? row.TaskName ?? ""),
    vd ? new Date(vd).toLocaleDateString() : "",
    start === "—" ? "" : start,
    end === "—" ? "" : end,
    String(row.totalHours ?? row.TotalHours ?? ""),
    cd ? new Date(cd).toLocaleString() : "",
    String(row.taskDescription ?? row.TaskDescription ?? ""),
  ];
}

function matchesCriteria(fieldValue, searchCriteria, searchLower) {
  const fv = String(fieldValue ?? "").toLowerCase();
  if (searchCriteria === "equals") return fv === searchLower;
  if (searchCriteria === "starts_with") return fv.startsWith(searchLower);
  return fv.includes(searchLower);
}

const TimeSheetTracking = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const pageSize = 20;

  const [formOpen, setFormOpen] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskName, setTaskName] = useState(TASK_OPTIONS[0]);
  const [volunteerDate, setVolunteerDate] = useState(() => toDateInputValue(new Date()));
  const [startHour, setStartHour] = useState("09");
  const [startMin, setStartMin] = useState("00");
  const [startType, setStartType] = useState("AM");
  const [endHour, setEndHour] = useState("05");
  const [endMin, setEndMin] = useState("00");
  const [endType, setEndType] = useState("PM");
  const [taskDescription, setTaskDescription] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLogId, setDeleteLogId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await timeSheetTrackingService.getTimeSheetTrackingList({
        Username: username,
      });
      const data =
        res?.timeSheetTrackingList ?? res?.TimeSheetTrackingList ?? [];
      if (res?.isSuccess !== false && Array.isArray(data)) {
        setList(data);
      } else if (res?.isSuccess === false && res?.errorMessage) {
        setSnackbar({
          open: true,
          message: res.errorMessage,
          severity: "error",
        });
        setList([]);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading time sheet tracking:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading time sheet.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) loadList();
    else setLoading(false);
  }, [username]);

  const filteredList = useMemo(() => {
    if (!list.length) return [];
    const q = searchText.trim();
    if (!q) return list;

    const searchLower = q.toLowerCase();

    if (searchBy === "ALL") {
      return list.filter((row) => {
        const vals = rowSearchFieldValues(row);
        if (searchCriteria === "contains") {
          return vals.some((v) =>
            String(v).toLowerCase().includes(searchLower),
          );
        }
        if (searchCriteria === "equals") {
          return vals.some(
            (v) => String(v).toLowerCase() === searchLower,
          );
        }
        return vals.some((v) =>
          String(v).toLowerCase().startsWith(searchLower),
        );
      });
    }

    return list.filter((row) => {
      let fieldValue = "";
      const { start, end } = displayStartEnd(row);
      const vd = row.volunteerDate ?? row.VolunteerDate;
      const cd = row.createdDate ?? row.CreatedDate;
      switch (searchBy) {
        case "LOG_ID":
          fieldValue = String(row.logID ?? row.LogID ?? row.mLogID ?? "");
          break;
        case "NAME":
          fieldValue = row.name ?? row.Name ?? "";
          break;
        case "TASK":
          fieldValue = row.taskName ?? row.TaskName ?? "";
          break;
        case "DATE":
          fieldValue = vd ? new Date(vd).toLocaleDateString() : "";
          break;
        case "START":
          fieldValue = start === "—" ? "" : start;
          break;
        case "END":
          fieldValue = end === "—" ? "" : end;
          break;
        case "HOURS":
          fieldValue = String(row.totalHours ?? row.TotalHours ?? "");
          break;
        case "CREATED":
          fieldValue = cd ? new Date(cd).toLocaleString() : "";
          break;
        case "DESCRIPTION":
          fieldValue = row.taskDescription ?? row.TaskDescription ?? "";
          break;
        default:
          return true;
      }
      return matchesCriteria(fieldValue, searchCriteria, searchLower);
    });
  }, [list, searchBy, searchCriteria, searchText]);

  const totalRecords = filteredList.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [searchBy, searchCriteria, searchText, list.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
      setGoToPageInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const resetFormDefaults = () => {
    setTaskName(TASK_OPTIONS[0]);
    setVolunteerDate(toDateInputValue(new Date()));
    setStartHour("09");
    setStartMin("00");
    setStartType("AM");
    setEndHour("05");
    setEndMin("00");
    setEndType("PM");
    setTaskDescription("");
  };

  const openAdd = () => {
    setEditingLogId(null);
    resetFormDefaults();
    setFormOpen(true);
  };

  const openEdit = async (row) => {
    const logId = row.logID ?? row.LogID ?? row.mLogID;
    if (!logId) return;
    setEditingLogId(logId);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const res = await timeSheetTrackingService.getTimeSheetForEdit(logId, username);
      const entry = res?.timeSheetEntry ?? res?.TimeSheetEntry;
      if (!res?.isSuccess || !entry) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Could not load entry.",
          severity: "error",
        });
        setFormOpen(false);
        return;
      }
      setTaskName(entry.taskName ?? entry.TaskName ?? TASK_OPTIONS[0]);
      setVolunteerDate(
        toDateInputValue(entry.volunteerDate ?? entry.VolunteerDate) ||
          toDateInputValue(new Date()),
      );
      setStartHour(pad2(entry.startHour ?? entry.StartHour ?? "09"));
      setStartMin(pad2(entry.startMin ?? entry.StartMin ?? "00"));
      setStartType(entry.startType ?? entry.StartType ?? "AM");
      setEndHour(pad2(entry.endHour ?? entry.EndHour ?? "05"));
      setEndMin(pad2(entry.endMin ?? entry.EndMin ?? "00"));
      setEndType(entry.endType ?? entry.EndType ?? "PM");
      setTaskDescription(entry.taskDescription ?? entry.TaskDescription ?? "");
    } catch (e) {
      setSnackbar({
        open: true,
        message: e?.response?.data?.message ?? e?.message ?? "Load failed.",
        severity: "error",
      });
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const closeForm = () => {
    if (saving) return;
    setFormOpen(false);
    setEditingLogId(null);
  };

  const handleSubmitForm = async () => {
    if (!username) {
      setSnackbar({ open: true, message: "You must be signed in.", severity: "error" });
      return;
    }
    if (!volunteerDate) {
      setSnackbar({ open: true, message: "Please choose a volunteer date.", severity: "error" });
      return;
    }
    const sh = pad2(startHour || "09");
    const sm = pad2(startMin || "00");
    const eh = pad2(endHour || "05");
    const em = pad2(endMin || "00");
    const parts = volunteerDate.split("-").map((x) => parseInt(x, 10));
    const volunteerDateObj =
      parts.length === 3 && parts.every((n) => Number.isFinite(n))
        ? new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
        : new Date(volunteerDate);

    setSaving(true);
    try {
      const payload = {
        username,
        taskName: taskName.trim(),
        volunteerDate: volunteerDateObj.toISOString(),
        startHour: sh,
        startMin: sm,
        startType,
        endHour: eh,
        endMin: em,
        endType,
        taskDescription: taskDescription.trim(),
        logID: editingLogId && editingLogId > 0 ? editingLogId : null,
      };
      const res = await timeSheetTrackingService.upsertTimeSheetTracking(payload);
      if (res?.isSuccess === false) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? res?.message ?? "Save failed.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message:
          res?.message ??
          res?.Message ??
          "Time Sheet Entry has been recorded successfully",
        severity: "success",
      });
      closeForm();
      await loadList();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message ?? err?.message ?? "Save failed.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (row) => {
    const logId = row.logID ?? row.LogID;
    if (!logId) return;
    setDeleteLogId(logId);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteLogId) return;
    try {
      const res = await timeSheetTrackingService.deleteTimeSheetTracking({
        logID: deleteLogId,
      });
      if (res?.isSuccess === false) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Delete failed.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: res?.message ?? "Entry has been deleted successfully",
        severity: "success",
      });
      setDeleteOpen(false);
      setDeleteLogId(null);
      await loadList();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.message ?? err?.message ?? "Delete failed.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={timeSheetTrackingPageSx}>
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: PORTAL_CARD_BOX_SHADOW,
                overflow: "hidden",
                ...portalCardAntiLiftSx,
              }}
            >
              <CardContent sx={{ p: 3 }}>
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
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: APPLICATION_ADMIN_TITLE_COLOR,
                      fontSize: "1rem",
                    }}
                  >
                    My Time Sheet
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={openAdd}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Enter Time Sheet
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={loadList}
                      disabled={loading}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Refresh
                    </Button>
                  </Box>
                </Box>

                {!loading && (
                  <Box
                    sx={{
                      backgroundColor: "#4caf50",
                      p: 0.5,
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Search By:
                      </Typography>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        size="small"
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          minWidth: 120,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                      >
                        <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>
                          -ALL-
                        </MenuItem>
                        <MenuItem value="LOG_ID" sx={{ fontSize: "0.75rem" }}>
                          #
                        </MenuItem>
                        <MenuItem value="NAME" sx={{ fontSize: "0.75rem" }}>
                          Name
                        </MenuItem>
                        <MenuItem value="TASK" sx={{ fontSize: "0.75rem" }}>
                          Task Name
                        </MenuItem>
                        <MenuItem value="DATE" sx={{ fontSize: "0.75rem" }}>
                          Date Volunteer
                        </MenuItem>
                        <MenuItem value="START" sx={{ fontSize: "0.75rem" }}>
                          Start Time
                        </MenuItem>
                        <MenuItem value="END" sx={{ fontSize: "0.75rem" }}>
                          End Time
                        </MenuItem>
                        <MenuItem value="HOURS" sx={{ fontSize: "0.75rem" }}>
                          Total Hours
                        </MenuItem>
                        <MenuItem value="CREATED" sx={{ fontSize: "0.75rem" }}>
                          Created Date
                        </MenuItem>
                        <MenuItem value="DESCRIPTION" sx={{ fontSize: "0.75rem" }}>
                          Task Details
                        </MenuItem>
                      </Select>
                    </Box>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Criteria:
                      </Typography>
                      <Select
                        value={searchCriteria}
                        onChange={(e) => setSearchCriteria(e.target.value)}
                        size="small"
                        sx={{
                          color: "white",
                          fontSize: "0.75rem",
                          minWidth: 100,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                      >
                        <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>
                          Contains
                        </MenuItem>
                        <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>
                          Equals
                        </MenuItem>
                        <MenuItem
                          value="starts_with"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          Starts With
                        </MenuItem>
                      </Select>
                    </Box>
                    <TextField
                      size="small"
                      placeholder="Search Text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      sx={{
                        minWidth: 150,
                        flex: 1,
                        maxWidth: 280,
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          fontSize: "0.75rem",
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={{
                        backgroundColor: "white",
                        color: "#4caf50",
                        fontSize: "0.75rem",
                        textTransform: "none",
                        minHeight: 32,
                        py: 0,
                        px: 1,
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      Find
                    </Button>
                  </Box>
                )}

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper} sx={{ width: "100%", mt: 1 }}>
                      <Table
                        sx={{
                          width: "100%",
                          tableLayout: "fixed",
                          "& .MuiTableCell-root": {
                            paddingTop: 0,
                            paddingBottom: 0,
                          },
                        }}
                        size="small"
                      >
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "5%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "12%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "14%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Task Name
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "10%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Date Volunteer
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "11%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Start Time
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "11%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              End Time
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "8%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Total Hours
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "11%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                              }}
                            >
                              Created Date
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                borderRight: "1px solid #4caf50",
                                width: "7%",
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Edit
                            </TableCell>
                            <TableCell
                              sx={{
                                fontWeight: 400,
                                fontSize: "0.75rem",
                                padding: cellPadding,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Delete
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedList.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={10}
                                align="center"
                                sx={{
                                  fontSize: "0.75rem",
                                  padding: cellPadding,
                                  py: 3,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{ fontSize: "0.75rem" }}
                                >
                                  {searchText.trim()
                                    ? "No records found matching your search."
                                    : "No entries found."}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            paginatedList.map((row, idx) => {
                              const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                              const vd = row.volunteerDate ?? row.VolunteerDate;
                              const cd = row.createdDate ?? row.CreatedDate;
                              const { start, end } = displayStartEnd(row);
                              const th = row.totalHours ?? row.TotalHours ?? "—";
                              return (
                                <TableRow
                                  key={row.logID ?? row.LogID ?? row.mLogID ?? idx}
                                >
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {globalIdx}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {row.name ?? row.Name ?? "—"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {row.taskName ?? row.TaskName ?? ""}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {vd
                                      ? new Date(vd).toLocaleDateString()
                                      : ""}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {start}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {end}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {th}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                    }}
                                  >
                                    {cd
                                      ? new Date(cd).toLocaleString()
                                      : "—"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      borderRight: "1px solid #4caf50",
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <Tooltip title="Edit">
                                      <IconButton
                                        size="small"
                                        onClick={() => openEdit(row)}
                                        sx={{ padding: "2px" }}
                                      >
                                        <EditIcon sx={{ fontSize: "1rem" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: "0.75rem",
                                      padding: cellPadding,
                                      verticalAlign: "middle",
                                    }}
                                  >
                                    <Tooltip title="Delete">
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => confirmDelete(row)}
                                        sx={{ padding: "2px" }}
                                      >
                                        <DeleteIcon sx={{ fontSize: "1rem" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
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
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                      >
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(1)}
                          disabled={currentPage === 1}
                        >
                          <FirstPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <PrevPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <NextPageIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: "white", padding: "2px" }}
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <LastPageIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                        Page(s): {currentPage} of {totalPages}
                      </Typography>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                        Record(s):{" "}
                        {totalRecords > 0
                          ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)}`
                          : "0"}{" "}
                        of {totalRecords}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
                      >
                        <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                          Go to Page:
                        </Typography>
                        <TextField
                          size="small"
                          type="number"
                          value={goToPageInput}
                          onChange={(e) => setGoToPageInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") handleGoToPage();
                          }}
                          sx={{
                            width: 56,
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "white",
                              fontSize: "0.75rem",
                            },
                          }}
                          inputProps={{ min: 1, max: totalPages }}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleGoToPage}
                          sx={{
                            backgroundColor: "white",
                            color: "#4caf50",
                            fontSize: "0.75rem",
                            minHeight: 32,
                            py: 0,
                            px: 0.75,
                            "&:hover": { backgroundColor: "#f5f5f5" },
                          }}
                        >
                          Go
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={formOpen}
        onClose={closeForm}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1rem" }}>
          {editingLogId ? "Update Time Sheet" : "Add Time Sheet"}
        </DialogTitle>
        <DialogContent>
          {formLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ pt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Task Name</InputLabel>
                  <Select
                    label="Task Name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  >
                    {TASK_OPTIONS.map((t) => (
                      <MenuItem key={t} value={t}>
                        {t}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Volunteer Date"
                  type="date"
                  value={volunteerDate}
                  onChange={(e) => setVolunteerDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Start Time
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Hour</InputLabel>
                    <Select
                      label="Hour"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                    >
                      {HOUR_OPTIONS.map((o, i) => (
                        <MenuItem key={`sh-${i}-${o.label}`} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Min</InputLabel>
                    <Select
                      label="Min"
                      value={startMin}
                      onChange={(e) => setStartMin(e.target.value)}
                    >
                      {MIN_OPTIONS.map((o, i) => (
                        <MenuItem key={`sm-${i}`} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel />
                    <Select
                      value={startType}
                      onChange={(e) => setStartType(e.target.value)}
                      displayEmpty
                    >
                      {AMPM_OPTIONS.map((a) => (
                        <MenuItem key={a} value={a}>
                          {a}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  End Time
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Hour</InputLabel>
                    <Select
                      label="Hour"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                    >
                      {HOUR_OPTIONS.map((o, i) => (
                        <MenuItem key={`eh-${i}-${o.label}`} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>Min</InputLabel>
                    <Select
                      label="Min"
                      value={endMin}
                      onChange={(e) => setEndMin(e.target.value)}
                    >
                      {MIN_OPTIONS.map((o, i) => (
                        <MenuItem key={`em-${i}`} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <Select
                      value={endType}
                      onChange={(e) => setEndType(e.target.value)}
                      displayEmpty
                    >
                      {AMPM_OPTIONS.map((a) => (
                        <MenuItem key={a} value={a}>
                          {a}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Task Details"
                  multiline
                  minRows={3}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeForm} disabled={saving}>
            Close
          </Button>
          <Button variant="contained" onClick={handleSubmitForm} disabled={saving || formLoading}>
            {saving ? "Submitting…" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteLogId(null);
        }}
      >
        <DialogTitle>Delete entry</DialogTitle>
        <DialogContent>Do you want to delete this entry?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
              setDeleteLogId(null);
            }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason === "clickaway") return;
          setSnackbar((s) => ({ ...s, open: false }));
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TimeSheetTracking;
