import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Alert,
  Snackbar,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import adminDashboardService from "../../../services/adminDashboardService";
import AdminHeader from "./AdminHeader";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../../../styles/applicationSurfaces";
import EnrolledStudents from "./EnrolledStudents";
import ToDoList from "./ToDoList";
import SystemSupport from "./SystemSupport";
import StudentList from "./StudentList";
import "../../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const hasRedirectedRef = useRef(false);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);
  const [studentCounts, setStudentCounts] = useState({});
  const [userTrackingSummary, setUserTrackingSummary] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [message, setMessage] = useState("");

  // Admin privileges state
  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canPublishDocuments: false,
    canExportData: false,
  });

  // Global message state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Handle authentication and validation
  useEffect(() => {
    console.log("AdminDashboard: useEffect triggered", {
      authLoading,
      isAuthenticated,
      hasRedirected: hasRedirectedRef.current,
      user: user
        ? { email: user.email, memberType: user.memberType, role: user.role }
        : null,
    });

    if (authLoading) {
      console.log("AdminDashboard: Auth context still loading");
      return;
    }

    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      console.log("AdminDashboard: Already redirected, skipping");
      return;
    }

    if (!isAuthenticated || !user) {
      console.log(
        "AdminDashboard: User not authenticated, redirecting to login"
      );
      hasRedirectedRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    // Check if user is an admin
    const memberType = user.memberType?.toUpperCase();
    const role = user.role;
    console.log("AdminDashboard: Checking user type", { memberType, role });

    if (memberType !== "A" && role !== "Admin" && role !== "SystemAdmin") {
      console.log(
        "AdminDashboard: User is not an admin, redirecting to appropriate dashboard"
      );
      hasRedirectedRef.current = true;
      // Redirect to appropriate dashboard based on user type
      if (memberType === "S" || role === "Student") {
        navigate("/pstudyware/student/dashboard", { replace: true });
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
      "AdminDashboard: User is authenticated admin, validation complete"
    );
    setIsValidated(true);
    setLoading(false);
  }, [isAuthenticated, user, authLoading, navigate]);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isValidated || !user) {
        return;
      }

      try {
        setLoading(true);
        console.log("AdminDashboard: Fetching dashboard data");

        // Check admin privileges first
        const privilegesResponse =
          await adminDashboardService.checkAdminPrivileges();
        console.log("AdminDashboard: Admin privileges", privilegesResponse);
        setAdminPrivileges(privilegesResponse);

        // Get complete dashboard data
        const response = await adminDashboardService.getDashboardData(
          user.email || user.username
        );

        console.log("AdminDashboard: Dashboard data response", response);

        if (response) {
          setDashboardData(response);

          // Extract student list
          if (response.studentList && response.studentList.students) {
            setStudentList(response.studentList.students);
          }

          // Extract dashboard message and student counts
          if (response.dashboardMessage) {
            setMessage(response.dashboardMessage.message || "");
            setStudentCounts(response.dashboardMessage.studentCounts || {});
          }

          // Extract user tracking summary
          if (
            response.userTrackingSummary &&
            response.userTrackingSummary.trackingData
          ) {
            setUserTrackingSummary(response.userTrackingSummary.trackingData);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        showMessage(
          "Error loading dashboard data. Please refresh the page.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isValidated, user]);

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

  // Handle publish document
  const handlePublishDocument = async (sendEmail) => {
    try {
      console.log("AdminDashboard: Publishing document", { sendEmail });
      const response = await adminDashboardService.publishDocument({
        sendEmail,
      });

      if (response.isSuccess) {
        showMessage(
          response.message || "Documents published successfully!",
          "success"
        );
      } else {
        showMessage(
          response.errorMessage || "Failed to publish documents.",
          "error"
        );
      }
    } catch (err) {
      console.error("Error publishing document:", err);
      showMessage("Error publishing documents. Please try again.", "error");
    }
  };

  // Handle export to Excel
  const handleExportToExcel = async () => {
    try {
      console.log("AdminDashboard: Exporting to Excel");
      showMessage("Generating Excel file...", "info");

      const blob = await adminDashboardService.exportStudentListToExcel({
        username: user.email || user.username,
        mode: "D",
      });

      // Download the file
      adminDashboardService.downloadExcelFile(
        blob,
        `StudentList_${new Date().toISOString().split("T")[0]}.xlsx`
      );

      showMessage("Excel file downloaded successfully!", "success");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      showMessage("Error exporting to Excel. Please try again.", "error");
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    window.location.reload();
  };

  // Show loading while auth context is loading or while validating user
  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="textSecondary">
          Loading Admin Dashboard...
        </Typography>
      </Box>
    );
  }

  // Only render dashboard if user is authenticated, validated, and is an admin
  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Alert severity="error">
          Access denied. Please log in as an administrator.
        </Alert>
      </Box>
    );
  }

  const panelCardSx = {
    backgroundColor: "white",
    borderRadius: 2,
    boxShadow: PORTAL_CARD_BOX_SHADOW,
    overflow: "hidden",
    ...portalCardAntiLiftSx,
  };

  return (
    <Box className="admin-dashboard">
      <AdminHeader user={user} />
      <Box sx={{ height: "48px" }} />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={panelCardSx}>
              <CardContent sx={{ p: 3 }}>
                <Grid
                  container
                  spacing={2}
                  sx={{ alignItems: "stretch" }}
                >
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                      <ToDoList
                        trackingSummary={userTrackingSummary}
                        onPublishDocument={handlePublishDocument}
                        canPublishDocuments={
                          adminPrivileges.canPublishDocuments
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                      <EnrolledStudents studentCounts={studentCounts} />
                    </Box>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
                      <SystemSupport />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={panelCardSx}>
              <CardContent sx={{ p: 3 }}>
                <StudentList
                  students={studentList}
                  onExportToExcel={handleExportToExcel}
                  canExportData={adminPrivileges.canExportData}
                  onRefresh={handleRefresh}
                />
              </CardContent>
            </Card>
          </Grid>
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

export default AdminDashboard;
