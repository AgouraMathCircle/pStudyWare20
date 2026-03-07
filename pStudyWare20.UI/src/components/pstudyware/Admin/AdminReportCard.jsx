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
  TablePagination,
  InputAdornment,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Visibility as ViewReportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
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
  const { user } = useAuth();
  const username = user?.email || user?.username || "";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const filteredList = useMemo(() => {
    if (!searchTerm.trim()) return list;
    const search = searchTerm.toLowerCase();
    return list.filter((r) => {
      const o = row(r);
      return (
        (o.studentName || "").toLowerCase().includes(search) ||
        (o.studentID || "").toString().toLowerCase().includes(search) ||
        (o.group || "").toLowerCase().includes(search) ||
        (o.examType || "").toLowerCase().includes(search) ||
        (o.comments || "").toLowerCase().includes(search)
      );
    });
  }, [list, searchTerm]);

  const filteredSummary = useMemo(() => {
    if (!searchTerm.trim()) return summaryData;
    const search = searchTerm.toLowerCase();
    return summaryData.filter((r) => {
      const sn = (r.studentName ?? r.StudentName ?? "").toLowerCase();
      const sid = (r.studentID ?? r.StudentID ?? "").toString().toLowerCase();
      const gr = (r.group ?? r.Group ?? "").toLowerCase();
      return sn.includes(search) || sid.includes(search) || gr.includes(search);
    });
  }, [summaryData, searchTerm]);

  const paginatedList = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredList.slice(start, start + rowsPerPage);
  }, [filteredList, page, rowsPerPage]);

  const paginatedSummary = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSummary.slice(start, start + rowsPerPage);
  }, [filteredSummary, page, rowsPerPage]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Box>
          {/* Header Section - same as DocumentList */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              backgroundColor: "#4caf50",
              padding: "12px 16px",
              borderRadius: "4px 4px 0 0",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "white", fontSize: "1rem" }}
              >
                Report Card
              </Typography>
              <Typography variant="caption" sx={{ color: "white", fontSize: "0.75rem" }}>
                View and manage student scores. Use filters below to view summary report or export to Excel.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Tooltip title="Refresh list">
                <IconButton onClick={loadList} disabled={loading} sx={{ color: "white" }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              {canEdit && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddDialogOpen(true)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    backgroundColor: "white",
                    color: "#4caf50",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  Add Score
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={handleExportExcel}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  backgroundColor: "white",
                  color: "#4caf50",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                Export to Excel
              </Button>
              {showSummary && (
                <Button
                  variant="contained"
                  startIcon={<EmailIcon />}
                  onClick={handleSendEmail}
                  disabled={submitting}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    px: 3,
                    backgroundColor: "white",
                    color: "#4caf50",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  Send Email
                </Button>
              )}
            </Box>
          </Box>

          {/* Filters row */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
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
              >
                View Score Card Summary Report
              </Button>
              {showSummary && (
                <Button variant="outlined" size="small" onClick={() => setShowSummary(false)}>
                  Back to Score Card List
                </Button>
              )}
            </Box>
          </Paper>

          {/* Search Section - same as DocumentList */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by student name, student #, class, exam type, or comments..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : showSummary ? (
          <>
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
                        {searchTerm ? "No summary data matching your search." : "No summary data."}
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
                      <TableCell sx={cellBodySx}>{page * rowsPerPage + idx + 1}</TableCell>
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
          <TablePagination
            component="div"
            count={filteredSummary.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{ borderTop: "1px solid #e0e0e0" }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Total: {filteredSummary.length}
              {searchTerm && ` (filtered from ${summaryData.length})`}
            </Typography>
          </Box>
          </>
        ) : (
          <>
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
                        {searchTerm ? "No report cards matching your search." : "No report cards found."}
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
                        <TableCell sx={cellBodySx}>{page * rowsPerPage + idx + 1}</TableCell>
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
          <TablePagination
            component="div"
            count={filteredList.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            sx={{ borderTop: "1px solid #e0e0e0" }}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="textSecondary">
              Total: {filteredList.length}
              {searchTerm && ` (filtered from ${list.length})`}
            </Typography>
          </Box>
          </>
        )}
        </Box>
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
