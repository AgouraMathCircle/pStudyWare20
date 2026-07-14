import React, { useState, useEffect, useMemo, useRef } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  Download as DownloadIcon,
  UploadFile as UploadFileIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Visibility as ViewReportIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import AdminSessionListPagination from "./AdminSessionListPagination";
import reportCardService from "../../../services/reportCardService";
import {
  ADMIN_SESSION_LIST_BORDER,
  ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  adminSessionListEmptyCellSx,
  adminSessionListEmptyTextSx,
  adminSessionListFindButtonSx,
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
  instructorPortalContentContainerProps,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import "../../../styles/InstructorReportCard.css";
import SortableHeader from "../Common/SortableHeader";
import {
  sortRows,
  toSortableDate,
  toSortableNumber,
} from "../../../utils/tableSort";

const EXAM_TYPES = [
  "Quiz",
  "Class Test",
  "Home Work",
  "Final Exam",
  "Placement Test",
];

const getClassLabel = (classCode) => {
  const classMap = {
    JB: "Junior Beginner",
    JI: "Junior Intermediate",
    JA: "Junior Advanced",
    SB: "Senior Beginner",
    SI: "Senior Intermediate",
    SA: "Senior Advanced",
    DS: "Data Science",
    AI: "Artificial Intelligence",
    GD: "Game Development",
    AD: "App Development",
    DM: "Data Management",
    ST: "PSAT/SAT",
    AT: "ACT",
    ED: "Engineering Design",
  };
  return classMap[classCode] || classCode || "";
};

const pickField = (item, ...keys) => {
  if (item == null) return "";
  if (typeof item !== "object") return String(item);
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      const val = item[key];
      if (val != null && val !== "") return val;
    }
  }
  const normalizedKeys = new Set(keys.map((key) => key.toLowerCase()));
  for (const [objKey, val] of Object.entries(item)) {
    if (
      normalizedKeys.has(objKey.toLowerCase()) &&
      val != null &&
      val !== ""
    ) {
      return val;
    }
  }
  return "";
};

const formatFieldValue = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "object") return "";
  return String(value);
};

const formatLegacyExamDate = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const formatExamDateValue = (value) => formatLegacyExamDate(value);
const formatReportCardDate = (value) => formatLegacyExamDate(value);

const resolveReportCardId = (value) => {
  if (value == null || value === "") return "";
  return String(value);
};

const resolveClassSelectValue = (group, classList) => {
  if (!group) return "";
  const raw = String(group).trim();
  const expanded = getClassLabel(raw);

  for (const item of classList) {
    const name = getClassOptionValue(item);
    if (!name) continue;
    const nameTrim = name.trim();
    const label = getClassLabel(nameTrim);
    if (
      nameTrim === raw ||
      nameTrim === expanded ||
      label === raw ||
      label === expanded
    ) {
      return nameTrim;
    }
  }

  return raw;
};

const resolveExamScheduleValue = (examDate, examDateList) => {
  if (!examDate) return "";
  const raw = String(examDate).trim();
  const normalized = formatExamDateValue(raw);

  for (const item of examDateList) {
    const value = getExamScheduleOptionValue(item);
    if (!value) continue;
    const valueText = String(value).trim();
    if (valueText === raw || formatExamDateValue(valueText) === normalized) {
      return valueText;
    }
  }

  return normalized || raw;
};

const classListIncludesValue = (classList, value) =>
  !!value &&
  classList.some((item) => {
    const name = getClassOptionValue(item);
    if (!name) return false;
    const normalized = String(value).trim();
    const nameTrim = name.trim();
    return (
      nameTrim === normalized ||
      getClassLabel(nameTrim) === normalized ||
      getClassLabel(normalized) === nameTrim
    );
  });

const examDateListIncludesValue = (examDateList, value) =>
  !!value &&
  examDateList.some((item) => {
    const scheduleValue = getExamScheduleOptionValue(item);
    return (
      scheduleValue &&
      (String(scheduleValue).trim() === String(value).trim() ||
        formatExamDateValue(scheduleValue) === formatExamDateValue(value))
    );
  });

const DEFAULT_ADD_SCORE_FORM = {
  studentId: "",
  className: "",
  examDate: "",
  quizTotal: "10",
  quizReceived: "",
  quizComments: "",
  classTestTotal: "10",
  classTestReceived: "",
  classTestComments: "",
  homeWorkTotal: "10",
  homeWorkReceived: "",
  homeWorkComments: "",
  finalExamTotal: "0",
  finalExamReceived: "",
  finalExamComments: "",
  placementTestTotal: "0",
  placementTestReceived: "",
  placementTestComments: "",
};

const ADD_SCORE_ROWS = [
  {
    label: "Quiz",
    totalKey: "quizTotal",
    receivedKey: "quizReceived",
    commentsKey: "quizComments",
  },
  {
    label: "Class Test",
    totalKey: "classTestTotal",
    receivedKey: "classTestReceived",
    commentsKey: "classTestComments",
  },
  {
    label: "Home Work",
    totalKey: "homeWorkTotal",
    receivedKey: "homeWorkReceived",
    commentsKey: "homeWorkComments",
  },
  {
    label: "Final Exam",
    totalKey: "finalExamTotal",
    receivedKey: "finalExamReceived",
    commentsKey: "finalExamComments",
  },
  {
    label: "Placement Test",
    totalKey: "placementTestTotal",
    receivedKey: "placementTestReceived",
    commentsKey: "placementTestComments",
  },
];

const SCORE_UPLOAD_TEMPLATE_URL =
  "/pstudyware/Documents/AMC_ScoreCard/StudentReportCard.csv";

const getReportDateOptionValue = (item) =>
  pickField(
    item,
    "mExamDate",
    "MExamDate",
    "reportDate",
    "ReportDate",
    "value",
    "Value",
  ) || "";

const getReportDateOptionLabel = (item) => {
  const label = pickField(item, "reportDate", "ReportDate");
  if (label) return label;
  const value = getReportDateOptionValue(item);
  return value ? formatReportCardDate(value) : "";
};

const getClassOptionValue = (item) =>
  pickField(
    item,
    "className",
    "ClassName",
    "text",
    "Text",
    "value",
    "Value",
  ) || "";

/** Legacy BindClassList uses ClassName; dedupe SP rows that repeat the same class. */
const getClassOptionLabel = (item) => {
  const value = getClassOptionValue(item);
  if (!value) return "";
  return getClassLabel(value) || value;
};

const dedupeClassList = (items) => {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const value = getClassOptionValue(item);
    if (!value) continue;
    const label = getClassOptionLabel(item) || value;
    const key = label.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
};

const mapClassMenuOptions = (classList) =>
  dedupeClassList(classList).map((c) => {
    const value = getClassOptionValue(c);
    const label = getClassOptionLabel(c) || value;
    return { key: value, value, label };
  });

