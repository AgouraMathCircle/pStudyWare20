import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Link,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import finalExamService from "../../../services/finalExamService";
import StudentHeader from "./StudentHeader";
import FinalExamScoresGrid from "./FinalExamScoresGrid";
import {
  APPLICATION_ADMIN_TITLE_COLOR,
  APPLICATION_SURFACE_BG,
  APPLICATION_SURFACE_BORDER,
  PORTAL_CARD_BOX_SHADOW,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/StudentDashboard.css";

const EXAM_TYPE = "Final Exam";

/** Clearance for fixed StudentHeader (top: 64px) — tight, no extra gap */
const STUDENT_HEADER_SPACER = "52px";

/** Legacy FinalExam.aspx / style.css palette */
const LEGACY_CONTROL_BOX_BG = "#54B50A";
const LEGACY_CONTROL_BOX_BORDER = "#cceac4";
const LEGACY_INPUT_HEADER_BG = "#3f8a36";
const LEGACY_GROUP_HEADER_BG = "#174a10";
const LEGACY_INPUT_CAPTION_BG = "#54B50A";
const LEGACY_INPUTBOX_BG = "#D4E6F1";
const LEGACY_BODY_COLOR = "#0e4354";
const LEGACY_BUTTON_BG = "#174a10";
const LEGACY_TABLE_BORDER = "#333333";

const examAnswerSheetScale = 1.584;

const answerSheetPanelSx = {
  backgroundColor: LEGACY_CONTROL_BOX_BG,
  border: `1px solid ${LEGACY_CONTROL_BOX_BORDER}`,
  borderRadius: 0,
  boxShadow: "none",
  mb: 2,
  overflow: "visible",
};

const answerSheetTitleSx = {
  backgroundColor: LEGACY_INPUT_HEADER_BG,
  color: "whitesmoke",
  borderBottom: "1px solid #152F52",
  textAlign: "center",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "1.3em",
  lineHeight: 1.5,
  fontWeight: 400,
  py: 1,
};

const answerSheetGroupPaperSx = {
  p: 0,
  borderRadius: 1,
  overflow: "hidden",
  border: `1px solid ${LEGACY_TABLE_BORDER}`,
  backgroundColor: "#ffffff",
};

const answerSheetGroupHeaderSx = {
  backgroundColor: LEGACY_GROUP_HEADER_BG,
  color: "whitesmoke",
  textAlign: "center",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontWeight: 400,
  fontSize: `${0.8 * examAnswerSheetScale}rem`,
  lineHeight: 1.5,
  py: 0.5,
  borderBottom: `1px solid ${LEGACY_TABLE_BORDER}`,
};

const legacySubmitButtonSx = {
  backgroundColor: LEGACY_BUTTON_BG,
  color: "#FFFFFF",
  textTransform: "none",
  fontWeight: 400,
  height: 25,
  minWidth: 100,
  borderRadius: 0,
  fontSize: "0.875rem",
  "&:hover": { backgroundColor: "#0f3310" },
};

const legacyInstructionBodySx = {
  px: { xs: 2, sm: 2.5 },
  pt: 1.25,
  pb: 2,
};

const legacyInstructionStepSx = {
  color: "#ffffff",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "0.875rem",
  lineHeight: 1.5,
  mb: 0.75,
};

const legacyInstructionLinkSx = {
  color: "#ffffff",
  fontWeight: 400,
  textDecoration: "underline",
  "&:hover": { color: "#ffffff", textDecoration: "underline" },
};

const legacyFormCaptionCellSx = {
  backgroundColor: LEGACY_INPUT_CAPTION_BG,
  color: "whitesmoke",
  borderBottom: `1px solid ${LEGACY_INPUT_CAPTION_BG}`,
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "0.8rem",
  textAlign: "center",
  py: 0.75,
  px: 1.5,
  whiteSpace: "nowrap",
  verticalAlign: "middle",
};

const legacyFormFieldCellSx = {
  py: 0.5,
  px: 0.5,
  verticalAlign: "middle",
};

const legacyFormRowSx = {
  display: "flex",
  flexWrap: { xs: "wrap", lg: "nowrap" },
  alignItems: "stretch",
  gap: 0,
  width: "100%",
};

const legacyFormGroupSx = {
  display: "flex",
  alignItems: "stretch",
  flex: { xs: "1 1 100%", sm: "1 1 auto" },
  minWidth: 0,
};

const legacyInputSelectSx = {
  backgroundColor: LEGACY_INPUTBOX_BG,
  color: LEGACY_BODY_COLOR,
  fontSize: "0.875rem",
  minWidth: 220,
  height: 32,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_BG,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_BG,
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: LEGACY_CONTROL_BOX_BG,
  },
  "& .MuiSelect-select": {
    py: "4px",
    display: "flex",
    alignItems: "center",
  },
};

