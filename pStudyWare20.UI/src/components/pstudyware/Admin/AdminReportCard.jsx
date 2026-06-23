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
  IconButton,
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
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  portalModalFieldSx,
  portalModalSendButtonSx,
} from "../Common/portalModalStyles";
import AdminSessionListPagination from "./AdminSessionListPagination";
import InstructorPortalPaginationBar from "../Instructor/InstructorPortalPaginationBar";
import reportCardService from "../../../services/reportCardService";
import {
  instructorGreenSearchBarSx,
  instructorPageShellSx,
  instructorPageTitleSx,
  instructorSearchLabelSx,
  instructorSelectOnGreenSx,
  instructorFindButtonSx,
  instructorSearchTextFieldSx,
  instructorTableSx,
  instructorTableHeadRowSx,
  instructorTableBodyRowZebraSx,
  instructorCellHeaderSx,
  instructorCellHeaderSxLast,
  instructorCellBodySx,
  instructorCellBodySxLast,
} from "../Instructor/instructorPortalTableStyles";
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
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTitleSx,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
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
  };
  return classMap[classCode] || classCode || "";
};

const pickField = (item, ...keys) => {
  if (item == null) return "";
  if (typeof item !== "object") return String(item);
  for (const key of keys) {
    const val = item[key];
    if (val != null && val !== "") return val;
  }
  return "";
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

const matchesReportDateFilter = (examDate, filterDate) => {
  if (!filterDate || filterDate === ALL_FILTER_VALUE) return true;
  const rowDate = formatLegacyExamDate(examDate);
  const filter = formatLegacyExamDate(filterDate);
  return (
    rowDate === filter ||
    String(examDate ?? "").trim() === String(filterDate).trim()
  );
};

const matchesClassFilter = (group, filterClass) => {
  if (!filterClass || filterClass === ALL_FILTER_VALUE) return true;
  return (
    String(group ?? "").trim().toLowerCase() ===
    String(filterClass).trim().toLowerCase()
  );
};

const resolveReportCardId = (value) => {
  if (value == null || value === "") return "";
  return String(value);
};

const resolveClassSelectValue = (group, classList) => {
  if (!group) return "";
  const raw = String(group).trim();
  const expanded = getClassLabel(raw);

  for (const item of classList) {
    const name = pickField(
      item,
      "className",
      "ClassName",
      "text",
      "Text",
      "value",
      "Value"
    );
    if (name && (name.trim() === raw || name.trim() === expanded)) {
      return name;
    }
  }

  return expanded || raw;
};

const resolveExamScheduleValue = (examDate, examDateList) => {
  if (!examDate) return "";
  const raw = String(examDate).trim();
  const normalized = formatExamDateValue(raw);

  for (const item of examDateList) {
    const value = pickField(
      item,
      "displayValue",
      "DisplayValue",
      "mExamDate",
      "MExamDate",
      "value",
      "Value"
    );
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
    const name = pickField(
      item,
      "className",
      "ClassName",
      "text",
      "Text",
      "value",
      "Value"
    );
    return name && name.trim() === String(value).trim();
  });

const examDateListIncludesValue = (examDateList, value) =>
  !!value &&
  examDateList.some((item) => {
    const scheduleValue = pickField(
      item,
      "displayValue",
      "DisplayValue",
      "mExamDate",
      "MExamDate",
      "value",
      "Value"
    );
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
  { label: "Quiz", totalKey: "quizTotal", receivedKey: "quizReceived", commentsKey: "quizComments" },
  { label: "Class Test", totalKey: "classTestTotal", receivedKey: "classTestReceived", commentsKey: "classTestComments" },
  { label: "Home Work", totalKey: "homeWorkTotal", receivedKey: "homeWorkReceived", commentsKey: "homeWorkComments" },
  { label: "Final Exam", totalKey: "finalExamTotal", receivedKey: "finalExamReceived", commentsKey: "finalExamComments" },
  { label: "Placement Test", totalKey: "placementTestTotal", receivedKey: "placementTestReceived", commentsKey: "placementTestComments" },
];

const SCORE_UPLOAD_TEMPLATE_URL = "/pstudyware/Documents/AMC_ScoreCard/StudentReportCard.csv";

const ALL_FILTER_VALUE = "ALL";

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
  minWidth: "100%",
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
  overflowX: "hidden",
};

const adminReportCardTableWrapSx = {
  width: "100%",
  minWidth: "100%",
  alignSelf: "stretch",
};

const reportCardCommentsCellSx = {
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
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
  edit: 52,
  delete: 56,
  studentId: 72,
  studentName: null,
  class: 140,
  grade: 56,
  session: null,
  examType: null,
  examDate: 88,
  total: 72,
  topScore: 72,
  avg: 72,
  yourScore: 72,
  comments: 180,
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

const ReportCardColGroup = ({ widths }) => (
  <colgroup>
    {widths.map((w, i) => (
      <col key={i} style={w == null ? undefined : { width: w }} />
    ))}
  </colgroup>
);

const reportCardDeleteLinkSx = {
  ...adminSessionListTableActionLinkSx,
  color: "#c62828",
  "&:visited": { color: "#c62828" },
  "&:hover": { color: "#b71c1c" },
};

const AdminReportCard = () => {
  const location = useLocation();
  const hideRoleHeader = location.pathname.includes("/pstudyware/instructor/");
  const isAdminView = !hideRoleHeader;
  const { user } = useAuth();
  const username = user?.username || user?.email || "";
  const pageSize = 20;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportDates, setReportDates] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [examDateList, setExamDateList] = useState([]);
  const [selectedReportDate, setSelectedReportDate] = useState(ALL_FILTER_VALUE);
  const [selectedClass, setSelectedClass] = useState(ALL_FILTER_VALUE);
  const [semesterReport, setSemesterReport] = useState(false);
  const [appliedReportDate, setAppliedReportDate] = useState(ALL_FILTER_VALUE);
  const [appliedClass, setAppliedClass] = useState(ALL_FILTER_VALUE);
  const [appliedSemesterReport, setAppliedSemesterReport] = useState(false);
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
  const [sortField, setSortField] = useState("examDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortField(field);
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const sortHeadSx = (width, isLast = false) => {
    if (!isAdminView) {
      return isLast ? instructorCellHeaderSxLast : instructorCellHeaderSx;
    }
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
    if (isAdminView) {
      return {
        ...adminSessionListTableBodyCellSx(options),
        whiteSpace: "nowrap",
        width: options.truncate ? reportCardColumnWidths.comments : "auto",
        maxWidth: options.truncate ? reportCardColumnWidths.comments : undefined,
        minWidth: options.autoFit ? "max-content" : options.truncate ? 0 : undefined,
        overflow: options.truncate ? "hidden" : undefined,
        textOverflow: options.truncate ? "ellipsis" : undefined,
        ...(options.align ? { textAlign: options.align } : {}),
      };
    }
    const base = options.isLast
      ? instructorCellBodySxLast
      : instructorCellBodySx;
    if (options.truncate) {
      return {
        ...base,
        maxWidth: reportCardColumnWidths.comments,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      };
    }
    return options.action ? { ...base, verticalAlign: "middle" } : base;
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
    if (isAdminView) {
      return (
        <Box
          component="span"
          onClick={() => openEdit(reportCardId)}
          sx={adminSessionListTableActionLinkSx}
        >
          Edit
        </Box>
      );
    }
    return (
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={() => openEdit(reportCardId)}
          sx={{ padding: "2px", color: "#0000ee" }}
        >
          <EditIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Tooltip>
    );
  };

  const renderDeleteAction = (reportCardId) => {
    if (!canEdit) return "—";
    if (isAdminView) {
      return (
        <Box
          component="span"
          onClick={() => handleDeleteClick(reportCardId)}
          sx={reportCardDeleteLinkSx}
        >
          Delete
        </Box>
      );
    }
    return (
      <Tooltip title="Delete">
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDeleteClick(reportCardId)}
          sx={{ padding: "2px" }}
        >
          <DeleteIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Tooltip>
    );
  };

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await reportCardService.getReportCardList({
        Username: username,
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
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    if (!username) return;
    try {
      const res = await reportCardService.getDashboardData(username);
      const r = res?.reportDateList ?? res?.ReportDateList;
      const c = res?.classList ?? res?.ClassList;
      const s = res?.studentList ?? res?.StudentList;
      const e = res?.examDateList ?? res?.ExamDateList;
      setReportDates(Array.isArray(r) ? r : []);
      setClassList(Array.isArray(c) ? c : []);
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
        loadList();
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
        message: err?.response?.data?.error ?? err?.response?.data?.message ?? err?.message ?? "Upload failed.",
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
        loadList();
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
            ? serverMessage ?? "You do not have permission to add scores."
            : serverMessage ?? err?.message ?? "Add score failed.",
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

  const renderFilterSelectValue = (selected) =>
    !selected || selected === ALL_FILTER_VALUE ? "All" : selected;

  const handleViewReport = () => {
    setAppliedReportDate(selectedReportDate);
    setAppliedClass(selectedClass);
    setAppliedSemesterReport(semesterReport);
    setCurrentPage(1);
    setGoToPageInput("1");
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
      if (res?.isSuccess === false || !(res?.scoreDetails ?? res?.ScoreDetails)) {
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
          message:
            res?.message ?? "Scores have been updated successfully.",
          severity: "success",
        });
        setEditDialogOpen(false);
        loadList();
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
          message:
            res?.message ?? "Score has been deleted successfully.",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setSelectedScoreId(null);
        loadList();
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
      pickField(r, "ReportCardID", "reportCardID", "reportCardId", "ReportCardId"),
    ),
    studentID: pickField(r, "StudentID", "studentID", "studentId", "StudentId"),
    studentName: pickField(r, "StudentName", "studentName"),
    group: pickField(r, "Group", "group"),
    grade: pickField(r, "Grade", "grade"),
    semester: pickField(r, "Semester", "semester"),
    examType: pickField(r, "ExamType", "examType"),
    examDate: pickField(r, "ExamDate", "examDate"),
    totalCredit: pickField(r, "TotalCredit", "totalCredit"),
    highestScore: pickField(r, "HighestScore", "highestScore"),
    classAverage: pickField(r, "ClassAverage", "classAverage"),
    receivedCredit: pickField(r, "ReceivedCredit", "receivedCredit"),
    comments: pickField(r, "Comments", "comments"),
  });

  const getReportCardListFieldValue = (rawRow, field) => {
    const r = row(rawRow);
    switch (field) {
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

  const reportFilteredList = useMemo(() => {
    return list.filter((r) => {
      const o = row(r);
      if (!matchesClassFilter(o.group, appliedClass)) return false;
      if (!appliedSemesterReport && !matchesReportDateFilter(o.examDate, appliedReportDate)) {
        return false;
      }
      return true;
    });
  }, [list, appliedReportDate, appliedClass, appliedSemesterReport]);

  const filteredList = useMemo(() => {
    if (!searchText.trim()) return reportFilteredList;
    const search = searchText.trim();
    if (searchBy === "ALL") {
      return reportFilteredList.filter((r) => {
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
    return reportFilteredList.filter((r) => {
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
  }, [reportFilteredList, searchText, searchBy, searchCriteria]);

  const sortedList = useMemo(
    () =>
      sortRows(filteredList, sortField, sortOrder, getReportCardListFieldValue),
    [filteredList, sortField, sortOrder],
  );

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
    <Box sx={isAdminView ? { minHeight: "100vh" } : instructorPageShellSx}>
      {!hideRoleHeader && <AdminHeader user={user} />}
      {!hideRoleHeader && <AdminRoleHeaderSpacer />}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={isAdminView ? 3 : 2}>
          <Grid item xs={12}>
            <Card
              sx={
                isAdminView
                  ? adminSessionListPanelCardSx
                  : {
                      backgroundColor: "white",
                      borderRadius: 2,
                      overflow: "hidden",
                    }
              }
            >
              <CardContent
                sx={isAdminView ? adminSessionListPanelContentSx : { p: 3 }}
              >
                <Box sx={reportCardLayoutSx}>
                  <Box
                    sx={
                      isAdminView
                        ? adminSessionListHeaderBarSx
                        : {
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2,
                          }
                    }
                  >
                    <Typography
                      variant="subtitle1"
                      sx={
                        isAdminView
                          ? adminSessionListTitleSx
                          : instructorPageTitleSx
                      }
                    >
                      Report Card
                    </Typography>
                  </Box>

                  <Box sx={reportCardInlineToolbarSx}>
                    <FormControl size="small" sx={reportCardInlineFilterSx}>
                      <InputLabel>Report Date</InputLabel>
                      <Select
                        value={selectedReportDate}
                        label="Report Date"
                        displayEmpty
                        renderValue={renderFilterSelectValue}
                        onChange={(e) => setSelectedReportDate(e.target.value)}
                      >
                        <MenuItem value={ALL_FILTER_VALUE}>All</MenuItem>
                        {reportDates.map((d, i) => {
                          const label = pickField(d, "reportDate", "ReportDate") || String(d);
                          return (
                            <MenuItem key={i} value={label}>
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
                        displayEmpty
                        renderValue={renderFilterSelectValue}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        <MenuItem value={ALL_FILTER_VALUE}>All</MenuItem>
                        {classList.map((c, i) => {
                          const label = pickField(c, "className", "ClassName", "text", "Text", "value", "Value") || String(c);
                          return (
                            <MenuItem key={i} value={label}>
                              {label}
                            </MenuItem>
                          );
                        })}
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

                  {loading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box
                        sx={{
                          ...(isAdminView
                            ? adminSessionListSearchBarSx
                            : instructorGreenSearchBarSx),
                          width: "100%",
                          maxWidth: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={
                              isAdminView
                                ? adminSessionListSearchLabelSx
                                : instructorSearchLabelSx
                            }
                          >
                            Search By:
                          </Typography>
                          <Select
                            value={searchBy}
                            onChange={(e) => setSearchBy(e.target.value)}
                            size="small"
                            sx={
                              isAdminView
                                ? {
                                    ...adminSessionListSearchSelectSx,
                                    minWidth: 120,
                                  }
                                : {
                                    ...instructorSelectOnGreenSx,
                                    minWidth: 120,
                                  }
                            }
                          >
                            <MenuItem
                              value="ALL"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              -ALL-
                            </MenuItem>
                            <MenuItem
                              value="STUDENT_ID"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Student #
                            </MenuItem>
                            <MenuItem
                              value="STUDENT_NAME"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Student Name
                            </MenuItem>
                            <MenuItem
                              value="CLASS"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Class
                            </MenuItem>
                            <MenuItem
                              value="GRADE"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Grade
                            </MenuItem>
                            <MenuItem
                              value="SESSION"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Session
                            </MenuItem>
                            <MenuItem
                              value="EXAM_TYPE"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Exam Type
                            </MenuItem>
                            <MenuItem
                              value="COMMENTS"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Comments
                            </MenuItem>
                          </Select>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            sx={
                              isAdminView
                                ? adminSessionListSearchLabelSx
                                : instructorSearchLabelSx
                            }
                          >
                            Criteria:
                          </Typography>
                          <Select
                            value={searchCriteria}
                            onChange={(e) => setSearchCriteria(e.target.value)}
                            size="small"
                            sx={
                              isAdminView
                                ? adminSessionListSearchSelectSx
                                : instructorSelectOnGreenSx
                            }
                          >
                            <MenuItem
                              value=""
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Select Criteria
                            </MenuItem>
                            <MenuItem
                              value="equals"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Equals
                            </MenuItem>
                            <MenuItem
                              value="contains"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
                            >
                              Contains
                            </MenuItem>
                            <MenuItem
                              value="starts_with"
                              sx={
                                isAdminView
                                  ? adminSessionListMenuItemSx
                                  : { fontSize: "0.75rem" }
                              }
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
                          sx={
                            isAdminView
                              ? adminSessionListSearchFieldSx
                              : instructorSearchTextFieldSx
                          }
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleSearch}
                          sx={
                            isAdminView
                              ? adminSessionListFindButtonSx
                              : instructorFindButtonSx
                          }
                        >
                          Find
                        </Button>
                      </Box>

                      <Box sx={adminReportCardTableWrapSx}>
                      <TableContainer
                          component={Paper}
                          sx={
                            isAdminView
                              ? adminReportCardTableContainerSx
                              : { width: "100%", minWidth: "100%" }
                          }
                        >
                          <Table
                            sx={
                              isAdminView
                                ? adminReportCardTableSx
                                : instructorTableSx
                            }
                            size="small"
                          >
                            {isAdminView && (
                              <ReportCardColGroup
                                widths={reportCardColWidthsPx}
                              />
                            )}
                            <TableHead>
                              <TableRow
                                sx={
                                  isAdminView
                                    ? adminSessionListTableHeadRowSx
                                    : instructorTableHeadRowSx
                                }
                              >
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
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedList.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    colSpan={14}
                                    align="center"
                                    sx={
                                      isAdminView
                                        ? adminSessionListEmptyCellSx
                                        : { fontSize: "0.75rem", py: 3 }
                                    }
                                  >
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      sx={
                                        isAdminView
                                          ? adminSessionListEmptyTextSx
                                          : { fontSize: "0.75rem" }
                                      }
                                    >
                                      {searchText
                                        ? "No report cards matching your search."
                                        : "No report cards found."}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedList.map((r, idx) => {
                                  const o = row(r);
                                  return (
                                    <TableRow
                                      key={o.reportCardID ?? idx}
                                      sx={
                                        isAdminView
                                          ? adminSessionListTableBodyRowSx
                                          : instructorTableBodyRowZebraSx
                                      }
                                    >
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          action: true,
                                        })}
                                      >
                                        {renderEditAction(o.reportCardID)}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          action: true,
                                        })}
                                      >
                                        {renderDeleteAction(o.reportCardID)}
                                      </TableCell>
                                      <TableCell sx={reportCardBodyCellSx()}>
                                        {o.studentID}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          autoFit: true,
                                        })}
                                      >
                                        {o.studentName}
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
                                          autoFit: true,
                                        })}
                                      >
                                        {o.semester}
                                      </TableCell>
                                      <TableCell
                                        sx={reportCardBodyCellSx({
                                          autoFit: true,
                                        })}
                                      >
                                        {o.examType}
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
                                        })}
                                      >
                                        <Tooltip
                                          title={o.comments || ""}
                                          disableHoverListener={!o.comments}
                                        >
                                          <Box
                                            component="span"
                                            sx={reportCardCommentsCellSx}
                                          >
                                            {o.comments}
                                          </Box>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      {isAdminView ? (
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
                      ) : (
                        <InstructorPortalPaginationBar
                          currentPage={currentPage}
                          totalPages={totalPages}
                          totalRecords={totalRecords}
                          pageSize={pageSize}
                          goToPageInput={goToPageInput}
                          setGoToPageInput={setGoToPageInput}
                          onPageChange={handlePageChange}
                          onGoToPage={handleGoToPage}
                        />
                      )}
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
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
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
            <Select
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
              {classList.map((c, i) => {
                const label = pickField(c, "className", "ClassName", "text", "Text", "value", "Value") || String(c);
                return (
                  <MenuItem key={i} value={label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam/Session Date</InputLabel>
            <Select
              value={editForm.examDate}
              label="Exam/Session Date"
              onChange={(e) =>
                setEditForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {editForm.examDate &&
                !examDateListIncludesValue(examDateList, editForm.examDate) && (
                  <MenuItem value={editForm.examDate}>{editForm.examDate}</MenuItem>
                )}
              {examDateList.map((d, i) => {
                const value = pickField(d, "displayValue", "DisplayValue", "mExamDate", "MExamDate", "value", "Value");
                const label = pickField(d, "session", "Session", "reportDate", "ReportDate", "text", "Text") || value;
                return (
                  <MenuItem key={i} value={value || label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam Type</InputLabel>
            <Select
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
            </Select>
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
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
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
            <Select
              value={addForm.studentId}
              label="Student Name"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, studentId: e.target.value }))
              }
            >
              {studentList.map((s, i) => {
                const id = pickField(s, "studentID", "StudentID", "studentId", "StudentId");
                const name = pickField(s, "studentName", "StudentName");
                return (
                  <MenuItem key={i} value={String(id)}>
                    {name || id}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <Select
              value={addForm.className}
              label="Class"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, className: e.target.value }))
              }
            >
              {classList.map((c, i) => {
                const label = pickField(c, "className", "ClassName", "text", "Text", "value", "Value") || String(c);
                return (
                  <MenuItem key={i} value={label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam/Session Date</InputLabel>
            <Select
              value={addForm.examDate}
              label="Exam/Session Date"
              onChange={(e) =>
                setAddForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {examDateList.map((d, i) => {
                const value = pickField(d, "displayValue", "DisplayValue", "mExamDate", "MExamDate", "value", "Value");
                const label = pickField(d, "session", "Session", "reportDate", "ReportDate", "text", "Text") || value;
                return (
                  <MenuItem key={i} value={value || label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Table size="small" sx={{ border: "1px solid #ccc", mt: 1 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                <TableCell sx={{ fontSize: "0.75rem" }}>Type</TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>Total Score</TableCell>
                <TableCell sx={{ fontSize: "0.75rem" }}>Received Score</TableCell>
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
                        setAddForm((f) => ({ ...f, [row.totalKey]: e.target.value }))
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
                        setAddForm((f) => ({ ...f, [row.receivedKey]: e.target.value }))
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
                        setAddForm((f) => ({ ...f, [row.commentsKey]: e.target.value }))
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
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : null
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
            <Select
              value={uploadForm.className}
              label="Class"
              onChange={(e) =>
                setUploadForm((f) => ({ ...f, className: e.target.value }))
              }
            >
              {classList.map((c, i) => {
                const label = pickField(c, "className", "ClassName", "text", "Text", "value", "Value") || String(c);
                return (
                  <MenuItem key={i} value={label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl size="small" fullWidth sx={portalModalFieldSx}>
            <InputLabel>Exam Date</InputLabel>
            <Select
              value={uploadForm.examDate}
              label="Exam Date"
              onChange={(e) =>
                setUploadForm((f) => ({ ...f, examDate: e.target.value }))
              }
            >
              {examDateList.map((d, i) => {
                const value = pickField(d, "displayValue", "DisplayValue", "mExamDate", "MExamDate", "value", "Value");
                const label = pickField(d, "session", "Session", "reportDate", "ReportDate", "text", "Text") || value;
                return (
                  <MenuItem key={i} value={value || label}>
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <Typography sx={{ fontSize: "0.875rem", fontWeight: 500 }}>Total Score</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem" }}>Quiz</Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.quizTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, quizTotal: e.target.value }))
                }
                sx={{ width: 64, ...portalModalFieldSx }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem" }}>Class Work</Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.classWorkTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, classWorkTotal: e.target.value }))
                }
                sx={{ width: 64, ...portalModalFieldSx }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ fontSize: "0.75rem" }}>Home Work</Typography>
              <TextField
                size="small"
                type="number"
                value={uploadForm.homeWorkTotal}
                onChange={(e) =>
                  setUploadForm((f) => ({ ...f, homeWorkTotal: e.target.value }))
                }
                sx={{ width: 64, ...portalModalFieldSx }}
              />
            </Box>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.875rem", mb: 0.5 }}>Select File Name</Typography>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
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