/** Legacy BindStudentList: DataValueField=StudentID, DataTextField=StudentName (API). */
const getStudentOptionValue = (item) =>
  formatFieldValue(
    pickField(item, "studentID", "StudentID", "studentId", "StudentId"),
  );

const getStudentOptionLabel = (item) => {
  const name = pickField(item, "studentName", "StudentName");
  const id = getStudentOptionValue(item);
  return name || id;
};

const mapStudentMenuOptions = (students) => {
  if (!Array.isArray(students)) return [];
  const seen = new Set();
  const options = [];
  for (const item of students) {
    const value = getStudentOptionValue(item);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    options.push({
      key: value,
      value,
      label: getStudentOptionLabel(item),
    });
  }
  return options;
};

/** Legacy BindClassSchedule: DataValueField=DisplayValue, DataTextField=Session. */
const getExamScheduleOptionValue = (item) =>
  formatFieldValue(
    pickField(
      item,
      "displayValue",
      "DisplayValue",
      "mExamDate",
      "MExamDate",
      "value",
      "Value",
    ),
  );

const getExamScheduleOptionLabel = (item) => {
  const session = pickField(
    item,
    "session",
    "Session",
    "reportDate",
    "ReportDate",
    "text",
    "Text",
  );
  const value = getExamScheduleOptionValue(item);
  return session || (value ? formatExamDateValue(value) : "");
};

const mapExamScheduleMenuOptions = (examDates) => {
  if (!Array.isArray(examDates)) return [];
  const seen = new Set();
  const options = [];
  for (const item of examDates) {
    const value = getExamScheduleOptionValue(item);
    if (!value || seen.has(value)) continue;
    seen.add(value);
    options.push({
      key: value,
      value,
      label: getExamScheduleOptionLabel(item) || value,
    });
  }
  return options;
};

/** Legacy ReportCard.aspx / kGrid1 defaults */
const LEGACY_REPORT_CARD_PAGE_SIZE = 25;
const LEGACY_REPORT_CARD_DEFAULT_SORT_FIELD = "reportCardId";
const LEGACY_REPORT_CARD_DEFAULT_SORT_ORDER = "desc";

const DEFAULT_UPLOAD_SCORE_FORM = {
  className: "",
  examDate: "",
  quizTotal: "5",
  classWorkTotal: "20",
  homeWorkTotal: "10",
  file: null,
};

const adminReportCardTableSx = {
  tableLayout: "fixed",
  width: "100%",
  minWidth: 1208,
  borderCollapse: "collapse",
  border: ADMIN_SESSION_LIST_BORDER,
  "& .MuiTableCell-root": {
    paddingTop: 0,
    paddingBottom: 0,
    borderRight: ADMIN_SESSION_LIST_BORDER,
    borderBottom: ADMIN_SESSION_LIST_BORDER,
  },
};

const adminReportCardTableContainerSx = {
  ...adminSessionListTableContainerSx,
  width: "100%",
  maxWidth: "100%",
  minWidth: "100%",
  overflowX: "auto",
};

const adminReportCardTableWrapSx = {
  width: "100%",
  minWidth: "100%",
  alignSelf: "stretch",
};

const reportCardTruncateCellSx = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
};

const ReportCardTruncatedCell = ({ value }) => {
  const text = value ?? "";
  return (
    <Tooltip title={text} disableHoverListener={!text}>
      <Box component="span" sx={reportCardTruncateCellSx}>
        {text}
      </Box>
    </Tooltip>
  );
};

const reportCardLayoutSx = {
  width: "100%",
  maxWidth: "100%",
  minWidth: "100%",
};

const reportCardInlineToolbarSx = {
  mb: 1,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 1,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
};

const reportCardInlineFilterSx = {
  flex: "1 1 0",
  minWidth: 120,
  maxWidth: "none",
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
    width: "100%",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.75rem",
  },
  "& .MuiSelect-select": {
    py: 0,
    minHeight: "unset !important",
    display: "flex",
    alignItems: "center",
  },
};

const reportCardInlineCheckboxSx = {
  flex: "0 0 auto",
  m: 0,
  height: ADMIN_SESSION_LIST_BAR_CONTROL_HEIGHT,
  alignItems: "center",
  px: 0.5,
  "& .MuiFormControlLabel-label": {
    fontSize: "0.75rem",
    lineHeight: 1,
    whiteSpace: "nowrap",
  },
};

/** null = auto-size to fit cell content */
const reportCardColumnWidths = {
  edit: 64,
  delete: 72,
  studentId: 72,
  studentName: 168,
  class: 140,
  grade: 56,
  session: 80,
  examType: 72,
  examDate: 88,
  total: 72,
  topScore: 72,
  avg: 72,
  yourScore: 72,
  comments: 100,
};

const summaryColumnWidths = {
  studentId: 72,
  studentName: 168,
  class: 120,
  examDate: 88,
  quiz: 64,
  classWork: 80,
  homeWork: 80,
  finalExam: 80,
  placementTest: 96,
  totalScore: 80,
  rank: 56,
};

const reportCardColWidthsPx = [
  reportCardColumnWidths.edit,
  reportCardColumnWidths.delete,
  reportCardColumnWidths.studentId,
  reportCardColumnWidths.studentName,
  reportCardColumnWidths.class,
  reportCardColumnWidths.grade,
  reportCardColumnWidths.session,
  reportCardColumnWidths.examType,
  reportCardColumnWidths.examDate,
  reportCardColumnWidths.total,
  reportCardColumnWidths.topScore,
  reportCardColumnWidths.avg,
  reportCardColumnWidths.yourScore,
  reportCardColumnWidths.comments,
];

const summaryColWidthsPx = [
  summaryColumnWidths.studentId,
  summaryColumnWidths.studentName,
  summaryColumnWidths.class,
  summaryColumnWidths.examDate,
  summaryColumnWidths.quiz,
  summaryColumnWidths.classWork,
  summaryColumnWidths.homeWork,
  summaryColumnWidths.finalExam,
  summaryColumnWidths.placementTest,
  summaryColumnWidths.totalScore,
  summaryColumnWidths.rank,
];

const ReportCardColGroup = ({ widths }) => (
  <colgroup>
    {widths.map((w, i) => (
      <col key={i} style={w == null ? undefined : { width: w }} />
    ))}
  </colgroup>
);

const reportCardDeleteLinkSx = adminSessionListTableDeleteLinkSx;

