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
  Tooltip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import { useAuth } from "../../../contexts/AuthContext";
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
  adminSessionListTableActionLinkSx,
  adminSessionListTableDeleteLinkSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import SortableHeader from "../Common/SortableHeader";
import studentWaitingListService from "../../../services/studentWaitingListService";
import "../../../styles/StudentWaitingList.css";

const studentWaitingListPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const waitingListColumnWidths = {
  edit: "4%",
  delete: "4%",
  status: "5.5%",
  studentId: "4.5%",
  studentName: "8%",
  location: "5.5%",
  class: "6%",
  grade: "5%",
  school: "6%",
  parent: "5.5%",
  phone: "5.5%",
  email: "8%",
  session: "4.5%",
  registeredDate: "9.5%",
  password: "6%",
  city: "4.5%",
  state: "4%",
  country: "6.5%",
};

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  return copied;
}

const WaitingListCopyCell = ({ value, onCopied }) => {
  const display =
    value == null || value === "" ? "—" : String(value).trim() || "—";
  const canCopy = display !== "—";

  const handleClick = async (event) => {
    event.stopPropagation();
    if (!canCopy) return;
    try {
      const copied = await copyTextToClipboard(display);
      if (copied) {
        onCopied?.(display);
      }
    } catch {
      // ignore copy failures
    }
  };

  return (
    <Tooltip title={canCopy ? `${display} (click to copy)` : display}>
      <Box
        component="span"
        onClick={handleClick}
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          cursor: canCopy ? "pointer" : "default",
        }}
      >
        {display}
      </Box>
    </Tooltip>
  );
};

const WaitingListPasswordCell = ({ value, onCopied }) => {
  const password =
    value == null || value === "" ? "" : String(value).trim();
  const canCopy = Boolean(password);
  const display = canCopy ? "xxx" : "—";

  const handleClick = async (event) => {
    event.stopPropagation();
    if (!canCopy) return;
    try {
      const copied = await copyTextToClipboard(password);
      if (copied) {
        onCopied?.(password);
      }
    } catch {
      // ignore copy failures
    }
  };

  return (
    <Tooltip title={canCopy ? "Click to copy password" : display}>
      <Box
        component="span"
        onClick={handleClick}
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
          cursor: canCopy ? "pointer" : "default",
          letterSpacing: canCopy ? 1 : undefined,
        }}
      >
        {display}
      </Box>
    </Tooltip>
  );
};

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
];

const LOCATION_OPTIONS = [
  { value: "O", label: "OnSite" },
  { value: "I", label: "Internet" },
];

const STATUS_OPTIONS = [
  { value: "A", label: "Approved" },
  { value: "D", label: "Declined" },
];

const SESSION_OPTIONS = [
  { value: "F2024", label: "Fall F2024" },
  { value: "S2024", label: "Spring 2024" },
];

// Parse StudentClassInfo legacy format: Fname E$~# Lname E$~# Class E$~# Email E$~# Sem E$~# Grade E$~# Location E$~# ChapterID E$~# Password
function parseStudentClassInfo(str) {
  if (!str || typeof str !== "string") return {};
  const arr = str.split("E$~#");
  return {
    firstName: (arr[0] || "").trim(),
    lastName: (arr[1] || "").trim(),
    class: (arr[2] || "").trim(),
    email: (arr[3] || "").trim(),
    session: (arr[4] || "").trim(),
    grade: (arr[5] || "").trim(),
    location: (arr[6] || "").trim(),
    chapterID: (arr[7] || "").trim(),
    password: (arr[8] || "").trim(),
  };
}

/** Legacy UpdateClass + drLocation: O/I from parsed value or EventLocation display text. */
function waitingListLocationCode(parsedLocation, eventLocation) {
  const p = (parsedLocation || "").trim().toUpperCase();
  if (p === "I" || p === "O") return p;
  const s = (eventLocation || "").toString().toLowerCase();
  if (s.includes("internet") || s === "i" || s === "online") return "I";
  return "O";
}

