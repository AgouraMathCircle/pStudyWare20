import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import studentScoreService, {
  getErrorMessage,
} from "../../../services/studentScoreService";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import StudentScoreScoresGrid from "./StudentScoreScoresGrid";
import {
  parseStudentDropdownValue,
  parseOnlineExamDisplayChapters,
  shouldRedirectToOnlineExam,
} from "../../../utils/studentChapterRouting";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListMenuItemSx,
  adminSessionListGridTableSx,
  adminSessionListTableHeadCellSx,
  adminSessionListTableHeadRowSx,
  adminSessionListTableBodyCellSx,
  adminSessionListTableBodyRowSx,
  adminSessionListTableContainerSx,
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  APPLICATION_SURFACE_BG,
  APPLICATION_SURFACE_BORDER,
  APPLICATION_ADMIN_TITLE_COLOR,
} from "../styles/applicationSurfaces";

/** Legacy StudentScore.aspx `.control_box` / `.inputHeader` colors */
const LEGACY_CONTROL_BOX_GREEN = "#54B50A";
const LEGACY_INPUT_HEADER_GREEN = "#3f8a36";
const LEGACY_CONTROL_BOX_BORDER = "#cceac4";

const updateScoreLegacyCardSx = {
  backgroundColor: LEGACY_CONTROL_BOX_GREEN,
  border: `1px solid ${LEGACY_CONTROL_BOX_BORDER}`,
  borderRadius: 2,
  boxShadow: PORTAL_CARD_BOX_SHADOW,
  overflow: "hidden",
  boxSizing: "border-box",
  ...portalCardAntiLiftSx,
};

const updateScoreLegacyCardContentSx = {
  pt: 2.5,
  pb: 2,
  px: { xs: 2, md: 3.75 },
  "&:last-child": { pb: 2 },
};

const updateScorePageTitleSx = {
  fontSize: "1.25rem",
  fontWeight: 600,
  lineHeight: 1.4,
  color: "#ffffff",
  mb: 1,
};

const legacyInputHeaderSx = {
  backgroundColor: LEGACY_INPUT_HEADER_GREEN,
  borderBottom: "1px solid #152F52",
  py: 0.75,
  px: 1,
  mb: 1,
  textAlign: "center",
};

const legacyInputHeaderTitleSx = {
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.5,
  color: "#f5f5f5",
};

const legacyInstructionTextSx = {
  fontSize: "0.875rem",
  lineHeight: 1.5,
  color: "#ffffff",
  mb: 0.5,
};

const legacyFieldBarSx = {
  backgroundColor: LEGACY_INPUT_HEADER_GREEN,
  borderBottom: "1px solid #152F52",
  py: "4px",
  px: "8px",
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 1,
  mb: 1,
  minHeight: 40,
  boxSizing: "border-box",
};

const legacyFieldLabelSx = {
  color: "#f5f5f5",
  fontSize: "0.75rem",
  lineHeight: 1,
  whiteSpace: "nowrap",
};

const legacyFieldSelectSx = {
  color: "#0e4354",
  fontSize: "0.75rem",
  minWidth: 160,
  height: 32,
  backgroundColor: "#D4E6F1",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_GREEN,
  },
  "& .MuiSelect-icon": { color: "#0e4354" },
  "& .MuiSelect-select": {
    py: "4px",
    minHeight: "unset !important",
    display: "flex",
    alignItems: "center",
  },
};

const legacySubmitButtonSx = {
  backgroundColor: "#174a10",
  color: "#ffffff",
  fontSize: "0.9375rem",
  fontWeight: 600,
  textTransform: "none",
  px: 4,
  py: 1,
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
  "&:hover": {
    backgroundColor: "#0f3310",
    color: "#ffffff",
  },
  "&:disabled": {
    backgroundColor: "rgba(23, 74, 16, 0.5)",
    color: "rgba(255, 255, 255, 0.7)",
  },
};

