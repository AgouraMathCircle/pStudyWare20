import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import StudentMeetingSchedule from "../Student/StudentMeetingSchedule";
import instructorDashboardService from "../../../services/instructorDashboardService";
import studentDashboardService from "../../../services/studentDashboardService";
import volunteerAvailabilityService from "../../../services/volunteerAvailabilityService";
import InstructorStudentListGrid from "./InstructorStudentListGrid";
import InstructorVolunteerAvailabilityGrid from "./InstructorVolunteerAvailabilityGrid";
import VolunteerAvailability from "../Volunteer/VolunteerAvailability";
import {
  instructorDashboardMeetingTitleSx,
  instructorDashboardMessagesPanelContentSx,
  instructorDashboardPanelCardSx,
  instructorDashboardPanelContentSx,
} from "./instructorPortalTableStyles";
import {
  instructorPortalContentContainerProps,
  portalDashboardPageSx,
} from "../styles/applicationSurfaces";
import "../../../styles/InstructorDashboard.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [studentRows, setStudentRows] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
  
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
    if (memberType !== "I" && memberType !== "C" && role !== "Instructor") {
      hasRedirectedRef.current = true;
      if (memberType === "A" || role === "Admin") {
        navigate("/pstudyware/admin/dashboard", { replace: true });
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

  const loadStudentList = useCallback(async ({ silent = false } = {}) => {
    if (!username) return;

    if (!silent) {
      setListError(null);
      setListLoading(true);
    }

    try {
      const res = await instructorDashboardService.getDashboardData(username);
      const list = res?.studentList ?? res?.StudentList;
      if (res?.isSuccess && Array.isArray(list)) {
        setStudentRows(list);
        setListError(null);
      } else {
        setStudentRows([]);
        setListError(res?.errorMessage || res?.message || "Could not load student list.");
      }
    } catch (e) {
      setListError(e?.message || "Failed to load student list.");
      setStudentRows([]);
    } finally {
      if (!silent) setListLoading(false);
    }
  }, [username]);

  const loadVolunteerAvailability = useCallback(async () => {
    if (!username) return;

    setAvailabilityError(null);
    setAvailabilityLoading(true);

    try {
      const res = await volunteerAvailabilityService.getAvailabilitySummary({ username });
      if (res?.isSuccess) {
        setAvailabilityRows(res.summaryData || []);
        setAvailabilityError(null);
      } else {
        setAvailabilityRows([]);
        setAvailabilityError(res?.errorMessage || "Could not load volunteer availability list.");
      }
    } catch (e) {
      setAvailabilityError(e?.message || "Failed to load volunteer availability list.");
      setAvailabilityRows([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, [username]);

  useEffect(() => {
    if (!isValidated || !username) return;

    let cancelled = false;

    const load = async () => {
      if (cancelled) return;
      await Promise.all([
        loadStudentList(),
        loadVolunteerAvailability()
      ]);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username, loadStudentList, loadVolunteerAvailability]);

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
        if (!cancelled) console.error("Instructor dashboard messages:", err);
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
        className="instructor-dashboard"
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
        <CircularProgress size={60} sx={{ color: "#1565c0" }} />
        <Typography variant="h6" color="textSecondary">
          Loading Instructor Dashboard...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user || !isValidated) {
    return (
      <Box
        className="instructor-dashboard"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <Alert severity="error">Access denied. Please log in as an instructor.</Alert>
      </Box>
    );
  }

  return (
    <Box className="instructor-dashboard">
      <Container {...instructorPortalContentContainerProps} sx={{ mb: 4, pt: 0, mt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ pb: "0 !important", mb: "-4px !important" }}>
            <Card sx={instructorDashboardPanelCardSx} className="dashboard-messages-panel">
              <CardContent sx={instructorDashboardMessagesPanelContentSx}>
                <DashboardMessages
                  username={username}
                  chapterId={chapterId}
                  dashboardMessages={dashboardMessages}
                  loading={messagesLoading}
                  compact
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Left Column: Stats & Logged Hours / Schedules */}
          <Grid item xs={12} md={showVolunteerAvailability ? 8 : 12} sx={{ display: "flex", flexDirection: "column", gap: 3, pt: "0 !important" }}>
            <StudentMeetingSchedule
              username={username}
              panelCardSx={instructorDashboardPanelCardSx}
              sectionTitleSx={instructorDashboardMeetingTitleSx}
            />

            <Card sx={instructorDashboardPanelCardSx}>
              <CardContent sx={instructorDashboardPanelContentSx}>
                <InstructorVolunteerAvailabilityGrid
                  rows={availabilityRows}
                  loading={availabilityLoading}
                  error={availabilityError}
                />
              </CardContent>
            </Card>

            <Card sx={instructorDashboardPanelCardSx}>
              <CardContent sx={instructorDashboardPanelContentSx}>
                <InstructorStudentListGrid
                  rows={studentRows}
                  loading={listLoading}
                  error={listError}
                  dashboardView
                  onStudentSaved={() => loadStudentList({ silent: true })}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Own Volunteer Availability Form */}
          {showVolunteerAvailability && (
            <Grid item xs={12} md={4} sx={{ pt: "0 !important" }}>
              <Card sx={instructorDashboardPanelCardSx}>
                <CardContent sx={instructorDashboardPanelContentSx}>
                  <VolunteerAvailability embedded={true} />
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default InstructorDashboard;
