import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Container, Grid, Paper, Typography, Button, Card, CardContent } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
} from "../styles/applicationSurfaces";
import studentDashboardService from "../../../services/studentDashboardService";
import volunteerDashboardService from "../../../services/volunteerDashboardService";
import VolunteerTimeSheetGrid from "./VolunteerTimeSheetGrid";
import VolunteerAvailability from "./VolunteerAvailability";


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
    () => user?.volunteerAvailability === "Y" || user?.VolunteerAvailability === "Y",
    [user?.volunteerAvailability, user?.VolunteerAvailability]
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
    <Container maxWidth="xl" sx={{ pb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ pb: "0 !important" }}>
          <Card sx={panelCardSx}>
            <CardContent sx={panelContentSx}>
              <DashboardMessages
                username={username}
                chapterId={chapterId}
                dashboardMessages={dashboardMessages}
                loading={messagesLoading}
              />
            </CardContent>
          </Card>
        </Grid>
        {/* Left Column: Stats & Logged Hours Grid */}
        <Grid item xs={12} md={showVolunteerAvailability ? 8 : 12} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Card sx={panelCardSx}>
            <CardContent sx={panelContentSx}>
              {/* Header Box with Title and Action Button */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  mb: 2.5,
                  borderBottom: "1px solid #e0e0e0",
                  pb: 1.5,
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ flexGrow: 1, fontWeight: 700, color: "#4527a0" }}
                >
                  Time sheet entry
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<AddIcon />}
                  component={RouterLink}
                  to="/pstudyware/volunteer/time-sheet"
                  sx={{
                    backgroundColor: "#7e57c2",
                    "&:hover": {
                      backgroundColor: "#5e35b1",
                    },
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Log hours
                </Button>
              </Box>

              {/* Stats Cards Row */}
              <Grid container spacing={2} sx={{ mb: 1.5 }}>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      height: "100%",
                      border: "1px solid #e0e0e0",
                      boxShadow: "none",
                      backgroundColor: "#fbfbfe",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Total volunteer hours
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", mt: 0.5 }}>
                      {(summary.totalVolunteerHours ?? 0).toFixed(2)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      height: "100%",
                      border: "1px solid #e0e0e0",
                      boxShadow: "none",
                      backgroundColor: "#fbfbfe",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Entries
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#333", mt: 0.5 }}>
                      {summary.totalEntries ?? 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper
                    sx={{
                      p: 2,
                      height: "100%",
                      border: "1px solid #e0e0e0",
                      boxShadow: "none",
                      backgroundColor: "#fbfbfe",
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Most frequent task
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: "#333", mt: 0.8 }}>
                      {summary.mostFrequentTask || "—"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <VolunteerTimeSheetGrid
            rows={entries}
            loading={listLoading}
            error={listError}
            onEntriesChanged={loadDashboard}
          />
        </Grid>

        {/* Right Column: Volunteer Availability Form */}
        {showVolunteerAvailability && (
          <Grid item xs={12} md={4}>
            <Card sx={panelCardSx}>
              <CardContent sx={panelContentSx}>
                <VolunteerAvailability embedded={true} />
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default VolunteerDashboard;
