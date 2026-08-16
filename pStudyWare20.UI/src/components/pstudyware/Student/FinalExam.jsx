import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Button,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import ResponsiveTableContainer from "../Common/ResponsiveTableContainer";
import { Send as SendIcon } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import finalExamService from "../../../services/finalExamService";
import {
  getStudentListItemText,
  getStudentListItemValue,
  getSessionLabel,
  parseStudentDropdownValue,
  buildFinalExamSubmitSuccessUrl,
  formatExamSubmitSuccessMessage,
  splitQuestionsIntoGroups,
} from "../../../utils/studentChapterRouting";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import FinalExamScoresGrid from "./FinalExamScoresGrid";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/StudentDashboard.css";

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
  minWidth: { xs: 0, md: 140 },
  width: "100%",
  maxWidth: "100%",
  "& .MuiSelect-select": {
    ...legacyInputSelectSx["& .MuiSelect-select"],
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
  },
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
  mr: 0,
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

const answerSheetOptionCellSx = (isFirst) => ({
  display: "flex",
  alignItems: "center",
  alignSelf: "stretch",
  borderLeft: isFirst ? "none" : `1px solid ${LEGACY_TABLE_BORDER}`,
  px: 0.85,
  py: 0.25,
});

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

const parseStudentValue = parseStudentDropdownValue;

const isScoreUpdateEnabled = (response) =>
  response?.enableScoreUpdate ?? response?.EnableScoreUpdate ?? false;

