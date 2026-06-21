import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Alert,
  Snackbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Divider,
  Link,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import onlineExamService from "../../../services/onlineExamService";
import StudentHeader from "./StudentHeader";
import FinalExamScoresGrid from "./FinalExamScoresGrid";
import AppConfirmDialog from "../Common/AppConfirmDialog";
import SendIcon from "@mui/icons-material/Send";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

const portalCardSx = {
  backgroundColor: "white",
  borderRadius: 2,
  boxShadow: PORTAL_CARD_BOX_SHADOW,
  overflow: "hidden",
  ...portalCardAntiLiftSx,
};

const fieldSx = {
  "& .MuiInputBase-root": {
    fontSize: "0.75rem",
    backgroundColor: "#fff",
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.75rem",
    maxWidth: "calc(100% - 32px)",
  },
  "& .MuiSelect-select": {
    fontSize: "0.75rem",
  },
};

const menuItemSx = { fontSize: "0.75rem" };

const primaryButtonSx = {
  backgroundColor: "#174a10",
  fontSize: "0.75rem",
  textTransform: "none",
  fontWeight: 600,
  px: 2,
  py: 0.75,
  whiteSpace: "nowrap",
  "&:hover": {
    backgroundColor: "#0f3209",
  },
};

const instructionTextSx = { fontSize: "0.875rem", color: "#666" };
const alertTextSx = { fontSize: "0.875rem" };
const sectionTitleSx = { ...adminSessionListTitleSx, mb: 1 };
const groupHeaderSx = {
  backgroundColor: "#174a10",
  color: "white",
  p: 0.75,
  mb: 1.5,
  fontSize: "0.875rem",
  fontWeight: 600,
};
const questionBoxSx = {
  mb: 1.5,
  p: 1.5,
  border: "1px solid #ddd",
  borderRadius: 1,
};
const questionLegendSx = { fontSize: "0.75rem", fontWeight: 600 };
const questionChoiceSx = {
  "& .MuiFormControlLabel-label": { fontSize: "0.75rem" },
};