/** Legacy StudentWaitingList.aspx.cs UpdateClass() section default. */
function waitingListDefaultSection(classCode, chapterID) {
  const cls = (classCode || "").trim();
  const ch = String(chapterID ?? "").trim();
  return cls === "SI" || cls === "SA" || ch !== "1" ? "A" : "B";
}

/** Password from row or legacy StudentClassInfo (matches StudentWaitingList.aspx grid). */
function getRowPassword(row) {
  const direct = (row?.password ?? "").toString().trim();
  if (direct) return direct;
  return parseStudentClassInfo(row?.studentClassInfo).password || "";
}

function resolveWaitingListChapterId(row, parsed, chapters) {
  const parsedId = String(parsed.chapterID ?? "").trim();
  if (parsedId) return parsedId;
  const eventLocation = String(row?.eventLocation ?? "").trim();
  if (!eventLocation || !chapters?.length) return "";
  const match = chapters.find((chapter) => {
    const name = String(chapter.chapterName ?? chapter.ChapterName ?? "").trim();
    const loc = String(chapter.location ?? chapter.Location ?? "").trim();
    return (
      eventLocation === name ||
      eventLocation === `${name} - ${loc}` ||
      eventLocation.startsWith(`${name} -`)
    );
  });
  return match ? String(match.chapterID ?? match.ChapterID ?? "") : "";
}

function waitingListClassCode(parsedClass, rowClass) {
  const code = (parsedClass || rowClass || "").trim();
  return code || "JB";
}

function waitingListApplicationStatus(status) {
  const value = String(status ?? "").trim().toLowerCase();
  if (value === "d" || value === "declined") return "D";
  return "A";
}

function isWaitingListRequestTimeout(err) {
  return err?.code === "ECONNABORTED" || err?.message?.includes("timeout");
}

