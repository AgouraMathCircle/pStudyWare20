import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Chip, Container, Grid, Paper, Typography, Button, Card, CardContent } from "@mui/material";
import {
  Add as AddIcon,
  AssignmentTurnedIn as EntriesIcon,
  StarBorder as TaskIcon,
  VolunteerActivism as HoursIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import {
  PORTAL_CARD_BOX_SHADOW,
  dashboardMessagesPanelContentSx,
  portalCardAntiLiftSx,
} from "../styles/applicationSurfaces";
import studentDashboardService from "../../../services/studentDashboardService";
import volunteerDashboardService from "../../../services/volunteerDashboardService";
import VolunteerTimeSheetGrid from "./VolunteerTimeSheetGrid";
import VolunteerAvailability from "./VolunteerAvailability";
import "../../../styles/VolunteerDashboard.css";

const canShowVolunteerAvailability = (user) => {
  const flag = user?.volunteerAvailability ?? user?.VolunteerAvailability ?? "N";
  return String(flag).trim().toUpperCase() === "Y";
};

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
  const chapterId = useMemo(
    () => user?.chapterId ?? user?.chapterID ?? 1,
    [user?.chapterId, user?.chapterID]
  );

  const showVolunteerAvailability = useMemo(
    () => canShowVolunteerAvailability(user),
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

  useEffect(() => {
    if (!isValidated || !username) return;
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await loadDashboard();
    })();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, loadDashboard]);

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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
        <Typography>Access denied.</Typography>
      </Box>
    );
  }

  const panelCardSx = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 2,
    boxShadow: PORTAL_CARD_BOX_SHADOW,
    overflow: "hidden",
    boxSizing: "border-box",
    pl: "16px",
    pr: "16px",
    ...portalCardAntiLiftSx,
  };

  const panelContentSx = {
    px: { xs: 0.5, sm: 1 },
    pt: 1,
    pb: 0,
    "&:last-child": { pb: 1 },
  };

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
      value: summary.mostFrequentTask || "-",
      icon: <TaskIcon fontSize="small" />,
      accent: "#2e7d32",
    },
  ];

  return (
    <Container maxWidth="xl" className="volunteer-dashboard" sx={{ pb: 4 }}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sx={{ width: "100%", pb: "0 !important" }}>
          <Card sx={panelCardSx} className="dashboard-messages-panel">
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
        <Grid item xs={12} sx={{ width: "100%", pt: "0 !important" }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, width: "100%", alignItems: "stretch", mt: -1.5, zoom: "85%" }}>
            {showVolunteerAvailability && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Card
                  sx={{
                    ...panelCardSx,
                    borderTop: "4px solid #43a047",
                    height: "100%"
                  }}
                >
                  <CardContent sx={{ ...panelContentSx, "&:last-child": { pb: 2 } }}>
                    <VolunteerAvailability embedded={true} />
                  </CardContent>
                </Card>
              </Box>
            )}

            <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <Card sx={{ ...panelCardSx, height: "100%" }}>
                <CardContent sx={{ ...panelContentSx, "&:last-child": { pb: 2 }, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 0.5,
                      borderBottom: "1px solid #dcebdc",
                      pb: 0.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        component="h1"
                        sx={{ fontWeight: 800, color: "#1b5e20", letterSpacing: 0, lineHeight: 1.2 }}
                      >
                        Time sheet entry
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

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
                    {statItems.map((item) => (
                      <Box key={item.label}>
                        <Paper
                          sx={{
                            p: 0.75,
                            height: "100%",
                            border: "1px solid #dfe9df",
                            borderLeft: `4px solid ${item.accent}`,
                            borderRadius: 2,
                            boxShadow: "none",
                            background: "linear-gradient(180deg, #ffffff 0%, #fbfffb 100%)",
                            display: "flex",
                            gap: 0.75,
                            alignItems: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
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
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
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
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ width: "100%", mt: 3 }}>
            <Card sx={panelCardSx}>
              <CardContent sx={{ ...panelContentSx, p: 0, "&:last-child": { pb: 0 } }}>
                <VolunteerTimeSheetGrid
                  rows={entries}
                  loading={listLoading}
                  error={listError}
                  onEntriesChanged={loadDashboard}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default VolunteerDashboard;
