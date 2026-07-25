import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAdminPortalBase } from "../../../utils/adminPortalPaths";
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
  status: "7.25rem",
  studentId: "4.75rem",
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
  country: "2%",
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

const DUPLICATE_STATUS_PATTERN = /^Duplicate[:\s]*(\d+)/i;

function parseDuplicateStatusId(status) {
  const text = String(status ?? "").trim();
  const match = text.match(DUPLICATE_STATUS_PATTERN);
  return match ? match[1] : null;
}

function buildRegisteredStudentSearchPath(studentId) {
  const base = getAdminPortalBase(
    typeof window !== "undefined" ? window.location.pathname : "",
  );
  return `${base}/registeredstudentlist?searchBy=STUDENT_ID&searchCriteria=equals&searchText=${encodeURIComponent(studentId)}&from=student-waiting-list`;
}

const WaitingListStatusCell = ({ value }) => {
  const navigate = useNavigate();
  const display =
    value == null || value === "" ? "—" : String(value).trim() || "—";
  const duplicateId = parseDuplicateStatusId(display);

  if (!duplicateId) {
    return (
      <Tooltip title={display}>
        <Box
          component="span"
          sx={{
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
        >
          {display}
        </Box>
      </Tooltip>
    );
  }

  const linkPath = buildRegisteredStudentSearchPath(duplicateId);

  return (
    <Tooltip title={`View registered student #${duplicateId}`}>
      <Box
        component="span"
        sx={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        Duplicate:{" "}
        <Box
          component="span"
          onClick={(event) => {
            event.stopPropagation();
            navigate(linkPath);
          }}
          sx={adminSessionListTableActionLinkSx}
        >
          {duplicateId}
        </Box>
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

const STATUS_OPTIONS = [
  { value: "A", label: "Approved" },
  { value: "D", label: "Declined" },
];

// Class is hardcoded (same catalog used across admin pages; no class lookup table wired for this screen).
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
  { value: "ED", label: "Engineering Design" },
];

const LOCATION_OPTIONS = [
  { value: "O", label: "OnSite" },
  { value: "I", label: "Internet" },
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
    const city = String(chapter.city ?? chapter.City ?? "").trim();
    const label = String(chapter.label ?? chapter.Label ?? "").trim();
    return (
      eventLocation === name ||
      eventLocation === label ||
      eventLocation === `${name} - ${loc}` ||
      eventLocation === `${name} - ${loc} - ${city}` ||
      eventLocation.startsWith(`${name} -`)
    );
  });
  return match ? String(match.chapterID ?? match.ChapterID ?? "") : "";
}

function mapWaitingListSessionOptions(options) {
  if (!Array.isArray(options) || options.length === 0) {
    return [];
  }
  return options
    .map((option) => ({
      value: String(option.value ?? option.Value ?? "").trim(),
      label: String(
        option.label ?? option.Label ?? option.value ?? option.Value ?? "",
      ).trim(),
    }))
    .filter((option) => option.value);
}

function chapterOptionLabel(chapter) {
  const label = String(chapter.label ?? chapter.Label ?? "").trim();
  if (label) return label;
  const name = String(chapter.chapterName ?? chapter.ChapterName ?? "").trim();
  const loc = String(chapter.location ?? chapter.Location ?? "").trim();
  const city = String(chapter.city ?? chapter.City ?? "").trim();
  return [name, loc, city].filter(Boolean).join(" - ");
}

function getSelectedChapterLabel(chapterID, chapters) {
  const id = String(chapterID ?? "").trim();
  if (!id) return "";
  const match = (chapters || []).find(
    (chapter) => String(chapter.chapterID ?? chapter.ChapterID ?? "") === id,
  );
  return match ? chapterOptionLabel(match) : `Chapter ${id}`;
}

function waitingListClassCode(parsedClass, rowClass) {
  const code = (parsedClass || "").trim();
  if (code && CLASS_OPTIONS.some((option) => option.value === code)) {
    return code;
  }
  const display = (rowClass || code || "").trim();
  const byLabel = CLASS_OPTIONS.find(
    (option) => option.label === display || option.value === display,
  );
  if (byLabel) return byLabel.value;
  return code || display || "JB";
}

function buildWaitingListLocationLabel(chapterID, locationCode, chapters) {
  const chapterPart = getSelectedChapterLabel(chapterID, chapters);
  const locationPart =
    LOCATION_OPTIONS.find((option) => option.value === locationCode)?.label ??
    locationCode;
  return `${chapterPart} - ${locationPart}`;
}

function waitingListApplicationStatus(status) {
  const value = String(status ?? "").trim().toLowerCase();
  if (value === "d" || value === "declined") return "D";
  return "A";
}

function applyWaitingListSearchCriteria(fieldValue, search, criteria) {
  const value = String(fieldValue ?? "").toLowerCase();

  switch (criteria) {
    case "equals":
      return value === search;
    case "starts_with":
      return value.startsWith(search);
    case "contains":
    default:
      return value.includes(search);
  }
}

function getWaitingListSearchFieldValue(row, searchBy) {
  switch (searchBy) {
    case "STUDENT_ID":
      return row.studentID ?? "";
    case "STUDENT_NAME":
      return row.studentName ?? "";
    case "CLASS":
      return row.class ?? "";
    case "GRADE":
      return row.grade ?? "";
    case "SCHOOL":
      return row.school ?? "";
    case "PARENT":
      return row.parentName ?? "";
    case "EMAIL":
      return row.emailAddress ?? "";
    case "STATUS":
      return row.applicationStatus ?? "";
    case "LOCATION":
      return row.eventLocation ?? "";
    case "SESSION":
      return row.eventSession ?? "";
    case "PHONE":
      return row.phoneNumber ?? "";
    default:
      return "";
  }
}

function getWaitingListAllSearchValues(row) {
  const registeredDate = row.registeredDate
    ? new Date(row.registeredDate)
    : null;
  const formattedDate =
    registeredDate && !Number.isNaN(registeredDate.getTime())
      ? registeredDate.toLocaleDateString()
      : "";

  return [
    row.applicationStatus,
    row.studentID,
    row.studentName,
    row.eventLocation,
    row.class,
    row.grade,
    row.school,
    row.parentName,
    row.phoneNumber,
    row.emailAddress,
    row.eventSession,
    formattedDate,
    row.registeredDate,
    row.city,
    row.state,
    row.country,
    getRowPassword(row),
  ];
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
  const [sessionOptions, setSessionOptions] = useState([]);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    chapterID: "",
    location: "O",
    originalLocation: "O",
    session: "",
    class: "",
    section: "A",
    applicationStatus: "A",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderBy, setOrderBy] = useState("studentID");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [appliedSearchBy, setAppliedSearchBy] = useState("ALL");
  const [appliedSearchCriteria, setAppliedSearchCriteria] =
    useState("contains");
  const [appliedSearchText, setAppliedSearchText] = useState("");
  const pageSize = 20;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const sessionSelectOptions = useMemo(() => {
    const options = [...sessionOptions];
    const currentSession = form.session?.trim();
    if (
      currentSession &&
      !options.some((option) => option.value === currentSession)
    ) {
      options.unshift({ value: currentSession, label: currentSession });
    }
    return options;
  }, [sessionOptions, form.session]);

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

  const loadSessionOptions = async () => {
    try {
      const res = await studentWaitingListService.getActiveSessionOptions();
      const options = res?.sessionOptions ?? res?.SessionOptions;
      if (res?.isSuccess && Array.isArray(options)) {
        const mapped = mapWaitingListSessionOptions(options);
        setSessionOptions(mapped);
        setForm((f) =>
          f.session || mapped.length === 0
            ? f
            : { ...f, session: mapped[0].value },
        );
      }
    } catch (err) {
      console.error("Error loading session options:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }
    setOrderBy("studentID");
    setOrder("asc");
    setCurrentPage(1);
    setGoToPageInput("1");
    loadList();
  }, [isAuthenticated, user, waitingForOnSite]);

  useEffect(() => {
    loadChapterLocations();
    loadSessionOptions();
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
    setAppliedSearchBy(searchBy);
    setAppliedSearchCriteria(searchCriteria || "contains");
    setAppliedSearchText(searchText.trim());
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
    const normalizedSearch = appliedSearchText.trim().toLowerCase();
    const criteria = appliedSearchCriteria || "contains";

    if (normalizedSearch) {
      filtered = list.filter((row) => {
        if (appliedSearchBy === "ALL") {
          return getWaitingListAllSearchValues(row).some((value) =>
            applyWaitingListSearchCriteria(value, normalizedSearch, criteria),
          );
        }

        const fieldValue = getWaitingListSearchFieldValue(row, appliedSearchBy);
        return applyWaitingListSearchCriteria(
          fieldValue,
          normalizedSearch,
          criteria,
        );
      });
    }

    const key = orderBy;
    return [...filtered].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === "studentID") {
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        const aValid = !Number.isNaN(aNum);
        const bValid = !Number.isNaN(bNum);
        if (aValid && bValid) {
          return order === "asc" ? aNum - bNum : bNum - aNum;
        }
        if (!aValid && !bValid) return 0;
        return order === "asc" ? (aValid ? -1 : 1) : aValid ? -1 : 1;
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
  }, [
    list,
    orderBy,
    order,
    appliedSearchBy,
    appliedSearchCriteria,
    appliedSearchText,
  ]);

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
    const locationCode = waitingListLocationCode(parsed.location, row.eventLocation);
    setForm({
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      chapterID,
      location: locationCode,
      originalLocation: locationCode,
      session:
        parsed.session ||
        row.eventSession ||
        sessionOptions[0]?.value ||
        "",
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
    const sessionLabel =
      sessionSelectOptions.find((option) => option.value === form.session)?.label ??
      form.session;
    const classLabel =
      CLASS_OPTIONS.find((option) => option.value === form.class)?.label ??
      form.class;
    const locationLabel = buildWaitingListLocationLabel(
      form.chapterID,
      form.location,
      chapterLocations,
    );

    // camelCase payload — matches API DTOs / RegisteredStudentList update-class pattern.
    const payload = {
      studentID: String(selectedRow.studentID ?? "").trim(),
      class: String(form.class ?? "").trim(),
      section: String(form.section ?? "").trim(),
      chapterID: String(form.chapterID ?? "").trim(),
      location: String(form.location ?? "").trim(),
      session: String(form.session ?? "").trim(),
      sessionLabel: String(sessionLabel ?? "").trim(),
      classLabel: String(classLabel ?? "").trim(),
      locationLabel: String(locationLabel ?? "").trim(),
      originalLocation: String(form.originalLocation ?? "").trim(),
      applicationStatus: String(form.applicationStatus ?? "A").trim(),
      firstName: parsed.firstName || nameParts[0] || "",
      lastName: parsed.lastName || nameParts.slice(1).join(" ") || "",
      email: selectedRow.emailAddress || parsed.email || "",
      password: parsed.password || selectedRow.password || "",
      reason: form.reason,
    };

    setSubmitting(true);
    try {
      const res =
        await studentWaitingListService.updateStudentWaitingListStatus(payload);
      const ok = res?.isSuccess === true || res?.IsSuccess === true;
      if (ok) {
        const defaultMessage =
          form.applicationStatus === "D"
            ? "You have declined the student successfully."
            : "You have registered the student successfully.";
        setSnackbar({
          open: true,
          message:
            res.message ||
            res.Message ||
            defaultMessage,
          severity: "success",
        });
        setReviewOpen(false);
        setSelectedRow(null);
        loadList();
      } else {
        const message =
          res?.errorMessage || res?.ErrorMessage || "Update failed.";
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

  const statusCell = (status) => (
    <TableCell
      className="student-waiting-list-status-cell"
      sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
    >
      <WaitingListStatusCell value={status} />
    </TableCell>
  );

  const studentIdCell = (studentId) => (
    <TableCell
      className="student-waiting-list-student-id-cell"
      sx={adminSessionListTableBodyCellSx({ ellipsis: true })}
    >
      <WaitingListCopyCell value={studentId} onCopied={handleCellCopy} />
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
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
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
                                key={`${row.studentID ?? "row"}-${row.registeredDate ?? ""}-${index}`}
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
                                {statusCell(row.applicationStatus)}
                                {studentIdCell(row.studentID)}
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
                                  {appliedSearchText
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
            <Tooltip
              title={
                getSelectedChapterLabel(form.chapterID, chapterLocations) ||
                "Select chapter"
              }
              placement="top-start"
              enterDelay={400}
            >
              <Box sx={{ width: "100%" }}>
                <FormControl fullWidth size="small" sx={portalModalFieldSx}>
                  <InputLabel>Chapter</InputLabel>
                  <PortalModalSelect
                    value={String(form.chapterID ?? "")}
                    label="Chapter"
                    renderValue={(selected) =>
                      getSelectedChapterLabel(selected, chapterLocations) ||
                      selected
                    }
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        chapterID: e.target.value,
                        section: waitingListDefaultSection(
                          f.class,
                          e.target.value,
                        ),
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
                        <MenuItem
                          value={String(form.chapterID)}
                          title={`Chapter ${form.chapterID}`}
                        >
                          Chapter {form.chapterID}
                        </MenuItem>
                      )}
                    {chapterLocations.map((ch) => {
                      const id = String(ch.chapterID ?? ch.ChapterID ?? "");
                      const label = chapterOptionLabel(ch);
                      return (
                        <MenuItem key={id} value={id} title={label}>
                          {label}
                        </MenuItem>
                      );
                    })}
                  </PortalModalSelect>
                </FormControl>
              </Box>
            </Tooltip>
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
                {!form.session && (
                  <MenuItem value="">
                    <em>Select session</em>
                  </MenuItem>
                )}
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
