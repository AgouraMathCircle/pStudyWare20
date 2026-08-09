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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import SystemAdminSessionListPagination from "./SystemAdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";
import {
  pad2,
  resolveTimeFieldsFromEntry,
} from "../../../utils/timeSheetClockParse";
import {
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
  adminSessionListGridTableSx,
  adminSessionListHeaderBarSx,
  adminSessionListMenuItemSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListSearchBarSx,
  adminSessionListSearchFieldSx,
  adminSessionListSearchLabelSx,
  adminSessionListSearchSelectSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/SystemAdminTimeSheetTracking.css";

const timeSheetTrackingPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const timeSheetColumnWidths = {
  logID: "5%",
  name: "12%",
  taskName: "14%",
  volunteerDate: "10%",
  startTime: "11%",
  endTime: "11%",
  totalHours: "8%",
  createdDate: "11%",
  status: "14%",
};

const timeSheetDeleteLinkSx = adminSessionListTableDeleteLinkSx;

const timeSheetModalTimeRowSx = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 0.85fr",
  gap: 0.75,
  width: "100%",
  maxWidth: "100%",
};

const timeSheetModalInputHeight = 32;

const timeSheetModalTimeSelectSx = {
  ...portalModalFieldSx,
  width: "100%",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    height: timeSheetModalInputHeight,
    width: "100%",
  },
  "& .MuiSelect-select": {
    height: `${timeSheetModalInputHeight}px !important`,
    minHeight: `${timeSheetModalInputHeight}px !important`,
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    py: "0 !important",
    overflow: "hidden !important",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

const timeSheetModalStackSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.25,
  width: "100%",
};

const timeSheetTaskDetailsSx = {
  ...portalModalFieldSx,
  "& .MuiOutlinedInput-root": {
    minHeight: 72,
    alignItems: "flex-start",
  },
  "& .MuiInputBase-inputMultiline": {
    minHeight: "56px !important",
    fontSize: "0.8125rem",
  },
};

function isApiSuccess(res) {
  return res?.isSuccess === true || res?.IsSuccess === true;
}

/** Real AMC_tblTimeTracking.LogID — never use mLogID (display row number). */
function resolveTimeSheetLogId(row) {
  const raw = row?.logID ?? row?.LogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function resolveTimeSheetRowNumber(row) {
  const raw = row?.mLogID ?? row?.MLogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function extractApiError(err, fallback = "Save failed.") {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(" ");
  }
  return (
    data?.errorMessage ??
    data?.ErrorMessage ??
    data?.message ??
    err?.message ??
    fallback
  );
}

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
    String(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row) ?? ""),
    String(row.name ?? row.Name ?? ""),
    String(row.taskName ?? row.TaskName ?? ""),
    vd ? new Date(vd).toLocaleDateString() : "",
    start === "—" ? "" : start,
    end === "—" ? "" : end,
    String(row.totalHours ?? row.TotalHours ?? ""),
    cd ? new Date(cd).toLocaleString() : "",
    String(row.taskDescription ?? row.TaskDescription ?? ""),
    String(row.approvalStatus ?? row.ApprovalStatus ?? "Pending"),
  ];
}

function matchesCriteria(fieldValue, searchCriteria, searchLower) {
  const fv = String(fieldValue ?? "").toLowerCase();
  if (searchCriteria === "equals") return fv === searchLower;
  if (searchCriteria === "starts_with") return fv.startsWith(searchLower);
  return fv.includes(searchLower);
}