function getWaitingListApiErrorMessage(err, fallback = "Request failed.") {
  if (isWaitingListRequestTimeout(err)) {
    return "The request timed out. Please try again.";
  }
  const apiErrors = err?.response?.data?.errors;
  if (apiErrors) {
    return Object.values(apiErrors).flat().join(" ");
  }
  return (
    err?.response?.data?.errorMessage ||
    err?.response?.data?.title ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

const waitingListDeleteLinkSx = adminSessionListTableDeleteLinkSx;

const waitingListReviewDisabledFieldSx = {
  ...portalModalFieldSx,
  "& .MuiInputBase-root.Mui-disabled": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "text.secondary",
  },
};

const StudentWaitingList = () => {
  const { user, isAuthenticated } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitingForOnSite, setWaitingForOnSite] = useState("N");
  const [chapterLocations, setChapterLocations] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    chapterID: "",
    location: "O",
    session: "F2024",
    class: "",
    section: "A",
    applicationStatus: "A",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("registeredDate");
  const [order, setOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const pageSize = 20;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const sessionSelectOptions = useMemo(() => {
    const options = [...SESSION_OPTIONS];
    const currentSession = form.session?.trim();
    if (
      currentSession &&
      !options.some((option) => option.value === currentSession)
    ) {
      options.unshift({ value: currentSession, label: currentSession });
    }
    return options;
  }, [form.session]);

  const chapterSelectIds = useMemo(
    () =>
      chapterLocations.map((chapter) =>
        String(chapter.chapterID ?? chapter.ChapterID ?? ""),
      ),
    [chapterLocations],
  );

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await studentWaitingListService.getStudentWaitingList({
        WaitingForOnSite: waitingForOnSite,
        Username: username,
      });
      const data = res?.studentWaitingList ?? res?.StudentWaitingList;
      if (res?.isSuccess && Array.isArray(data)) {
        setList(
          data
            .map((row) => {
              if (!row || typeof row !== "object") return null;
              const studentClassInfo =
                row.studentClassInfo ?? row.StudentClassInfo;
              const parsed = parseStudentClassInfo(studentClassInfo);
              return {
                studentID: row.studentID ?? row.StudentID,
                studentName: row.studentName ?? row.StudentName,
                eventLocation: row.eventLocation ?? row.EventLocation,
                class: row.class ?? row.Class,
                grade: row.grade ?? row.Grade,
                school: row.school ?? row.School,
                parentName: row.parentName ?? row.ParentName,
                phoneNumber: row.phoneNumber ?? row.PhoneNumber,
                emailAddress: row.emailAddress ?? row.EmailAddress,
                eventSession: row.eventSession ?? row.EventSession,
                registeredDate: row.registeredDate ?? row.RegisteredDate,
                password:
                  (row.password ?? row.Password ?? "").toString().trim() ||
                  parsed.password ||
                  "",
                city: row.city ?? row.City,
                state: row.state ?? row.State,
                country: row.country ?? row.Country,
                applicationStatus:
                  row.applicationStatus ?? row.ApplicationStatus,
                studentClassInfo,
              };
            })
            .filter(Boolean),
        );
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading student waiting list:", err);
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.errorMessage ??
        err?.response?.data?.title ??
        err?.message ??
        "Error loading Student waiting list.";
      setSnackbar({
        open: true,
        message: msg,
        severity: "error",
      });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadChapterLocations = async () => {
    try {
      const res = await studentWaitingListService.getChapterLocation({
        Mode: "N",
      });
      const chapters = res?.chapterLocations ?? res?.ChapterLocations;
      if (res?.isSuccess && Array.isArray(chapters)) {
        setChapterLocations(chapters);
      }
    } catch (err) {
      console.error("Error loading chapter locations:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    setOrderBy("registeredDate");
    setOrder("desc");
    setCurrentPage(1);
    setGoToPageInput("1");
    loadList();
  }, [isAuthenticated, user, waitingForOnSite]);

  useEffect(() => {
    loadChapterLocations();
  }, []);

  /** Legacy kGrid: first header click DESC, same column toggles ASC/DESC. */
  const handleRequestSort = (property) => {
    if (orderBy === property) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(property);
      setOrder("desc");
    }
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(
      (filteredAndSortedList?.length || 0) / pageSize,
    );
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const filteredAndSortedList = useMemo(() => {
    if (!list.length) return [];
    let filtered = list;
    if (searchBy !== "ALL" && searchText.trim()) {
      filtered = list.filter((row) => {
        let fieldValue = "";
        switch (searchBy) {
          case "STUDENT_ID":
            fieldValue = (row.studentID ?? "").toString();
            break;
          case "STUDENT_NAME":
            fieldValue = row.studentName ?? "";
            break;
          case "CLASS":
            fieldValue = row.class ?? "";
            break;
          case "GRADE":
            fieldValue = row.grade ?? "";
            break;
          case "SCHOOL":
            fieldValue = row.school ?? "";
            break;
          case "PARENT":
            fieldValue = row.parentName ?? "";
            break;
          case "EMAIL":
            fieldValue = row.emailAddress ?? "";
            break;
          case "STATUS":
            fieldValue = row.applicationStatus ?? "";
            break;
          default:
            return true;
        }
        fieldValue = String(fieldValue).toLowerCase();
        const search = searchText.trim().toLowerCase();
        if (searchCriteria === "equals") return fieldValue === search;
        if (searchCriteria === "starts_with")
          return fieldValue.startsWith(search);
        return fieldValue.includes(search);
      });
    }
    const key = orderBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "studentID") {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return order === "asc" ? aNum - bNum : bNum - aNum;
        }
      }

      if (key === "registeredDate") {
        const aTime = aVal ? new Date(aVal).getTime() : 0;
        const bTime = bVal ? new Date(bVal).getTime() : 0;
        if (!Number.isNaN(aTime) && !Number.isNaN(bTime)) {
          return order === "asc" ? aTime - bTime : bTime - aTime;
        }
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }
      aVal = (aVal ?? "").toString();
      bVal = (bVal ?? "").toString();
      return order === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  }, [list, orderBy, order, searchBy, searchCriteria, searchText]);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedList.slice(start, start + pageSize);
  }, [filteredAndSortedList, currentPage]);

  const totalPages = Math.ceil((filteredAndSortedList?.length || 0) / pageSize);
  const totalRecords = filteredAndSortedList?.length || 0;
  const isDeclinedReview = form.applicationStatus === "D";

  const handleEdit = (row) => {
    setSelectedRow(row);
    const parsed = parseStudentClassInfo(row.studentClassInfo);
    const nameParts = (row.studentName || "").trim().split(/\s+/);
    const classCode = waitingListClassCode(parsed.class, row.class);
    const chapterID = resolveWaitingListChapterId(row, parsed, chapterLocations);
    setForm({
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      chapterID,
      location: waitingListLocationCode(parsed.location, row.eventLocation),
      session: parsed.session || row.eventSession || SESSION_OPTIONS[0].value,
      class: classCode,
      section: waitingListDefaultSection(classCode, chapterID),
      applicationStatus: waitingListApplicationStatus(row.applicationStatus),
      reason: "",
    });
    setReviewOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRow?.studentID) return;
    setSubmitting(true);
    try {
      const res = await studentWaitingListService.deleteStudent({
        StudentId: String(selectedRow.studentID),
      });
      if (res?.isSuccess) {
        setSnackbar({
          open: true,
          message: res.message || "Student removed successfully.",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage || "Delete failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: getWaitingListApiErrorMessage(err, "Delete failed."),
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedRow) return;

    if (!form.chapterID) {
      setSnackbar({
        open: true,
        message: "Please select a chapter.",
        severity: "error",
      });
      return;
    }
    if (!form.class || !form.section || !form.location) {
      setSnackbar({
        open: true,
        message: "Class, section, and location are required.",
        severity: "error",
      });
      return;
    }
    if (!form.session) {
      setSnackbar({
        open: true,
        message: "Please select a session.",
        severity: "error",
      });
      return;
    }
    if (form.applicationStatus === "D" && !form.reason.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a reason when declining an application.",
        severity: "error",
      });
      return;
    }

    const parsed = parseStudentClassInfo(selectedRow.studentClassInfo);
    const nameParts = (selectedRow.studentName || "").trim().split(/\s+/);

    setSubmitting(true);
    try {
      const res =
        await studentWaitingListService.updateStudentWaitingListStatus({
          StudentID: String(selectedRow.studentID),
          Class: form.class,
          Section: form.section,
          ChapterID: form.chapterID,
          Location: form.location,
          Session: form.session,
          ApplicationStatus: form.applicationStatus,
          FirstName: parsed.firstName || nameParts[0] || "",
          LastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
          Email: selectedRow.emailAddress || parsed.email || "",
          Password: parsed.password || selectedRow.password || "",
          Reason: form.reason,
        });
      if (res?.isSuccess) {
        setSnackbar({
          open: true,
          message: res.message || "Application updated successfully.",
          severity: "success",
        });
        setReviewOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        const message = res?.errorMessage || "Update failed.";
        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
      }
    } catch (err) {
      const timedOut = isWaitingListRequestTimeout(err);
      const message = timedOut
        ? "The request timed out, but your changes may have been saved. Refreshing the list."
        : getWaitingListApiErrorMessage(err, "Update failed.");
      setSnackbar({
        open: true,
        message,
        severity: timedOut ? "warning" : "error",
      });
      if (timedOut) {
        setReviewOpen(false);
        setSelectedRow(null);
        loadList();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      await studentWaitingListService.exportToExcel({
        Username: username,
        WaitingForOnSite: waitingForOnSite,
      });
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getWaitingListApiErrorMessage(err, "Export failed."),
        severity: "error",
      });
    }
  };

  const handleExportCsv = async () => {
    try {
      await studentWaitingListService.exportToCsv({
        Username: username,
        WaitingForOnSite: waitingForOnSite,
      });
      setSnackbar({
        open: true,
        message: "CSV export downloaded.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getWaitingListApiErrorMessage(err, "CSV export failed."),
        severity: "error",
      });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    const date = typeof d === "string" ? new Date(d) : d;
    return isNaN(date.getTime()) ? d : date.toLocaleDateString();
  };

  const headCellSx = (width, isLast = false, extra = {}) => ({
    ...adminSessionListTableHeadCellSx(width, isLast),
    width,
    overflow: "hidden",
    ...extra,
  });

  const handleCellCopy = () => {
    setSnackbar({
      open: true,
      message: "Copied to clipboard",
      severity: "success",
    });
  };

  const dataCell = (value, isLast = false) => (
    <TableCell
      sx={adminSessionListTableBodyCellSx({ ellipsis: true, isLast })}
    >
      <WaitingListCopyCell value={value} onCopied={handleCellCopy} />
    </TableCell>
  );

  const passwordCell = (row, isLast = false) => (
    <TableCell
      sx={adminSessionListTableBodyCellSx({ ellipsis: true, isLast })}
    >
      <WaitingListPasswordCell
        value={getRowPassword(row)}
        onCopied={handleCellCopy}
      />
    </TableCell>
  );

  const exportToolbarButtonSx = {
    ...adminSessionListFindButtonSx,
    backgroundColor: "#4caf50",
    color: "white",
    flexShrink: 0,
    px: 1.5,
    "&:hover": { backgroundColor: "#43a047" },
  };

  return (
    <Box className="student-waiting-list" sx={studentWaitingListPageSx}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={adminSessionListTitleSx}
                  >
                    Student Waiting List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      sx={exportToolbarButtonSx}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportCsv}
                      sx={exportToolbarButtonSx}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        setWaitingForOnSite((v) => (v === "Y" ? "N" : "Y"))
                      }
                      sx={{
                        ...exportToolbarButtonSx,
                      }}
                    >
                      Waiting for OnSite Class
                    </Button>
                  </Box>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box className="student-waiting-list-table-panel">
                    <Box sx={adminSessionListSearchBarSx}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography sx={adminSessionListSearchLabelSx}>
                          Search By:
                        </Typography>
                        <Select
                          value={searchBy}
                          onChange={(e) => setSearchBy(e.target.value)}
                          size="small"
                          sx={adminSessionListSearchSelectSx}
                        >
                          <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                            -ALL-
                          </MenuItem>
                          <MenuItem
                            value="STUDENT_ID"
                            sx={adminSessionListMenuItemSx}
                          >
                            Student #
                          </MenuItem>
                          <MenuItem
                            value="STUDENT_NAME"
                            sx={adminSessionListMenuItemSx}
                          >
                            Student Name
                          </MenuItem>
                          <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
                            Class
                          </MenuItem>
                          <MenuItem value="GRADE" sx={adminSessionListMenuItemSx}>
                            Grade
                          </MenuItem>
                          <MenuItem value="SCHOOL" sx={adminSessionListMenuItemSx}>
                            School
                          </MenuItem>
                          <MenuItem value="PARENT" sx={adminSessionListMenuItemSx}>
                            Parent
                          </MenuItem>
                          <MenuItem value="EMAIL" sx={adminSessionListMenuItemSx}>
                            Email
                          </MenuItem>
                          <MenuItem value="STATUS" sx={adminSessionListMenuItemSx}>
                            Status
                          </MenuItem>
                        </Select>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Typography sx={adminSessionListSearchLabelSx}>
                          Criteria:
                        </Typography>
                        <Select
                          value={searchCriteria}
                          onChange={(e) => setSearchCriteria(e.target.value)}
                          size="small"
                          sx={adminSessionListSearchSelectSx}
                        >
                          <MenuItem value="" sx={adminSessionListMenuItemSx}>
                            Select Criteria
                          </MenuItem>
                          <MenuItem value="equals" sx={adminSessionListMenuItemSx}>
                            Equals
                          </MenuItem>
                          <MenuItem
                            value="contains"
                            sx={adminSessionListMenuItemSx}
                          >
                            Contains
                          </MenuItem>
                          <MenuItem
                            value="starts_with"
                            sx={adminSessionListMenuItemSx}
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
                      sx={adminSessionListTableContainerSx}
                      className="student-waiting-list-table-container"
                    >
                      <Table
                        sx={adminSessionListGridTableSx}
                        size="small"
                        className="student-waiting-list-table"
                      >
                        <TableHead>
                          <TableRow sx={adminSessionListTableHeadRowSx}>
                            <TableCell
                              className="student-waiting-list-edit-cell"
                              sx={headCellSx(waitingListColumnWidths.edit)}
                            >
                              Edit
                            </TableCell>
                            <TableCell
                              className="student-waiting-list-delete-cell"
                              sx={headCellSx(waitingListColumnWidths.delete)}
                            >
                              Delete
                            </TableCell>
                            <SortableHeader
                              label="Status"
                              field="applicationStatus"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.status)}
                            />
                            <SortableHeader
                              label="Student #"
                              field="studentID"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.studentId)}
                            />
                            <SortableHeader
                              label="Student Name"
                              field="studentName"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.studentName)}
                            />
                            <SortableHeader
                              label="Location"
                              field="eventLocation"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.location)}
                            />
                            <SortableHeader
                              label="Class"
                              field="class"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.class)}
                            />
                            <SortableHeader
                              label="Grade"
                              field="grade"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.grade)}
                            />
                            <SortableHeader
                              label="School"
                              field="school"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.school)}
                            />
                            <SortableHeader
                              label="Parent"
                              field="parentName"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.parent)}
                            />
                            <SortableHeader
                              label="Phone"
                              field="phoneNumber"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.phone)}
                            />
                            <SortableHeader
                              label="Email"
                              field="emailAddress"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.email)}
                            />
                            <SortableHeader
                              label="Session"
                              field="eventSession"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.session)}
                            />
                            <SortableHeader
                              label="Registered Date"
                              field="registeredDate"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(
                                waitingListColumnWidths.registeredDate,
                              )}
                            />
                            <SortableHeader
                              label="Password"
                              field="password"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.password)}
                            />
                            <SortableHeader
                              label="City"
                              field="city"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.city)}
                            />
                            <SortableHeader
                              label="State"
                              field="state"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.state)}
                            />
                            <SortableHeader
                              label="Country"
                              field="country"
                              sortField={orderBy}
                              sortOrder={order}
                              onSort={handleRequestSort}
                              headCellSx={headCellSx(waitingListColumnWidths.country, true)}
                            />
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paginatedList.length > 0 ? (
                            paginatedList.map((row, index) => (
                              <TableRow
                                key={row.studentID ?? `row-${index}`}
                                sx={adminSessionListTableBodyRowSx}
                              >
                                <TableCell
                                  className="student-waiting-list-edit-cell"
                                  sx={adminSessionListTableBodyCellSx({
                                    action: true,
                                  })}
                                >
                                  <Box
                                    component="span"
                                    onClick={() => handleEdit(row)}
                                    sx={adminSessionListTableActionLinkSx}
                                  >
                                    Edit
                                  </Box>
                                </TableCell>
                                <TableCell
                                  className="student-waiting-list-delete-cell"
                                  sx={adminSessionListTableBodyCellSx({
                                    action: true,
                                  })}
                                >
                                  {row.studentID === 0 ? (
                                    <Box component="span" sx={{ color: "#999" }}>
                                      Delete
                                    </Box>
                                  ) : (
                                    <Box
                                      component="span"
                                      onClick={() => handleDeleteClick(row)}
                                      sx={waitingListDeleteLinkSx}
                                    >
                                      Delete
                                    </Box>
                                  )}
                                </TableCell>
                                {dataCell(row.applicationStatus)}
                                {dataCell(row.studentID)}
                                {dataCell(row.studentName)}
                                {dataCell(row.eventLocation)}
                                {dataCell(row.class)}
                                {dataCell(row.grade)}
                                {dataCell(row.school)}
                                {dataCell(row.parentName)}
                                {dataCell(row.phoneNumber)}
                                {dataCell(row.emailAddress)}
                                {dataCell(row.eventSession)}
                                {dataCell(formatDate(row.registeredDate) || null)}
                                {passwordCell(row)}
                                {dataCell(row.city)}
                                {dataCell(row.state)}
                                {dataCell(row.country, true)}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={18}
                                align="center"
                                sx={adminSessionListEmptyCellSx}
                              >
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={adminSessionListEmptyTextSx}
                                >
                                  {searchText
                                    ? "No records found matching your search criteria."
                                    : "No records found."}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}
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
                      onPageChange={handlePageChange}
                      onGoToPage={handleGoToPage}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <PortalDialog
        open={reviewOpen}
        onClose={() => {
          if (!submitting) {
            setReviewOpen(false);
          }
        }}
        maxWidth="sm"
        disableClose={submitting}
        title="Review Application"
        icon={<EditIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            onClick={handleReviewSubmit}
            disabled={submitting}
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        }
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="First Name"
              value={form.firstName}
              disabled
              sx={waitingListReviewDisabledFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Last Name"
              value={form.lastName}
              disabled
              sx={waitingListReviewDisabledFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              value={
                selectedRow?.emailAddress ||
                parseStudentClassInfo(selectedRow?.studentClassInfo).email ||
                ""
              }
              disabled
              sx={waitingListReviewDisabledFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Grade"
              value={
                selectedRow?.grade ||
                parseStudentClassInfo(selectedRow?.studentClassInfo).grade ||
                ""
              }
              disabled
              sx={waitingListReviewDisabledFieldSx}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Student #"
              value={selectedRow?.studentID ?? ""}
              disabled
              sx={waitingListReviewDisabledFieldSx}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Chapter</InputLabel>
              <PortalModalSelect
                value={String(form.chapterID ?? "")}
                label="Chapter"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    chapterID: e.target.value,
                    section: waitingListDefaultSection(f.class, e.target.value),
                  }))
                }
              >
                {!form.chapterID && (
                  <MenuItem value="">
                    <em>Select chapter</em>
                  </MenuItem>
                )}
                {form.chapterID &&
                  !chapterSelectIds.includes(String(form.chapterID)) && (
                    <MenuItem value={String(form.chapterID)}>
                      Chapter {form.chapterID}
                    </MenuItem>
                  )}
                {chapterLocations.map((ch) => {
                  const id = String(ch.chapterID ?? ch.ChapterID ?? "");
                  const name = ch.chapterName ?? ch.ChapterName ?? "";
                  const loc = ch.location ?? ch.Location ?? "";
                  return (
                    <MenuItem key={id} value={id}>
                      {name} - {loc}
                    </MenuItem>
                  );
                })}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Location</InputLabel>
              <PortalModalSelect
                value={form.location}
                label="Location"
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
              >
                {LOCATION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Session</InputLabel>
              <PortalModalSelect
                value={form.session}
                label="Session"
                onChange={(e) =>
                  setForm((f) => ({ ...f, session: e.target.value }))
                }
              >
                {sessionSelectOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Class</InputLabel>
              <PortalModalSelect
                value={form.class}
                label="Class"
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    class: e.target.value,
                    section: waitingListDefaultSection(
                      e.target.value,
                      f.chapterID,
                    ),
                  }))
                }
              >
                {form.class &&
                  !CLASS_OPTIONS.some((opt) => opt.value === form.class) && (
                    <MenuItem value={form.class}>{form.class}</MenuItem>
                  )}
                {CLASS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              fullWidth
              size="small"
              disabled
              sx={waitingListReviewDisabledFieldSx}
            >
              <InputLabel>Section</InputLabel>
              <PortalModalSelect value={form.section} label="Section" disabled>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small" sx={portalModalFieldSx}>
              <InputLabel>Application Status</InputLabel>
              <PortalModalSelect
                value={form.applicationStatus}
                label="Application Status"
                onChange={(e) => {
                  const applicationStatus = e.target.value;
                  setForm((f) => ({
                    ...f,
                    applicationStatus,
                    reason: applicationStatus === "D" ? f.reason : "",
                  }));
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </PortalModalSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Reason"
              multiline
              rows={3}
              value={form.reason}
              disabled={!isDeclinedReview}
              placeholder={
                isDeclinedReview
                  ? "Required when declining an application"
                  : "Only used when application status is Declined"
              }
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
              sx={
                isDeclinedReview
                  ? portalModalFieldSx
                  : waitingListReviewDisabledFieldSx
              }
            />
          </Grid>
        </Grid>
      </PortalDialog>

      <AppConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          if (!submitting) {
            setDeleteConfirmOpen(false);
          }
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete student"
        message="Do you want to delete this student from the waiting list?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
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

export default StudentWaitingList;
