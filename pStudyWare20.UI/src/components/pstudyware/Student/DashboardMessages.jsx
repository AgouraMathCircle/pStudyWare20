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
  Button,
} from "@mui/material";
import studentDashboardService from "../../../services/studentDashboardService";
import PdfViewerModal from "../../common/PdfViewerModal";
import {
  adminDashboardWidgetCardSx,
  adminDashboardWidgetColumnSx,
  adminDashboardWidgetTableBodyFontSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

const IMPORTANT_NOTICE_LINKS = [
  {
    label: "Subscribe and Watch all the Lectures Video",
    href: "https://www.youtube.com/channel/UCWK2w-BVGps-Y9c08B5pRgA/featured",
    external: true,
    color: "#1976d2",
  },
  {
    label: "AMC Curriculum",
    prefix: "View: ",
    prefixColor: "#c62828",
    href: "/pstudyware/Documents/AMC_curriculam.pdf",
    isPdf: true,
    color: "#1976d2",
  },
];

const MESSAGE_SECTIONS = [
  {
    key: "importantNotice",
    title: "Important Notice",
    titleColor: "#f44336",
    cardBackground: "#d6e1e8",
    alwaysShow: true,
    showLinks: true,
  },
  {
    key: "announcement",
    title: "Math Circle",
    titleColor: "#3ea7e0",
    cardBackground: "#d6e1e8",
  },
  {
    key: "competitions",
    title: "Engineering Circle",
    titleColor: "#8ea63d",
    cardBackground: "#d6e1e8",
  },
  {
    key: "todoList",
    title: "Test Preparation",
    titleColor: "#3ea7e0",
    cardBackground: "#d6e1e8",
  },
];

const messageWidgetContentSx = {
  flex: "0 1 auto",
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  px: 1,
  py: 0.75,
  "&:last-child": { pb: 0.75 },
};

const messageWidgetBodySx = {
  ...adminDashboardWidgetTableBodyFontSx,
  color: "#003b5c",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
};

const messageWidgetLinkSx = (color) => ({
  ...adminDashboardWidgetTableBodyFontSx,
  color,
  fontWeight: 500,
  lineHeight: 1.3,
  textDecoration: "underline",
  textAlign: "left",
  border: "none",
  background: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  display: "inline",
  "&:hover": {
    textDecoration: "underline",
  },
});

const DashboardMessages = ({
  username,
  chapterId,
  dashboardMessages: propsDashboardMessages,
  loading: propsLoading,
  compact = false,
  timeSheetUrl = "",
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
  const [selectedPdf, setSelectedPdf] = useState(null);

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
      return Boolean(text) || IMPORTANT_NOTICE_LINKS.length > 0;
    }
    return Boolean(text);
  };

  const renderImportantNoticeLinks = () =>
    IMPORTANT_NOTICE_LINKS.map((item, index) => {
      const linkContent = (
        <span>
          {item.prefix && (
            <span
              style={{
                color: item.prefixColor || "inherit",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              {item.prefix}
            </span>
          )}
          <span>{item.label}</span>
        </span>
      );

      const linkElement = item.isPdf ? (
        <Link
          key={item.href}
          component="button"
          onClick={() => setSelectedPdf(item.href)}
          sx={messageWidgetLinkSx(item.color)}
        >
          {linkContent}
        </Link>
      ) : item.external ? (
        <Link
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          sx={messageWidgetLinkSx(item.color)}
        >
          {linkContent}
        </Link>
      ) : (
        <Link
          key={item.href}
          component={RouterLink}
          to={item.href}
          sx={messageWidgetLinkSx(item.color)}
        >
          {linkContent}
        </Link>
      );

      return (
        <React.Fragment key={item.href}>
          {linkElement}
          {index < IMPORTANT_NOTICE_LINKS.length - 1 && (
            <span style={{ margin: "0 4px", color: "#9e9e9e" }}>|</span>
          )}
        </React.Fragment>
      );
    });

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
        className="student-dashboard-widgets-row"
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
                  elevation={3}
                  className="admin-dashboard-widget-card student-dashboard-message-widget"
                  sx={{
                    ...adminDashboardWidgetCardSx,
                    backgroundColor: section.cardBackground || "#d6e1e8",
                  }}
                >
                  <CardContent sx={messageWidgetContentSx}>
                    <Box sx={adminSessionListHeaderBarSx}>
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                          ...adminSessionListTitleSx,
                          color: section.titleColor || adminSessionListTitleSx.color,
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        overflowY: "auto",
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                        minHeight: 0,
                      }}
                    >
                      {text ? (
                        <Typography component="p" sx={messageWidgetBodySx}>
                          {text}
                        </Typography>
                      ) : null}

                      {section.showLinks ? (
                        <Box sx={{ display: "block", lineHeight: 1.3 }}>
                          {renderImportantNoticeLinks()}
                        </Box>
                      ) : null}
                    </Box>

                    {section.key === "todoList" && timeSheetUrl ? (
                      <Box
                        sx={{
                          mt: 0.75,
                          pt: 0.75,
                          borderTop: `1px solid #c8e6c9`,
                        }}
                      >
                        <Button
                          component={RouterLink}
                          to={timeSheetUrl}
                          variant="text"
                          size="small"
                          sx={{
                            ...adminDashboardWidgetTableBodyFontSx,
                            color: "#2e7d32",
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

      <PdfViewerModal
        open={Boolean(selectedPdf)}
        pdfUrl={selectedPdf}
        pdfName="AMC Curriculum"
        onClose={() => setSelectedPdf(null)}
        basePath=""
        apiEndpoint={null}
        downloadEndpoint={null}
      />
    </Box>
  );
};

export default DashboardMessages;
