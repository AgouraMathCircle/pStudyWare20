import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import AdminSessionListPagination from "./AdminSessionListPagination";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import PortalDialog from "../Common/PortalDialog";
import PortalModalSelect from "../Common/PortalModalSelect";
import PdfViewerModal from "../../common/PdfViewerModal";
import { portalModalFieldSx, portalModalSendButtonSx } from "../Common/portalModalStyles";
import uploadAnswerKeyService from "../../../services/uploadAnswerKeyService";
import config from "../../../utils/config";
import "../../../styles/UploadAnswerKey.css";
import {
  UPLOAD_ANSWER_KEY_PAGE_SIZE,
  uploadAnswerKeyActionLinkSx,
  uploadAnswerKeyBodyCellSx,
  uploadAnswerKeyBodyRowSx,
  uploadAnswerKeyColumnWidths,
  uploadAnswerKeyDeleteLinkSx,
  uploadAnswerKeyEmptyCellSx,
  uploadAnswerKeyEmptyTextSx,
  uploadAnswerKeyFindButtonSx,
  uploadAnswerKeyHeaderActionButtonSx,
  uploadAnswerKeyHeaderBarSx,
  uploadAnswerKeyHeadCellSx,
  uploadAnswerKeyMenuItemSx,
  uploadAnswerKeyPageSx,
  uploadAnswerKeyPanelCardSx,
  uploadAnswerKeyPanelContentSx,
  uploadAnswerKeySearchBarSx,
  uploadAnswerKeySearchFieldSx,
  uploadAnswerKeySearchLabelSx,
  uploadAnswerKeySearchSelectSx,
  uploadAnswerKeyTableContainerSx,
  uploadAnswerKeyTableHeadRowSx,
  uploadAnswerKeyTableSx,
  uploadAnswerKeyTitleSx,
} from "./uploadAnswerKeyStyles";

const PAGE_SIZE = UPLOAD_ANSWER_KEY_PAGE_SIZE;

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "GD", label: "Game Development" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
];