function getTimeSheetFieldValue(row, field) {
  switch (field) {
    case "logID":
      return toSortableNumber(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row));
    case "name":
      return row.name ?? row.Name ?? "";
    case "taskName":
      return row.taskName ?? row.TaskName ?? "";
    case "volunteerDate":
      return toSortableDate(row.volunteerDate ?? row.VolunteerDate);
    case "startTime": {
      const { start } = displayStartEnd(row);
      return start === "—" ? "" : start;
    }
    case "endTime": {
      const { end } = displayStartEnd(row);
      return end === "—" ? "" : end;
    }
    case "totalHours":
      return toSortableNumber(row.totalHours ?? row.TotalHours);
    case "createdDate":
      return toSortableDate(row.createdDate ?? row.CreatedDate);
    default:
      return "";
  }
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
  const [sortField, setSortField] = useState("volunteerDate");
  const [sortOrder, setSortOrder] = useState("desc");
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
  const [approvalStatus, setApprovalStatus] = useState("Pending");

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
          fieldValue = String(resolveTimeSheetLogId(row) ?? resolveTimeSheetRowNumber(row) ?? "");
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
        case "STATUS":
          fieldValue = row.approvalStatus ?? row.ApprovalStatus ?? "Pending";
          break;
        default:
          return true;
      }
      return matchesCriteria(fieldValue, searchCriteria, searchLower);
    });
  }, [list, searchBy, searchCriteria, searchText]);

  const sortedList = useMemo(
    () => sortRows(filteredList, sortField, sortOrder, getTimeSheetFieldValue),
    [filteredList, sortField, sortOrder],
  );

  const totalRecords = sortedList.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 0;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedList.slice(start, start + pageSize);
  }, [sortedList, currentPage, pageSize]);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [searchBy, searchCriteria, searchText, list.length]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
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

  const openEdit = async (row) => {
    const logId = resolveTimeSheetLogId(row);
    if (!logId) {
      setSnackbar({
        open: true,
        message: "Cannot edit: missing entry ID.",
        severity: "error",
      });
      return;
    }
    setEditingLogId(logId);
    setFormOpen(true);
    setFormLoading(true);
    try {
      const res = await timeSheetTrackingService.getTimeSheetForEdit(logId, username);
      const entry = res?.timeSheetEntry ?? res?.TimeSheetEntry;
      if (!isApiSuccess(res) || !entry) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Could not load entry.",
          severity: "error",
        });
        setFormOpen(false);
        return;
      }
      setTaskName(entry.taskName ?? entry.TaskName ?? TASK_OPTIONS[0]);
      const volunteerRaw = entry.volunteerDate ?? entry.VolunteerDate;
      setVolunteerDate(
        toDateInputValue(volunteerRaw) ||
          (() => {
            const m = String(volunteerRaw ?? "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (!m) return "";
            return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
          })() ||
          toDateInputValue(new Date()),
      );
      const startFields = resolveTimeFieldsFromEntry(entry, "start");
      const endFields = resolveTimeFieldsFromEntry(entry, "end");
      setStartHour(startFields.hour);
      setStartMin(startFields.min);
      setStartType(startFields.type);
      setEndHour(endFields.hour);
      setEndMin(endFields.min);
      setEndType(endFields.type);
      setTaskDescription(entry.taskDescription ?? entry.TaskDescription ?? "");
      
      const dbStatus = entry.approvalStatus ?? entry.ApprovalStatus ?? "Pending";
      if (dbStatus === "Approved" || dbStatus === "Accepted") setApprovalStatus("Accepted");
      else if (dbStatus === "Rejected") setApprovalStatus("Rejected");
      else setApprovalStatus("Pending");
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
    if (!taskName?.trim()) {
      setSnackbar({ open: true, message: "Please select a task name.", severity: "error" });
      return;
    }
    if (!volunteerDate) {
      setSnackbar({ open: true, message: "Please choose a volunteer date.", severity: "error" });
      return;
    }
    if (!startHour || !startMin || !startType) {
      setSnackbar({ open: true, message: "Please complete the start time.", severity: "error" });
      return;
    }
    if (!endHour || !endMin || !endType) {
      setSnackbar({ open: true, message: "Please complete the end time.", severity: "error" });
      return;
    }

    const sh = pad2(startHour);
    const sm = pad2(startMin);
    const eh = pad2(endHour);
    const em = pad2(endMin);
    const parts = volunteerDate.split("-").map((x) => parseInt(x, 10));
    const volunteerDateObj =
      parts.length === 3 && parts.every((n) => Number.isFinite(n))
        ? new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
        : new Date(volunteerDate);

    if (Number.isNaN(volunteerDateObj.getTime())) {
      setSnackbar({ open: true, message: "Please enter a valid volunteer date.", severity: "error" });
      return;
    }

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
        approvalStatus: approvalStatus === "Accepted" || approvalStatus === "Approved" ? "A" : (approvalStatus === "Rejected" ? "R" : "P"),
        logID: editingLogId && editingLogId > 0 ? editingLogId : null,
      };
      const res = await timeSheetTrackingService.upsertTimeSheetTracking(payload);
      if (!isApiSuccess(res)) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? res?.ErrorMessage ?? res?.message ?? res?.Message ?? "Save failed.",
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
      
      if (editingLogId && editingLogId > 0) {
        setList((prev) =>
          prev.map((item) => {
            if (resolveTimeSheetLogId(item) === editingLogId) {
              const updatedStatus = 
                (approvalStatus === "Accepted" || approvalStatus === "Approved") 
                  ? "Approved" 
                  : approvalStatus;
              
              return {
                ...item,
                taskName: taskName.trim(),
                volunteerDate: volunteerDateObj.toISOString(),
                startHour: sh,
                startMin: sm,
                startType,
                endHour: eh,
                endMin: em,
                endType,
                taskDescription: taskDescription.trim(),
                approvalStatus: updatedStatus,
                ApprovalStatus: updatedStatus,
              };
            }
            return item;
          })
        );
      } else {
        await loadList();
      }
      closeForm();
    } catch (err) {
      setSnackbar({
        open: true,
        message: extractApiError(err),
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (row) => {
    const logId = resolveTimeSheetLogId(row);
    if (!logId) {
      setSnackbar({
        open: true,
        message: "Cannot delete: missing entry ID.",
        severity: "error",
      });
      return;
    }
    setDeleteLogId(logId);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteLogId) return;
    try {
      const res = await timeSheetTrackingService.deleteTimeSheetTracking({
        logID: Number(deleteLogId),
      });
      if (!isApiSuccess(res)) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? res?.ErrorMessage ?? res?.message ?? "Delete failed.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: res?.message ?? res?.Message ?? "Entry has been deleted successfully",
        severity: "success",
      });
      
      setList((prev) => prev.filter((item) => resolveTimeSheetLogId(item) !== deleteLogId));
      
      setDeleteOpen(false);
      setDeleteLogId(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: extractApiError(err, "Delete failed."),
        severity: "error",
      });
    }
  };

  return (
    <Box className="admin-time-sheet-tracking" sx={timeSheetTrackingPageSx}>
      <SystemAdminHeader user={user} />
      <SystemAdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography variant="subtitle1" component="div" sx={adminSessionListTitleSx}>
                    Time Sheet Approval
                  </Typography>
                </Box>

                <Box className="admin-time-sheet-tracking-table-panel">
                  <Box sx={adminSessionListSearchBarSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={adminSessionListSearchLabelSx}>Search By:</Typography>
                      <Select
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        size="small"
                        sx={adminSessionListSearchSelectSx}
                      >
                        <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                          -ALL-
                        </MenuItem>
                        <MenuItem value="LOG_ID" sx={adminSessionListMenuItemSx}>
                          #
                        </MenuItem>
                        <MenuItem value="NAME" sx={adminSessionListMenuItemSx}>
                          Name
                        </MenuItem>
                        <MenuItem value="TASK" sx={adminSessionListMenuItemSx}>
                          Task Name
                        </MenuItem>
                        <MenuItem value="DATE" sx={adminSessionListMenuItemSx}>
                          Date Volunteer
                        </MenuItem>
                        <MenuItem value="START" sx={adminSessionListMenuItemSx}>
                          Start Time
                        </MenuItem>
                        <MenuItem value="END" sx={adminSessionListMenuItemSx}>
                          End Time
                        </MenuItem>
                        <MenuItem value="HOURS" sx={adminSessionListMenuItemSx}>
                          Total Hours
                        </MenuItem>
                        <MenuItem value="CREATED" sx={adminSessionListMenuItemSx}>
                          Created Date
                        </MenuItem>
                        <MenuItem value="DESCRIPTION" sx={adminSessionListMenuItemSx}>
                          Task Details
                        </MenuItem>
                        <MenuItem value="STATUS" sx={adminSessionListMenuItemSx}>
                          Status
                        </MenuItem>
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
                        <MenuItem value="contains" sx={adminSessionListMenuItemSx}>
                          Contains
                        </MenuItem>
                        <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
                          Equals
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
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSearch}
                      sx={adminSessionListFindButtonSx}
                    >
                      Find
                    </Button>
                  </Box>

                  <TableContainer
                    component={Paper}
                    className="admin-time-sheet-tracking-table-container"
                    sx={{ width: "100%" }}
                  >
                    <Table
                      className="admin-time-sheet-tracking-table"
                      sx={adminSessionListGridTableSx}
                      size="small"
                    >
                      <TableHead>
                        <TableRow sx={adminSessionListTableHeadRowSx}>
                          <SortableHeader
                            label="#"
                            field="logID"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.logID)}
                          />
                          <SortableHeader
                            label="Name"
                            field="name"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.name)}
                          />
                          <SortableHeader
                            label="Task Name"
                            field="taskName"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.taskName)}
                          />
                          <SortableHeader
                            label="Date Volunteer"
                            field="volunteerDate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.volunteerDate)}
                          />
                          <SortableHeader
                            label="Start Time"
                            field="startTime"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.startTime)}
                          />
                          <SortableHeader
                            label="End Time"
                            field="endTime"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.endTime)}
                          />
                          <SortableHeader
                            label="Total Hours"
                            field="totalHours"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.totalHours)}
                          />
                          <SortableHeader
                            label="Created Date"
                            field="createdDate"
                            sortField={sortField}
                            sortOrder={sortOrder}
                            onSort={handleSort}
                            headCellSx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.createdDate)}
                          />
                          <TableCell
                            sx={adminSessionListTableHeadCellSx(timeSheetColumnWidths.status, true)}
                          >
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
                                Loading...
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : paginatedList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={10} align="center" sx={adminSessionListEmptyCellSx}>
                              <Typography variant="body2" color="textSecondary" sx={adminSessionListEmptyTextSx}>
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
                                key={resolveTimeSheetLogId(row) ?? `row-${idx}`}
                                sx={adminSessionListTableBodyRowSx}
                              >
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {globalIdx}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {row.name ?? row.Name ?? "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {row.taskName ?? row.TaskName ?? ""}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {vd ? new Date(vd).toLocaleDateString() : ""}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {start}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {end}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {th}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ ellipsis: true })}>
                                  {cd ? new Date(cd).toLocaleString() : "—"}
                                </TableCell>
                                <TableCell sx={adminSessionListTableBodyCellSx({ isLast: true, action: true })}>
                                  <Box
                                    onClick={() => openEdit(row)}
                                    sx={{
                                      ...adminSessionListTableActionLinkSx,
                                      color: (row.approvalStatus ?? row.ApprovalStatus) === "Approved" || (row.approvalStatus ?? row.ApprovalStatus) === "Accepted" ? "green" : (row.approvalStatus ?? row.ApprovalStatus) === "Rejected" ? "red" : "blue",
                                      fontWeight: 'bold',
                                      textDecoration: 'underline'
                                    }}
                                  >
                                    {row.approvalStatus ?? row.ApprovalStatus ?? "Pending"}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <SystemAdminSessionListPagination
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
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <PortalDialog
        open={formOpen}
        onClose={closeForm}
        maxWidth="xs"
        disableClose={saving}
        contentSx={{ px: 2, pt: "16px !important", pb: 1.5 }}
        title={editingLogId ? "Update Time Sheet" : "Add Time Sheet"}
        icon={
          editingLogId ? (
            <EditIcon sx={{ fontSize: 20 }} />
          ) : (
            <AddIcon sx={{ fontSize: 20 }} />
          )
        }
        actions={
          <Button
            variant="contained"
            onClick={handleSubmitForm}
            disabled={saving || formLoading}
            sx={portalModalSendButtonSx}
          >
            {saving ? "Submitting…" : "Submit"}
          </Button>
        }
      >
        {formLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="time-sheet-modal-form" sx={timeSheetModalStackSx}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel id="time-sheet-task-name" shrink>
                Task Name
              </InputLabel>
              <PortalModalSelect
                labelId="time-sheet-task-name"
                label="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              >
                {TASK_OPTIONS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Volunteer Date"
              type="date"
              value={volunteerDate}
              onChange={(e) => setVolunteerDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={portalModalFieldSx}
            />

            <Box className="time-sheet-modal-time-row" sx={timeSheetModalTimeRowSx}>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-start-hour" shrink>
                  Start Hour
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-start-hour"
                  label="Start Hour"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  inputProps={{ "aria-label": "Start hour" }}
                >
                  {HOUR_OPTIONS.map((o, i) => (
                    <MenuItem key={`sh-${i}-${o.label}`} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-start-min" shrink>
                  Start Min
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-start-min"
                  label="Start Min"
                  value={startMin}
                  onChange={(e) => setStartMin(e.target.value)}
                  inputProps={{ "aria-label": "Start minutes" }}
                >
                  {MIN_OPTIONS.map((o, i) => (
                    <MenuItem key={`sm-${i}`} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-start-ampm" shrink>
                  Start AM/PM
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-start-ampm"
                  label="Start AM/PM"
                  value={startType}
                  onChange={(e) => setStartType(e.target.value)}
                  inputProps={{ "aria-label": "Start AM or PM" }}
                >
                  {AMPM_OPTIONS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
            </Box>

            <Box className="time-sheet-modal-time-row" sx={timeSheetModalTimeRowSx}>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-end-hour" shrink>
                  End Hour
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-end-hour"
                  label="End Hour"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  inputProps={{ "aria-label": "End hour" }}
                >
                  {HOUR_OPTIONS.map((o, i) => (
                    <MenuItem key={`eh-${i}-${o.label}`} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-end-min" shrink>
                  End Min
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-end-min"
                  label="End Min"
                  value={endMin}
                  onChange={(e) => setEndMin(e.target.value)}
                  inputProps={{ "aria-label": "End minutes" }}
                >
                  {MIN_OPTIONS.map((o, i) => (
                    <MenuItem key={`em-${i}`} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
              <FormControl fullWidth size="small" sx={timeSheetModalTimeSelectSx}>
                <InputLabel id="time-sheet-end-ampm" shrink>
                  End AM/PM
                </InputLabel>
                <PortalModalSelect
                  labelId="time-sheet-end-ampm"
                  label="End AM/PM"
                  value={endType}
                  onChange={(e) => setEndType(e.target.value)}
                  inputProps={{ "aria-label": "End AM or PM" }}
                >
                  {AMPM_OPTIONS.map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
            </Box>

            <TextField
              className="time-sheet-task-details-field"
              fullWidth
              size="small"
              label="Task Details"
              multiline
              minRows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={timeSheetTaskDetailsSx}
            />

            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel id="time-sheet-approval-status" shrink>
                Status
              </InputLabel>
              <PortalModalSelect
                labelId="time-sheet-approval-status"
                label="Status"
                value={approvalStatus}
                onChange={(e) => setApprovalStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Approved">Approve</MenuItem>
                <MenuItem value="Rejected">Reject</MenuItem>
              </PortalModalSelect>
            </FormControl>
          </Box>
        )}
      </PortalDialog>

      <AppConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteLogId(null);
        }}
        onConfirm={handleDelete}
        title="Delete entry"
        message="Do you want to delete this entry?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
      />

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
