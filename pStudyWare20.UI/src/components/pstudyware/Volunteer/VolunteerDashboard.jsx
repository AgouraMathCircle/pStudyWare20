import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Container, Grid, Typography, Button, Card, CardContent, Stack } from "@mui/material";
import { 
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import studentDashboardService from "../../../services/studentDashboardService";
import volunteerDashboardService from "../../../services/volunteerDashboardService";
import VolunteerAvailability from "./VolunteerAvailability";
import VolunteerHeader from "./VolunteerHeader";
import VolunteerTimeSheetGrid from "./VolunteerTimeSheetGrid";

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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>Loading your dashboard…</Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "#f5576c", fontWeight: 600 }}>Access denied. Please log in as a volunteer.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#e8f5e9" }}>
      <VolunteerHeader user={user} />
      <Container maxWidth="xl" sx={{ pt: { xs: 14, md: 16 }, pb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 2,
                backgroundColor: "#ffffff",
                p: 3,
                borderRadius: 2,
                border: "1px solid #e8f5e9",
                boxShadow: "0 10px 30px rgba(46, 125, 50, 0.08)",
              }}
            >
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: "#2e7d32", mb: 1 }}>
                  Volunteer Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: "#2e7d32", opacity: 0.85, maxWidth: 760 }}>
                  Track your volunteer hours, manage your availability, and access classroom resources from one central page.
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Box sx={{ backgroundColor: "#e8f5e9", borderRadius: 2, p: 1.5, minWidth: 140, textAlign: "center", border: "1px solid #c8e6c9" }}>
                  <Typography variant="subtitle2" sx={{ color: "#2e7d32", fontWeight: 700, mb: 0.5 }}>
                    Last Entry
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1b5e20", fontWeight: 600 }}>
                    {summary.lastEntryDate ? new Date(summary.lastEntryDate).toLocaleDateString() : "No entries"}
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#e8f5e9", borderRadius: 2, p: 1.5, minWidth: 140, textAlign: "center", border: "1px solid #c8e6c9" }}>
                  <Typography variant="subtitle2" sx={{ color: "#2e7d32", fontWeight: 700, mb: 0.5 }}>
                    Focus Area
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#1b5e20", fontWeight: 600 }}>
                    {summary.mostFrequentTask || "No task yet"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <DashboardMessages
              username={username}
              chapterId={chapterId}
              dashboardMessages={dashboardMessages}
              loading={messagesLoading}
            />
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(46, 125, 50, 0.08)",
                border: "1px solid #e8f5e9",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                }
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#388e3c", opacity: 0.9, mb: 1, fontWeight: 600 }}>
                    Volunteer Hours
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1b5e20" }}>
                    {(summary.totalVolunteerHours ?? 0).toFixed(2)}
                  </Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 48, color: "#66bb6a" }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(46, 125, 50, 0.08)",
                border: "1px solid #e8f5e9",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                }
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#388e3c", opacity: 0.9, mb: 1, fontWeight: 600 }}>
                    Timesheet Records
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#1b5e20" }}>
                    {summary.totalEntries ?? 0}
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 48, color: "#66bb6a" }} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card 
              sx={{ 
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(46, 125, 50, 0.08)",
                border: "1px solid #e8f5e9",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                }
              }}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle2" sx={{ color: "#388e3c", opacity: 0.9, mb: 1, fontWeight: 600 }}>
                    Focus Area
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: "#1b5e20",
                      fontSize: "1.2rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {summary.mostFrequentTask || "No task yet"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main content + sidebar */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ 
              backgroundColor: "#ffffff",
              borderRadius: 3,
              boxShadow: "0 10px 26px rgba(46, 125, 50, 0.08)",
              overflow: "hidden"
            }}>
              <Box sx={{
                backgroundColor: "#dcedc8",
                color: "#1b5e20",
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderBottom: "1px solid #c8e6c9"
              }}>
                <AccessTimeIcon sx={{ color: "#2e7d32" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                  Time Sheet Records
                </Typography>
              </Box>
              <VolunteerTimeSheetGrid
                rows={entries}
                loading={listLoading}
                error={listError}
                onEntriesChanged={loadDashboard}
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <Box sx={{ 
                backgroundColor: "#ffffff",
                borderRadius: 3,
                boxShadow: "0 10px 26px rgba(46, 125, 50, 0.08)",
                overflow: "hidden"
              }}>
                <Box sx={{
                  backgroundColor: "#dcedc8",
                  color: "#1b5e20",
                  p: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderBottom: "1px solid #c8e6c9"
                }}>
                  <CheckCircleIcon sx={{ color: "#2e7d32" }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, m: 0 }}>
                    Availability
                  </Typography>
                </Box>
                <VolunteerAvailability embedded />
              </Box>

            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default VolunteerDashboard;