const scoreInputSx = {
  width: 72,
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    backgroundColor: "#D4E6F1",
    color: "#0e4354",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_GREEN,
  },
};
const commentInputSx = {
  minWidth: 220,
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    backgroundColor: "#D4E6F1",
    color: "#0e4354",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_GREEN,
  },
};

const scoreInstructionsPanelSx = {
  mb: 1.5,
  px: 0.5,
};

const scoreStep9HighlightSx = {
  fontSize: "0.9375rem",
  lineHeight: 1.4,
  color: "red",
  mb: 0.5,
};

const parseStudentValue = parseStudentDropdownValue;

const validateScoreEntries = (quiz, classTest, homeWork) => {
  const rows = [
    { label: "Quiz", total: quiz.total, received: quiz.received },
    {
      label: "Class Test",
      total: classTest.total,
      received: classTest.received,
    },
    { label: "Home Work", total: homeWork.total, received: homeWork.received },
  ];

  for (const row of rows) {
    const total = parseFloat(row.total);
    const received = parseFloat(row.received === "" ? "0" : row.received);

    if (Number.isNaN(total) || Number.isNaN(received)) {
      return `${row.label}: please enter valid numeric scores.`;
    }

    if (total < 0 || received < 0) {
      return `${row.label}: scores cannot be negative.`;
    }

    if (received > total) {
      return `${row.label}: received score cannot be greater than total score.`;
    }
  }

  return null;
};

const normalizeScores = (rows) =>
  (rows || []).map((row) => ({
    studentID: row.studentID ?? row.StudentID,
    studentName: row.studentName ?? row.StudentName ?? "",
    group: row.group ?? row.Group ?? "",
    grade: row.grade ?? row.Grade ?? "",
    semester: row.semester ?? row.Semester ?? "",
    examType: row.examType ?? row.ExamType ?? "",
    examDate: row.examDate ?? row.ExamDate,
    totalCredit: row.totalCredit ?? row.TotalCredit,
    receivedCredit: row.receivedCredit ?? row.ReceivedCredit,
    comments: row.comments ?? row.Comments ?? "",
  }));