const AdminReportCard = () => {
  const location = useLocation();
  const hideRoleHeader = location.pathname.includes("/pstudyware/instructor/");
  const isAdminView = !hideRoleHeader;
  const isInstructorPortalView = hideRoleHeader;
  const { user } = useAuth();
  const username = user?.username || user?.email || "";
  const pageSize = LEGACY_REPORT_CARD_PAGE_SIZE;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportDates, setReportDates] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [examDateList, setExamDateList] = useState([]);
  const [selectedReportDate, setSelectedReportDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [semesterReport, setSemesterReport] = useState(false);
  const [showSummaryMode, setShowSummaryMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState(DEFAULT_ADD_SCORE_FORM);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState(DEFAULT_UPLOAD_SCORE_FORM);
  const uploadFileInputRef = useRef(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [emailConfirmOpen, setEmailConfirmOpen] = useState(false);
  const [selectedScoreId, setSelectedScoreId] = useState(null);
  const [editForm, setEditForm] = useState({
    reportID: "",
    studentId: "",
    studentName: "",
    group: "",
    examDate: "",
    examType: "Quiz",
    totalScore: "",
    receivedScore: "",
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [canEdit, setCanEdit] = useState(true);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [sortField, setSortField] = useState(LEGACY_REPORT_CARD_DEFAULT_SORT_FIELD);
  const [sortOrder, setSortOrder] = useState(LEGACY_REPORT_CARD_DEFAULT_SORT_ORDER);

  const handleSort = (field) => {
    const isSameField = sortField === field;
    if (!isSameField) {
      setSortField(field);
      setSortOrder("desc");
    } else {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortHeadSx = (width, isLast = false) => {
    const sx = adminSessionListTableHeadCellSx(undefined, isLast);
    if (width == null) {
      return {
        ...sx,
        width: "auto",
        minWidth: "max-content",
        whiteSpace: "nowrap",
      };
    }
    if (typeof width === "number") {
      return { ...sx, width: "auto", minWidth: width, whiteSpace: "nowrap" };
    }
    return adminSessionListTableHeadCellSx(width, isLast);
  };

  const reportCardBodyCellSx = (options = {}) => {
    const truncateWidth =
      options.truncateWidth ??
      (options.truncate ? reportCardColumnWidths.comments : undefined);
    const base = {
      ...adminSessionListTableBodyCellSx(options),
      whiteSpace: "nowrap",
      width: options.truncate ? truncateWidth : "auto",
      maxWidth: options.truncate ? truncateWidth : undefined,
      minWidth: options.autoFit
        ? "max-content"
        : options.truncate
          ? 0
          : options.action
            ? (options.actionWidth ?? 64)
            : undefined,
      overflow: options.truncate ? "hidden" : options.action ? "visible" : undefined,
      textOverflow: options.truncate ? "ellipsis" : undefined,
      ...(options.align ? { textAlign: options.align } : {}),
    };
    return base;
  };

  const handleDeleteClick = (reportCardId) => {
    const id = resolveReportCardId(reportCardId);
    if (!id) {
      setSnackbar({
        open: true,
        message: "Invalid report card id.",
        severity: "error",
      });
      return;
    }
    setSelectedScoreId(id);
    setDeleteConfirmOpen(true);
  };

  const renderEditAction = (reportCardId) => {
    if (!canEdit) return "—";
    const id = resolveReportCardId(reportCardId);
    if (!id) return "—";
    return (
      <Box
        component="span"
        onClick={() => openEdit(id)}
        sx={adminSessionListTableActionLinkSx}
      >
        Edit
      </Box>
    );
  };

  const renderDeleteAction = (reportCardId) => {
    if (!canEdit) return "—";
    const id = resolveReportCardId(reportCardId);
    if (!id) return "—";
    return (
      <Box
        component="span"
        onClick={() => handleDeleteClick(id)}
        sx={reportCardDeleteLinkSx}
      >
        Delete
      </Box>
    );
  };

  const loadList = async ({ showLoading = true } = {}) => {
    if (!username) {
      setLoading(false);
      return;
    }
    if (showLoading) {
      setLoading(true);
    }
    try {
      const res = await reportCardService.getReportCardList({
        Username: "",
      });
      const raw = res?.reportCardList ?? res?.ReportCardList;
      const data = Array.isArray(raw) ? raw : (raw?.Table ?? raw?.Rows ?? []);
      setList(Array.isArray(data) ? data : []);
      if (res?.isSuccess === false && res?.errorMessage) {
        setSnackbar({
          open: true,
          message: res.errorMessage,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error loading report card list:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading report cards.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      if (showLoading) {
        setList([]);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const refreshReportCardList = async () => {
    setCurrentPage(1);
    setGoToPageInput("1");
    await loadList({ showLoading: false });
  };

  const loadDashboardData = async () => {
    if (!username) return;
    try {
      const res = await reportCardService.getDashboardData();
      const r = res?.reportDateList ?? res?.ReportDateList;
      const c = res?.classList ?? res?.ClassList;
      const s = res?.studentList ?? res?.StudentList;
      const e = res?.examDateList ?? res?.ExamDateList;
      setReportDates(Array.isArray(r) ? r : []);
      setClassList(dedupeClassList(Array.isArray(c) ? c : []));
      setStudentList(Array.isArray(s) ? s : []);
      setExamDateList(Array.isArray(e) ? e : []);
      const priv = await reportCardService.checkReportCardPrivileges();
      setCanEdit(priv?.canUpdateScores ?? priv?.CanUpdateScores ?? true);
    } catch (e) {
      console.error("Dashboard data:", e);
    }
  };

  const openAddDialog = () => {
    setAddForm({ ...DEFAULT_ADD_SCORE_FORM });
    setAddDialogOpen(true);
  };

  const openUploadDialog = () => {
    setUploadForm({ ...DEFAULT_UPLOAD_SCORE_FORM });
    setUploadDialogOpen(true);
  };

  const handleUploadScore = async () => {
    if (!uploadForm.className || !uploadForm.examDate || !uploadForm.file) {
      setSnackbar({
        open: true,
        message: "Class, Exam Date, and file are required.",
        severity: "warning",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await reportCardService.uploadScoresFromFile({
        file: uploadForm.file,
        examDate: uploadForm.examDate,
        group: uploadForm.className,
        totalQuizScore: uploadForm.quizTotal,
        totalClassTestScore: uploadForm.classWorkTotal,
        totalHomeWorkScore: uploadForm.homeWorkTotal,
      });
      if (res?.isSuccess !== false) {
        setSnackbar({
          open: true,
          message: res?.message ?? "Scores have been uploaded successfully.",
          severity: "success",
        });
        setUploadDialogOpen(false);
        setUploadForm({ ...DEFAULT_UPLOAD_SCORE_FORM });
        setShowSummaryMode(false);
        await refreshReportCardList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Upload failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error ??
          err?.response?.data?.message ??
          err?.message ??
          "Upload failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddScore = async () => {
    if (!addForm.studentId || !addForm.className || !addForm.examDate) {
      setSnackbar({
        open: true,
        message: "Student, Class, and Exam Date are required.",
        severity: "warning",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await reportCardService.addStudentScore({
        studentId: addForm.studentId,
        className: addForm.className,
        examDate: addForm.examDate,
        quizTotal: addForm.quizTotal,
        quizReceived: addForm.quizReceived,
        quizComments: addForm.quizComments,
        classTestTotal: addForm.classTestTotal,
        classTestReceived: addForm.classTestReceived,
        classTestComments: addForm.classTestComments,
        homeWorkTotal: addForm.homeWorkTotal,
        homeWorkReceived: addForm.homeWorkReceived,
        homeWorkComments: addForm.homeWorkComments,
        finalExamTotal: addForm.finalExamTotal,
        finalExamReceived: addForm.finalExamReceived,
        finalExamComments: addForm.finalExamComments,
        placementTestTotal: addForm.placementTestTotal,
        placementTestReceived: addForm.placementTestReceived,
        placementTestComments: addForm.placementTestComments,
      });
      if (res?.isSuccess !== false) {
        setSnackbar({
          open: true,
          message: res?.message ?? "Scores have been updated successfully.",
          severity: "success",
        });
        setAddDialogOpen(false);
        setAddForm({ ...DEFAULT_ADD_SCORE_FORM });
        setShowSummaryMode(false);
        await refreshReportCardList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Add score failed.",
          severity: "error",
        });
      }
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.response?.data?.errorMessage;
      setSnackbar({
        open: true,
        message:
          status === 403
            ? (serverMessage ?? "You do not have permission to add scores.")
            : (serverMessage ?? err?.message ?? "Add score failed."),
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadList();
      loadDashboardData();
    } else setLoading(false);
  }, [username]);

  useEffect(() => {
    if (reportDates.length === 0) return;
    const first = getReportDateOptionValue(reportDates[0]);
    setSelectedReportDate((current) => {
      const valid = reportDates.some(
        (d) => getReportDateOptionValue(d) === current,
      );
      return valid && current ? current : first;
    });
  }, [reportDates]);

  useEffect(() => {
    if (classList.length === 0) return;
    const first = getClassOptionValue(classList[0]);
    setSelectedClass((current) => {
      const valid = classList.some(
        (c) => getClassOptionValue(c) === current,
      );
      return valid && current ? current : first;
    });
  }, [classList]);

  const renderReportDateSelectValue = (selected) => {
    if (!selected) return "";
    const match = reportDates.find(
      (d) => getReportDateOptionValue(d) === selected,
    );
    return match
      ? getReportDateOptionLabel(match)
      : formatReportCardDate(selected);
  };

  const handleViewReport = async () => {
    setSubmitting(true);
    try {
      const res = await reportCardService.viewReport({
        Username: "",
        Class: selectedClass || "",
        ReportDate: selectedReportDate || "",
        IsSemesterReport: semesterReport,
      });
      const raw = res?.reportData ?? res?.ReportData;
      const data = Array.isArray(raw) ? raw : (raw?.Table ?? raw?.Rows ?? []);
      setList(Array.isArray(data) ? data : []);
      setShowSummaryMode(true);
      setSortField("studentId");
      setSortOrder("asc");
      setCurrentPage(1);
      setGoToPageInput("1");
      setSnackbar({
        open: true,
        message: `Summary report loaded (${Array.isArray(data) ? data.length : 0} records).`,
        severity: "success",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Failed to load report.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToScoreCardList = async () => {
    setShowSummaryMode(false);
    setSortField(LEGACY_REPORT_CARD_DEFAULT_SORT_FIELD);
    setSortOrder(LEGACY_REPORT_CARD_DEFAULT_SORT_ORDER);
    await refreshReportCardList();
  };

  const handleExportExcel = async () => {
    try {
      await reportCardService.exportToExcel({
        Username: username,
        IsSummaryReport: false,
      });
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.message ?? "Export failed.",
        severity: "error",
      });
    }
  };

  const handleSendEmail = async () => {
    setSubmitting(true);
    try {
      const res = await reportCardService.sendEmail({ Username: username });
      if (res?.isSuccess !== false) {
        setSnackbar({
          open: true,
          message: res?.message ?? "Email has been sent successfully.",
          severity: "success",
        });
        setEmailConfirmOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Send failed.",
          severity: "error",
        });
      }
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.message ?? "Send failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = async (scoreId) => {
    const id = resolveReportCardId(scoreId);
    if (!id) {
      setSnackbar({
        open: true,
        message: "Invalid report card id.",
        severity: "error",
      });
      return;
    }

    if (!canEdit) {
      setSnackbar({
        open: true,
        message:
          "You cannot edit this report card. Report card has been published already.",
        severity: "warning",
      });
      return;
    }

    setSelectedScoreId(id);
    setSubmitting(true);
    try {
      let res = await reportCardService.getScoreDetails(id);
      if (
        res?.isSuccess === false ||
        !(res?.scoreDetails ?? res?.ScoreDetails)
      ) {
        res = await reportCardService.getScoreDetailsById(id);
      }

      const sd = res?.scoreDetails ?? res?.ScoreDetails;
      if (res?.isSuccess === false || !sd) {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Score not found.",
          severity: "error",
        });
        return;
      }

      const groupRaw = sd.group ?? sd.Group ?? "";
      const examDateRaw = sd.examDate ?? sd.ExamDate ?? "";
      setEditForm({
        reportID: sd.reportCardId ?? sd.ReportCardId ?? id,
        studentId: sd.studentId ?? sd.StudentId ?? "",
        studentName: sd.studentName ?? sd.StudentName ?? "",
        group: resolveClassSelectValue(groupRaw, classList),
        examDate: resolveExamScheduleValue(examDateRaw, examDateList),
        examType: sd.examType ?? sd.ExamType ?? "Quiz",
        totalScore: String(sd.totalCredit ?? sd.TotalCredit ?? ""),
        receivedScore: String(sd.receivedCredit ?? sd.ReceivedCredit ?? ""),
        comments: sd.comments ?? sd.Comments ?? "",
      });
      setEditDialogOpen(true);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error ??
          err?.response?.data?.message ??
          err?.message ??
          "Failed to load score.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateScore = async () => {
    if (
      !editForm.reportID ||
      !editForm.group ||
      !editForm.examDate ||
      !editForm.examType ||
      editForm.totalScore === "" ||
      editForm.receivedScore === ""
    ) {
      setSnackbar({
        open: true,
        message: "Class, exam date, exam type, and scores are required.",
        severity: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await reportCardService.updateStudentScore({
        reportID: editForm.reportID,
        group: editForm.group,
        examDate: editForm.examDate,
        type: editForm.examType,
        totalScore: editForm.totalScore,
        receivedScore: editForm.receivedScore,
        comments: editForm.comments,
      });
      if (res?.isSuccess !== false) {
        setSnackbar({
          open: true,
          message: res?.message ?? "Scores have been updated successfully.",
          severity: "success",
        });
        setEditDialogOpen(false);
        setShowSummaryMode(false);
        await refreshReportCardList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Update failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error ??
          err?.response?.data?.message ??
          err?.message ??
          "Update failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScore = async () => {
    const id = resolveReportCardId(selectedScoreId);
    if (!id) return;

    if (!canEdit) {
      setSnackbar({
        open: true,
        message:
          "You cannot delete this report card. Report card has been published already.",
        severity: "warning",
      });
      setDeleteConfirmOpen(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await reportCardService.deleteStudentScore(id);
      if (res?.isSuccess !== false) {
        setSnackbar({
          open: true,
          message: res?.message ?? "Score has been deleted successfully.",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setSelectedScoreId(null);
        setShowSummaryMode(false);
        await refreshReportCardList();
      } else {
        setSnackbar({
          open: true,
          message: res?.errorMessage ?? "Delete failed.",
          severity: "error",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.error ??
          err?.response?.data?.message ??
          err?.message ??
          "Delete failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const row = (r) => ({
    reportCardID: resolveReportCardId(
      pickField(
        r,
        "ReportCardID",
        "reportCardID",
        "reportCardId",
        "ReportCardId",
        "ReportID",
        "reportID",
        "ID",
        "id",
      ),
    ),
    studentID: formatFieldValue(
      pickField(r, "StudentID", "studentID", "studentId", "StudentId"),
    ),
    studentName: formatFieldValue(pickField(r, "StudentName", "studentName")),
    group: formatFieldValue(pickField(r, "Group", "group", "Class", "class")),
    grade: formatFieldValue(pickField(r, "Grade", "grade")),
    semester: formatFieldValue(
      pickField(r, "Semester", "semester", "Session", "session"),
    ),
    examType: formatFieldValue(pickField(r, "ExamType", "examType")),
    examDate: formatFieldValue(pickField(r, "ExamDate", "examDate")),
    totalCredit: formatFieldValue(
      pickField(
        r,
        "TotalCredit",
        "totalCredit",
        "TotalScore",
        "totalScore",
      ),
    ),
    highestScore: formatFieldValue(
      pickField(
        r,
        "HighestScore",
        "highestScore",
        "TopScore",
        "topScore",
      ),
    ),
    classAverage: formatFieldValue(
      pickField(
        r,
        "ClassAverage",
        "classAverage",
        "AvgScore",
        "avgScore",
        "AVGScore",
      ),
    ),
    receivedCredit: formatFieldValue(
      pickField(
        r,
        "ReceivedCredit",
        "receivedCredit",
        "YourScore",
        "yourScore",
      ),
    ),
    comments: formatFieldValue(pickField(r, "Comments", "comments")),
  });

  const summaryRow = (r) => ({
    studentID: formatFieldValue(
      pickField(r, "StudentID", "studentID", "studentId", "StudentId"),
    ),
    studentName: formatFieldValue(pickField(r, "StudentName", "studentName")),
    group: formatFieldValue(pickField(r, "Group", "group", "Class", "class")),
    examDate: formatFieldValue(pickField(r, "ExamDate", "examDate")),
    quizReceived: formatFieldValue(
      pickField(
        r,
        "QuizReceived",
        "quizReceived",
        "Quiz",
        "quiz",
      ),
    ),
    classReceived: formatFieldValue(
      pickField(
        r,
        "ClassReceived",
        "classReceived",
        "ClassWork",
        "classWork",
        "ClassTestReceived",
        "classTestReceived",
      ),
    ),
    homeWorkReceived: formatFieldValue(
      pickField(
        r,
        "HomeWorkReceived",
        "homeWorkReceived",
        "HomeWork",
        "homeWork",
      ),
    ),
    finalExamReceived: formatFieldValue(
      pickField(
        r,
        "FinalExamReceived",
        "finalExamReceived",
        "FinalExam",
        "finalExam",
      ),
    ),
    placementTestReceived: formatFieldValue(
      pickField(
        r,
        "PlacementTestReceived",
        "placementTestReceived",
        "PlacementTest",
        "placementTest",
      ),
    ),
    totalScore: formatFieldValue(
      pickField(
        r,
        "TotalScore",
        "totalScore",
        "TotalCredit",
        "totalCredit",
      ),
    ),
    classRank: formatFieldValue(
      pickField(r, "ClassRank", "classRank", "Rank", "rank"),
    ),
  });

  const getReportCardListFieldValue = (rawRow, field) => {
    if (showSummaryMode) {
      const s = summaryRow(rawRow);
      switch (field) {
        case "studentId":
          return toSortableNumber(s.studentID);
        case "studentName":
          return s.studentName ?? "";
        case "class":
          return s.group ?? "";
        case "examDate":
          return toSortableDate(s.examDate);
        case "quiz":
          return toSortableNumber(s.quizReceived);
        case "classWork":
          return toSortableNumber(s.classReceived);
        case "homeWork":
          return toSortableNumber(s.homeWorkReceived);
        case "finalExam":
          return toSortableNumber(s.finalExamReceived);
        case "placementTest":
          return toSortableNumber(s.placementTestReceived);
        case "totalScore":
          return toSortableNumber(s.totalScore);
        case "rank":
          return toSortableNumber(s.classRank);
        default:
          return "";
      }
    }

    const r = row(rawRow);
    switch (field) {
      case "reportCardId":
        return toSortableNumber(r.reportCardID);
      case "studentId":
        return toSortableNumber(r.studentID);
      case "studentName":
        return r.studentName ?? "";
      case "class":
        return r.group ?? "";
      case "grade":
        return r.grade ?? "";
      case "session":
        return r.semester ?? "";
      case "examType":
        return r.examType ?? "";
      case "examDate":
        return toSortableDate(r.examDate);
      case "total":
        return toSortableNumber(r.totalCredit);
      case "topScore":
        return toSortableNumber(r.highestScore);
      case "avg":
        return toSortableNumber(r.classAverage);
      case "yourScore":
        return toSortableNumber(r.receivedCredit);
      case "comments":
        return r.comments ?? "";
      default:
        return "";
    }
  };

  const matchField = (fieldValue, search, criteria) => {
    const fv = String(fieldValue ?? "").toLowerCase();
    const s = search.trim().toLowerCase();
    if (criteria === "equals") return fv === s;
    if (criteria === "starts_with") return fv.startsWith(s);
    return fv.includes(s);
  };

  const filteredList = useMemo(() => {
    if (!searchText.trim()) return list;
    const search = searchText.trim();
    if (searchBy === "ALL") {
      return list.filter((r) => {
        if (showSummaryMode) {
          const s = summaryRow(r);
          return (
            matchField(s.studentName, search, searchCriteria) ||
            matchField(s.studentID, search, searchCriteria) ||
            matchField(s.group, search, searchCriteria) ||
            matchField(s.examDate, search, searchCriteria) ||
            matchField(s.classRank, search, searchCriteria)
          );
        }
        const o = row(r);
        return (
          matchField(o.studentName, search, searchCriteria) ||
          matchField(o.studentID, search, searchCriteria) ||
          matchField(o.group, search, searchCriteria) ||
          matchField(o.examType, search, searchCriteria) ||
          matchField(o.comments, search, searchCriteria) ||
          matchField(o.grade, search, searchCriteria) ||
          matchField(o.semester, search, searchCriteria)
        );
      });
    }
    return list.filter((r) => {
      if (showSummaryMode) {
        const s = summaryRow(r);
        let fieldValue = "";
        switch (searchBy) {
          case "STUDENT_ID":
            fieldValue = s.studentID ?? "";
            break;
          case "STUDENT_NAME":
            fieldValue = s.studentName ?? "";
            break;
          case "CLASS":
            fieldValue = s.group ?? "";
            break;
          default:
            return true;
        }
        return matchField(fieldValue, search, searchCriteria);
      }
      const o = row(r);
      let fieldValue = "";
      switch (searchBy) {
        case "STUDENT_ID":
          fieldValue = o.studentID ?? "";
          break;
        case "STUDENT_NAME":
          fieldValue = o.studentName ?? "";
          break;
        case "CLASS":
          fieldValue = o.group ?? "";
          break;
        case "GRADE":
          fieldValue = o.grade ?? "";
          break;
        case "SESSION":
          fieldValue = o.semester ?? "";
          break;
        case "EXAM_TYPE":
          fieldValue = o.examType ?? "";
          break;
        case "COMMENTS":
          fieldValue = o.comments ?? "";
          break;
        default:
          return true;
      }
      return matchField(fieldValue, search, searchCriteria);
    });
  }, [list, searchText, searchBy, searchCriteria, showSummaryMode]);

  const sortedList = useMemo(
    () =>
      sortRows(filteredList, sortField, sortOrder, getReportCardListFieldValue),
    [filteredList, sortField, sortOrder, showSummaryMode],
  );

  const activeTableMinWidth = showSummaryMode
    ? summaryColWidthsPx.reduce((sum, width) => sum + width, 0)
    : reportCardColWidthsPx.reduce((sum, width) => sum + width, 0);
  const activeColumnCount = showSummaryMode ? 11 : 14;

  const totalRecords = sortedList.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedList.slice(start, start + pageSize);
  }, [sortedList, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    const total = Math.ceil(totalRecords / pageSize);
    if (total === 0) return;
    if (page >= 1 && page <= total) {
      setCurrentPage(page);
      setGoToPageInput(String(page));
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    const total = Math.ceil(totalRecords / pageSize);
    if (total === 0) return;
    if (!Number.isNaN(page) && page >= 1 && page <= total) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(String(currentPage));
    }
  };

  const toolbarButtonSx = {
    ...portalHeaderActionButtonSx,
    flex: "0 0 auto",
  };

  return (
    <Box
      className={isInstructorPortalView ? "instructor-report-card" : undefined}
      sx={isAdminView ? { minHeight: "100vh" } : undefined}
    >
      {!hideRoleHeader && <AdminHeader user={user} />}
      {!hideRoleHeader && <AdminRoleHeaderSpacer />}
      <Container
        {...(isInstructorPortalView
          ? instructorPortalContentContainerProps
          : { maxWidth: "xl" })}
        sx={{ mb: 4 }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent
                sx={{
                  ...adminSessionListPanelContentSx,
                  pt: 1,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <Box sx={reportCardLayoutSx}>
                  <Box sx={adminSessionListHeaderBarSx}>
                    <Typography variant="subtitle1" sx={adminSessionListTitleSx}>
                      Report Card
                    </Typography>
                  </Box>

                  <Box sx={reportCardInlineToolbarSx}>
                    <FormControl size="small" sx={reportCardInlineFilterSx}>
                      <InputLabel>Report Date</InputLabel>
                      <Select
                        value={selectedReportDate}
                        label="Report Date"
                        disabled={reportDates.length === 0}
                        renderValue={renderReportDateSelectValue}
                        onChange={(e) => setSelectedReportDate(e.target.value)}
                      >
                        {reportDates.map((d, i) => {
                          const value = getReportDateOptionValue(d);
                          const label = getReportDateOptionLabel(d) || value;
                          return (
                            <MenuItem key={i} value={value}>
                              {label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <FormControl size="small" sx={reportCardInlineFilterSx}>
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={selectedClass}
                        label="Class"
                        disabled={classList.length === 0}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        {mapClassMenuOptions(classList).map((c) => (
                          <MenuItem key={c.key} value={c.value}>
                            {c.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      sx={reportCardInlineCheckboxSx}
                      control={
                        <Checkbox
                          size="small"
                          checked={semesterReport}
                          onChange={(e) => setSemesterReport(e.target.checked)}
                        />
                      }
                      label="Semester"
                    />
                    {!showSummaryMode ? (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<ViewReportIcon />}
                        onClick={handleViewReport}
                        disabled={submitting}
                        sx={toolbarButtonSx}
                      >
                        View Score Card Summary Report
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleBackToScoreCardList}
                        disabled={submitting}
                        sx={toolbarButtonSx}
                      >
                        Back to Score Card List
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => setEmailConfirmOpen(true)}
                      disabled={submitting}
                      sx={toolbarButtonSx}
                    >
                      Send Email
                    </Button>
                    {canEdit && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={openAddDialog}
                          sx={toolbarButtonSx}
                        >
                          Add Score
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<UploadFileIcon />}
                          onClick={openUploadDialog}
                          sx={toolbarButtonSx}
                        >
                          Upload Score
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={handleExportExcel}
                      sx={toolbarButtonSx}
                    >
                      Export to Excel
                    </Button>
                  </Box>

                  {loading && list.length === 0 ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box
                        className="admin-session-list-search"
                        sx={{
                          ...adminSessionListSearchBarSx,
                          width: "100%",
                          maxWidth: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography sx={adminSessionListSearchLabelSx}>
                            Search By:
                          </Typography>
                          <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            size="small"
                            sx={{ ...adminSessionListSearchSelectSx, minWidth: 120 }}
                          >
                            <MenuItem value="ALL" sx={adminSessionListMenuItemSx}>
                              -ALL-
                            </MenuItem>
                            <MenuItem value="STUDENT_ID" sx={adminSessionListMenuItemSx}>
                              Student #
                            </MenuItem>
                            <MenuItem value="STUDENT_NAME" sx={adminSessionListMenuItemSx}>
                              Student Name
                            </MenuItem>
                            <MenuItem value="CLASS" sx={adminSessionListMenuItemSx}>
                              Class
                            </MenuItem>
                            <MenuItem value="GRADE" sx={adminSessionListMenuItemSx}>
                              Grade
                            </MenuItem>
                            <MenuItem value="SESSION" sx={adminSessionListMenuItemSx}>
                              Session
                            </MenuItem>
                            <MenuItem value="EXAM_TYPE" sx={adminSessionListMenuItemSx}>
                              Exam Type
                            </MenuItem>
                            <MenuItem value="COMMENTS" sx={adminSessionListMenuItemSx}>
                              Comments
                            </MenuItem>
                          </Select>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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

                      <Box sx={adminReportCardTableWrapSx}>
                        <TableContainer
                          component={Paper}
                          sx={adminReportCardTableContainerSx}
                        >
                          <Table
                            sx={{
                              ...adminReportCardTableSx,
                              minWidth: activeTableMinWidth,
                            }}
                            size="small"
                          >
                            <ReportCardColGroup
                              widths={
                                showSummaryMode
                                  ? summaryColWidthsPx
                                  : reportCardColWidthsPx
                              }
                            />
                            <TableHead>
                              <TableRow sx={adminSessionListTableHeadRowSx}>
                                {showSummaryMode ? (
                                  <>
                                    <SortableHeader
                                      label="Student #"
                                      field="studentId"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.studentId,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Student Name"
                                      field="studentName"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.studentName,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Class"
                                      field="class"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.class,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Exam Date"
                                      field="examDate"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.examDate,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Quiz"
                                      field="quiz"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.quiz,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Class Work"
                                      field="classWork"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.classWork,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Home Work"
                                      field="homeWork"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.homeWork,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Final Exam"
                                      field="finalExam"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.finalExam,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Placement Test"
                                      field="placementTest"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.placementTest,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Total Score"
                                      field="totalScore"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.totalScore,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Rank"
                                      field="rank"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        summaryColumnWidths.rank,
                                        true,
                                      )}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <TableCell
                                      sx={sortHeadSx(reportCardColumnWidths.edit)}
                                    >
                                      Edit
                                    </TableCell>
                                    <TableCell
                                      sx={sortHeadSx(reportCardColumnWidths.delete)}
                                    >
                                      Delete
                                    </TableCell>
                                    <SortableHeader
                                      label="Student #"
                                      field="studentId"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.studentId,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Student Name"
                                      field="studentName"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.studentName,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Class"
                                      field="class"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.class,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Grade"
                                      field="grade"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.grade,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Session"
                                      field="session"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.session,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Exam Type"
                                      field="examType"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.examType,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Exam Date"
                                      field="examDate"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.examDate,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Total Score"
                                      field="total"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.total,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Top Score"
                                      field="topScore"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.topScore,
                                      )}
                                    />
                                    <SortableHeader
                                      label="AVG Score"
                                      field="avg"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.avg,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Your Score"
                                      field="yourScore"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.yourScore,
                                      )}
                                    />
                                    <SortableHeader
                                      label="Comments"
                                      field="comments"
                                      sortField={sortField}
                                      sortOrder={sortOrder}
                                      onSort={handleSort}
                                      headCellSx={sortHeadSx(
                                        reportCardColumnWidths.comments,
                                        true,
                                      )}
                                    />
                                  </>
                                )}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedList.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={activeColumnCount}
                                    align="center"
                                    sx={adminSessionListEmptyCellSx}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={adminSessionListEmptyTextSx}
                                    >
                                      {searchText
                                        ? "No report cards matching your search."
                                        : showSummaryMode
                                          ? "No summary report records found."
                                          : "No report cards found."}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : showSummaryMode ? (
                                paginatedList.map((r, idx) => {
                                  const s = summaryRow(r);
                                  return (
                                    <TableRow
                                      key={`${s.studentID}-${s.examDate}-${idx}`}
                                      sx={adminSessionListTableBodyRowSx}
                                    >
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {s.studentID}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          truncate: true,
                                          truncateWidth:
                                            summaryColumnWidths.studentName,
                                        })}
                                      >
                                        <ReportCardTruncatedCell
                                          value={s.studentName}
                                        />
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {s.group}
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {formatReportCardDate(s.examDate)}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.quizReceived}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.classReceived}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.homeWorkReceived}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.finalExamReceived}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.placementTestReceived}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {s.totalScore}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                          isLast: true,
                                        })}
                                      >
                                        {s.classRank}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              ) : (
                                paginatedList.map((r, idx) => {
                                  const o = row(r);
                                  return (
                                    <TableRow
                                      key={o.reportCardID || idx}
                                      sx={adminSessionListTableBodyRowSx}
                                    >
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          action: true,
                                          actionWidth:
                                            reportCardColumnWidths.edit,
                                        })}
                                      >
                                        {renderEditAction(o.reportCardID)}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          action: true,
                                          actionWidth:
                                            reportCardColumnWidths.delete,
                                        })}
                                      >
                                        {renderDeleteAction(o.reportCardID)}
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {o.studentID}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          truncate: true,
                                          truncateWidth:
                                            reportCardColumnWidths.studentName,
                                        })}
                                      >
                                        <ReportCardTruncatedCell
                                          value={o.studentName}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          autoFit: true,
                                        })}
                                      >
                                        {o.group}
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {o.grade}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          truncate: true,
                                          truncateWidth:
                                            reportCardColumnWidths.session,
                                        })}
                                      >
                                        <ReportCardTruncatedCell
                                          value={o.semester}
                                        />
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          truncate: true,
                                          truncateWidth:
                                            reportCardColumnWidths.examType,
                                        })}
                                      >
                                        <ReportCardTruncatedCell
                                          value={o.examType}
                                        />
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {formatReportCardDate(o.examDate)}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {o.totalCredit}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {o.highestScore}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {o.classAverage}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          align: "right",
                                        })}
                                      >
                                        {o.receivedCredit}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          isLast: true,
                                          truncate: true,
                                          truncateWidth:
                                            reportCardColumnWidths.comments,
                                        })}
                                      >
                                        <ReportCardTruncatedCell
                                          value={o.comments}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

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
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Update score dialog — legacy divEdit */}
      <PortalDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        title="Update Student Score"
        icon={<EditIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            onClick={handleUpdateScore}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Student Name"
            value={editForm.studentName}
            disabled
            size="small"
            fullWidth
            sx={portalModalFieldSx}
          />
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <PortalModalSelect
              value={editForm.group}
              label="Class"
              onChange={(e) =>
                setEditForm((f) => ({ ...f, group: e.target.value }))
              }
            >
              {editForm.group &&
                !classListIncludesValue(classList, editForm.group) && (
                  <MenuItem value={editForm.group}>{editForm.group}</MenuItem>
                )}
              {mapClassMenuOptions(classList).map((c) => (
                <MenuItem key={c.key} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam/Session Date</InputLabel>
            <PortalModalSelect
              value={editForm.examDate}
              label="Exam/Session Date"
              onChange={(e) =>
                setEditForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {editForm.examDate &&
                !examDateListIncludesValue(examDateList, editForm.examDate) && (
                  <MenuItem value={editForm.examDate}>
                    {editForm.examDate}
                  </MenuItem>
                )}
              {mapExamScheduleMenuOptions(examDateList).map((d) => (
                <MenuItem key={d.key} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam Type</InputLabel>
            <PortalModalSelect
              value={editForm.examType}
              label="Exam Type"
              onChange={(e) =>
                setEditForm((f) => ({ ...f, examType: e.target.value }))
              }
            >
              {EXAM_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <TextField
            label="Total Score"
            type="number"
            value={editForm.totalScore}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, totalScore: e.target.value }))
            }
            size="small"
            fullWidth
            sx={portalModalFieldSx}
          />
          <TextField
            label="Received Score"
            type="number"
            value={editForm.receivedScore}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, receivedScore: e.target.value }))
            }
            size="small"
            fullWidth
            sx={portalModalFieldSx}
          />
          <TextField
            label="Comments"
            multiline
            rows={3}
            value={editForm.comments}
            onChange={(e) =>
              setEditForm((f) => ({ ...f, comments: e.target.value }))
            }
            size="small"
            fullWidth
            sx={portalModalFieldSx}
          />
        </Box>
      </PortalDialog>

      {/* Delete confirm */}
      <AppConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteScore}
        title="Delete Score"
        message="Do you want to delete this score?"
        confirmLabel="Delete"
        confirmColor="error"
        icon={<DeleteIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
      />

      {/* Add score dialog — legacy divAdd */}
      <PortalDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="md"
        title="Add Score"
        icon={<AddIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            onClick={handleAddScore}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Student Name</InputLabel>
            <PortalModalSelect
              value={addForm.studentId}
              label="Student Name"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, studentId: e.target.value }))
              }
            >
              {mapStudentMenuOptions(studentList).map((s) => (
                <MenuItem key={s.key} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <PortalModalSelect
              value={addForm.className}
              label="Class"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, className: e.target.value }))
              }
            >
              {mapClassMenuOptions(classList).map((c) => (
                <MenuItem key={c.key} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam/Session Date</InputLabel>
            <PortalModalSelect
              value={addForm.examDate}
              label="Exam/Session Date"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {mapExamScheduleMenuOptions(examDateList).map((d) => (
                <MenuItem key={d.key} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>

          <Table size="small" sx={{ border: "1px solid #ccc", mt: 1 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                <TableCell sx={{ fontSize: "0.75rem" }}>Type</TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>Total Score</TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>
                  Received Score
                </TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ADD_SCORE_ROWS.map((row) => (
                <TableRow key={row.label}>
                  <TableCell sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                    {row.label}
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={addForm[row.totalKey]}
                      onChange={(e) =>
                        setAddForm((f) => ({
                          ...f,
                          [row.totalKey]: e.target.value,
                        }))
                      }
                      sx={{ width: 72, ...portalModalFieldSx }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={addForm[row.receivedKey]}
                      onChange={(e) =>
                        setAddForm((f) => ({
                          ...f,
                          [row.receivedKey]: e.target.value,
                        }))
                      }
                      sx={{ width: 72, ...portalModalFieldSx }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      multiline
                      minRows={1}
                      value={addForm[row.commentsKey]}
                      onChange={(e) =>
                        setAddForm((f) => ({
                          ...f,
                          [row.commentsKey]: e.target.value,
                        }))
                      }
                      fullWidth
                      sx={portalModalFieldSx}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PortalDialog>

      {/* Upload score dialog — legacy divUpdateExcel */}
      <PortalDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        title="Upload Student Score"
        icon={<UploadFileIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            onClick={handleUploadScore}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Uploading…" : "Upload"}
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Download the template, enter the scores, and upload the file.{" "}
            <Box
              component="a"
              href={SCORE_UPLOAD_TEMPLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#0000ee", textDecoration: "underline" }}
            >
              Download Template
            </Box>
          </Typography>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <PortalModalSelect
              value={uploadForm.className}
              label="Class"
              onChange={(e) =>
                setUploadForm((f) => ({ ...f, className: e.target.value }))
              }
            >
              {mapClassMenuOptions(classList).map((c) => (
                <MenuItem key={c.key} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam Date</InputLabel>
            <PortalModalSelect
              value={uploadForm.examDate}
              label="Exam Date"
              onChange={(e) =>
                setUploadForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {mapExamScheduleMenuOptions(examDateList).map((d) => (
                <MenuItem key={d.key} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>
              Total Score
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
              <Typography sx={{ fontSize: "0.75rem", minWidth: 72 }}>
                Quiz
              </Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.quizTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, quizTotal: e.target.value }))
                }
                sx={{ width: 72, ...portalModalFieldSx }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
              <Typography sx={{ fontSize: "0.75rem", minWidth: 72 }}>
                Class Work
              </Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.classWorkTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({
                    ...f,
                    classWorkTotal: e.target.value,
                  }))
                }
                sx={{ width: 72, ...portalModalFieldSx }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
              <Typography sx={{ fontSize: "0.75rem", minWidth: 72 }}>
                Home Work
              </Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.homeWorkTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({
                    ...f,
                    homeWorkTotal: e.target.value,
                  }))
                }
                sx={{ width: 72, ...portalModalFieldSx }}
              />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>
              Select File Name
            </Typography>
            <input
              ref={uploadFileInputRef}
              type="file"
              accept=".xlsx,.csv"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setUploadForm((f) => ({ ...f, file }));
              }}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => uploadFileInputRef.current?.click()}
              >
                Choose File
              </Button>
              <Typography variant="body2" color="text.secondary">
                {uploadForm.file?.name ?? "No file selected (.xlsx or .csv)"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </PortalDialog>

      {/* Send email confirm — legacy UserSendEmailConfirmation */}
      <AppConfirmDialog
        open={emailConfirmOpen}
        onClose={() => setEmailConfirmOpen(false)}
        onConfirm={handleSendEmail}
        title="Send Email"
        message="Are you sure you want to send the email to all students?"
        confirmLabel="Send Email"
        icon={<EmailIcon sx={{ fontSize: 20 }} />}
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

export default AdminReportCard;
