import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Link,
  Snackbar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Upload as UploadIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  Lock as LockIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  YouTube as YouTubeIcon,
  VideoCall as VideoCallIcon,
} from "@mui/icons-material";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import StudentHeader from "./StudentHeader";
import DashboardMessages from "./DashboardMessages";
import StudentProfile from "./StudentProfile";
import ReportCard from "./ReportCard";
import RegistrationSection from "./RegistrationSection";
import FinalExamSection from "./FinalExamSection";
import StudentMeetingSchedule from "./StudentMeetingSchedule";
import studentDashboardService from "../../../services/studentDashboardService";
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
    severity: "info", // 'success', 'error', 'warning', 'info'
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

  // Stable primitive values so child effects don't re-run when user object reference changes
  const username = useMemo(
    () => user?.email || user?.username || "",
    [user?.email, user?.username]
  );
  const chapterId = useMemo(
    () => user?.chapterId ?? user?.chapterID ?? 1,
    [user?.chapterId, user?.chapterID]
  );

  // Handle authentication and validation
  useEffect(() => {
    console.log("StudentDashboard: useEffect triggered", {
      authLoading,
      isAuthenticated,
      hasRedirected: hasRedirectedRef.current,
      user: user
        ? { email: user.email, memberType: user.memberType, role: user.role }
        : null,
    });

    if (authLoading) {
      console.log("StudentDashboard: Auth context still loading");
      return;
    }

    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      console.log("StudentDashboard: Already redirected, skipping");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log(
        "StudentDashboard: User not authenticated, redirecting to login"
      );
      hasRedirectedRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    // Check if user is a student
    const memberType = user.memberType?.toUpperCase();
    const role = user.role;
    console.log("StudentDashboard: Checking user type", { memberType, role });

    if (memberType !== "S" && role !== "Student") {
      console.log(
        "StudentDashboard: User is not a student, redirecting to appropriate dashboard"
      );
      hasRedirectedRef.current = true;
      // Redirect to appropriate dashboard based on user type
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

    console.log(
      "StudentDashboard: User is authenticated student, validation complete"
    );
    setIsValidated(true);
    setLoading(false);
  }, [isAuthenticated, user, authLoading, navigate]);

  // Separate effect for validation completion
  useEffect(() => {
    if (isValidated && !loading) {
      console.log("StudentDashboard: Validation complete, ready to render");
    }
  }, [isValidated, loading]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading && !authLoading) {
        console.log(
          "StudentDashboard: Loading timeout reached, forcing validation"
        );
        setLoading(false);
        setIsValidated(true);
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeout);
  }, [loading, authLoading]);

  // Load registration status (stable deps: username so we don't re-run when user object reference changes)
  useEffect(() => {
    if (!isValidated || !username) return;

    const abortController = new AbortController();
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

  // Single dashboard data fetch: messages + final exam visibility (avoids duplicate GetDashboardData from DashboardMessages)
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
          setShowFinalExam(
            response.showFinalExam !== undefined
              ? response.showFinalExam
              : checkIfFinalExamPeriod()
          );
        } else {
          setShowFinalExam(checkIfFinalExamPeriod());
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching dashboard data:", err);
          setShowFinalExam(true);
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

  // Helper function to check if it's final exam period
  const checkIfFinalExamPeriod = () => {
    // Option 1: Always show (matching old ASPX: divExamButton.Visible = true)
    // return true;

    // Option 2: Check date range (example: show during exam period)
    const now = new Date();
    const examStartDate = new Date("2024-05-01"); // Configure start date
    const examEndDate = new Date("2024-06-30"); // Configure end date

    // Show if within exam period or always show (uncomment line below for date-based)
    // return now >= examStartDate && now <= examEndDate;

    // For now, return true to match old behavior (always visible)
    return true;
  };

  // Helper function to show messages
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Helper function to close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle successful registration
  const handleRegistrationSuccess = (message) => {
    showMessage(
      message || "You have successfully registered for the Fall 2024 session!",
      "success"
    );
    // Hide registration section after successful registration
    setShowRegistration(false);
    // Trigger refresh of dashboard data
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle registration error
  const handleRegistrationError = (message) => {
    showMessage(
      message || "Error submitting registration. Please try again.",
      "error"
    );
  };

  // Show loading while auth context is loading or while validating user
  if (authLoading || loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "16px",
        }}
      >
        Loading...
      </div>
    );
  }

  // Only render dashboard if user is authenticated, validated, and is a student
  if (!isAuthenticated || !user || !isValidated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
          fontSize: "16px",
        }}
      >
        Access denied. Please log in as a student.
      </div>
    );
  }

  return (
    <Box className="student-dashboard">
      <StudentHeader user={user} />
      {/* Spacer to account for fixed StudentHeader */}
      <Box sx={{ height: "40px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {/* Dashboard Messages (data from single parent fetch to avoid duplicate API call) */}
          <DashboardMessages
            username={username}
            chapterId={chapterId}
            dashboardMessages={dashboardMessages}
            loading={dashboardMessagesLoading}
          />

          {/* Meeting Schedule Section */}
          <Grid item xs={12}>
            <StudentMeetingSchedule username={username} />
          </Grid>

          {/* Registration Section - Conditionally Rendered */}
          {showRegistration && !registrationLoading && (
            <Grid item xs={12}>
              <RegistrationSection
                registrationData={registrationData}
                username={username}
                onSuccess={handleRegistrationSuccess}
                onError={handleRegistrationError}
              />
            </Grid>
          )}

          {/* Loading state for registration */}
          {registrationLoading && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <Typography>Loading registration information...</Typography>
              </Box>
            </Grid>
          )}

          {/* Final Exam Section - Conditionally Rendered */}
          {showFinalExam && !finalExamLoading && (
            <Grid item xs={12}>
              <FinalExamSection />
            </Grid>
          )}

          {/* Loading state for final exam */}
          {finalExamLoading && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  p: 3,
                }}
              >
                <Typography>Loading final exam information...</Typography>
              </Box>
            </Grid>
          )}

          {/* Student Profile */}
          <StudentProfile
            username={username}
            chapterId={chapterId}
            key={`profile-${refreshTrigger}`}
          />

          {/* Report Card */}
          <ReportCard
            username={username}
            key={`reportcard-${refreshTrigger}`}
          />
        </Grid>
      </Container>

      {/* Global Snackbar for Success/Error Messages */}
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
