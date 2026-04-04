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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Visibility as ViewReportIcon,
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft as PrevPageIcon,
  KeyboardArrowRight as NextPageIcon,
  LastPage as LastPageIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import reportCardService from "../../../services/reportCardService";

const EXAM_TYPES = [
  "Quiz",
  "Class Test",
  "Home Work",
  "Final Exam",
  "Placement Test",
];

const AdminReportCard = () => {
  const location = useLocation();
  const hideRoleHeader = location.pathname.includes("/pstudyware/instructor/");
  const { user } = useAuth();
  const username = user?.email || user?.username || "";
  const pageSize = 10;
  const [list, setList] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reportDates, setReportDates] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedReportDate, setSelectedReportDate] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [semesterReport, setSemesterReport] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
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
  const [searchCriteria, setSearchCriteria] = useState("contains");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");

  const cellPadding = "0 8px";
  const cellHeaderSx = {
    fontWeight: 400,
    borderRight: "1px solid #4caf50",
    fontSize: "0.75rem",
    padding: cellPadding,
  };
  const cellHeaderSxLast = {
    fontWeight: 400,
    fontSize: "0.75rem",
    padding: cellPadding,
  };
  const cellBodySx = {
    borderRight: "1px solid #4caf50",
    fontSize: "0.75rem",
    padding: cellPadding,
  };
  const cellBodySxLast = {
    fontSize: "0.75rem",
    padding: cellPadding,
  };

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await reportCardService.getReportCardList({ Username: username });
      const raw = res?.reportCardList ?? res?.ReportCardList;
      const data = Array.isArray(raw) ? raw : raw?.Table ?? raw?.Rows ?? [];
      setList(Array.isArray(data) ? data : []);
      setShowSummary(false);
      if (res?.isSuccess === false && res?.errorMessage) {
        setSnackbar({ open: true, message: res.errorMessage, severity: "error" });
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
      setReportDates(Array.isArray(r) ? r : []);
      setClassList(Array.isArray(c) ? c : []);
      const priv = await reportCardService.checkReportCardPrivileges();
      setCanEdit(priv?.canUpdateScores ?? priv?.CanUpdateScores ?? true);
    } catch (e) {
      console.error("Dashboard data:", e);
    }
  };

  useEffect(() => {
    if (username) {
      loadList();
      loadDashboardData();
    } else setLoading(false);
  }, [username]);

  useEffect(() => {
    setCurrentPage(1);
    setGoToPageInput("1");
  }, [showSummary]);

  const handleViewReport = async () => {
    setSubmitting(true);
    try {
      const res = await reportCardService.viewReport({
        Username: username,
        Class: selectedClass,
        ReportDate: selectedReportDate,
        IsSemesterReport: semesterReport,
      });
      const raw = res?.reportData ?? res?.ReportData;
      const data = Array.isArray(raw) ? raw : raw?.Table ?? raw?.Rows ?? [];
      setSummaryData(Array.isArray(data) ? data : []);
      setShowSummary(true);
    } catch (err) {
      const msg =
        err?.response?.data?.error ?? err?.message ?? "Failed to load report.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const res = await reportCardService.exportToExcel({
        Username: username,
        IsSummaryReport: showSummary,
      });
      const blob = res?.data instanceof Blob ? res.data : new Blob([res?.data ?? ""]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        res?.headers?.["content-disposition"]?.match(/filename="?([^"]+)"?/)?.[1] ??
        "ReportCard.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: "Export downloaded.", severity: "success" });
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.message ?? "Export failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    }
  };

  const handleSendEmail = async () => {
    setSubmitting(true);
    try {
      await reportCardService.sendStudentReportEmail({
        Username: username,
        ReportDate: selectedReportDate || undefined,
      });
      setSnackbar({ open: true, message: "Email sent.", severity: "success" });
    } catch (err) {
      const msg = err?.response?.data?.error ?? err?.message ?? "Send failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = async (scoreId) => {
    setSelectedScoreId(scoreId);
    try {
      const res = await reportCardService.getScoreDetails({ ReportCardId: scoreId });
      const sd = res?.scoreDetails ?? res?.ScoreDetails;
      if (sd) {
        setEditForm({
          reportID: scoreId,
          studentId: sd.studentId ?? sd.StudentId ?? "",
          studentName: sd.studentName ?? sd.StudentName ?? "",
          group: sd.group ?? sd.Group ?? "",
          examDate: sd.examDate ?? sd.ExamDate ?? "",
          examType: sd.examType ?? sd.ExamType ?? "Quiz",
          totalScore: sd.totalCredit ?? sd.TotalCredit ?? "",
          receivedScore: sd.receivedCredit ?? sd.ReceivedCredit ?? "",
          comments: sd.comments ?? sd.Comments ?? "",
        });
        setEditDialogOpen(true);
      } else {
        setSnackbar({ open: true, message: res?.errorMessage ?? "Score not found", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error ?? err?.message ?? "Failed to load score.",
        severity: "error",
      });
    }
  };

  const handleUpdateScore = async () => {
    setSubmitting(true);
    try {
      const res = await reportCardService.updateStudentScore({
        ReportID: editForm.reportID,
        Group: editForm.group,
        ExamDate: editForm.examDate,
        Type: editForm.examType,
        TotalScore: editForm.totalScore,
        ReceivedScore: editForm.receivedScore,
        Comments: editForm.comments,
      });
      if (res?.isSuccess !== false) {
        setSnackbar({ open: true, message: "Score updated.", severity: "success" });
        setEditDialogOpen(false);
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage ?? "Update failed", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error ?? err?.message ?? "Update failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScore = async () => {
    if (!selectedScoreId) return;
    setSubmitting(true);
    try {
      const res = await reportCardService.deleteStudentScore({
        ReportCardId: selectedScoreId,
      });
      if (res?.isSuccess !== false) {
        setSnackbar({ open: true, message: "Score deleted.", severity: "success" });
        setDeleteConfirmOpen(false);
        setSelectedScoreId(null);
        loadList();
      } else {
        setSnackbar({ open: true, message: res?.errorMessage ?? "Delete failed", severity: "error" });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data?.error ?? err?.message ?? "Delete failed.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const row = (r) => ({
    reportCardID: r.reportCardID ?? r.ReportCardID ?? r.ReportCardId,
    studentID: r.studentID ?? r.StudentID,
    studentName: r.studentName ?? r.StudentName,
    group: r.group ?? r.Group,
    grade: r.grade ?? r.Grade,
    semester: r.semester ?? r.Semester,
    examType: r.examType ?? r.ExamType,
    examDate: r.examDate ?? r.ExamDate,
    totalCredit: r.totalCredit ?? r.TotalCredit,
    highestScore: r.highestScore ?? r.HighestScore,
    classAverage: r.classAverage ?? r.ClassAverage,
    receivedCredit: r.receivedCredit ?? r.ReceivedCredit,
    comments: r.comments ?? r.Comments,
  });

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
  }, [list, searchText, searchBy, searchCriteria]);

  const filteredSummary = useMemo(() => {
    if (!searchText.trim()) return summaryData;
    const search = searchText.trim();
    if (searchBy === "ALL") {
      return summaryData.filter((r) => {
        const sn = r.studentName ?? r.StudentName ?? "";
        const sid = r.studentID ?? r.StudentID ?? "";
        const gr = r.group ?? r.Group ?? "";
        return (
          matchField(sn, search, searchCriteria) ||
          matchField(sid, search, searchCriteria) ||
          matchField(gr, search, searchCriteria)
        );
      });
    }
    return summaryData.filter((r) => {
      let fieldValue = "";
      switch (searchBy) {
        case "STUDENT_ID":
          fieldValue = r.studentID ?? r.StudentID ?? "";
          break;
        case "STUDENT_NAME":
          fieldValue = r.studentName ?? r.StudentName ?? "";
          break;
        case "CLASS":
          fieldValue = r.group ?? r.Group ?? "";
          break;
        default:
          fieldValue = "";
      }
      return matchField(fieldValue, search, searchCriteria);
    });
  }, [summaryData, searchText, searchBy, searchCriteria]);

  const filteredRows = showSummary ? filteredSummary : filteredList;
  const totalRecords = filteredRows.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const paginatedSummary = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSummary.slice(start, start + pageSize);
  }, [filteredSummary, currentPage]);

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

  const displayTotalPages = Math.max(1, totalPages);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {!hideRoleHeader && <AdminHeader user={user} />}
      {!hideRoleHeader && <Box sx={{ height: "60px" }} aria-hidden />}
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
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
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, color: "#1976d2", fontSize: "1rem" }}
                  >
                    Report Card
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    View and manage student scores. Use filters to view summary or export to Excel.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
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
                  {canEdit && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => setAddDialogOpen(true)}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Add Score
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportExcel}
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                  >
                    Export to Excel
                  </Button>
                  {showSummary && (
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={handleSendEmail}
                      disabled={submitting}
                      sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                    >
                      Send Email
                    </Button>
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  mb: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Report Date</InputLabel>
                  <Select
                    value={selectedReportDate}
                    label="Report Date"
                    onChange={(e) => setSelectedReportDate(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {reportDates.map((d, i) => (
                      <MenuItem key={i} value={typeof d === "object" ? d.value ?? d.text ?? d.Value ?? d.Text : d}>
                        {typeof d === "object" ? d.text ?? d.Value ?? d.Text ?? d.value : d}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Class"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <MenuItem value="">All</MenuItem>
                    {classList.map((c, i) => (
                      <MenuItem key={i} value={typeof c === "object" ? c.value ?? c.text ?? c.Value ?? c.Text : c}>
                        {typeof c === "object" ? c.text ?? c.Value ?? c.Text ?? c.value : c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={<Checkbox checked={semesterReport} onChange={(e) => setSemesterReport(e.target.checked)} />}
                  label="Semester"
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ViewReportIcon />}
                  onClick={handleViewReport}
                  disabled={submitting}
                  sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                >
                  View Score Card Summary Report
                </Button>
                {showSummary && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowSummary(false)}
                    sx={{ fontSize: "0.75rem", px: 1.5, py: 0.25 }}
                  >
                    Back to Score Card List
                  </Button>
                )}
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
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
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                      >
                        <MenuItem value="ALL" sx={{ fontSize: "0.75rem" }}>-ALL-</MenuItem>
                        <MenuItem value="STUDENT_ID" sx={{ fontSize: "0.75rem" }}>Student #</MenuItem>
                        <MenuItem value="STUDENT_NAME" sx={{ fontSize: "0.75rem" }}>Student Name</MenuItem>
                        <MenuItem value="CLASS" sx={{ fontSize: "0.75rem" }}>Class</MenuItem>
                        <MenuItem value="GRADE" sx={{ fontSize: "0.75rem" }}>Grade</MenuItem>
                        <MenuItem value="SESSION" sx={{ fontSize: "0.75rem" }}>Session</MenuItem>
                        <MenuItem value="EXAM_TYPE" sx={{ fontSize: "0.75rem" }}>Exam Type</MenuItem>
                        <MenuItem value="COMMENTS" sx={{ fontSize: "0.75rem" }}>Comments</MenuItem>
                      </Select>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography sx={{ color: "white", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
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
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                      >
                        <MenuItem value="contains" sx={{ fontSize: "0.75rem" }}>Contains</MenuItem>
                        <MenuItem value="equals" sx={{ fontSize: "0.75rem" }}>Equals</MenuItem>
                        <MenuItem value="starts_with" sx={{ fontSize: "0.75rem" }}>Starts With</MenuItem>
                      </Select>
                    </Box>
                    <TextField
                      size="small"
                      placeholder="Search Text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      sx={{
                        minWidth: 150,
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

        {showSummary ? (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table
              sx={{
                width: "100%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
              }}
              size="small"
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                  <TableCell sx={cellHeaderSx}>#</TableCell>
                  <TableCell sx={cellHeaderSx}>Student #</TableCell>
                  <TableCell sx={cellHeaderSx}>Student Name</TableCell>
                  <TableCell sx={cellHeaderSx}>Class</TableCell>
                  <TableCell sx={cellHeaderSx}>Exam Date</TableCell>
                  <TableCell sx={cellHeaderSx}>Quiz</TableCell>
                  <TableCell sx={cellHeaderSx}>Class Work</TableCell>
                  <TableCell sx={cellHeaderSx}>Home Work</TableCell>
                  <TableCell sx={cellHeaderSx}>Final Exam</TableCell>
                  <TableCell sx={cellHeaderSx}>Placement Test</TableCell>
                  <TableCell sx={cellHeaderSx}>Total Score</TableCell>
                  <TableCell sx={cellHeaderSxLast}>Rank</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSummary.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ fontSize: "0.75rem", padding: cellPadding, py: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                        {searchText ? "No summary data matching your search." : "No summary data."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSummary.map((r, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell sx={cellBodySx}>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                      <TableCell sx={cellBodySx}>{r.studentID ?? r.StudentID ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.studentName ?? r.StudentName ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.group ?? r.Group ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>
                        {r.examDate ?? r.ExamDate ? new Date(r.examDate ?? r.ExamDate).toLocaleDateString() : ""}
                      </TableCell>
                      <TableCell sx={cellBodySx}>{r.quizReceived ?? r.QuizReceived ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.classReceived ?? r.ClassReceived ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.homeWorkReceived ?? r.HomeWorkReceived ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.finalExamReceived ?? r.FinalExamReceived ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.placementTestReceived ?? r.PlacementTestReceived ?? ""}</TableCell>
                      <TableCell sx={cellBodySx}>{r.totalScore ?? r.TotalScore ?? ""}</TableCell>
                      <TableCell sx={cellBodySxLast}>{r.classRank ?? r.ClassRank ?? ""}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table
              sx={{
                width: "100%",
                tableLayout: "fixed",
                "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
              }}
              size="small"
            >
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
                  <TableCell sx={{ ...cellHeaderSx, width: "5%" }}>Edit</TableCell>
                  <TableCell sx={{ ...cellHeaderSx, width: "5%" }}>Delete</TableCell>
                  <TableCell sx={cellHeaderSx}>#</TableCell>
                  <TableCell sx={cellHeaderSx}>Student #</TableCell>
                  <TableCell sx={cellHeaderSx}>Student Name</TableCell>
                  <TableCell sx={cellHeaderSx}>Class</TableCell>
                  <TableCell sx={cellHeaderSx}>Grade</TableCell>
                  <TableCell sx={cellHeaderSx}>Session</TableCell>
                  <TableCell sx={cellHeaderSx}>Exam Type</TableCell>
                  <TableCell sx={cellHeaderSx}>Exam Date</TableCell>
                  <TableCell sx={cellHeaderSx}>Total</TableCell>
                  <TableCell sx={cellHeaderSx}>Top Score</TableCell>
                  <TableCell sx={cellHeaderSx}>AVG</TableCell>
                  <TableCell sx={cellHeaderSx}>Your Score</TableCell>
                  <TableCell sx={cellHeaderSxLast}>Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} align="center" sx={{ fontSize: "0.75rem", padding: cellPadding, py: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                        {searchText ? "No report cards matching your search." : "No report cards found."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedList.map((r, idx) => {
                    const o = row(r);
                    return (
                      <TableRow
                        key={o.reportCardID ?? idx}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                        }}
                      >
                        <TableCell sx={{ ...cellBodySx, verticalAlign: "middle" }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => openEdit(o.reportCardID)}
                              disabled={!canEdit}
                              sx={{ padding: "2px" }}
                            >
                              <EditIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={{ ...cellBodySx, verticalAlign: "middle" }}>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => { setSelectedScoreId(o.reportCardID); setDeleteConfirmOpen(true); }}
                              disabled={!canEdit}
                              sx={{ padding: "2px" }}
                            >
                              <DeleteIcon sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={cellBodySx}>{(currentPage - 1) * pageSize + idx + 1}</TableCell>
                        <TableCell sx={cellBodySx}>{o.studentID}</TableCell>
                        <TableCell sx={cellBodySx}>{o.studentName}</TableCell>
                        <TableCell sx={cellBodySx}>{o.group}</TableCell>
                        <TableCell sx={cellBodySx}>{o.grade}</TableCell>
                        <TableCell sx={cellBodySx}>{o.semester}</TableCell>
                        <TableCell sx={cellBodySx}>{o.examType}</TableCell>
                        <TableCell sx={cellBodySx}>
                          {o.examDate ? new Date(o.examDate).toLocaleDateString() : ""}
                        </TableCell>
                        <TableCell sx={cellBodySx}>{o.totalCredit}</TableCell>
                        <TableCell sx={cellBodySx}>{o.highestScore}</TableCell>
                        <TableCell sx={cellBodySx}>{o.classAverage}</TableCell>
                        <TableCell sx={cellBodySx}>{o.receivedCredit}</TableCell>
                        <TableCell sx={cellBodySxLast}>{o.comments}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <IconButton
                        size="small"
                        sx={{ color: "white", padding: "2px" }}
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1 || totalPages === 0}
                      >
                        <FirstPageIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "white", padding: "2px" }}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || totalPages === 0}
                      >
                        <PrevPageIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "white", padding: "2px" }}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        <NextPageIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: "white", padding: "2px" }}
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                      >
                        <LastPageIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>GoTo</Typography>
                      <Select
                        size="small"
                        value={totalPages > 0 ? currentPage : ""}
                        onChange={(e) => handlePageChange(Number(e.target.value))}
                        disabled={totalPages === 0}
                        sx={{
                          color: "white",
                          minWidth: 50,
                          fontSize: "0.75rem",
                          "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "& .MuiSelect-icon": { color: "white" },
                        }}
                      >
                        {totalPages > 0 ? (
                          Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <MenuItem key={p} value={p} sx={{ fontSize: "0.75rem" }}>
                              {p}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="" sx={{ fontSize: "0.75rem" }}>-</MenuItem>
                        )}
                      </Select>
                    </Box>
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      Page(s): {totalPages === 0 ? 0 : currentPage} of {displayTotalPages}
                    </Typography>
                    <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                      Record(s):{" "}
                      {totalRecords > 0
                        ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalRecords)}`
                        : "0"}{" "}
                      of {totalRecords}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                      <Typography sx={{ color: "white", fontSize: "0.75rem" }}>
                        Go to Page Number:
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
                          width: 50,
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                            fontSize: "0.75rem",
                          },
                        }}
                        inputProps={{ min: 1, max: totalPages || 1 }}
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
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Edit dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Student Score</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField label="Student" value={editForm.studentName} disabled size="small" />
            <TextField label="Class" value={editForm.group} disabled size="small" />
            <TextField label="Exam Date" value={editForm.examDate} disabled size="small" />
            <FormControl size="small" fullWidth>
              <InputLabel>Exam Type</InputLabel>
              <Select
                value={editForm.examType}
                label="Exam Type"
                onChange={(e) => setEditForm((f) => ({ ...f, examType: e.target.value }))}
              >
                {EXAM_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Total Score"
              type="number"
              value={editForm.totalScore}
              onChange={(e) => setEditForm((f) => ({ ...f, totalScore: e.target.value }))}
              size="small"
            />
            <TextField
              label="Received Score"
              type="number"
              value={editForm.receivedScore}
              onChange={(e) => setEditForm((f) => ({ ...f, receivedScore: e.target.value }))}
              size="small"
            />
            <TextField
              label="Comments"
              multiline
              rows={2}
              value={editForm.comments}
              onChange={(e) => setEditForm((f) => ({ ...f, comments: e.target.value }))}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateScore} disabled={submitting}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Score</DialogTitle>
        <DialogContent>Do you want to delete this score?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteScore} disabled={submitting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add score placeholder - opens a simple message for now; can be extended with full form */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Score</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Use the Report Card API AddStudentScore with Student, Class, Exam Date, and score rows (Quiz, Class Test, Home Work, Final Exam, Placement Test). This form can be extended with dropdowns and inputs for each field.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReportCard;
