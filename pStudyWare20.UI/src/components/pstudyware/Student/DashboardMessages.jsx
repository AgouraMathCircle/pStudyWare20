import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Link,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import studentDashboardService from "../../../services/studentDashboardService";

const IMPORTANT_NOTICE_LINKS = [
  {
    label: "Subscribe and Watch all the Lectures Notes Video",
    href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
    external: true,
    color: "#f44336",
  },
  {
    label: "Send your message to your instructor.",
    href: "/pstudyware/student/message-center",
    external: false,
    color: "#1976d2",
  },
];

const importantNoticeLinkSx = (color) => ({
  display: "block",
  color,
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: 1.15,
  m: 0,
  p: 0,
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
});

const messageCardGridSx = {
  flex: "1 1 0",
  minWidth: "0",
  alignSelf: "flex-start",
};

const messageCardContentSx = {
  px: 2,
  pt: 1.5,
  pb: 0,
  "&:last-child": { pb: 0.75 },
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const messageCardBodySx = {
  color: "#333",
  lineHeight: 1.35,
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
};

const messageCardHeaderSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  mb: 0.75,
};

const compactMessageCardContentSx = {
  px: 1.5,
  pt: 0.75,
  pb: 0,
  "&:last-child": { pb: 0 },
  display: "flex",
  flexDirection: "column",
  width: "100%",
};

const compactMessageCardHeaderSx = {
  ...messageCardHeaderSx,
  mb: 0.25,
};

const DashboardMessages = ({
  username,
  chapterId,
  dashboardMessages: propsDashboardMessages,
  loading: propsLoading,
  compact = false,
}) => {
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

  const cardContentSx = compact ? compactMessageCardContentSx : messageCardContentSx;
  const cardHeaderSx = compact ? compactMessageCardHeaderSx : messageCardHeaderSx;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 0 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        spacing={compact ? 0 : 1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 0,
          ...(compact && { m: 0, width: "100%" }),
        }}
      >
        {(dashboardMessages.importantNotice || IMPORTANT_NOTICE_LINKS.length > 0) && (
          <Grid item xs={12} sm={6} md={3} sx={messageCardGridSx}>
            <Card
              sx={{
                backgroundColor: "#e3f2fd",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#f44336", fontSize: "1rem" }}
                  >
                    Important Notice
                  </Typography>
                  <WarningIcon sx={{ color: "#f44336", fontSize: 24 }} />
                </Box>
                {dashboardMessages.importantNotice && (
                  <Typography variant="body2" sx={messageCardBodySx}>
                    {dashboardMessages.importantNotice}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    mt: dashboardMessages.importantNotice ? 0.25 : 0,
                  }}
                >
                  {IMPORTANT_NOTICE_LINKS.map((item) =>
                    item.external ? (
                      <Link
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={importantNoticeLinkSx(item.color)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <Link
                        key={item.href}
                        component={RouterLink}
                        to={item.href}
                        sx={importantNoticeLinkSx(item.color)}
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.announcement && (
          <Grid item xs={12} sm={6} md={3} sx={messageCardGridSx}>
            <Card
              sx={{
                backgroundColor: "#e8f5e8",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#2196f3", fontSize: "1rem" }}
                  >
                    Math Circle
                  </Typography>
                  <InfoIcon sx={{ color: "#2196f3", fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={messageCardBodySx}>
                  {dashboardMessages.announcement}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.competitions && (
          <Grid item xs={12} sm={6} md={3} sx={messageCardGridSx}>
            <Card
              sx={{
                backgroundColor: "#fff3e0",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#4caf50", fontSize: "1rem" }}
                  >
                    Engineering Circle
                  </Typography>
                  <EmojiEventsIcon sx={{ color: "#4caf50", fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={messageCardBodySx}>
                  {dashboardMessages.competitions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.todoList && (
          <Grid item xs={12} sm={6} md={3} sx={messageCardGridSx}>
            <Card
              sx={{
                backgroundColor: "#f3e5f5",
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "#9c27b0", fontSize: "1rem" }}
                  >
                    Test Preparation
                  </Typography>
                  <ChecklistIcon sx={{ color: "#9c27b0", fontSize: 24 }} />
                </Box>
                <Typography variant="body2" sx={messageCardBodySx}>
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