const StudentScore = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const username = user?.username || user?.email;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [dueDate, setDueDate] = useState("");
  const onlineExamRedirectChaptersRef = useRef(null);
  const pageInitKeyRef = useRef("");
  const [enableScoreUpdate, setEnableScoreUpdate] = useState(false);
  const [studentContextLoading, setStudentContextLoading] = useState(false);
  const [studentScores, setStudentScores] = useState([]);
  const scoreWindowClosedToastShownRef = useRef(false);
  const accessDeniedShownRef = useRef(false);

  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("info");

  const [quiz, setQuiz] = useState({
    total: "5",
    received: "",
    comments: "",
  });
  const [classTest, setClassTest] = useState({
    total: "20",
    received: "",
    comments: "",
  });
  const [homeWork, setHomeWork] = useState({
    total: "10",
    received: "",
    comments: "",
  });

  const loadScores = useCallback(async () => {
    if (!username) return;
    try {
      const response = await studentScoreService.getStudentScores(username);
      if (response?.isSuccess) {
        setStudentScores(normalizeScores(response.studentScores));
      } else {
        showSnackbar(
          response?.errorMessage || "Failed to load scores.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error loading student scores:", error);
      showSnackbar(getErrorMessage(error, "Failed to load scores."), "error");
    }
  }, [username]);

  const validateWindow = useCallback(async (studentId, session, classCode) => {
    if (!studentId || !session) {
      setEnableScoreUpdate(false);
      return;
    }
    try {
      const response = await studentScoreService.validateScoreUpdate({
        studentID: studentId,
        session,
        class: classCode,
        examType: "Quiz",
      });
      if (!response?.isSuccess) {
        setEnableScoreUpdate(false);
        if (response?.errorMessage) {
          showSnackbar(response.errorMessage, "error");
        }
        return;
      }
      setEnableScoreUpdate(
        response.enableScoreUpdate ?? response.EnableScoreUpdate ?? false,
      );
    } catch (error) {
      console.error("Error validating score update window:", error);
      setEnableScoreUpdate(false);
      showSnackbar(
        getErrorMessage(error, "Failed to validate score update window."),
        "error",
      );
    }
  }, []);

  const loadSessionsForStudent = useCallback(
    async (studentValue, studentText, chaptersOverride) => {
      setStudentContextLoading(true);
      setEnableScoreUpdate(false);

      const { chapterId, studentId, classCode } =
        parseStudentValue(studentValue);

      if (!studentId || !chapterId) {
        showSnackbar(
          "Unable to read student details. Please contact support.",
          "error",
        );
        setSessions([]);
        setSelectedSession("");
        setStudentContextLoading(false);
        return false;
      }

      const redirectChapters =
        chaptersOverride !== undefined
          ? chaptersOverride
          : onlineExamRedirectChaptersRef.current;

      if (shouldRedirectToOnlineExam(chapterId, redirectChapters)) {
        const params = new URLSearchParams({
          Source: "S",
          Action: "R",
          Student: studentText || "",
          ChapterID: chapterId,
        });
        setStudentContextLoading(false);
        setLoading(false);
        navigate(`/student/online-exam?${params.toString()}`, {
          replace: true,
        });
        return true;
      }

      try {
        const sessionResponse =
          await studentScoreService.getCurrentSession(chapterId);
        if (!sessionResponse?.isSuccess) {
          showSnackbar(
            sessionResponse?.errorMessage || "Failed to load sessions.",
            "error",
          );
          setSessions([]);
          setSelectedSession("");
          return false;
        }

        const sessionRows =
          sessionResponse?.sessions ?? sessionResponse?.Sessions ?? [];
        setSessions(sessionRows);
        const firstSession =
          sessionRows[0]?.session ?? sessionRows[0]?.Session ?? "";
        setSelectedSession(firstSession);

        if (!firstSession) {
          setEnableScoreUpdate(false);
          return false;
        }

        await validateWindow(studentId, firstSession, classCode);
        return false;
      } finally {
        setStudentContextLoading(false);
      }
    },
    [navigate, validateWindow],
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const initKey = [
      username,
      searchParams.get("Student") ?? "",
      searchParams.get("Action") ?? "",
    ].join("|");

    if (pageInitKeyRef.current === initKey) {
      return;
    }
    pageInitKeyRef.current = initKey;

    const init = async () => {
      try {
        setLoading(true);
        if (searchParams.get("Action") === "U") {
          showSnackbar("Scores have been updated successfully.", "success");
        }

        const [listResponse, dueDateResponse] = await Promise.all([
          studentScoreService.getStudentList(username),
          studentScoreService.getDueDate(),
        ]);

        if (!listResponse?.isSuccess) {
          showSnackbar(
            listResponse?.errorMessage || "Failed to load student list.",
            "error",
          );
        }

        const studentList =
          listResponse?.studentList ?? listResponse?.StudentList ?? [];
        setStudents(studentList);

        const configuredChapters = dueDateResponse?.isSuccess
          ? parseOnlineExamDisplayChapters(
              dueDateResponse.onlineExamDisplayChapter ??
                dueDateResponse.OnlineExamDisplayChapter,
            )
          : null;

        if (dueDateResponse?.isSuccess) {
          setDueDate(dueDateResponse.dueDate ?? dueDateResponse.DueDate ?? "");
          onlineExamRedirectChaptersRef.current = configuredChapters;
        } else if (dueDateResponse?.errorMessage) {
          showSnackbar(dueDateResponse.errorMessage, "warning");
        }

        if (studentList.length > 0) {
          const queryStudent = searchParams.get("Student");
          const match = queryStudent
            ? studentList.find((s) => (s.text ?? s.Text) === queryStudent)
            : null;
          const initial = match ?? studentList[0];
          const value = initial.value ?? initial.Value ?? "";
          const text = initial.text ?? initial.Text ?? "";
          setSelectedStudent(value);
          const redirected = await loadSessionsForStudent(
            value,
            text,
            configuredChapters,
          );
          if (redirected) return;
        }

        await loadScores();
      } catch (error) {
        console.error("Error loading student score page:", error);
        showSnackbar(
          getErrorMessage(error, "Error loading update score data."),
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isAuthenticated, user, username, searchParams]);

  const handleStudentChange = async (event) => {
    const value = event.target.value;
    setSelectedStudent(value);
    scoreWindowClosedToastShownRef.current = false;
    const student = students.find((s) => (s.value ?? s.Value) === value);
    const text = student?.text ?? student?.Text ?? "";
    await loadSessionsForStudent(value, text);
  };

  const handleSessionChange = async (event) => {
    const session = event.target.value;
    setSelectedSession(session);
    const { studentId, classCode } = parseStudentValue(selectedStudent);
    setStudentContextLoading(true);
    try {
      await validateWindow(studentId, session, classCode);
    } finally {
      setStudentContextLoading(false);
    }
  };

  const handleNumericChange = (setter, field) => (event) => {
    const value = event.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setter((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmitClick = () => {
    if (!enableScoreUpdate) {
      showSnackbar("The Score Update window has closed.", "warning");
      return;
    }

    const { studentId, classCode } = parseStudentValue(selectedStudent);
    if (!studentId || !selectedSession) {
      showSnackbar("Please select a student and session.", "warning");
      return;
    }

    const validationError = validateScoreEntries(quiz, classTest, homeWork);
    if (validationError) {
      showSnackbar(validationError, "warning");
      return;
    }

    setSubmitConfirmOpen(true);
  };

  const handleSubmitConfirmClose = () => {
    if (!submitting) {
      setSubmitConfirmOpen(false);
    }
  };

  const handleSubmitConfirm = async () => {
    setSubmitConfirmOpen(false);

    const { studentId, classCode } = parseStudentValue(selectedStudent);

    try {
      setSubmitting(true);
      const response = await studentScoreService.addStudentScore({
        studentID: studentId,
        session: selectedSession,
        class: classCode,
        quizTotalScore: quiz.total,
        quizReceivedScore: quiz.received,
        quizComments: quiz.comments,
        classTestTotalScore: classTest.total,
        classTestReceivedScore: classTest.received,
        classTestComments: classTest.comments,
        homeWorkTotalScore: homeWork.total,
        homeWorkReceivedScore: homeWork.received,
        homeWorkComments: homeWork.comments,
      });

      if (response?.isSuccess) {
        const message =
          response.message || "Scores have been updated successfully.";
        showSnackbar(message, "success");
        setQuiz((prev) => ({ ...prev, received: "", comments: "" }));
        setClassTest((prev) => ({ ...prev, received: "", comments: "" }));
        setHomeWork((prev) => ({ ...prev, received: "", comments: "" }));
        await loadScores();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showSnackbar(
          response?.errorMessage || "Failed to update scores.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error submitting scores:", error);
      showSnackbar(getErrorMessage(error, "Failed to update scores."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const entryColumnWidths = {
    type: "14%",
    total: "12%",
    received: "12%",
    comments: "62%",
  };

  useEffect(() => {
    if (
      !enableScoreUpdate &&
      !loading &&
      !studentContextLoading &&
      students.length > 0 &&
      selectedStudent &&
      !scoreWindowClosedToastShownRef.current
    ) {
      scoreWindowClosedToastShownRef.current = true;
      showSnackbar("The Score Update window has closed.", "error");
    }
  }, [
    enableScoreUpdate,
    loading,
    studentContextLoading,
    students.length,
    selectedStudent,
    showSnackbar,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (!accessDeniedShownRef.current) {
        accessDeniedShownRef.current = true;
        showSnackbar("Access denied. Please log in to update scores.", "error");
      }
    }
  }, [isAuthenticated, user, showSnackbar]);

  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
      </Box>
    );
  }

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <StudentRoleHeaderSpacer />

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={updateScoreLegacyCardSx}>
              <CardContent sx={updateScoreLegacyCardContentSx}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={updateScorePageTitleSx}
                  >
                    {/* Update Score */}
                  </Typography>

                  {studentContextLoading && (
                    <Typography
                      sx={{ mb: 1, fontSize: "0.75rem", color: "#ffffff" }}
                    >
                      Loading student session...
                    </Typography>
                  )}

                  {enableScoreUpdate && !studentContextLoading && (
                    <>
                      <Box sx={legacyInputHeaderSx}>
                        <Typography
                          component="div"
                          sx={legacyInputHeaderTitleSx}
                        >
                          Score Update Instructions
                        </Typography>
                      </Box>

                      <Box sx={scoreInstructionsPanelSx}>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 1:</strong> Select the student from the
                          list. (If you have multiple kids enrolled, pay
                          attention to the name.)
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 2:</strong> Enter the total points
                          available for the quiz (it is usually 5) and the score
                          you received on the quiz. If you did not take the
                          quiz, put a 0 in this spot.
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 3:</strong> Enter the class work total
                          score (depends on the class — please double check the
                          total score on the classwork) and the score you have
                          received.
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 4:</strong> Enter the last week home work
                          total score (it is usually 10) and received score.
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 5:</strong> Click the submit button. Do
                          not forget this step.
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 7:</strong> After submitting, verify the
                          score in the grid. If it is not correct, please
                          reenter and submit — it will overwrite the previous
                          incorrect score.
                        </Typography>
                        <Typography sx={legacyInstructionTextSx}>
                          <strong>Step 8:</strong> The score update option will
                          be disabled before the next class.
                        </Typography>
                        {dueDate && (
                          <Typography
                            component="div"
                            sx={scoreStep9HighlightSx}
                          >
                            <strong>
                              Step 9: The current session score update option
                              will be enabled till {dueDate}. Please update
                              score before the last date.
                            </strong>
                          </Typography>
                        )}
                        <Typography sx={legacyInstructionTextSx}>
                          If you have any questions, please contact us via
                          Message Center.
                        </Typography>
                      </Box>
                    </>
                  )}

                  <Box sx={{ ...legacyInputHeaderSx, mt: enableScoreUpdate && !studentContextLoading ? 1.5 : 0 }}>
                    <Typography
                      component="div"
                      sx={legacyInputHeaderTitleSx}
                    >
                      Update Student Score
                    </Typography>
                  </Box>

                  {loading ? (
                    <Typography
                      sx={{ mb: 1, fontSize: "0.75rem", color: "#ffffff" }}
                    >
                      Loading students...
                    </Typography>
                  ) : students.length === 0 ? (
                    <Typography
                      sx={{ mb: 1, fontSize: "0.75rem", color: "#ffffff" }}
                    >
                      No students found for your account.
                    </Typography>
                  ) : (
                    <Box sx={legacyFieldBarSx}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Typography sx={legacyFieldLabelSx}>
                          Student Name:
                        </Typography>
                        <Select
                          value={selectedStudent}
                          onChange={handleStudentChange}
                          size="small"
                          sx={{ ...legacyFieldSelectSx, minWidth: 200 }}
                          disabled={loading || studentContextLoading}
                        >
                          {students.map((student, index) => (
                            <MenuItem
                              key={index}
                              value={student.value ?? student.Value}
                              sx={adminSessionListMenuItemSx}
                            >
                              {student.text ?? student.Text}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <Typography sx={legacyFieldLabelSx}>
                          Session:
                        </Typography>
                        <Select
                          value={selectedSession}
                          onChange={handleSessionChange}
                          size="small"
                          sx={{ ...legacyFieldSelectSx, minWidth: 160 }}
                          disabled={
                            loading ||
                            studentContextLoading ||
                            sessions.length === 0
                          }
                        >
                          {sessions.map((session, index) => (
                            <MenuItem
                              key={index}
                              value={session.session ?? session.Session}
                              sx={adminSessionListMenuItemSx}
                            >
                              {session.session ?? session.Session}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  )}

                  {enableScoreUpdate && !studentContextLoading && (
                    <>
                      <TableContainer
                        component={Paper}
                        sx={{
                          ...adminSessionListTableContainerSx,
                          mt: 1,
                          backgroundColor: "#ffffff",
                          borderRadius: 1,
                        }}
                      >
                        <Table size="small" sx={adminSessionListGridTableSx}>
                          <TableHead>
                            <TableRow sx={adminSessionListTableHeadRowSx}>
                              <TableCell
                                sx={adminSessionListTableHeadCellSx(
                                  entryColumnWidths.type,
                                )}
                              >
                                Type
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableHeadCellSx(
                                  entryColumnWidths.total,
                                )}
                              >
                                Total Score
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableHeadCellSx(
                                  entryColumnWidths.received,
                                )}
                              >
                                Received Score
                              </TableCell>
                              <TableCell
                                sx={adminSessionListTableHeadCellSx(
                                  entryColumnWidths.comments,
                                  true,
                                )}
                              >
                                Comments
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[
                              { label: "Quiz", state: quiz, setState: setQuiz },
                              {
                                label: "Class Test",
                                state: classTest,
                                setState: setClassTest,
                              },
                              {
                                label: "Home Work",
                                state: homeWork,
                                setState: setHomeWork,
                              },
                            ].map((row) => (
                              <TableRow
                                key={row.label}
                                sx={adminSessionListTableBodyRowSx}
                              >
                                <TableCell
                                  sx={adminSessionListTableBodyCellSx()}
                                >
                                  {row.label}
                                </TableCell>
                                <TableCell
                                  sx={adminSessionListTableBodyCellSx()}
                                >
                                  <TextField
                                    size="small"
                                    value={row.state.total}
                                    onChange={handleNumericChange(
                                      row.setState,
                                      "total",
                                    )}
                                    sx={scoreInputSx}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={adminSessionListTableBodyCellSx()}
                                >
                                  <TextField
                                    size="small"
                                    value={row.state.received}
                                    onChange={handleNumericChange(
                                      row.setState,
                                      "received",
                                    )}
                                    sx={scoreInputSx}
                                  />
                                </TableCell>
                                <TableCell
                                  sx={adminSessionListTableBodyCellSx({
                                    isLast: true,
                                  })}
                                >
                                  <TextField
                                    size="small"
                                    multiline
                                    minRows={1}
                                    value={row.state.comments}
                                    onChange={(e) =>
                                      row.setState((prev) => ({
                                        ...prev,
                                        comments: e.target.value,
                                      }))
                                    }
                                    inputProps={{ maxLength: 300 }}
                                    sx={commentInputSx}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      <Box sx={{ mt: 1.5, textAlign: "center" }}>
                        <Button
                          className="student-score-submit-btn"
                          variant="contained"
                          size="large"
                          onClick={handleSubmitClick}
                          disabled={
                            submitting ||
                            loading ||
                            students.length === 0 ||
                            !enableScoreUpdate
                          }
                          startIcon={<SendIcon sx={{ color: "#ffffff" }} />}
                          sx={legacySubmitButtonSx}
                        >
                          {submitting ? "Submitting..." : "Submit"}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent
                sx={{
                  ...adminSessionListPanelContentSx,
                  pt: 1,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <StudentScoreScoresGrid
                  scores={studentScores}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <AppConfirmDialog
        open={submitConfirmOpen}
        onClose={handleSubmitConfirmClose}
        onConfirm={handleSubmitConfirm}
        title="Confirm Submit"
        message="Are you sure you want to submit these scores?"
        confirmLabel="Submit"
        icon={<SendIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
      />

      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} autoHideDuration={6000} />
    </Box>
  );
};

export default StudentScore;
