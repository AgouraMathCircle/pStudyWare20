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
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  EmojiEvents as EmojiEventsIcon,
  Checklist as ChecklistIcon,
} from "@mui/icons-material";
import studentDashboardService from "../../../services/studentDashboardService";
import PdfViewerModal from "../../common/PdfViewerModal";

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

const importantNoticeLinkSx = (color) => ({
  color,
  fontSize: "0.75rem",
  fontWeight: 500,
  lineHeight: 1.3,
  textDecoration: "none",
  textAlign: "left",
  "&:hover": {
    textDecoration: "none",
  },
});

const messageCardGridSx = {
  alignSelf: "stretch",
  display: "flex",
  flex: "1 1 0%",
  maxWidth: "25%",
  minWidth: 240,
  height: "100%",
};

const messageCardBaseSx = {
  borderRadius: 2.5,
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  position: "relative",
  overflow: "hidden",
  minHeight: 140,
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },
};

const messageCardContentSx = {
  px: 2.25,
  pt: 2,
  pb: 1.75,
  "&:last-child": { pb: 1.75 },
  display: "flex",
  flexDirection: "column",
  width: "100%",
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
};

const messageCardBodySx = {
  color: "#333",
  fontSize: "0.8rem",
  lineHeight: 1.45,
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
};

const messageCardHeaderSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  mb: 1.25,
};

const compactMessageCardContentSx = {
  px: 1.75,
  pt: 1.25,
  pb: 1.25,
  "&:last-child": { pb: 1.25 },
  display: "flex",
  flexDirection: "column",
  width: "100%",
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
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
        spacing={compact ? 0 : 2}
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "stretch",
          mb: 0,
          width: "100%",
          overflowX: "auto",
          ...(compact && { m: 0 }),
        }}
      >
        {(dashboardMessages.importantNotice || IMPORTANT_NOTICE_LINKS.length > 0) && (
          <Grid item xs={3} sx={messageCardGridSx}>
            <Card
              sx={{
                ...messageCardBaseSx,
                background: "linear-gradient(180deg, #ffffff 60%, #fff8f8 100%)",
                borderLeft: "6px solid #e53935",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#111111", fontSize: "0.85rem" }}
                  >
                    Important Notice
                  </Typography>
                  <WarningIcon sx={{ color: "#e53935", fontSize: 22 }} />
                </Box>
                
                <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 1, pr: 0.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {dashboardMessages.importantNotice && (
                    <Typography variant="body2" sx={{ ...messageCardBodySx, color: "#333333" }}>
                      {dashboardMessages.importantNotice}
                    </Typography>
                  )}
                  <Box sx={{ display: "block", lineHeight: 1.3 }}>
                    {IMPORTANT_NOTICE_LINKS.map((item, index) => {
                    const linkContent = (
                      <span>
                        {item.prefix && (
                          <span style={{ color: item.prefixColor || "inherit", fontWeight: 500, textDecoration: "none" }}>
                            {item.prefix}
                          </span>
                        )}
                        <span style={{ textDecoration: "underline" }}>
                          {item.label}
                        </span>
                      </span>
                    );

                    const linkElement = item.isPdf ? (
                      <Link
                        key={item.href}
                        component="button"
                        onClick={() => setSelectedPdf(item.href)}
                        sx={{
                          ...importantNoticeLinkSx(item.color),
                          border: "none",
                          background: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          display: "inline",
                        }}
                      >
                        {linkContent}
                      </Link>
                    ) : item.external ? (
                      <Link
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          ...importantNoticeLinkSx(item.color),
                          display: "inline"
                        }}
                      >
                        {linkContent}
                      </Link>
                    ) : (
                      <Link
                        key={item.href}
                        component={RouterLink}
                        to={item.href}
                        sx={{
                          ...importantNoticeLinkSx(item.color),
                          display: "inline"
                        }}
                      >
                        {linkContent}
                      </Link>
                    );
                    
                    return (
                      <React.Fragment key={item.href}>
                        {linkElement}
                        {index < IMPORTANT_NOTICE_LINKS.length - 1 && (
                          <span style={{ margin: "0 4px", color: "#ccc" }}>|</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.announcement && (
          <Grid item xs={3} sx={messageCardGridSx}>
            <Card
              sx={{
                ...messageCardBaseSx,
                background: "linear-gradient(180deg, #ffffff 60%, #f7fbff 100%)",
                borderLeft: "6px solid #1e88e5",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#111111", fontSize: "0.85rem" }}
                  >
                    Math Circle
                  </Typography>
                  <InfoIcon sx={{ color: "#1e88e5", fontSize: 22 }} />
                </Box>
                <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 1, pr: 0.5 }}>
                  <Typography variant="body2" sx={{ ...messageCardBodySx, color: "#333333" }}>
                    {dashboardMessages.announcement}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.competitions && (
          <Grid item xs={3} sx={messageCardGridSx}>
            <Card
              sx={{
                ...messageCardBaseSx,
                background: "linear-gradient(180deg, #ffffff 60%, #f4faf4 100%)",
                borderLeft: "6px solid #43a047",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#111111", fontSize: "0.85rem" }}
                  >
                    Engineering Circle
                  </Typography>
                  <EmojiEventsIcon sx={{ color: "#43a047", fontSize: 22 }} />
                </Box>
                <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 1, pr: 0.5 }}>
                  <Typography variant="body2" sx={{ ...messageCardBodySx, color: "#333333" }}>
                    {dashboardMessages.competitions}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {dashboardMessages.todoList && (
          <Grid item xs={3} sx={messageCardGridSx}>
            <Card
              sx={{
                ...messageCardBaseSx,
                background: "linear-gradient(180deg, #ffffff 60%, #faf5fc 100%)",
                borderLeft: "6px solid #8e24aa",
              }}
            >
              <CardContent sx={cardContentSx}>
                <Box sx={cardHeaderSx}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#6a1b9a", fontSize: "0.85rem" }}
                  >
                    Test Preparation
                  </Typography>
                  <ChecklistIcon sx={{ color: "#8e24aa", fontSize: 22 }} />
                </Box>
                <Box sx={{ overflowY: "auto", flexGrow: 1, mb: 1, pr: 0.5 }}>
                  <Typography variant="body2" sx={{ ...messageCardBodySx, color: "#333333" }}>
                    {dashboardMessages.todoList}
                  </Typography>
                </Box>
                {timeSheetUrl && (
                  <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid #e1bee7" }}>
                    <Button
                      component={RouterLink}
                      to={timeSheetUrl}
                      variant="text"
                      size="small"
                      sx={{ color: "#6a1b9a", fontWeight: "bold", textTransform: "none", p: 0 }}
                    >
                      Add time sheet
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
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
