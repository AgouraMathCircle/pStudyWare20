import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import studentDashboardService from "../../../services/studentDashboardService";

const DashboardMessages = ({
  username,
  chapterId,
  dashboardMessages: propsDashboardMessages,
  loading: propsLoading,
}) => {
  // When parent passes data (single fetch from StudentDashboard), use it and don't call API
  const isControlled = propsDashboardMessages != null;
  const [internalMessages, setInternalMessages] = useState({
    importantNotice: "",
    announcement: "",
    competitions: "",
    todoList: "",
  });
  const [internalLoading, setInternalLoading] = useState(!isControlled);
  const [error, setError] = useState(null);

  const dashboardMessages = isControlled ? propsDashboardMessages : internalMessages;
  const loading = isControlled ? (propsLoading ?? false) : internalLoading;

  // Only fetch when not controlled by parent (e.g. if used elsewhere without props)
  useEffect(() => {
    if (isControlled || !username || !chapterId) {
      if (isControlled) setError(null);
      return;
    }

    let cancelled = false;

    const loadDashboardData = async () => {
      try {
        setInternalLoading(true);
        setError(null);
        const response = await studentDashboardService.getDashboardData(
          username,
          chapterId
        );
        if (cancelled) return;
        if (response.isSuccess) {
          setInternalMessages({
            importantNotice: response.importantNotice || "",
            announcement: response.announcement || "",
            competitions: response.competitions || "",
            todoList: response.todoList || "",
          });
        } else {
          setError(response.message || "Failed to load dashboard messages");
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error fetching dashboard messages:", err);
          setError("Failed to load dashboard messages. Please try again.");
        }
      } finally {
        if (!cancelled) setInternalLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, [isControlled, username, chapterId]);

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Dashboard Messages Section */}
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 600, color: "#1976d2" }}
      >
        Dashboard Messages
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        {/* Important Notice Card */}
        {dashboardMessages.importantNotice && (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ flex: "1 1 0", minWidth: "0" }}
          >
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#e3f2fd",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#f44336", fontSize: "1rem" }}
                  >
                    Important Notice
                  </Typography>
                  <WarningIcon sx={{ color: "#f44336", fontSize: 24 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    lineHeight: 1.5,
                    flex: 1,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {dashboardMessages.importantNotice}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Announcement Card */}
        {dashboardMessages.announcement && (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ flex: "1 1 0", minWidth: "0" }}
          >
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#e8f5e8",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2196f3", fontSize: "1rem" }}
                  >
                    Math Circle
                  </Typography>
                  <InfoIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    lineHeight: 1.5,
                    flex: 1,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {dashboardMessages.announcement}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Competitions Card */}
        {dashboardMessages.competitions && (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ flex: "1 1 0", minWidth: "0" }}
          >
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#fff3e0",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#4caf50", fontSize: "1rem" }}
                  >
                    Engineering Circle
                  </Typography>
                  <EmojiEventsIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    lineHeight: 1.5,
                    flex: 1,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {dashboardMessages.competitions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Todo List Card */}
        {dashboardMessages.todoList && (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ flex: "1 1 0", minWidth: "0" }}
          >
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#f3e5f5",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#9c27b0", fontSize: "1rem" }}
                  >
                    Test Preparation
                  </Typography>
                  <ChecklistIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#333",
                    lineHeight: 1.5,
                    flex: 1,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "normal",
                  }}
                >
                  {dashboardMessages.todoList}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DashboardMessages;
