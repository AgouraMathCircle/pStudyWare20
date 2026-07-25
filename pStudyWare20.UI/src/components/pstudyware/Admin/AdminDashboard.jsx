import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import adminDashboardService, {
  adminVolunteerAvailabilityApi,
} from "../../../services/adminDashboardService";
import {
  getPortalUsername,
  getPortalLoginIdentifier,
} from "../../../utils/portalUsername";
import { applyVolunteerAvailabilityRefresh } from "../../../utils/volunteerAvailabilityGridMerge";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import SystemSupport from "./SystemSupport";
import StudentList from "./StudentList";
import VolunteerAvailability from "../Common/VolunteerAvailability";
import AdminVolunteerAvailabilityGrid from "./AdminVolunteerAvailabilityGrid";
import "../../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const hasRedirectedRef = useRef(false);

  const [studentList, setStudentList] = useState([]);

  const [availabilityRows, setAvailabilityRows] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

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

  const portalUsername = useMemo(() => getPortalUsername(user), [user]);

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

    if (memberType !== "A" && role !== "Admin" && role !== "SystemAdmin") {
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

  const loadVolunteerAvailability = useCallback(
    async ({ silent = false } = {}) => {
      if (!portalUsername) return;

      if (!silent) {
        setAvailabilityError(null);
        setAvailabilityLoading(true);
      }

      try {
        const res = await adminVolunteerAvailabilityApi.getAvailabilitySummary({
          username: portalUsername,
        });
        if (res?.isSuccess !== false) {
          const nextRows = res.summaryData || [];
          if (nextRows.length > 0 || !silent) {
            setAvailabilityRows(nextRows);
            setAvailabilityError(null);
          }
        } else if (!silent) {
          setAvailabilityRows([]);
          setAvailabilityError(
            res?.errorMessage || "Could not load volunteer availability list.",
          );
        }
      } catch (e) {
        if (!silent) {
          setAvailabilityError(
            e?.message || "Failed to load volunteer availability list.",
          );
          setAvailabilityRows([]);
        }
      } finally {
        if (!silent) setAvailabilityLoading(false);
      }
    },
    [portalUsername],
  );

  const refreshVolunteerAvailabilityList = useCallback((payload) => {
    setAvailabilityRows((prev) =>
      applyVolunteerAvailabilityRefresh(prev, payload),
    );
    setAvailabilityError(null);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isValidated || !user) {
        return;
      }

      try {
        setLoading(true);

        const privilegesResponse =
          await adminDashboardService.checkAdminPrivileges();
        const systemAdminFromUser =
          String(user?.systemAdmin ?? user?.SystemAdmin ?? "").toUpperCase() ===
          "Y";
        const isSystemAdmin =
          privilegesResponse?.isSystemAdmin === true ||
          privilegesResponse?.IsSystemAdmin === true ||
          systemAdminFromUser;
        const isAdmin =
          privilegesResponse?.isAdmin === true ||
          privilegesResponse?.IsAdmin === true ||
          String(user?.memberType ?? "")
            .trim()
            .toUpperCase() === "A" ||
          user?.role === "Admin" ||
          user?.role === "SystemAdmin";
        setAdminPrivileges({
          isAdmin,
          isSystemAdmin,
          canPublishDocuments: isSystemAdmin,
          canExportData: isAdmin,
        });

        const portalUser =
          getPortalUsername(user) || getPortalLoginIdentifier(user);
        const response =
          await adminDashboardService.getDashboardData(portalUser);

        if (response) {
          const studentListPayload =
            response.studentList || response.StudentList || {};
          const students =
            studentListPayload.students || studentListPayload.Students || [];
          if (Array.isArray(students)) {
            setStudentList(students);
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

  useEffect(() => {
    if (!isValidated || !portalUsername) return;
    loadVolunteerAvailability();
  }, [isValidated, portalUsername, loadVolunteerAvailability]);

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
      const response = await adminDashboardService.publishDocument({
        sendEmail,
        SendEmail: sendEmail,
      });

      const success = response?.isSuccess ?? response?.IsSuccess;
      if (success) {
        showMessage(
          response?.message ??
            response?.Message ??
            "Documents published successfully!",
          "success",
        );
      } else {
        showMessage(
          response?.errorMessage ??
            response?.ErrorMessage ??
            "Failed to publish documents.",
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

      await adminDashboardService.exportStudentListToExcel({
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
          Loading Admin Dashboard...
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
    boxSizing: "border-box",
    pl: "35px",
    pr: "35px",
    ...portalCardAntiLiftSx,
  };

  return (
    <Box className="admin-dashboard">
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pb: 0 }}>
            <Box
              className="admin-dashboard-top-cards-row"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "stretch",
                gap: 2,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  flex: { xs: "1 1 auto", md: "1 1 0" },
                  width: { xs: "100%", md: "50%" },
                  minWidth: 0,
                  display: "flex",
                }}
              >
                <Card
                  sx={{
                    ...panelCardSx,
                    width: "100%",
                    height: "100%",
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
                      flex: 1,
                      "&:last-child": { pb: 0 },
                    }}
                  >
                    <SystemSupport
                      onPublishDocument={handlePublishDocument}
                      canPublishDocuments={adminPrivileges.canPublishDocuments}
                    />
                  </CardContent>
                </Card>
              </Box>

              <Box
                sx={{
                  flex: { xs: "1 1 auto", md: "1 1 0" },
                  width: { xs: "100%", md: "50%" },
                  minWidth: 0,
                  display: "flex",
                }}
              >
                <Card
                  sx={{
                    ...adminSessionListPanelCardSx,
                    width: "100%",
                    height: "100%",
                  }}
                  className="admin-dashboard-volunteer-availability-entry-panel"
                >
                  <CardContent
                    sx={{
                      ...adminSessionListPanelContentSx,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <VolunteerAvailability
                      embedded
                      alwaysVisible
                      availabilityService={adminVolunteerAvailabilityApi}
                      onSaved={refreshVolunteerAvailabilityList}
                    />
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ pt: "8px !important" }}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={adminSessionListTitleSx}
                  >
                    Volunteers Availability List for upcoming class
                  </Typography>
                </Box>
                <AdminVolunteerAvailabilityGrid
                  rows={availabilityRows}
                  loading={availabilityLoading}
                  error={availabilityError}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            id="admin-student-list"
            sx={{ pt: "8px !important" }}
          >
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

export default AdminDashboard;
