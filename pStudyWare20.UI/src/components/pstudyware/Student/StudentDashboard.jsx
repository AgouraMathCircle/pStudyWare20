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
import "../../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const hasRedirectedRef = useRef(false);

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
        navigate("/admin/dashboard", { replace: true });
      } else if (memberType === "I" || role === "Instructor") {
        navigate("/instructor/dashboard", { replace: true });
      } else if (memberType === "V" || role === "Volunteer") {
        navigate("/volunteer/dashboard", { replace: true });
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
      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Left Content */}
          <Grid item xs={12} lg={8}>
            {/* Dashboard Messages */}
            <DashboardMessages
              username={user?.email || user?.username}
              chapterId={user?.chapterId || user?.chapterID || 1}
            />
          </Grid>

          {/* Right Content */}
          <Grid item xs={12} lg={4}>
            {/* Student Profile */}
            <StudentProfile
              username={user?.email || user?.username}
              chapterId={user?.chapterId || user?.chapterID || 1}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
