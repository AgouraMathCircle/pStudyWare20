import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Grid, Typography } from "@mui/material";
import { instructorPageShellSx } from "./instructorPortalTableStyles";
import { useAuth } from "../../../contexts/AuthContext";
import DashboardMessages from "../Student/DashboardMessages";
import StudentMeetingSchedule from "../Student/StudentMeetingSchedule";
import instructorDashboardService from "../../../services/instructorDashboardService";
import studentDashboardService from "../../../services/studentDashboardService";
import InstructorStudentListGrid from "./InstructorStudentListGrid";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);
  const [studentRows, setStudentRows] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);
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
    if (memberType !== "I" && role !== "Instructor") {
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

  useEffect(() => {
    if (!isValidated || !username) return;

    let cancelled = false;

    const load = async () => {
      setListError(null);
      setListLoading(true);
      try {
        const res = await instructorDashboardService.getDashboardData(username);
        if (cancelled) return;
        const list = res?.studentList ?? res?.StudentList;
        if (res?.isSuccess && Array.isArray(list)) {
          setStudentRows(list);
        } else {
          setStudentRows([]);
          setListError(res?.errorMessage || res?.message || "Could not load student list.");
        }
      } catch (e) {
        if (!cancelled) {
          setListError(e?.message || "Failed to load student list.");
          setStudentRows([]);
        }
      } finally {
        if (!cancelled) setListLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [isValidated, username]);

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

  return (
    <Box sx={instructorPageShellSx}>
      <Container maxWidth="xl" sx={{ mb: 4, px: { xs: 1, sm: 2 } }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DashboardMessages
              username={username}
              chapterId={chapterId}
              dashboardMessages={dashboardMessages}
              loading={messagesLoading}
            />
          </Grid>
          <Grid item xs={12}>
            <StudentMeetingSchedule username={username} />
          </Grid>
          <Grid item xs={12}>
            <InstructorStudentListGrid
              rows={studentRows}
              loading={listLoading}
              error={listError}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InstructorDashboard;