const SESSION_OPTIONS = [
  ...Array.from({ length: 10 }, (_, i) => `Fall Session ${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `Spring Session ${i + 1}`),
];

const EXAM_TYPE_OPTIONS = [
  "Quiz",
  "Class Work",
  "Home Work",
  "Mock Test",
  "Final Exam",
];

const ANSWER_TYPE_OPTIONS = [
  { value: "Multiple Choice", label: "Multiple Choice" },
  { value: "Short Answer", label: "Short Answer" },
  { value: "Essay", label: "Essay" },
  { value: "Free Style", label: "Free Style" },
];

const columnWidths = uploadAnswerKeyColumnWidths;

function normalizeRow(row) {
  const questionPaper =
    row.questionPaper ?? row.QuestionPaper ?? row.mDocName ?? "";
  return {
    questionID: row.questionID ?? row.QuestionID ?? 0,
    class: row.class ?? row.Class ?? "",
    examType: row.examType ?? row.ExamType ?? "",
    question: row.question ?? row.Question ?? "",
    answerKey: row.answerKey ?? row.AnswerKey ?? "",
    points: row.points ?? row.Points ?? "",
    session: row.session ?? row.mSession ?? row.Session ?? "",
    category: row.category ?? row.Category ?? "",
    semester: row.semester ?? row.Semester ?? "",
    questionPaper: String(questionPaper).trim(),
  };
}

function matchesSearch(row, searchBy, criteria, term) {
  const value = term.trim().toLowerCase();
  if (!value) return true;

  const fieldMap = {
    CLASS: row.class,
    TYPE: row.examType,
    QUESTION: row.question,
    ANSWER_KEY: row.answerKey,
    STATUS: row.category,
    SESSION: row.session,
    CATEGORY: row.category,
  };

  const haystack =
    searchBy === "ALL"
      ? [
          row.questionID,
          row.class,
          row.examType,
          row.question,
          row.answerKey,
          row.points,
          row.session,
          row.category,
        ]
          .join(" ")
          .toLowerCase()
      : String(fieldMap[searchBy] ?? "").toLowerCase();

  if (criteria === "equals") return haystack === value;
  if (criteria === "starts_with") return haystack.startsWith(value);
  return haystack.includes(value);
}

const DEFAULT_UPLOAD_FORM = {
  classCode: "JB",
  session: "Fall Session 1",
  examType: "Quiz",
  answerType: "Multiple Choice",
  file: null,
};

const UploadAnswerKey = () => {
  const { user } = useAuth();
  const username =
    user?.username || user?.userName || user?.email || user?.Email || "";
  const chapterID =
    user?.chapterID?.toString() || user?.ChapterID?.toString() || "";
  const createdBy = user?.firstName || user?.FirstName || username;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [canUpload, setCanUpload] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [searchBy, setSearchBy] = useState("ALL");
  const [searchCriteria, setSearchCriteria] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState({
    searchBy: "ALL",
    searchCriteria: "",
    searchTerm: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPageInput, setGoToPageInput] = useState("1");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [uploadForm, setUploadForm] = useState(DEFAULT_UPLOAD_FORM);
  const [selectedQuestionPaper, setSelectedQuestionPaper] = useState(null);

  const closeUploadModal = () => {
    if (submitting) return;
    setUploadModalOpen(false);
    setUploadForm(DEFAULT_UPLOAD_FORM);
  };

  const openUploadModal = () => {
    setUploadForm(DEFAULT_UPLOAD_FORM);
    setUploadModalOpen(true);
  };

  const handleViewQuestionPaper = (fileName) => {
    const normalized = String(fileName ?? "").trim().replace(/^.*[\\/]/, "");
    if (!normalized) {
      setSnackbar({
        open: true,
        message: "Question paper file name is missing for this row.",
        severity: "error",
      });
      return;
    }
    setSelectedQuestionPaper(normalized);
  };

  const handleCloseQuestionPaper = () => {
    setSelectedQuestionPaper(null);
  };

  const loadQuestions = useCallback(async () => {
    if (!username) return;
    setLoading(true);
    try {
      const res = await uploadAnswerKeyService.getExamMasterList(username);
      if (!res.isSuccess) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to load answer keys.",
          severity: "error",
        });
        return;
      }
      setQuestions((res.questions || []).map(normalizeRow));
      setCanUpload(res.canUpload === true);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load answer keys.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((row) =>
      matchesSearch(
        row,
        appliedSearch.searchBy,
        appliedSearch.searchCriteria,
        appliedSearch.searchTerm,
      ),
    );
  }, [questions, appliedSearch]);

  const totalRecords = filteredQuestions.length;
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE) || 0;

  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
      setGoToPageInput(String(totalPages));
    }
  }, [currentPage, totalPages]);

  const handleSearch = () => {
    setAppliedSearch({ searchBy, searchCriteria, searchTerm });
    setCurrentPage(1);
    setGoToPageInput("1");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setGoToPageInput(page.toString());
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      setGoToPageInput(currentPage.toString());
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSubmitting(true);
    try {
      const res = await uploadAnswerKeyService.deleteExamQuestion(
        confirmDelete.questionID,
      );
      if (!res.isSuccess) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to delete question.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: res.message || "Question deleted successfully.",
        severity: "success",
      });
      setConfirmDelete(null);
      await loadQuestions();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete question.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadForm.file) {
      setSnackbar({
        open: true,
        message: "Please select a file.",
        severity: "warning",
      });
      return;
    }

    const ext = uploadForm.file.name.split(".").pop()?.toLowerCase();
    if (ext !== "xlsx") {
      setSnackbar({
        open: true,
        message: "Sorry, we can accept only Excel files (.xlsx).",
        severity: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await uploadAnswerKeyService.uploadAnswerKey({
        username,
        classCode: uploadForm.classCode,
        session: uploadForm.session,
        examType: uploadForm.examType,
        answerType: uploadForm.answerType,
        createdBy,
        chapterID,
        file: uploadForm.file,
      });
      if (!res.isSuccess) {
        setSnackbar({
          open: true,
          message: res.errorMessage || "Failed to upload answer key.",
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: res.message || "Answer key uploaded successfully.",
        severity: "success",
      });
      setUploadModalOpen(false);
      setUploadForm(DEFAULT_UPLOAD_FORM);
      await loadQuestions();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.errorMessage ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to upload answer key.",
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await uploadAnswerKeyService.downloadExcelTemplate();
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to download Excel template.",
        severity: "error",
      });
    }
  };

  return (
    <Box className="upload-answer-key-page" sx={uploadAnswerKeyPageSx}>
      <AdminHeader />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={uploadAnswerKeyPanelCardSx}>
              <CardContent sx={uploadAnswerKeyPanelContentSx}>
            <Box sx={uploadAnswerKeyHeaderBarSx}>
              <Typography variant="subtitle1" sx={uploadAnswerKeyTitleSx}>
                Upload Online Exam Answer Key
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {canUpload && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<UploadIcon />}
                    onClick={openUploadModal}
                    sx={uploadAnswerKeyHeaderActionButtonSx}
                  >
                    Upload Answer Key
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<RefreshIcon />}
                  onClick={loadQuestions}
                  disabled={loading || submitting}
                  sx={uploadAnswerKeyHeaderActionButtonSx}
                >
                  Refresh
                </Button>
              </Box>
            </Box>

            <Box sx={uploadAnswerKeySearchBarSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={uploadAnswerKeySearchLabelSx}>Search By:</Typography>
                <Select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  size="small"
                  sx={uploadAnswerKeySearchSelectSx}
                >
                  <MenuItem value="ALL" sx={uploadAnswerKeyMenuItemSx}>-ALL-</MenuItem>
                  <MenuItem value="CLASS" sx={uploadAnswerKeyMenuItemSx}>Class</MenuItem>
                  <MenuItem value="TYPE" sx={uploadAnswerKeyMenuItemSx}>Type</MenuItem>
                  <MenuItem value="QUESTION" sx={uploadAnswerKeyMenuItemSx}>Question</MenuItem>
                  <MenuItem value="ANSWER_KEY" sx={uploadAnswerKeyMenuItemSx}>Answer Key</MenuItem>
                  <MenuItem value="SESSION" sx={uploadAnswerKeyMenuItemSx}>Session</MenuItem>
                  <MenuItem value="CATEGORY" sx={uploadAnswerKeyMenuItemSx}>Category</MenuItem>
                </Select>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={uploadAnswerKeySearchLabelSx}>Criteria:</Typography>
                <Select
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  size="small"
                  sx={uploadAnswerKeySearchSelectSx}
                >
                  <MenuItem value="" sx={uploadAnswerKeyMenuItemSx}>Select Criteria</MenuItem>
                  <MenuItem value="equals" sx={uploadAnswerKeyMenuItemSx}>Equals</MenuItem>
                  <MenuItem value="contains" sx={uploadAnswerKeyMenuItemSx}>Contains</MenuItem>
                  <MenuItem value="starts_with" sx={uploadAnswerKeyMenuItemSx}>Starts With</MenuItem>
                </Select>
              </Box>
              <TextField
                size="small"
                placeholder="Search Text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                sx={uploadAnswerKeySearchFieldSx}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSearch}
                sx={uploadAnswerKeyFindButtonSx}
              >
                Find
              </Button>
            </Box>

            <TableContainer component={Paper} sx={uploadAnswerKeyTableContainerSx}>
              <Table sx={uploadAnswerKeyTableSx} size="small">
                <TableHead>
                  <TableRow sx={uploadAnswerKeyTableHeadRowSx}>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.actions)}>
                      Actions
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.questionId)}>
                      #
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.class)}>
                      Class
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.examType)}>
                      Type
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.question)}>
                      Question
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.answerKey)}>
                      Answer Key
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.points)}>
                      Points
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.session)}>
                      Session
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.category)}>
                      Category
                    </TableCell>
                    <TableCell sx={uploadAnswerKeyHeadCellSx(columnWidths.questionPaper, true)}>
                      Question Paper
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={uploadAnswerKeyEmptyCellSx}>
                        <CircularProgress size={28} />
                        <Typography variant="body2" color="textSecondary" sx={uploadAnswerKeyEmptyTextSx}>
                          Loading answer keys...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={uploadAnswerKeyEmptyCellSx}>
                        <Typography variant="body2" color="textSecondary" sx={uploadAnswerKeyEmptyTextSx}>
                          {appliedSearch.searchTerm.trim()
                            ? "No answer key records found matching your search criteria."
                            : "No answer key records found."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedQuestions.map((row) => (
                      <TableRow key={row.questionID} sx={uploadAnswerKeyBodyRowSx}>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ action: true })}>
                          <Box
                            onClick={() => setConfirmDelete(row)}
                            sx={uploadAnswerKeyDeleteLinkSx}
                          >
                            Delete
                          </Box>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx()}>
                          {row.questionID}
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx()}>
                          {row.class || "—"}
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true })}>
                          <Tooltip title={row.examType || "—"}>
                            <span>{row.examType || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true })}>
                          <Tooltip title={row.question || "—"}>
                            <span>{row.question || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true })}>
                          <Tooltip title={row.answerKey || "—"}>
                            <span>{row.answerKey || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx()}>
                          {row.points ?? "—"}
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true })}>
                          <Tooltip title={row.session || "—"}>
                            <span>{row.session || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true })}>
                          <Tooltip title={row.category || "—"}>
                            <span>{row.category || "—"}</span>
                          </Tooltip>
                        </TableCell>
                        <TableCell sx={uploadAnswerKeyBodyCellSx({ ellipsis: true, isLast: true })}>
                          {row.questionPaper ? (
                            <Tooltip title={row.questionPaper}>
                              <Box
                                onClick={() => handleViewQuestionPaper(row.questionPaper)}
                                sx={uploadAnswerKeyActionLinkSx}
                              >
                                QuestionPaper
                              </Box>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <AdminSessionListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              pageSize={PAGE_SIZE}
              goToPageInput={goToPageInput}
              onGoToPageInputChange={setGoToPageInput}
              onPageChange={handlePageChange}
              onGoToPage={handleGoToPage}
            />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <PortalDialog
        open={uploadModalOpen}
        onClose={closeUploadModal}
        maxWidth="sm"
        disableClose={submitting}
        ariaLabelledby="upload-answer-key-dialog-title"
        title="Upload Answer Key"
        icon={<UploadIcon sx={{ fontSize: 20 }} />}
        actions={
          <Button
            variant="contained"
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : <UploadIcon />
            }
            onClick={handleUploadSubmit}
            disabled={submitting}
            sx={portalModalSendButtonSx}
          >
            {submitting ? "Uploading…" : "Submit"}
          </Button>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
          <Typography variant="body2">
            Download the Excel template, enter the answer key, and upload it.{" "}
            <Box
              component="button"
              type="button"
              onClick={handleDownloadTemplate}
              sx={{
                color: "#0000ee",
                textDecoration: "underline",
                cursor: "pointer",
                border: "none",
                background: "none",
                p: 0,
                font: "inherit",
                "&:hover": { color: "#551a8b" },
              }}
            >
              Download Excel Template
            </Box>
          </Typography>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
            <InputLabel>Class</InputLabel>
            <PortalModalSelect
              value={uploadForm.classCode}
              label="Class"
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, classCode: e.target.value }))
              }
            >
              {CLASS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
            <InputLabel>Session</InputLabel>
            <PortalModalSelect
              value={uploadForm.session}
              label="Session"
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, session: e.target.value }))
              }
            >
              {SESSION_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
            <InputLabel>Description</InputLabel>
            <PortalModalSelect
              value={uploadForm.examType}
              label="Description"
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, examType: e.target.value }))
              }
            >
              {EXAM_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <FormControl fullWidth size="small" sx={portalModalFieldSx}>
            <InputLabel>Answer Type</InputLabel>
            <PortalModalSelect
              value={uploadForm.answerType}
              label="Answer Type"
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, answerType: e.target.value }))
              }
            >
              {ANSWER_TYPE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </PortalModalSelect>
          </FormControl>
          <Box>
            <Button variant="outlined" component="label" size="small">
              Select File (.xlsx)
              <input
                type="file"
                hidden
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) =>
                  setUploadForm((prev) => ({
                    ...prev,
                    file: e.target.files?.[0] ?? null,
                  }))
                }
              />
            </Button>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {uploadForm.file?.name || "No file selected"}
            </Typography>
          </Box>
        </Box>
      </PortalDialog>

      <AppConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete Question"
        message="Do you want to delete this question?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(null)}
        loading={submitting}
      />

      <PdfViewerModal
        open={Boolean(selectedQuestionPaper)}
        pdfUrl={selectedQuestionPaper}
        pdfName={selectedQuestionPaper}
        onClose={handleCloseQuestionPaper}
        basePath={config.paths.sessionDocuments}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UploadAnswerKey;
