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
  Button,
} from "@mui/material";
import studentDashboardService from "../../../services/studentDashboardService";
import { getDashboardNoticeLinks } from "../Common/dashboardMessageLinks";
import {
  adminDashboardWidgetCardSx,
  adminDashboardWidgetColumnSx,
  adminDashboardWidgetTableBodyFontSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";
import "../../../styles/DashboardMessages.css";

const MESSAGE_GREEN = {
  cardBg: "#eef6ee",
  cardBorder: "#c8e6c9",
  body: "#000000",
  link: "#1565c0",
  linkHover: "#0d47a1",
  muted: "#5a6b5a",
  titleBarBg: "#d8efd0",
  titleBarBorder: "#a5d6a7",
};

const MESSAGE_SECTIONS = [
  {
    key: "importantNotice",
    title: "Important Notice",
    titleColor: "#b71c1c",
    titleBarBg: "#ffcdd2",
    titleBarBorder: "#ef9a9a",
    cardBackground: MESSAGE_GREEN.cardBg,
    alwaysShow: true,
    showLinks: true,
  },
  {
    key: "announcement",
    title: "Math Circle",
    titleColor: "#1565c0",
    titleBarBg: "#bbdefb",
    titleBarBorder: "#90caf9",
    cardBackground: MESSAGE_GREEN.cardBg,
  },
  {
    key: "competitions",
    title: "Engineering Circle",
    titleColor: "#558b2f",
    titleBarBg: "#dcedc8",
    titleBarBorder: "#aed581",
    cardBackground: MESSAGE_GREEN.cardBg,
  },
  {
    key: "todoList",
    title: "Test Preparation",
    titleColor: "#00838f",
    titleBarBg: "#b2ebf2",
    titleBarBorder: "#4dd0e1",
    cardBackground: MESSAGE_GREEN.cardBg,
  },
];

const messageWidgetContentSx = {
  flex: "0 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  px: 1,
  py: 0.5,
  "&:last-child": { pb: 0.5 },
};

const messageWidgetBodySx = {
  ...adminDashboardWidgetTableBodyFontSx,
  color: MESSAGE_GREEN.body,
  fontSize: "0.875rem",
  lineHeight: 1.3,
  margin: 0,
  mb: 0.25,
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
};

const messageWidgetLinkSx = (color) => ({
  ...adminDashboardWidgetTableBodyFontSx,
  color: `${color} !important`,
  fontWeight: 600,
  fontSize: "0.875rem",
  lineHeight: 1.2,
  textDecoration: "underline",
  textDecorationColor: "rgba(21, 101, 192, 0.45)",
  textUnderlineOffset: "2px",
  textAlign: "left",
  cursor: "pointer",
  display: "inline",
  padding: 0,
  margin: 0,
  border: "none",
  background: "none",
  boxShadow: "none",
  borderRadius: 0,
  appearance: "none",
  WebkitAppearance: "none",
  verticalAlign: "baseline",
  "&:hover": {
    color: `${MESSAGE_GREEN.linkHover} !important`,
    textDecoration: "underline",
    textDecorationColor: MESSAGE_GREEN.linkHover,
    background: "none",
    boxShadow: "none",
  },
});

const DashboardMessages = ({
  username,
  chapterId,
  dashboardMessages: propsDashboardMessages,
  loading: propsLoading,
  compact = false,
  timeSheetUrl = "",
  variant = "student",
  noticeLinks: noticeLinksProp,
}) => {
  const importantNoticeLinks =
    noticeLinksProp ?? getDashboardNoticeLinks(variant);
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

  const shouldShowSection = (section) => {
    const text = dashboardMessages[section.key];
    if (section.alwaysShow) {
      return Boolean(text) || importantNoticeLinks.length > 0;
    }
    return Boolean(text);
  };

  const renderImportantNoticeLinks = () => {
    const links = importantNoticeLinks.map((item) => {
      const linkContent = (
        <>
          {item.prefix ? (
            <span
              style={{
                color: item.prefixColor || "inherit",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {item.prefix}
            </span>
          ) : null}
          <span>{item.label}</span>
        </>
      );

      if (item.external) {
        return (
          <Box
            key={item.href}
            component="a"
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            sx={messageWidgetLinkSx(item.color)}
          >
            {linkContent}
          </Box>
        );
      }

      return (
        <Box
          key={item.href}
          component={RouterLink}
          to={item.href}
          sx={messageWidgetLinkSx(item.color)}
        >
          {linkContent}
        </Box>
      );
    });

    return links.reduce((nodes, link, index) => {
      if (index > 0) {
        nodes.push(<br key={`notice-link-br-${index}`} />);
      }
      nodes.push(link);
      return nodes;
    }, []);
  };

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

  const visibleSections = MESSAGE_SECTIONS.filter(shouldShowSection);

  return (
    <Box sx={{ width: "100%" }}>
      <Grid
        container
        spacing={compact ? 2 : 4}
        className="dashboard-messages-widgets-row"
        sx={{
          alignItems: "flex-start",
          flexWrap: "wrap",
          width: "100%",
          m: 0,
        }}
      >
        {visibleSections.map((section) => {
          const text = dashboardMessages[section.key];

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={section.key}
              sx={adminDashboardWidgetColumnSx}
            >
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  maxWidth: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Card
                  elevation={0}
                  className="admin-dashboard-widget-card dashboard-message-widget"
                  sx={{
                    ...adminDashboardWidgetCardSx,
                    backgroundColor: section.cardBackground || MESSAGE_GREEN.cardBg,
                    border: `1px solid ${MESSAGE_GREEN.cardBorder}`,
                    boxShadow: "none",
                  }}
                >
                  <CardContent sx={messageWidgetContentSx}>
                    <Box
                      sx={{
                        ...adminSessionListHeaderBarSx,
                        backgroundColor:
                          section.titleBarBg || MESSAGE_GREEN.titleBarBg,
                        borderBottom: `1px solid ${
                          section.titleBarBorder || MESSAGE_GREEN.titleBarBorder
                        }`,
                        borderRadius: "2px",
                        mx: -0.25,
                        mb: 0.5,
                        px: 0.75,
                        py: 0.35,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                          ...adminSessionListTitleSx,
                          color: section.titleColor || "#174a10",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                          letterSpacing: "0.01em",
                          lineHeight: 1.25,
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        overflowY: "auto",
                        flexGrow: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                        minHeight: 0,
                      }}
                    >
                      {text ? (
                        <Typography
                          component="p"
                          className="dashboard-message-body"
                          sx={messageWidgetBodySx}
                        >
                          {text}
                        </Typography>
                      ) : null}

                      {section.showLinks ? (
                        <Box
                          className="dashboard-message-notice-links"
                          sx={{
                            display: "block",
                            lineHeight: 1.2,
                            m: 0,
                            p: 0,
                          }}
                        >
                          {renderImportantNoticeLinks()}
                        </Box>
                      ) : null}
                    </Box>

                    {section.key === "todoList" && timeSheetUrl ? (
                      <Box
                        sx={{
                          mt: 0.75,
                          pt: 0.75,
                          borderTop: `1px solid ${MESSAGE_GREEN.cardBorder}`,
                        }}
                      >
                        <Button
                          component={RouterLink}
                          to={timeSheetUrl}
                          variant="text"
                          size="small"
                          sx={{
                            ...adminDashboardWidgetTableBodyFontSx,
                            color: MESSAGE_GREEN.link,
                            fontWeight: 600,
                            textTransform: "none",
                            p: 0,
                            minWidth: 0,
                          }}
                        >
                          Add time sheet
                        </Button>
                      </Box>
                    ) : null}
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DashboardMessages;
