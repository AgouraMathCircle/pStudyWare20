import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  Add as AddIcon,
  AssignmentTurnedIn as EntriesIcon,
  EventAvailable as LastEntryIcon,
  StarBorder as TaskIcon,
  VolunteerActivism as HoursIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import InstructorVolunteerAvailabilityGrid from "../Instructor/InstructorVolunteerAvailabilityGrid";
import VolunteerTimeSheetGrid from "./VolunteerTimeSheetGrid";
import VolunteerAvailability, {
  shouldShowVolunteerAvailability,
} from "../Common/VolunteerAvailability";
import studentDashboardService from "../../../services/studentDashboardService";
import volunteerDashboardService from "../../../services/volunteerDashboardService";
import volunteerAvailabilityService from "../../../services/volunteerAvailabilityService";
import { getPortalUsername } from "../../../utils/portalUsername";
import { applyVolunteerAvailabilityRefresh } from "../../../utils/volunteerAvailabilityGridMerge";
import {
  instructorDashboardPanelCardSx,
  instructorDashboardPanelContentSx,
} from "../Instructor/instructorPortalTableStyles";
import {
  dashboardMessagesPanelContentSx,
  instructorPortalContentContainerProps,
  portalDashboardPageSx,
} from "../styles/applicationSurfaces";
import "../../../styles/VolunteerDashboard.css";

function formatLastEntryDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-US");
  } catch {
    return String(value);
  }
}

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [entries, setEntries] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  const [summary, setSummary] = useState({
    totalVolunteerHours: 0,
    totalEntries: 0,
    lastEntryDate: null,
    mostFrequentTask: "",
  });
  const [availabilityRows, setAvailabilityRows] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);
  const [dashboardMessages, setDashboardMessages] = useState({
    importantNotice: "",
    announcement: "",
    competitions: "",
    todoList: "",
  });
  const [messagesLoading, setMessagesLoading] = useState(false);

  const username = useMemo(
    () => user?.email || user?.username || "",
    [user?.email, user?.username]
  );
  const portalUsername = useMemo(() => getPortalUsername(user), [user]);
  const chapterId = useMemo(
    () => user?.chapterId ?? user?.chapterID ?? 1,
    [user?.chapterId, user?.chapterID]
  );

  const showVolunteerAvailability = useMemo(
    () => shouldShowVolunteerAvailability(user),
    [user]
  );

  useEffect(() => {
    if (authLoading) return;
    if (hasRedirectedRef.current) return;

    if (!isAuthenticated || !user) {
      hasRedirectedRef.current = true;
      navigate("/login", { replace: true });
      return;
    }

    const memberType = user.memberType?.toUpperCase();
    const role = user.role;
    if (memberType !== "V" && role !== "Volunteer") {
      hasRedirectedRef.current = true;
      if (memberType === "A" || role === "Admin") {
        navigate("/pstudyware/admin/dashboard", { replace: true });
      } else if (memberType === "I" || role === "Instructor") {
        navigate("/pstudyware/instructor/dashboard", { replace: true });
      } else if (memberType === "S" || role === "Student") {
        navigate("/pstudyware/student/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    setIsValidated(true);
    setLoading(false);
  }, [authLoading, isAuthenticated, user, navigate]);

  const loadDashboard = useCallback(async () => {
    if (!username) return;
    setListError(null);
    setListLoading(true);
    try {
      const res = await volunteerDashboardService.getDashboardData(username);
      const list = res?.timeTrackingEntries ?? res?.TimeTrackingEntries ?? [];
      if (res?.isSuccess !== false && Array.isArray(list)) {
        setEntries(list);
        setSummary({
          totalVolunteerHours: res?.totalVolunteerHours ?? res?.TotalVolunteerHours ?? 0,
          totalEntries: res?.totalEntries ?? res?.TotalEntries ?? list.length,
          lastEntryDate: res?.lastEntryDate ?? res?.LastEntryDate ?? null,
          mostFrequentTask: res?.mostFrequentTask ?? res?.MostFrequentTask ?? "",
        });
      } else {
        setEntries([]);
        setListError(res?.errorMessage || res?.message || "Could not load time sheet.");
      }
    } catch (e) {
      setListError(e?.message || "Failed to load time sheet.");
      setEntries([]);
    } finally {
      setListLoading(false);
    }
  }, [username]);

  const loadVolunteerAvailability = useCallback(async ({ silent = false } = {}) => {
    if (!portalUsername) return;

    if (!silent) {
      setAvailabilityError(null);
      setAvailabilityLoading(true);
    }

    try {
      const res = await volunteerAvailabilityService.getAvailabilitySummary({
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
        setAvailabilityError(e?.message || "Failed to load volunteer availability list.");
        setAvailabilityRows([]);
      }
    } finally {
      if (!silent) setAvailabilityLoading(false);
    }
  }, [portalUsername]);

  const refreshVolunteerAvailabilityList = useCallback((payload) => {
    setAvailabilityRows((prev) => applyVolunteerAvailabilityRefresh(prev, payload));
    setAvailabilityError(null);
  }, []);

  useEffect(() => {
    if (!isValidated || !username) return;
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await Promise.all([loadDashboard(), loadVolunteerAvailability()]);
    })();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, portalUsername, loadDashboard, loadVolunteerAvailability]);

  useEffect(() => {
    if (!isValidated || !username) return;

    let cancelled = false;

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        const response = await studentDashboardService.getDashboardData(username, chapterId);
        if (cancelled) return;
        if (response?.isSuccess) {
          setDashboardMessages({
            importantNotice: response.importantNotice || "",
            announcement: response.announcement || "",
            competitions: response.competitions || "",
            todoList: response.todoList || "",
          });
        }
      } catch (err) {
        if (!cancelled) console.error("Volunteer dashboard messages:", err);
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };

    loadMessages();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, chapterId]);

  if (authLoading || loading) {
    return (
      <Box
        className="volunteer-dashboard"
        sx={{
          ...portalDashboardPageSx,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#2e7d32" }} />
        <Typography variant="h6" color="textSecondary">
          Loading Volunteer Dashboard...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box
        className="volunteer-dashboard"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Alert severity="error">Access denied. Please log in as a volunteer.</Alert>
      </Box>
    );
  }

  const statItems = [
    {
      label: "Entries logged",
      value: summary.totalEntries ?? 0,
      icon: <EntriesIcon fontSize="small" />,
      accent: "#66bb6a",
    },
    {
      label: "Total volunteer hours",
      value: (summary.totalVolunteerHours ?? 0).toFixed(2),
      icon: <HoursIcon fontSize="small" />,
      accent: "#43a047",
    },
    {
      label: "Most frequent task",
      value: summary.mostFrequentTask || "—",
      icon: <TaskIcon fontSize="small" />,
      accent: "#2e7d32",
    },
    {
      label: "Last entry date",
      value: formatLastEntryDate(summary.lastEntryDate),
      icon: <LastEntryIcon fontSize="small" />,
      accent: "#1b5e20",
    },
  ];

  return (
    <Box className="volunteer-dashboard">
      <Container {...instructorPortalContentContainerProps} sx={{ mb: 4, pt: 0, mt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pb: "0 !important" }}>
            <Card sx={instructorDashboardPanelCardSx} className="dashboard-messages-panel">
              <CardContent sx={dashboardMessagesPanelContentSx}>
                <DashboardMessages
                  variant="volunteer"
                  username={username}
                  chapterId={chapterId}
                  dashboardMessages={dashboardMessages}
                  loading={messagesLoading}
                />
              </CardContent>
            </Card>
          </Grid>

          {showVolunteerAvailability && (
            <Grid
              item
              xs={12}
              sx={{ pt: "0 !important", pb: "0 !important", width: "100%" }}
            >
              <Card
                sx={{
                  ...instructorDashboardPanelCardSx,
                  width: "100%",
                }}
                className="volunteer-dashboard-availability-entry-panel"
              >
                <CardContent sx={instructorDashboardPanelContentSx}>
                  <VolunteerAvailability
                    embedded={true}
                    onSaved={refreshVolunteerAvailabilityList}
                  />
                </CardContent>
              </Card>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sx={{ pt: "0 !important", pb: "0 !important", width: "100%" }}
          >
            <Card
              sx={instructorDashboardPanelCardSx}
              className="volunteer-dashboard-timesheet-summary-panel"
            >
              <CardContent sx={{ ...instructorDashboardPanelContentSx, "&:last-child": { pb: 2 } }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.5,
                    borderBottom: "1px solid #dcebdc",
                    pb: 0.75,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="subtitle1"
                      component="h1"
                      sx={{
                        fontWeight: 800,
                        color: "#1b5e20",
                        letterSpacing: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      Time sheet summary
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0 }}>
                      Track tutoring, grading, operations, and other volunteer work in one place.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    component={RouterLink}
                    to="/pstudyware/volunteer/time-sheet"
                    sx={{
                      backgroundColor: "#43a047",
                      "&:hover": {
                        backgroundColor: "#2e7d32",
                      },
                      textTransform: "none",
                      fontWeight: 700,
                      borderRadius: 1.5,
                      px: 1.5,
                      py: 0.5,
                      boxShadow: "0 4px 10px rgba(67, 160, 71, 0.2)",
                    }}
                  >
                    Log hours
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "repeat(4, 1fr)",
                    },
                    gap: 1.5,
                  }}
                >
                  {statItems.map((item) => (
                    <Paper
                      key={item.label}
                      className="volunteer-dashboard-stat-card"
                      sx={{
                        p: 1,
                        height: "100%",
                        border: "1px solid #dfe9df",
                        borderLeft: `4px solid ${item.accent}`,
                        borderRadius: 2,
                        boxShadow: "none",
                        background: "linear-gradient(180deg, #ffffff 0%, #fbfffb 100%)",
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          bgcolor: "#e8f5e9",
                          color: item.accent,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          sx={{ fontWeight: 700 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography
                          variant={item.label === "Most frequent task" ? "caption" : "subtitle2"}
                          sx={{
                            fontWeight: 800,
                            color: "#2d2d2d",
                            mt: 0,
                            lineHeight: 1.2,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            item
            xs={12}
            className="volunteer-dashboard-grids-stack"
            sx={{ display: "flex", flexDirection: "column", pt: "0 !important" }}
          >
            <Card
              sx={instructorDashboardPanelCardSx}
              className="volunteer-dashboard-availability-panel"
            >
              <CardContent sx={instructorDashboardPanelContentSx}>
                <InstructorVolunteerAvailabilityGrid
                  rows={availabilityRows}
                  loading={availabilityLoading}
                  error={availabilityError}
                />
              </CardContent>
            </Card>

            <Card
              sx={instructorDashboardPanelCardSx}
              className="volunteer-dashboard-timesheet-panel"
            >
              <CardContent sx={instructorDashboardPanelContentSx}>
                <VolunteerTimeSheetGrid
                  rows={entries}
                  loading={listLoading}
                  error={listError}
                  onEntriesChanged={loadDashboard}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VolunteerDashboard;