const legacyInputSelectInlineSx = {
  ...legacyInputSelectSx,
  minWidth: { xs: 160, md: 140 },
  width: "100%",
};

const legacyGetAnswerSheetButtonSx = {
  ...legacySubmitButtonSx,
  width: 200,
  height: 32,
  flexShrink: 0,
  alignSelf: "stretch",
  mt: { xs: 1, lg: 0 },
};

const compactRadioLabelSx = {
  mr: 0.6,
  m: 0,
  my: 0,
  height: "auto",
  minHeight: 0,
  alignItems: "center",
  color: LEGACY_BODY_COLOR,
  "& .MuiFormControlLabel-label": {
    fontSize: `${0.75 * examAnswerSheetScale}rem`,
    lineHeight: 1,
    px: 0.3,
    py: 0,
    color: LEGACY_BODY_COLOR,
  },
  "& .MuiRadio-root": {
    p: 0,
    m: 0,
    color: LEGACY_GROUP_HEADER_BG,
    "&.Mui-checked": { color: LEGACY_GROUP_HEADER_BG },
    "& svg": { fontSize: `${0.875 * examAnswerSheetScale}rem` },
  },
};

const examQuestionTableSx = {
  borderCollapse: "collapse",
  backgroundColor: "#ffffff",
  "& .MuiTableCell-root": {
    py: "0 !important",
    pt: "0 !important",
    pb: "0 !important",
    fontSize: `${0.8 * examAnswerSheetScale}rem`,
    lineHeight: 1.2,
    border: `1px solid ${LEGACY_TABLE_BORDER}`,
    verticalAlign: "middle",
  },
  "& .MuiTableRow-root": {
    height: "auto !important",
    backgroundColor: "transparent",
  },
  "& .MuiTableRow-root:hover": {
    backgroundColor: "transparent",
  },
};

