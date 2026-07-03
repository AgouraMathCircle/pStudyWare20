import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Link,
  Typography,
} from "@mui/material";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import studentDashboardService from "../../../services/studentDashboardService";
import "../../../styles/InstructorDashboard.css";

const IMPORTANT_NOTICE_LINKS = [
  {
    label: "Subscribe and Watch all the Lectures Notes Video",
    href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
    external: true,
    linkClass: "instructor-dashboard-message-link--red",
  },
  {
    label: "Open Message Center",
    href: "/pstudyware/instructor/message-center",
    external: false,
    linkClass: "instructor-dashboard-message-link--blue",
  },
];

const MESSAGE_SECTIONS = [
  {
    key: "importantNotice",
    title: "Important Notice",
    cardClass: "instructor-dashboard-message-card--important",
    titleClass: "instructor-dashboard-message-card-title--important",
    iconClass: "instructor-dashboard-message-card-icon--important",
    Icon: WarningIcon,
    alwaysShow: true,
    showLinks: true,
  },
  {
    key: "announcement",
    title: "Math Circle",
    cardClass: "instructor-dashboard-message-card--announcement",
    titleClass: "instructor-dashboard-message-card-title--announcement",
    iconClass: "instructor-dashboard-message-card-icon--announcement",
    Icon: InfoIcon,
  },
  {
    key: "competitions",
    title: "Engineering Circle",
    cardClass: "instructor-dashboard-message-card--competitions",
    titleClass: "instructor-dashboard-message-card-title--competitions",
    iconClass: "instructor-dashboard-message-card-icon--competitions",
    Icon: EmojiEventsIcon,
  },
  {
    key: "todoList",
    title: "Test Preparation",
    cardClass: "instructor-dashboard-message-card--todo",
    titleClass: "instructor-dashboard-message-card-title--todo",
    iconClass: "instructor-dashboard-message-card-icon--todo",
    Icon: ChecklistIcon,
  },
];

/**
 * Instructor dashboard message cards — same content/layout as student DashboardMessages,
 * styled via InstructorDashboard.css (not StudentDashboard.css).
 */
const InstructorDashboardMessages = ({
  username,
  chapterId,
  dashboardMessages: propsDashboardMessages,
  loading: propsLoading,
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
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("error");

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
          console.error("Instructor dashboard messages:", err);
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

  useEffect(() => {
    if (error) {
      showSnackbar(error, "error");
    }
  }, [error, showSnackbar]);

  if (loading) {
    return (
      <Box className="instructor-dashboard-messages-loading">
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />;
  }

  const shouldShowSection = (section) => {
    const text = dashboardMessages[section.key];
    if (section.alwaysShow) {
      return Boolean(text) || IMPORTANT_NOTICE_LINKS.length > 0;
    }
    return Boolean(text);
  };

  return (
    <Box className="instructor-dashboard-messages">
      <Box className="instructor-dashboard-messages-grid">
        {MESSAGE_SECTIONS.filter(shouldShowSection).map((section) => {
          const text = dashboardMessages[section.key];
          const { Icon } = section;

          return (
            <Card
              key={section.key}
              className={`instructor-dashboard-message-card ${section.cardClass}`}
              elevation={0}
            >
              <CardContent>
                <Box className="instructor-dashboard-message-card-header">
                  <Typography
                    component="h3"
                    className={`instructor-dashboard-message-card-title ${section.titleClass}`}
                  >
                    {section.title}
                  </Typography>
                  <Icon className={section.iconClass} />
                </Box>

                {text ? (
                  <Typography component="p" className="instructor-dashboard-message-card-body">
                    {text}
                  </Typography>
                ) : null}

                {section.showLinks ? (
                  <Box
                    className="instructor-dashboard-message-links"
                    sx={{ mt: text ? 0.25 : 0 }}
                  >
                    {IMPORTANT_NOTICE_LINKS.map((item) =>
                      item.external ? (
                        <Link
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`instructor-dashboard-message-link ${item.linkClass}`}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <Link
                          key={item.href}
                          component={RouterLink}
                          to={item.href}
                          className={`instructor-dashboard-message-link ${item.linkClass}`}
                        >
                          {item.label}
                        </Link>
                      )
                    )}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

export default InstructorDashboardMessages;
