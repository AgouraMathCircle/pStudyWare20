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
import React, { useState, useEffect, useRef } from "react";
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

  // Load registration status
  useEffect(() => {
    const loadRegistrationStatus = async () => {
      if (!isValidated || !user || !user.email) {
        return;
      }

      try {
        setRegistrationLoading(true);
        console.log(
          "StudentDashboard: Fetching registration status for",
          user.email
        );

        const response = await studentDashboardService.getRegistrationStatus(
          user.email || user.username
        );

        console.log("StudentDashboard: Registration status response", response);

        if (response.isSuccess && response.registrationEntries) {
          setRegistrationData(response.registrationEntries);
          // Show registration section if there are entries
          if (response.registrationEntries.length > 0) {
            setShowRegistration(true);
          } else {
            setShowRegistration(false);
          }
        } else {
          // No registration data or failed
          setShowRegistration(false);
          console.log(
            "StudentDashboard: No registration data available or failed to load"
          );
        }
      } catch (err) {
        console.error("Error fetching registration status:", err);
        setShowRegistration(false);
      } finally {
        setRegistrationLoading(false);
      }
    };

    loadRegistrationStatus();
  }, [isValidated, user, refreshTrigger]);

  // Load dashboard data and check for final exam visibility
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isValidated || !user || !user.email) {
        return;
      }

      try {
        setFinalExamLoading(true);
        console.log(
          "StudentDashboard: Fetching dashboard data for final exam status"
        );

        const response = await studentDashboardService.getDashboardData(
          user.email || user.username,
          user.chapterId || user.chapterID || 1
        );

        console.log("StudentDashboard: Dashboard data response", response);

        // Check if final exam should be shown
        // Option 1: Check from API response (if backend provides this info)
        if (response.isSuccess && response.showFinalExam !== undefined) {
          setShowFinalExam(response.showFinalExam);
        } else {
          // Option 2: Check based on current date (exam period)
          // For now, we'll enable it by default (matching old ASPX behavior: divExamButton.Visible = true)
          // You can customize this logic based on your requirements
          setShowFinalExam(checkIfFinalExamPeriod());
        }
      } catch (err) {
        console.error("Error fetching dashboard data for final exam:", err);
        // Default to showing final exam if there's an error (matching old behavior)
        setShowFinalExam(true);
      } finally {
        setFinalExamLoading(false);
      }
    };

    loadDashboardData();
  }, [isValidated, user, refreshTrigger]);

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
      <Container 
        maxWidth="xl" 
        sx={{ 
          mb: 4, 
          ml: { xs: 2, sm: 3, md: "1in", lg: "1in" },
          mr: { xs: 2, sm: 3, md: "1in", lg: "1in" }
        }}
      >
        <Grid container spacing={3}>
          {/* Dashboard Messages */}
          <DashboardMessages
            username={user?.email || user?.username}
            chapterId={user?.chapterId || user?.chapterID || 1}
          />

          {/* Meeting Schedule Section - Centered on page */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Box sx={{ width: "100%", maxWidth: "600px" }}>
                <StudentMeetingSchedule
                  username={user?.email || user?.username}
                />
              </Box>
            </Box>
          </Grid>

          {/* Registration Section - Conditionally Rendered */}
          {showRegistration && !registrationLoading && (
            <Grid item xs={12}>
              <RegistrationSection
                registrationData={registrationData}
                username={user?.email || user?.username}
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
            username={user?.email || user?.username}
            chapterId={user?.chapterId || user?.chapterID || 1}
            key={`profile-${refreshTrigger}`}
          />

          {/* Report Card */}
          <ReportCard
            username={user?.email || user?.username}
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
