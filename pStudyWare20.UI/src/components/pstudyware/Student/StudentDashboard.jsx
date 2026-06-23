import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import StudentHeader, { StudentRoleHeaderSpacer } from "./StudentHeader";
import DashboardMessages from "./DashboardMessages";
import StudentProfile from "./StudentProfile";
import ReportCard from "./ReportCard";
import RegistrationSection from "./RegistrationSection";
import FinalExamSection from "./FinalExamSection";
import StudentMeetingSchedule from "./StudentMeetingSchedule";
import studentDashboardService from "../../../services/studentDashboardService";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  portalDashboardPageSx,
} from "../styles/applicationSurfaces";
import "../../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const hasRedirectedRef = useRef(false);

  // Registration state
  const [registrationData, setRegistrationData] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // Final Exam state
  const [showFinalExam, setShowFinalExam] = useState(false);
  const [finalExamLoading, setFinalExamLoading] = useState(false);

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Trigger for refreshing data after registration
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Dashboard messages (fetched once and passed to DashboardMessages to avoid duplicate API call)
  const [dashboardMessages, setDashboardMessages] = useState({
    importantNotice: "",
    announcement: "",
    competitions: "",
    todoList: "",
  });
  const [dashboardMessagesLoading, setDashboardMessagesLoading] = useState(false);

  const [reportCardEntries, setReportCardEntries] = useState([]);
  const [reportCardError, setReportCardError] = useState(null);

  const username = useMemo(
    () => user?.email || user?.username || "",
    [user?.email, user?.username]
  );
  const chapterId = useMemo(
    () => user?.chapterId ?? user?.chapterID ?? 1,
    [user?.chapterId, user?.chapterID]
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (hasRedirectedRef.current) {
      return;
    }

    if (!isAuthenticated || !user) {
      hasRedirectedRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    const memberType = user.memberType?.toUpperCase();
    const role = user.role;

    if (memberType !== "S" && role !== "Student") {
      hasRedirectedRef.current = true;
      if (memberType === "A" || role === "Admin") {
        navigate("/pstudyware/admin/dashboard", { replace: true });
      } else if (memberType === "I" || role === "Instructor") {
        navigate("/pstudyware/instructor/dashboard", { replace: true });
      } else if (memberType === "V" || role === "Volunteer") {
        navigate("/pstudyware/volunteer/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    setIsValidated(true);
    setLoading(false);
  }, [isAuthenticated, user, authLoading, navigate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !authLoading) {
        setLoading(false);
        setIsValidated(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [loading, authLoading]);

  useEffect(() => {
    if (!isValidated || !username) return;

    let cancelled = false;

    const loadRegistrationStatus = async () => {
      try {
        setRegistrationLoading(true);
        const response = await studentDashboardService.getRegistrationStatus(username);
        if (cancelled) return;

        if (response.isSuccess && response.registrationEntries) {
          setRegistrationData(response.registrationEntries);
          setShowRegistration(response.registrationEntries.length > 0);
        } else {
          setShowRegistration(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching registration status:", err);
          setShowRegistration(false);
        }
      } finally {
        if (!cancelled) setRegistrationLoading(false);
      }
    };

    loadRegistrationStatus();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, refreshTrigger]);

  useEffect(() => {
    if (!isValidated || !username) return;

    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        setDashboardMessagesLoading(true);
        setFinalExamLoading(true);
        const response = await studentDashboardService.getDashboardData(username, chapterId);
        if (cancelled) return;

        if (response.isSuccess) {
          setDashboardMessages({
            importantNotice: response.importantNotice || "",
            announcement: response.announcement || "",
            competitions: response.competitions || "",
            todoList: response.todoList || "",
          });
          setReportCardEntries(
            response.reportCardEntries ?? response.ReportCardEntries ?? []
          );
          setReportCardError(null);
          setShowFinalExam(
            response.showFinalExam !== undefined
              ? response.showFinalExam
              : checkIfFinalExamPeriod()
          );
        } else {
          setReportCardEntries([]);
          setReportCardError(response?.message || "Failed to load report card");
          setShowFinalExam(checkIfFinalExamPeriod());
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching dashboard data:", err);
          setReportCardEntries([]);
          setReportCardError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load report card"
          );
          setShowFinalExam(checkIfFinalExamPeriod());
        }
      } finally {
        if (!cancelled) {
          setDashboardMessagesLoading(false);
          setFinalExamLoading(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, chapterId, refreshTrigger]);

  const checkIfFinalExamPeriod = () => true;

  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRegistrationSuccess = (message) => {
    showMessage(
      message || "You have successfully registered for the Fall 2024 session!",
      "success"
    );
    setShowRegistration(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleRegistrationError = (message) => {
    showMessage(
      message || "Error submitting registration. Please try again.",
      "error"
    );
  };

  if (authLoading || loading) {
    return (
      <Box
        className="student-dashboard"
        sx={{
          ...portalDashboardPageSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Student Dashboard...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box
        className="student-dashboard"
        sx={{
          ...portalDashboardPageSx,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error">
          Access denied. Please log in as a student.
        </Alert>
      </Box>
    );
  }

  const panelCardSx = {
    backgroundColor: "white",
    borderRadius: 2,
    boxShadow: PORTAL_CARD_BOX_SHADOW,
    overflow: "hidden",
    boxSizing: "border-box",
    pl: "35px",
    pr: "35px",
    ...portalCardAntiLiftSx,
  };

  const panelContentSx = {
    px: 1.5,
    pt: 1,
    pb: 0,
    "&:last-child": { pb: 1.5 },
  };

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      <StudentRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pb: "0 !important" }}>
            <Card sx={panelCardSx}>
              <CardContent sx={panelContentSx}>
                <DashboardMessages
                  username={username}
                  chapterId={chapterId}
                  dashboardMessages={dashboardMessages}
                  loading={dashboardMessagesLoading}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ pt: "0 !important" }}>
            <StudentMeetingSchedule username={username} panelCardSx={panelCardSx} />
          </Grid>

          {showRegistration && !registrationLoading && (
            <Grid item xs={12} sx={{ pt: "8px !important" }}>
              <Card sx={panelCardSx}>
                <CardContent sx={panelContentSx}>
                  <RegistrationSection
                    registrationData={registrationData}
                    username={username}
                    onSuccess={handleRegistrationSuccess}
                    onError={handleRegistrationError}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}

          {registrationLoading && (
            <Grid item xs={12} sx={{ pt: "8px !important" }}>
              <Card sx={panelCardSx}>
                <CardContent sx={panelContentSx}>
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <Typography>Loading registration information...</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}

          {showFinalExam && !finalExamLoading && (
            <Grid item xs={12} sx={{ pt: "0 !important", mt: "-4px !important" }}>
              <Card sx={panelCardSx}>
                <CardContent sx={panelContentSx}>
                  <FinalExamSection />
                </CardContent>
              </Card>
            </Grid>
          )}

          {finalExamLoading && (
            <Grid item xs={12} sx={{ pt: "0 !important", mt: "-4px !important" }}>
              <Card sx={panelCardSx}>
                <CardContent sx={panelContentSx}>
                  <FinalExamSection loading />
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid item xs={12} sx={{ pt: "0 !important", mt: "-4px !important" }}>
            <Card sx={panelCardSx}>
              <CardContent sx={panelContentSx}>
                <StudentProfile
                  username={username}
                  chapterId={chapterId}
                  key={`profile-${refreshTrigger}`}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ pt: "0 !important", mt: "-4px !important" }}>
            <Card sx={panelCardSx}>
              <CardContent
                sx={{
                  ...panelContentSx,
                  pt: 0,
                  "&:last-child": { pb: 1.5 },
                }}
              >
                <ReportCard
                  username={username}
                  embedded
                  reportCardEntries={reportCardEntries}
                  reportCardLoading={dashboardMessagesLoading}
                  reportCardError={reportCardError}
                  key={`reportcard-${refreshTrigger}`}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

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
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDashboard;
