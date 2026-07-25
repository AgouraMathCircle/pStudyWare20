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
import systemAdminDashboardService from "../../../services/systemAdminDashboardService";
import { getPortalUsername, getPortalLoginIdentifier } from "../../../utils/portalUsername";
import SystemAdminHeader, { SystemAdminRoleHeaderSpacer } from "./SystemAdminHeader";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminDashboardWidgetColumnSx,
} from "../styles/applicationSurfaces";
import EnrolledStudents from "./EnrolledStudents";
import ToDoList from "./ToDoList";
import SystemSupport from "./SystemSupport";
import WaitingListStudents from "./WaitingListStudents";
import StudentList from "./StudentList";
import "../../../styles/SystemAdminDashboard.css";

const SystemAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const hasRedirectedRef = useRef(false);

  const [studentCounts, setStudentCounts] = useState({});
  const [waitingListCounts, setWaitingListCounts] = useState({});
  const [userTrackingSummary, setUserTrackingSummary] = useState([]);
  const [studentList, setStudentList] = useState([]);

  const [adminPrivileges, setAdminPrivileges] = useState({
    isAdmin: false,
    isSystemAdmin: false,
    canPublishDocuments: false,
    canExportData: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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

    const memberType = String(user.memberType ?? "")
      .trim()
      .toUpperCase();
    const role = user.role;

    if (
      role !== "SystemAdmin" &&
      memberType !== "A" &&
      role !== "Admin"
    ) {
      hasRedirectedRef.current = true;
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

    setIsValidated(true);
    setLoading(false);
  }, [isAuthenticated, user, authLoading, navigate]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isValidated || !user) {
        return;
      }

      try {
        setLoading(true);

        const privilegesResponse =
          await systemAdminDashboardService.checkSystemAdminPrivileges();
        const systemAdminFromUser =
          String(user?.systemAdmin ?? user?.SystemAdmin ?? "").toUpperCase() === "Y";
        const isSystemAdmin =
          privilegesResponse?.isSystemAdmin === true ||
          privilegesResponse?.IsSystemAdmin === true ||
          systemAdminFromUser;
        const isAdmin =
          privilegesResponse?.isAdmin === true ||
          privilegesResponse?.IsAdmin === true ||
          String(user?.memberType ?? "").trim().toUpperCase() === "A" ||
          user?.role === "SystemAdmin" ||
          user?.role === "Admin" ||
          user?.role === "SystemAdmin";
        const isSystemAdminElevated =
          isSystemAdmin || user?.role === "SystemAdmin";
        setAdminPrivileges({
          isAdmin,
          isSystemAdmin: isSystemAdminElevated,
          canPublishDocuments: isSystemAdminElevated,
          canExportData: isAdmin,
        });

        const portalUser =
          getPortalUsername(user) || getPortalLoginIdentifier(user);
        const response = await systemAdminDashboardService.getDashboardData(portalUser);

        if (response) {
          const studentListPayload =
            response.studentList || response.StudentList || {};
          const students =
            studentListPayload.students || studentListPayload.Students || [];
          if (Array.isArray(students)) {
            setStudentList(students);
          }

          const dm = response.dashboardMessage || response.DashboardMessage;
          if (dm) {
            setStudentCounts(dm.studentCounts ?? dm.StudentCounts ?? {});
            setWaitingListCounts(
              dm.waitingListCounts ?? dm.WaitingListCounts ?? {},
            );
          }

          const trackingPayload =
            response.userTrackingSummary || response.UserTrackingSummary || {};
          const trackingData =
            trackingPayload.trackingData || trackingPayload.TrackingData || [];
          if (Array.isArray(trackingData)) {
            setUserTrackingSummary(trackingData);
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        showMessage(
          "Error loading dashboard data. Please refresh the page.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isValidated, user]);

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

  const handlePublishDocument = async (sendEmail) => {
    try {
      const response = await systemAdminDashboardService.publishDocument({
        sendEmail,
        SendEmail: sendEmail,
      });

      const success = response?.isSuccess ?? response?.IsSuccess;
      if (success) {
        showMessage(
          response?.message ?? response?.Message ?? "Documents published successfully!",
          "success",
        );
      } else {
        showMessage(
          response?.errorMessage ?? response?.ErrorMessage ?? "Failed to publish documents.",
          "error",
        );
      }
    } catch (err) {
      console.error("Error publishing document:", err);
      showMessage("Error publishing documents. Please try again.", "error");
    }
  };

  const handleExportToExcel = async () => {
    try {
      showMessage("Generating Excel file...", "info");

      await systemAdminDashboardService.exportStudentListToExcel({
        username: getPortalUsername(user) || getPortalLoginIdentifier(user),
        mode: "D",
      });

      showMessage("Excel file downloaded successfully!", "success");
    } catch (err) {
      console.error("Error exporting to Excel:", err);
      showMessage("Error exporting to Excel. Please try again.", "error");
    }
  };

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
          Loading SystemAdmin Dashboard...
        </Typography>
      </Box>
    );
  }

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
          Access denied. Please log in as a system administrator.
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

  return (
    <Box className="systemadmin-dashboard">
      <SystemAdminHeader user={user} />
      <SystemAdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pb: 0 }}>
            <Card
              sx={{
                ...panelCardSx,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <CardContent
                sx={{
                  px: 2,
                  pt: 1.5,
                  pb: 0,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                  "&:last-child": { pb: 0 },
                }}
              >
                <Grid
                  container
                  spacing={4}
                  className="systemadmin-dashboard-widgets-row"
                  sx={{
                    alignItems: "flex-start",
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    width: "100%",
                  }}
                >
                  <Grid item xs={12} sm={6} md={3} sx={adminDashboardWidgetColumnSx}>
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <ToDoList trackingSummary={userTrackingSummary} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} sx={adminDashboardWidgetColumnSx}>
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <EnrolledStudents studentCounts={studentCounts} />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} sx={adminDashboardWidgetColumnSx}>
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <WaitingListStudents
                        waitingListCounts={waitingListCounts}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} sx={adminDashboardWidgetColumnSx}>
                    <Box
                      sx={{
                        width: "100%",
                        minWidth: 0,
                        maxWidth: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <SystemSupport
                        onPublishDocument={handlePublishDocument}
                        canPublishDocuments={
                          adminPrivileges.canPublishDocuments
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} id="systemadmin-student-list" sx={{ pt: "8px !important" }}>
            <Card sx={panelCardSx}>
              <CardContent sx={{ px: 1.5, pt: 1.5, pb: 0 }}>
                <StudentList
                  students={studentList}
                  onExportToExcel={handleExportToExcel}
                  canExportData={adminPrivileges.canExportData}
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

export default SystemAdminDashboard;