const FinalExam = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  // Student and exam selection state
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedExamType] = useState(EXAM_TYPE);

  // Questions and answers state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showQuestions, setShowQuestions] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  // Student scores state
  const [studentScores, setStudentScores] = useState([]);

  // Message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Visibility state
  const [showForm, setShowForm] = useState(true);
  const [showNoQuestions, setShowNoQuestions] = useState(false);
  const [showAlreadySubmitted, setShowAlreadySubmitted] = useState(false);
  const [showExamCompleted, setShowExamCompleted] = useState(false);
  const [showFormError, setShowFormError] = useState(false);

  const applyScoreValidationResult = useCallback((validationResponse) => {
    if (!validationResponse.isSuccess) {
      setShowQuestions(false);
      setShowAlreadySubmitted(true);
      setShowNoQuestions(false);
      setShowExamCompleted(false);
      return false;
    }

    if (!validationResponse.enableScoreUpdate) {
      setShowQuestions(false);
      setShowAlreadySubmitted(true);
      setShowNoQuestions(false);
      setShowExamCompleted(false);
      return false;
    }

    setShowAlreadySubmitted(false);
    setShowExamCompleted(false);
    return true;
  }, []);

  const runScoreValidation = useCallback(
    async (studentValue, session) => {
      const studentInfo = studentValue.split("~");
      const classValue = studentInfo[0];
      const studentID = parseInt(studentInfo[1], 10);

      const validationResponse = await finalExamService.validateScoreUpdate({
        studentID,
        session,
        class: classValue,
        examType: selectedExamType,
      });

      return applyScoreValidationResult(validationResponse);
    },
    [applyScoreValidationResult, selectedExamType]
  );

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("OnlineExam: Fetching student list");

        // Check URL parameters
        const action = searchParams.get("Action");
        const source = searchParams.get("Source");
        const studentName = searchParams.get("Student");
        const chapterID = searchParams.get("ChapterID");
        const receivedScore = searchParams.get("ReceivedScore");
        const totalScore = searchParams.get("TotalScore");

        // Handle success messages from URL parameters
        if (action === "U") {
          setShowQuestions(false);
        }

        if (action === "U" && source !== "S" && receivedScore && totalScore) {
          showSnackbar(
            `You have successfully submitted. You have received the score: ${receivedScore} out of ${totalScore}.`,
            "success"
          );
          setShowAlreadySubmitted(false);
          setShowExamCompleted(false);
        } else if (action === "U" && source === "S") {
          showSnackbar("You have successfully updated the scores.", "success");
          setShowAlreadySubmitted(false);
          setShowExamCompleted(false);
        }

        // Get student list
        const studentListResponse = await finalExamService.getStudentList(
          user.email || user.username
        );

        if (studentListResponse.isSuccess && studentListResponse.students) {
          const list = studentListResponse.students;
          setStudents(list);

          if (list.length === 0) {
            showSnackbar("No students found for your account.", "warning");
          } else if (list.length === 1) {
            setSelectedStudent(list[0].value);
          } else if (studentName) {
            const matchingStudent = list.find((s) => s.text === studentName);
            if (matchingStudent) {
              setSelectedStudent(matchingStudent.value);
            } else {
              setSelectedStudent("0");
            }
          } else {
            setSelectedStudent("0");
          }

          setShowForm(true);
        } else {
          showSnackbar(
            studentListResponse.errorMessage || "Error loading student list.",
            "error"
          );
        }

        // Load student scores
        await loadStudentScores();

        // If Action=R and Source=S with ChapterID, load sessions for that chapter
        if (action === "R" && source === "S" && chapterID) {
          try {
            const sessionResponse = await finalExamService.getCurrentSession(
              chapterID
            );
            if (sessionResponse.isSuccess && sessionResponse.sessions) {
              setSessions(sessionResponse.sessions);
              if (sessionResponse.sessions.length > 0) {
                setSelectedSession(sessionResponse.sessions[0].session);
              }
            }
          } catch (error) {
            console.error("Error loading sessions from ChapterID:", error);
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        showSnackbar("Error loading data. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, searchParams]);

  // Load sessions when student changes
  useEffect(() => {
    const loadSessions = async () => {
      if (!selectedStudent) return;

      // Don't reload if sessions were already loaded from URL parameters
      const chapterIDParam = searchParams.get("ChapterID");
      const actionParam = searchParams.get("Action");
      const sourceParam = searchParams.get("Source");

      // Skip if sessions already loaded from URL
      if (
        actionParam === "R" &&
        sourceParam === "S" &&
        chapterIDParam &&
        sessions.length > 0
      ) {
        return;
      }

      try {
        const studentInfo = selectedStudent.split("~");
        if (studentInfo.length >= 3) {
          const chapterID = studentInfo[2].trim();
          const sessionResponse = await finalExamService.getCurrentSession(
            chapterID
          );

          if (sessionResponse.isSuccess && sessionResponse.sessions) {
            setSessions(sessionResponse.sessions);
            if (sessionResponse.sessions.length > 0) {
              setSelectedSession(sessionResponse.sessions[0].session);
            }
          }
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
        showSnackbar("Error loading sessions. Please try again.", "error");
      }
    };

    loadSessions();
  }, [selectedStudent]);

  // EnbleScoreUpdate on student/session change (multi-student — FinalExam.aspx.cs)
  useEffect(() => {
    if (loading) return;
    if (students.length <= 1) return;
    if (!selectedStudent || selectedStudent === "0" || !selectedSession) return;

    const validateAccess = async () => {
      try {
        await runScoreValidation(selectedStudent, selectedSession);
      } catch (error) {
        console.error("Error validating exam access:", error);
      }
    };

    validateAccess();
  }, [
    loading,
    students.length,
    selectedStudent,
    selectedSession,
    runScoreValidation,
  ]);

  // Load student scores
  const loadStudentScores = async () => {
    try {
      const scoresResponse = await finalExamService.getStudentScores(
        user.email || user.username
      );

      if (scoresResponse.isSuccess && scoresResponse.scores) {
        setStudentScores(scoresResponse.scores);
      }
    } catch (error) {
      console.error("Error loading student scores:", error);
    }
  };

  // Handle student selection change
  const handleStudentChange = (event) => {
    const value = event.target.value;
    setSelectedStudent(value);
    setShowQuestions(false);
    setQuestions([]);
    setAnswers({});
    setShowNoQuestions(false);
    setShowFormError(false);

    if (!value || value === "0") {
      setShowAlreadySubmitted(false);
      setShowExamCompleted(false);
      setShowForm(true);
    }
  };

  // Handle get answer sheet button click (btnGenerateQuestion_Click)
  const handleGetAnswerSheet = async () => {
    if (!selectedStudent || selectedStudent === "0") {
      setShowFormError(true);
      return;
    }
    if (!selectedSession) {
      showSnackbar("Please select a session.", "warning");
      return;
    }

    setShowFormError(false);

    try {
      setQuestionsLoading(true);

      const canProceed = await runScoreValidation(
        selectedStudent,
        selectedSession
      );
      if (!canProceed) {
        return;
      }

      const studentInfo = selectedStudent.split("~");
      const classValue = studentInfo[0];

      const questionsResponse = await finalExamService.getExamQuestions({
        class: classValue,
        examType: selectedExamType,
        session: selectedSession,
      });

      if (
        questionsResponse.isSuccess &&
        questionsResponse.questions.length > 0
      ) {
        setQuestions(questionsResponse.questions);
        setShowQuestions(true);
        setShowNoQuestions(false);
        setShowAlreadySubmitted(false);
        setShowExamCompleted(false);
        setCanSubmit(true);

        const initialAnswers = {};
        questionsResponse.questions.forEach((q) => {
          initialAnswers[q.question] = "";
        });
        setAnswers(initialAnswers);
      } else {
        setShowQuestions(false);
        setShowNoQuestions(true);
        setShowAlreadySubmitted(false);
        setShowExamCompleted(false);
      }
    } catch (error) {
      console.error("Error getting answer sheet:", error);
      showSnackbar("Error loading questions. Please try again.", "error");
    } finally {
      setQuestionsLoading(false);
    }
  };

  // Handle answer change
  const handleAnswerChange = (questionNumber, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  const handleSubmitClick = () => {
    if (!selectedStudent || selectedStudent === "0") {
      showSnackbar("Please select a student.", "warning");
      return;
    }

    const answeredCount = questions.filter((q) => answers[q.question]).length;
    if (answeredCount === 0) {
      showSnackbar("Please select at least one answer before submitting.", "warning");
      return;
    }

    setSubmitConfirmOpen(true);
  };

  const handleSubmitConfirmClose = () => {
    if (!submitting) {
      setSubmitConfirmOpen(false);
    }
  };

  // Handle submit (btnSubmit_Click — FinalExam.aspx.cs)
  const handleSubmitConfirm = async () => {
    setSubmitConfirmOpen(false);

    try {
      setSubmitting(true);
      const studentInfo = selectedStudent.split("~");
      const classValue = studentInfo[0];
      const studentID = studentInfo[1];

      const answersArray = questions
        .filter((q) => answers[q.question])
        .map((q) => ({
          studentID: parseInt(studentID, 10),
          answerKey: answers[q.question],
          question: Number(q.question),
          class: classValue,
          semester: "",
          points: 0,
          createdDate: new Date().toISOString(),
          examType: selectedExamType,
          session: selectedSession,
        }));

      const submitResponse = await finalExamService.submitExam({
        studentID,
        class: classValue,
        examType: selectedExamType,
        session: selectedSession,
        answers: answersArray,
        scoreID: "0",
      });

      if (submitResponse.isSuccess) {
        const receivedScore = submitResponse.receivedScore ?? "0";
        const totalScore = submitResponse.totalScore ?? "0";

        setShowQuestions(false);
        setCanSubmit(false);
        setShowForm(false);
        setShowExamCompleted(false);
        setShowAlreadySubmitted(false);

        await loadStudentScores();

        navigate(
          `/pstudyware/student/final-exam?Action=U&ReceivedScore=${encodeURIComponent(receivedScore)}&TotalScore=${encodeURIComponent(totalScore)}`,
          { replace: true }
        );
      } else {
        showSnackbar(
          submitResponse.errorMessage || "Error submitting exam.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.errorMessage ||
        error.response?.data?.error;
      showSnackbar(
        apiMessage || "Error submitting exam. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Split questions into 3 groups for display
  const splitQuestionsIntoGroups = () => {
    if (questions.length === 0) return [[], [], []];

    if (questions.length <= 10) {
      return [questions, [], []];
    }

    const totalCount = questions.length;
    const groupSize = Math.ceil(totalCount / 3);

    const group1 = questions.slice(0, groupSize);
    const group2 = questions.slice(groupSize, groupSize * 2);
    const group3 = questions.slice(groupSize * 2);

    return [group1, group2, group3];
  };

  const [group1, group2, group3] = splitQuestionsIntoGroups();

  const renderQuestionRow = (question) => (
    <TableRow key={question.question} sx={{ height: "auto" }}>
      <TableCell
        sx={{
          width: "1%",
          whiteSpace: "nowrap",
          fontWeight: 400,
          px: 0.75,
          py: 0,
          textAlign: "center",
          backgroundColor: LEGACY_INPUT_CAPTION_BG,
          color: "whitesmoke",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        Question # {question.question}
      </TableCell>
      <TableCell
        sx={{
          py: "0 !important",
          pl: 6,
          pr: 3,
          backgroundColor: LEGACY_INPUTBOX_BG,
          color: LEGACY_BODY_COLOR,
        }}
      >
        <RadioGroup
          row
          value={answers[question.question] || ""}
          onChange={(e) =>
            handleAnswerChange(question.question, e.target.value)
          }
          sx={{
            flexWrap: "nowrap",
            gap: 0,
            m: 0,
            p: 0,
            minHeight: 0,
            lineHeight: 1,
          }}
        >
          {["A", "B", "C", "D"].map((option) => (
            <FormControlLabel
              key={option}
              value={option}
              control={<Radio />}
              label={option}
              sx={compactRadioLabelSx}
            />
          ))}
        </RadioGroup>
      </TableCell>
    </TableRow>
  );

  const renderQuestionGroup = (items, title) => {
    if (items.length === 0) return null;
    return (
      <Grid size={{ xs: 12, md: questions.length > 10 ? 4 : 12 }}>
        <Paper elevation={0} sx={answerSheetGroupPaperSx}>
          <Box sx={answerSheetGroupHeaderSx}>{title}</Box>
          <Table size="small" sx={examQuestionTableSx}>
            <TableBody>{items.map(renderQuestionRow)}</TableBody>
          </Table>
        </Paper>
      </Grid>
    );
  };

  // Auto-load answer sheet when only one student (legacy FinalExam.aspx behavior)
  useEffect(() => {
    if (
      !loading &&
      students.length === 1 &&
      selectedStudent &&
      selectedSession &&
      !showQuestions &&
      !showAlreadySubmitted &&
      !questionsLoading
    ) {
      handleGetAnswerSheet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, students.length, selectedStudent, selectedSession]);

  if (loading) {
    return (
      <Box className="student-dashboard final-exam-page">
        <StudentHeader user={user} />
        <Container maxWidth="xl" sx={{ pt: STUDENT_HEADER_SPACER }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
            gap={2}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="textSecondary">
              Loading Final Exam...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box className="student-dashboard final-exam-page">
      <StudentHeader user={user} />
      <Container maxWidth="xl" sx={{ pt: STUDENT_HEADER_SPACER, mb: 4, mt: 0 }}>
        {/* Instructions — legacy green panel above Answer Sheet */}
        {showForm && (
          <Paper
            className="final-exam-instructions"
            elevation={0}
            sx={{ ...answerSheetPanelSx, mb: 2 }}
          >
            <Box sx={answerSheetTitleSx}>On Line Exam</Box>
            <Box sx={legacyInstructionBodySx}>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 1:</strong> Download the questions (Quiz, Classwork,
                Homework, Final exam) and answer each question carefully.{" "}
                <Link
                  href="/pstudyware/student/class-material"
                  sx={legacyInstructionLinkSx}
                >
                  Click here to download the Questions (Quiz, Classwork, Homework,
                  Final exam).
                </Link>
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 2:</strong> Select the student from the list. (If you
                have multiple kids enrolled, pay attention to the Student Name,
                Session and Exam Type from the dropdown menu. You will only be able
                to submit your answers once and they cannot be changed.)
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 3:</strong> Select the Correct Answer. If you did not
                know the answer, skip it so you don&apos;t waste time.
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 4:</strong> Click the submit button after updating all
                answers. Do not forget this step.
              </Typography>
              <Typography component="p" sx={{ ...legacyInstructionStepSx, mb: 1.5 }}>
                <strong>Step 5:</strong> The answer sheet update option will be
                disabled after you submitted. You can submit only one time. If you
                have any questions, please contact us via Message Center.
              </Typography>

              {showFormError && (
                <Alert severity="error" sx={{ mb: 1.5, py: 0.5 }}>
                  Please Select Student.
                </Alert>
              )}

              {students.length === 0 ? (
                <Alert severity="info" sx={{ backgroundColor: "#edfce9" }}>
                  No students found for your account. Please contact support if you
                  believe this is an error.
                </Alert>
              ) : (
                <Box sx={legacyFormRowSx}>
                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Student Name</Box>
                    <Box sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedStudent}
                          onChange={handleStudentChange}
                          displayEmpty
                          sx={legacyInputSelectInlineSx}
                        >
                          {students.length > 1 && (
                            <MenuItem value="0">Select Student</MenuItem>
                          )}
                          {students.map((student, index) => (
                            <MenuItem key={index} value={student.value}>
                              {student.text}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Session</Box>
                    <Box sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedSession}
                          onChange={(e) => setSelectedSession(e.target.value)}
                          sx={legacyInputSelectInlineSx}
                        >
                          {sessions.map((session, index) => (
                            <MenuItem key={index} value={session.session}>
                              {session.session}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Exam Type</Box>
                    <Box sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedExamType}
                          disabled
                          sx={legacyInputSelectInlineSx}
                        >
                          <MenuItem value={EXAM_TYPE}>{EXAM_TYPE}</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleGetAnswerSheet}
                    disabled={questionsLoading}
                    sx={legacyGetAnswerSheetButtonSx}
                  >
                    {questionsLoading ? "Loading..." : "Get Answer Sheet"}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {/* No Questions Available Message */}
        {showNoQuestions && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                No answer sheet available for the selected options.
              </strong>
            </Typography>
          </Alert>
        )}

        {/* Already Submitted Message */}
        {showAlreadySubmitted && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                You have already submitted. You can't submit more than one time.
                Here is your score. If you have a question, please contact us
                via Message Center.
              </strong>
            </Typography>
          </Alert>
        )}

        {/* Exam Completed Message */}
        {showExamCompleted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                You have already taken the Exam. You can't take the Exam more
                than one time. Here is your Exam Score. If you have a question,
                please contact us via Message Center.
              </strong>
            </Typography>
          </Alert>
        )}

        {/* Questions Display */}
        {showQuestions && questions.length > 0 && (
          <Card
            className="final-exam-answer-sheet"
            sx={{ ...adminSessionListPanelCardSx, mb: 2 }}
          >
            <CardContent sx={adminSessionListPanelContentSx}>
              <Typography
                variant="subtitle1"
                sx={{ ...adminSessionListTitleSx, mb: 1.5 }}
              >
                Answer Sheet
              </Typography>

              <Grid container spacing={1.5}>
                {renderQuestionGroup(group1, "Group 1")}
                {renderQuestionGroup(group2, "Group 2")}
                {renderQuestionGroup(group3, "Group 3")}
              </Grid>

              {/* Submit Button */}
              {canSubmit && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {submitting && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Your answers are being processed. Please wait and do not
                      click the Submit button again.
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSubmitClick}
                    disabled={submitting}
                    sx={legacySubmitButtonSx}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Student Scores Table */}
        {studentScores.length > 0 && (
          <FinalExamScoresGrid scores={studentScores} />
        )}
      </Container>

      <AppConfirmDialog
        open={submitConfirmOpen}
        onClose={handleSubmitConfirmClose}
        onConfirm={handleSubmitConfirm}
        title="Confirm Submit"
        message="Are you sure you want to submit your answers?"
        confirmLabel="Submit"
        icon={<SendIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
      />

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinalExam;