const OnlineExam = () => {
  const { user, isAuthenticated } = useAuth();
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
  const [examTypes] = useState([
    "Quiz",
    "Class Work",
    "Home Work",
    "Mock Test",
    "Final Exam",
  ]);
  const [selectedExamType, setSelectedExamType] = useState("Quiz");

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
        const studentListResponse = await onlineExamService.getStudentList(
          user.email || user.username
        );

        console.log("OnlineExam: Student list response", studentListResponse);

        if (studentListResponse.isSuccess && studentListResponse.studentList) {
          setStudents(studentListResponse.studentList);

          if (studentListResponse.studentList.length === 0) {
            showSnackbar("No students found for your account.", "warning");
          } else {
            // Pre-select student from URL parameter if provided
            if (studentName && studentListResponse.studentList.length > 0) {
              const matchingStudent = studentListResponse.studentList.find(
                (s) => s.text === studentName
              );
              if (matchingStudent) {
                setSelectedStudent(matchingStudent.value);
              } else if (studentListResponse.studentList.length > 0) {
                setSelectedStudent(studentListResponse.studentList[0].value);
              }
            } else if (studentListResponse.studentList.length > 0) {
              setSelectedStudent(studentListResponse.studentList[0].value);
            }
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
            const sessionResponse = await onlineExamService.getCurrentSession(
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
          const sessionResponse = await onlineExamService.getCurrentSession(
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

  // Load student scores
  const loadStudentScores = async () => {
    try {
      const scoresResponse = await onlineExamService.getStudentScores(
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
    setSelectedStudent(event.target.value);
    setShowQuestions(false);
    setQuestions([]);
    setAnswers({});
    setShowNoQuestions(false);
    setShowAlreadySubmitted(false);
    setShowExamCompleted(false);
  };

  // Handle get answer sheet button click
  const handleGetAnswerSheet = async () => {
    if (!selectedStudent || !selectedSession || !selectedExamType) {
      showSnackbar("Please select all required fields.", "warning");
      return;
    }

    try {
      setQuestionsLoading(true);
      const studentInfo = selectedStudent.split("~");
      const classValue = studentInfo[0];
      const studentID = parseInt(studentInfo[1]);

      // First validate if score update is enabled
      const validationResponse = await onlineExamService.validateScoreUpdate({
        studentID: studentID,
        session: selectedSession,
        class: classValue,
        examType: selectedExamType,
      });

      if (!validationResponse.isSuccess) {
        showSnackbar("Error validating exam access.", "error");
        setShowQuestions(false);
        setShowAlreadySubmitted(true);
        return;
      }

      if (!validationResponse.enableScoreUpdate) {
        setShowQuestions(false);
        setShowAlreadySubmitted(true);
        setShowNoQuestions(false);
        setShowExamCompleted(false);
        return;
      }

      // If validation passed, get questions
      const questionsResponse = await onlineExamService.getOnlineExamQuestions({
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

        // Initialize answers object
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

      // Prepare answers array
      const answersArray = questions.map((q) => ({
        studentID: parseInt(studentID),
        answerKey: answers[q.question] || "",
        question: q.question,
        class: classValue,
        currentSemester: "", // Will be set by backend
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

      const submitResponse = await onlineExamService.submitOnlineExam(
        submitData
      );

      if (submitResponse.isSuccess) {
        showSnackbar(
          `You have successfully submitted. You received ${submitResponse.receivedScore} out of ${submitResponse.totalScore}.`,
          "success"
        );
        setShowQuestions(false);
        setCanSubmit(false);
        setShowExamCompleted(true);
        // Reload scores
        await loadStudentScores();
      } else {
        showSnackbar(
          submitResponse.errorMessage || "Error submitting exam.",
          "error"
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

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <Box sx={{ height: "48px" }} aria-hidden />

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={portalCardSx}>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ ...adminSessionListTitleSx, mb: 0.5 }}
                  >
                    Update Score
                  </Typography>
                </Box>

                <Box sx={{ px: 2, pb: 2 }}>
        {/* Instructions */}
        {showForm && (
          <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={sectionTitleSx}>
                Instructions
              </Typography>
              <Box sx={{ "& p": { mb: 1 } }}>
                <Typography variant="body2" paragraph sx={instructionTextSx}>
                  <strong>Step 1:</strong> Download the questions (Quiz,
                  Classwork, Homework, Final exam) and answer each question
                  carefully.{" "}
                  <Link
                    href="/pstudyware/student/class-material"
                    sx={{ color: "#174a10", fontWeight: 700 }}
                  >
                    Click here to download the Questions (Quiz, Classwork,
                    Homework, Final exam).
                  </Link>
                </Typography>
                <Typography variant="body2" paragraph sx={instructionTextSx}>
                  <strong>Step 2:</strong> Select the student from the list. (If
                  you have multiple kids enrolled, pay attention to the Student
                  Name, Session and Exam Type from the dropdown menu. You will
                  only be able to submit your answers once and they cannot be
                  changed.)
                </Typography>
                <Typography variant="body2" paragraph sx={instructionTextSx}>
                  <strong>Step 3:</strong> Select the Correct Answer. If you did
                  not know the answer, skip it so you don't waste time.
                </Typography>
                <Typography variant="body2" paragraph sx={instructionTextSx}>
                  <strong>Step 4:</strong> Click the submit button after
                  updating all answers. Do not forget this step.
                </Typography>
                <Typography variant="body2" paragraph sx={instructionTextSx}>
                  <strong>Step 5:</strong> The answer sheet update option will
                  be disabled after you submitted. You can submit only one time.
                  If you have any questions, please contact us via Message
                  Center.
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Student Selection Form */}
              {loading ? (
                <Alert severity="info" sx={{ mb: 2, width: "100%", fontSize: "0.875rem" }}>
                  Loading students...
                </Alert>
              ) : students.length === 0 ? (
                <Alert severity="info" sx={{ mb: 2, width: "100%", fontSize: "0.875rem" }}>
                  No students found for your account. Please contact support if
                  you believe this is an error.
                </Alert>
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#f4fbf5",
                    border: "1px solid #dbeedc",
                    borderRadius: 2,
                    p: { xs: 2, md: 2.5 },
                  }}
                >
                <Grid container spacing={1.5} alignItems="center">
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                      <InputLabel>Student Name</InputLabel>
                      <Select
                        value={selectedStudent}
                        onChange={handleStudentChange}
                        label="Student Name"
                        disabled={loading}
                      >
                        {students.map((student, index) => (
                          <MenuItem key={index} value={student.value} sx={menuItemSx}>
                            {student.text}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                      <InputLabel>Session</InputLabel>
                      <Select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        label="Session"
                        disabled={loading}
                      >
                        {sessions.map((session, index) => (
                          <MenuItem key={index} value={session.session} sx={menuItemSx}>
                            {session.session}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small" sx={fieldSx}>
                      <InputLabel>Exam Type</InputLabel>
                      <Select
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        label="Exam Type"
                        disabled={loading}
                      >
                        {examTypes.map((type, index) => (
                          <MenuItem key={index} value={type} sx={menuItemSx}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid size={{ xs: 12, md: 2 }}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleGetAnswerSheet}
                      disabled={loading || questionsLoading}
                      sx={{
                        ...primaryButtonSx,
                        width: "100%",
                      }}
                    >
                      {questionsLoading ? "Loading..." : "Get Answer Sheet"}
                    </Button>
                  </Grid>
                </Grid>
                </Box>
              )}
          </Box>
        )}

        {/* No Questions Available Message */}
        {showNoQuestions && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography sx={alertTextSx}>
              <strong>
                No answer sheet available for the selected options.
              </strong>
            </Typography>
          </Alert>
        )}

        {/* Already Submitted Message */}
        {showAlreadySubmitted && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography sx={alertTextSx}>
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
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography sx={alertTextSx}>
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
          <Box sx={{ mb: 1, pt: 2, borderTop: "1px solid #e0e0e0" }}>
              <Typography variant="subtitle1" sx={sectionTitleSx}>
                Answer Sheet
              </Typography>

              <Grid container spacing={2}>
                {/* Group 1 */}
                {group1.length > 0 && (
                  <Grid size={{ xs: 12, md: questions.length > 10 ? 4 : 12 }}>
                    <Paper elevation={1} sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" sx={groupHeaderSx}>
                        Group 1
                      </Typography>
                      {group1.map((question) => (
                        <Box key={question.question} sx={questionBoxSx}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" sx={questionLegendSx}>
                              Question # {question.question}
                            </FormLabel>
                            <RadioGroup
                              row
                              value={answers[question.question] || ""}
                              onChange={(e) =>
                                handleAnswerChange(
                                  question.question,
                                  e.target.value
                                )
                              }
                            >
                              <FormControlLabel
                                value="A"
                                control={<Radio size="small" />}
                                label="A"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="B"
                                control={<Radio size="small" />}
                                label="B"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="C"
                                control={<Radio size="small" />}
                                label="C"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="D"
                                control={<Radio size="small" />}
                                label="D"
                                sx={questionChoiceSx}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}

                {/* Group 2 */}
                {group2.length > 0 && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={1} sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" sx={groupHeaderSx}>
                        Group 2
                      </Typography>
                      {group2.map((question) => (
                        <Box key={question.question} sx={questionBoxSx}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" sx={questionLegendSx}>
                              Question # {question.question}
                            </FormLabel>
                            <RadioGroup
                              row
                              value={answers[question.question] || ""}
                              onChange={(e) =>
                                handleAnswerChange(
                                  question.question,
                                  e.target.value
                                )
                              }
                            >
                              <FormControlLabel
                                value="A"
                                control={<Radio size="small" />}
                                label="A"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="B"
                                control={<Radio size="small" />}
                                label="B"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="C"
                                control={<Radio size="small" />}
                                label="C"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="D"
                                control={<Radio size="small" />}
                                label="D"
                                sx={questionChoiceSx}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}

                {/* Group 3 */}
                {group3.length > 0 && (
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={1} sx={{ p: 1.5 }}>
                      <Typography variant="subtitle2" sx={groupHeaderSx}>
                        Group 3
                      </Typography>
                      {group3.map((question) => (
                        <Box key={question.question} sx={questionBoxSx}>
                          <FormControl component="fieldset">
                            <FormLabel component="legend" sx={questionLegendSx}>
                              Question # {question.question}
                            </FormLabel>
                            <RadioGroup
                              row
                              value={answers[question.question] || ""}
                              onChange={(e) =>
                                handleAnswerChange(
                                  question.question,
                                  e.target.value
                                )
                              }
                            >
                              <FormControlLabel
                                value="A"
                                control={<Radio size="small" />}
                                label="A"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="B"
                                control={<Radio size="small" />}
                                label="B"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="C"
                                control={<Radio size="small" />}
                                label="C"
                                sx={questionChoiceSx}
                              />
                              <FormControlLabel
                                value="D"
                                control={<Radio size="small" />}
                                label="D"
                                sx={questionChoiceSx}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}
              </Grid>

              {/* Submit Button */}
              {canSubmit && (
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  {submitting && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      Your answers are being processed. Please wait and do not
                      click the Submit button again.
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSubmit}
                    disabled={submitting}
                    sx={{
                      ...primaryButtonSx,
                      minWidth: "120px",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </Box>
              )}
          </Box>
        )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card sx={portalCardSx}>
              <CardContent sx={{ p: 0 }}>
                <FinalExamScoresGrid
                  scores={studentScores}
                  embedded
                  loading={loading}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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

export default OnlineExam;