const FinalExam = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  // Student and exam selection state
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState("");
  const EXAM_TYPE = "Final Exam";
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
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [showFinalExamUnavailable, setShowFinalExamUnavailable] =
    useState(false);

  const studentChangeReadyRef = useRef(false);
  const pageInitKeyRef = useRef("");
  const skipNextSessionLoadRef = useRef(false);
  const pendingAutoBindQuestionsRef = useRef(false);

  const applyScoreValidationResult = useCallback(
    (validationResponse) => {
      const action = searchParams.get("Action") || "";

      if (
        !validationResponse?.isSuccess ||
        !isScoreUpdateEnabled(validationResponse)
      ) {
        setShowQuestions(false);
        setQuestions([]);
        setAnswers({});
        setShowNoQuestions(false);
        if (action !== "U") {
          setShowAlreadySubmitted(true);
        }
        return false;
      }

      setShowAlreadySubmitted(false);
      setShowForm(true);
      return true;
    },
    [searchParams],
  );

  const runScoreValidation = useCallback(
    async (studentValue, session, examType = selectedExamType) => {
      const { classCode, studentId } = parseStudentValue(studentValue);

      if (!studentId || !session) {
        return false;
      }

      const validationResponse = await finalExamService.validateScoreUpdate({
        studentID: parseInt(studentId, 10),
        session,
        class: classCode,
        examType,
      });

      if (!validationResponse?.isSuccess && validationResponse?.errorMessage) {
        showSnackbar(validationResponse.errorMessage, "error");
      }

      return applyScoreValidationResult(validationResponse);
    },
    [applyScoreValidationResult, selectedExamType],
  );

  // Legacy OnlineExam.aspx.cs BindQuestions()
  const loadAnswerSheet = useCallback(
    async (studentValue, session, examType = selectedExamType) => {
      if (!studentValue || !session || !examType) {
        return false;
      }

      const { classCode, studentId } = parseStudentValue(studentValue);
      if (!classCode || !studentId) {
        return false;
      }

      try {
        setQuestionsLoading(true);
        const questionsResponse = await finalExamService.getExamQuestions({
          studentID: parseInt(studentId, 10),
          class: classCode,
          examType,
          session,
        });

        if (!questionsResponse?.isSuccess) {
          setShowQuestions(false);
          setShowNoQuestions(false);
          showSnackbar(
            questionsResponse?.errorMessage ||
              "You are not eligible to load this answer sheet.",
            "error",
          );
          return false;
        }

        if (
          questionsResponse.questions?.length > 0
        ) {
          setQuestions(questionsResponse.questions);
          setShowQuestions(true);
          setShowNoQuestions(false);
          setShowAlreadySubmitted(false);
          setCanSubmit(true);

          const initialAnswers = {};
          questionsResponse.questions.forEach((q) => {
            initialAnswers[q.question] = "";
          });
          setAnswers(initialAnswers);
          return true;
        }

        setShowQuestions(false);
        setShowNoQuestions(true);
        setShowAlreadySubmitted(false);
        return false;
      } catch (error) {
        console.error("Error loading answer sheet:", error);
        showSnackbar("Error loading questions. Please try again.", "error");
        return false;
      } finally {
        setQuestionsLoading(false);
      }
    },
    [selectedExamType],
  );

  const loadStudentScores = useCallback(async () => {
    if (!user) return;
    try {
      const scoresResponse = await finalExamService.getStudentScores();

      if (scoresResponse.isSuccess && scoresResponse.scores) {
        setStudentScores(scoresResponse.scores);
      }
    } catch (error) {
      console.error("Error loading student scores:", error);
    }
  }, [user]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      const action = searchParams.get("Action") || "";
      const source = searchParams.get("Source") || "";
      const studentName = searchParams.get("Student") || "";
      const chapterID = searchParams.get("ChapterID") || "";
      const receivedScore = searchParams.get("ReceivedScore") || "";
      const totalScore = searchParams.get("TotalScore") || "";

      const initKey = [
        user.username || user.email,
        studentName,
        action,
        source,
        chapterID,
        receivedScore,
        totalScore,
      ].join("|");

      if (pageInitKeyRef.current === initKey) {
        return;
      }
      pageInitKeyRef.current = initKey;
      studentChangeReadyRef.current = false;

      try {
        setLoading(true);

        // Legacy FinalExam.aspx?Action=U&ReceivedScore=…&TotalScore=… (divMessage)
        if (action === "U" && source !== "S" && receivedScore && totalScore) {
          setSubmitSuccess({ receivedScore, totalScore });
          setShowAlreadySubmitted(false);
          setShowQuestions(false);
          setCanSubmit(false);
        } else if (action === "U" && source === "S") {
          showSnackbar("You have successfully updated the scores.", "success");
          setShowAlreadySubmitted(false);
        } else if (action !== "U") {
          setSubmitSuccess(null);
        }

        const availabilityResponse =
          await finalExamService.getExamAvailability();
        const finalExamAvailable =
          availabilityResponse?.isSuccess !== false &&
          (availabilityResponse?.showFinalExam === true ||
            availabilityResponse?.ShowFinalExam === true);

        if (!finalExamAvailable) {
          setShowFinalExamUnavailable(true);
          setShowForm(false);
          setShowQuestions(false);
          setCanSubmit(false);
          await loadStudentScores();
          return;
        }

        setShowFinalExamUnavailable(false);

        if (action === "R" && source === "S") {
          setShowForm(true);
          setShowAlreadySubmitted(false);
          setShowNoQuestions(false);
          // Legacy Page_Load: EnbleScoreUpdate then BindQuestions when score window open
          pendingAutoBindQuestionsRef.current = true;
        }

        // Get student list
        const studentListResponse = await finalExamService.getStudentList();

        let list = [];
        if (studentListResponse.isSuccess && studentListResponse.students) {
          list = studentListResponse.students;
          setStudents(list);

          if (list.length === 0) {
            setShowForm(false);
            setShowFinalExamUnavailable(true);
          } else if (list.length === 1) {
            setSelectedStudent(getStudentListItemValue(list[0]));
          } else if (studentName) {
            const matchingStudent = list.find(
              (s) => getStudentListItemText(s) === studentName,
            );
            if (matchingStudent) {
              setSelectedStudent(getStudentListItemValue(matchingStudent));
            }
          }

          setShowForm(true);
        } else {
          showSnackbar(
            studentListResponse.errorMessage || "Error loading student list.",
            "error",
          );
        }

        // Load student scores
        await loadStudentScores();

        let sessionChapterId = chapterID;
        if (!sessionChapterId && list?.length) {
          const selected =
            list.find((s) => getStudentListItemText(s) === studentName) ??
            list[0];
          sessionChapterId = parseStudentValue(
            getStudentListItemValue(selected),
          ).chapterId;
        }

        if (sessionChapterId) {
          try {
            const sessionResponse =
              await finalExamService.getCurrentSession(sessionChapterId);
            if (sessionResponse.isSuccess && sessionResponse.sessions) {
              setSessions(sessionResponse.sessions);
              const firstSession = getSessionLabel(sessionResponse.sessions[0]);
              if (firstSession) {
                setSelectedSession(firstSession);
              }
            }
            skipNextSessionLoadRef.current = true;
          } catch (error) {
            console.error("Error loading sessions:", error);
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        showSnackbar("Error loading data. Please try again.", "error");
      } finally {
        setLoading(false);
        studentChangeReadyRef.current = true;
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, searchParams, loadStudentScores]);

  // Load sessions when student changes (skip during initial page load — init handles URL ChapterID)
  useEffect(() => {
    if (!studentChangeReadyRef.current || loading || !selectedStudent) {
      return;
    }

    if (skipNextSessionLoadRef.current) {
      skipNextSessionLoadRef.current = false;
      return;
    }

    const loadSessions = async () => {
      const { chapterId } = parseStudentValue(selectedStudent);
      if (!chapterId) return;

      try {
        const sessionResponse =
          await finalExamService.getCurrentSession(chapterId);

        if (sessionResponse.isSuccess && sessionResponse.sessions) {
          setSessions(sessionResponse.sessions);
          const firstSession = getSessionLabel(sessionResponse.sessions[0]);
          setSelectedSession(firstSession || "");
        }
      } catch (error) {
        console.error("Error loading sessions:", error);
        showSnackbar("Error loading sessions. Please try again.", "error");
      }
    };

    loadSessions();
  }, [selectedStudent, loading]);

  // Legacy OnlineExam.aspx.cs EnbleScoreUpdate on student/session/exam type change
  useEffect(() => {
    if (loading || !isAuthenticated || !selectedStudent || !selectedSession) {
      return;
    }

    const validateAccess = async () => {
      try {
        const canUpdate = await runScoreValidation(
          selectedStudent,
          selectedSession,
        );
        if (!canUpdate) {
          pendingAutoBindQuestionsRef.current = false;
          await loadStudentScores();
          return;
        }

        // Legacy Page_Load BindQuestions() after EnbleScoreUpdate when Source=S Action=R
        if (pendingAutoBindQuestionsRef.current) {
          pendingAutoBindQuestionsRef.current = false;
          await loadAnswerSheet(selectedStudent, selectedSession);
        }
      } catch (error) {
        console.error("Error validating exam access:", error);
        pendingAutoBindQuestionsRef.current = false;
      }
    };

    validateAccess();
  }, [
    loading,
    isAuthenticated,
    selectedStudent,
    selectedSession,
    selectedExamType,
    runScoreValidation,
    loadStudentScores,
    loadAnswerSheet,
  ]);

  const resetQuestionState = () => {
    setShowQuestions(false);
    setQuestions([]);
    setAnswers({});
    setCanSubmit(false);
    setShowNoQuestions(false);
  };

  const handleStudentChange = (event) => {
    if (!studentChangeReadyRef.current) {
      return;
    }

    const value = event.target.value;
    if (value === selectedStudent) {
      return;
    }

    setSelectedStudent(value);
    resetQuestionState();
    setShowAlreadySubmitted(false);
  };

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
    resetQuestionState();
    setShowAlreadySubmitted(false);
  };

  // Handle get answer sheet button click
  const handleGetAnswerSheet = async () => {
    if (!selectedStudent || selectedStudent === "0") {
      showSnackbar("Please select a student.", "warning");
      return;
    }
    if (!selectedSession) {
      showSnackbar("Please select a session.", "warning");
      return;
    }

    const canProceed = await runScoreValidation(
      selectedStudent,
      selectedSession,
    );
    if (!canProceed) {
      await loadStudentScores();
      return;
    }

    await loadAnswerSheet(selectedStudent, selectedSession);
  };

  // Handle answer change
  const handleAnswerChange = (questionNumber, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: value,
    }));
  };

  // Handle submit
  const handleSubmit = () => {
    setSubmitConfirmOpen(true);
  };

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
          question: q.question,
          class: classValue,
          semester: "",
          points: 0,
          createdDate: new Date().toISOString(),
          examType: selectedExamType,
          session: selectedSession,
        }));

      const submitData = {
        studentID: studentID,
        class: classValue,
        examType: selectedExamType,
        session: selectedSession,
        answers: answersArray,
        scoreID: "0",
      };

      const submitResponse = await finalExamService.submitExam(submitData);

      if (submitResponse.isSuccess) {
        const receivedScore =
          submitResponse.receivedScore ?? submitResponse.ReceivedScore ?? "";
        const totalScore =
          submitResponse.totalScore ?? submitResponse.TotalScore ?? "";

        setSubmitSuccess({ receivedScore, totalScore });
        setShowQuestions(false);
        setCanSubmit(false);
        setShowAlreadySubmitted(false);
        navigate(buildFinalExamSubmitSuccessUrl(receivedScore, totalScore), {
          replace: true,
        });
        await loadStudentScores();
      } else {
        showSnackbar(
          submitResponse.errorMessage || "Error submitting exam.",
          "error",
        );
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      showSnackbar("Error submitting exam. Please try again.", "error");
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

  const [group1, group2, group3] = splitQuestionsIntoGroups(questions);

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
            alignItems: "stretch",
          }}
        >
          {["A", "B", "C", "D"].map((option, index) => (
            <Box key={option} sx={answerSheetOptionCellSx(index === 0)}>
              <FormControlLabel
                value={option}
                control={<Radio />}
                label={option}
                sx={compactRadioLabelSx}
              />
            </Box>
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
          <ResponsiveTableContainer component={Box} minWidth={320}>
            <Table size="small" sx={examQuestionTableSx}>
              <TableBody>{items.map(renderQuestionRow)}</TableBody>
            </Table>
          </ResponsiveTableContainer>
        </Paper>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box className="student-dashboard final-exam-page">
        <StudentHeader user={user} />
        <StudentRoleHeaderSpacer />
        <Container maxWidth="xl">
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
      <StudentRoleHeaderSpacer />

      <Container maxWidth="xl" sx={{ mb: 4, mt: 0 }}>
        {showFinalExamUnavailable && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                The Final Exam is not available for any students on your account
                at this time.
              </strong>{" "}
              This may be because the exam is closed for this semester or is only
              open for certain chapters. Please check your dashboard for updates
              or contact us via Message Center if you have questions.
            </Typography>
          </Alert>
        )}

        {showForm && (
          <Paper
            className="final-exam-instructions"
            elevation={0}
            sx={{ ...answerSheetPanelSx, mb: 2 }}
          >
            <Box sx={answerSheetTitleSx}>Final Exam</Box>
            <Box sx={legacyInstructionBodySx}>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 1:</strong> Download the Final Exam questions and
                answer each question carefully.{" "}
                <Link
                  href="/pstudyware/student/class-material"
                  sx={legacyInstructionLinkSx}
                >
                  Click here to download the Final Exam questions.
                </Link>
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 2:</strong> Select the student from the list. Only
                students in chapters where the Final Exam is open for this
                semester are shown. (If you have multiple kids enrolled, pay
                attention to the Student Name and Session from the dropdown
                menu. You will only be able to submit your answers once and they
                cannot be changed.)
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 3:</strong> Select the Correct Answer. If you did
                not know the answer, skip it so you don&apos;t waste time.
              </Typography>
              <Typography component="p" sx={legacyInstructionStepSx}>
                <strong>Step 4:</strong> Click the submit button after updating
                all answers. Do not forget this step.
              </Typography>
              <Typography
                component="p"
                sx={{ ...legacyInstructionStepSx, mb: 1.5 }}
              >
                <strong>Step 5:</strong> The answer sheet update option will be
                disabled after you submitted. You can submit only one time. If
                you have any questions, please contact us via Message Center.
              </Typography>

              {students.length === 0 ? (
                <Alert severity="info" sx={{ backgroundColor: "#edfce9" }}>
                  No students on your account are eligible for the Final Exam
                  this semester. Please contact support if you believe this is
                  an error.
                </Alert>
              ) : (
                <Box sx={legacyFormRowSx}>
                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Student Name</Box>
                    <Box
                      sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}
                    >
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedStudent}
                          onChange={handleStudentChange}
                          displayEmpty
                          sx={legacyInputSelectInlineSx}
                        >
                          {students.length > 1 && (
                            <MenuItem value="">Select Student</MenuItem>
                          )}
                          {students.map((student) => {
                            const studentValue =
                              getStudentListItemValue(student);
                            return (
                              <MenuItem key={studentValue} value={studentValue}>
                                {getStudentListItemText(student)}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Session</Box>
                    <Box
                      sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}
                    >
                      <FormControl size="small" fullWidth>
                        <Select
                          value={selectedSession}
                          onChange={handleSessionChange}
                          sx={legacyInputSelectInlineSx}
                        >
                          {sessions.map((session, index) => {
                            const sessionLabel = getSessionLabel(session);
                            return (
                              <MenuItem
                                key={`${sessionLabel}-${index}`}
                                value={sessionLabel}
                              >
                                {sessionLabel}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  <Box sx={legacyFormGroupSx}>
                    <Box sx={legacyFormCaptionCellSx}>Exam Type</Box>
                    <Box
                      sx={{ ...legacyFormFieldCellSx, flex: 1, minWidth: 0 }}
                    >
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
                    disabled={questionsLoading || showAlreadySubmitted}
                    sx={legacyGetAnswerSheetButtonSx}
                  >
                    {questionsLoading ? "Loading..." : "Get Answer Sheet"}
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {showNoQuestions && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                No answer sheet available for the selected options.
              </strong>
            </Typography>
          </Alert>
        )}

        {showAlreadySubmitted && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1">
              <strong>
                You have already submitted. You can&apos;t submit more than one
                time. Here is your score. If you have a question, please contact
                us via Message Center.
              </strong>
            </Typography>
          </Alert>
        )}

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="body1">
              {formatExamSubmitSuccessMessage(
                submitSuccess.receivedScore,
                submitSuccess.totalScore,
              )}
            </Typography>
          </Alert>
        )}

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
                    onClick={handleSubmit}
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

        <FinalExamScoresGrid scores={studentScores} />
      </Container>

      <AppConfirmDialog
        open={submitConfirmOpen}
        onClose={() => {
          if (!submitting) {
            setSubmitConfirmOpen(false);
          }
        }}
        onConfirm={handleSubmitConfirm}
        title="Confirm Submit"
        message="Are you sure you want to submit your answers?"
        confirmLabel="Submit"
        icon={<SendIcon sx={{ fontSize: 20 }} />}
        loading={submitting}
      />

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
