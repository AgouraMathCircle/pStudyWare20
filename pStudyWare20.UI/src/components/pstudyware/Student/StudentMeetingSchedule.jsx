import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Tooltip,
} from "@mui/material";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import {
  AccessTime as AccessTimeIcon,
  VpnKey as VpnKeyIcon,
  MeetingRoom as MeetingRoomIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import meetingDetailsService from "../../../services/meetingDetailsService";
import {
  PORTAL_CARD_BOX_SHADOW,
  portalCardAntiLiftSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
  dashboardMessagesPanelContentSx,
} from "../styles/applicationSurfaces";

const ZoomIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M21 7.156l-3.375 2.531v-2.187c0-1.406-1.125-2.5-2.531-2.5h-11.25c-1.406 0-2.531 1.094-2.531 2.5v9c0 1.406 1.125 2.5 2.531 2.5h11.25c1.406 0 2.531-1.094 2.531-2.5v-2.188l3.375 2.531c0.688 0.5 1.5 0 1.5-0.844v-7.656c0-0.844-0.813-1.344-1.5-0.844z" />
  </svg>
);

const sectionTitle = "Meeting Schedule";

const defaultPanelCardSx = {
  backgroundColor: "white",
  borderRadius: 2,
  boxShadow: PORTAL_CARD_BOX_SHADOW,
  overflow: "hidden",
  boxSizing: "border-box",
  pl: "35px",
  pr: "35px",
  ...portalCardAntiLiftSx,
};

const CLASS_LABELS = {
  JB: "Junior Beginner",
  JI: "Junior Intermediate",
  JA: "Junior Advanced",
  SB: "Senior Beginner",
  SI: "Senior Intermediate",
  SA: "Senior Advanced",
  DS: "Data Science",
  AI: "Artificial Intelligence",
  GD: "Game Development",
  AD: "App Development",
  DM: "Data Management",
  ST: "PSAT/SAT",
  AT: "ACT",
  ED: "Engineering Design",
};

const getClassLabel = (classCode) => {
  if (!classCode) return "";
  return CLASS_LABELS[classCode] || classCode;
};

const getMeetingClassDisplay = (meeting, getProp) => {
  const className = getProp(meeting, "ClassName");
  if (className) return className;

  const classCode = getProp(meeting, "Class");
  if (classCode) return getClassLabel(classCode);

  return getProp(meeting, "ChapterName");
};

const formatMeetingDateTime = (meetingDate, meetingTime) => {
  if (!meetingDate) return "";
  if (meetingTime && !meetingDate.includes(meetingTime)) {
    return `${meetingDate} ${meetingTime}`;
  }
  return meetingDate;
};

const MEETING_CACHE_TTL_MS = 2 * 60 * 1000;
const meetingSchedulesCacheByUser = {};

const getMeetingSchedules = (response) => {
  if (!response?.isSuccess) return null;
  return response.meetingSchedules || [];
};

const renderSectionHeader = (sectionTitleSx) => (
  <Box sx={adminSessionListHeaderBarSx}>
    <Typography variant="subtitle1" component="div" sx={sectionTitleSx}>
      {sectionTitle}
    </Typography>
  </Box>
);

const StudentMeetingSchedule = ({
  username,
  panelCardSx = defaultPanelCardSx,
  sectionTitleSx = adminSessionListTitleSx,
}) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedText, setCopiedText] = useState("");
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("warning");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const getProp = (obj, propName) => {
    if (obj[propName] !== undefined) return obj[propName];
    const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
    if (obj[camelCase] !== undefined) return obj[camelCase];
    return "";
  };

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const cached = meetingSchedulesCacheByUser[username];
    const cacheValid =
      cached && cached.data && now - cached.time < MEETING_CACHE_TTL_MS;

    if (cacheValid) {
      setMeetings(cached.data);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadMeetings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await meetingDetailsService.getAllMeetingSchedules(username);

        if (cancelled) return;

        const schedules = getMeetingSchedules(response);
        if (schedules != null) {
          meetingSchedulesCacheByUser[username] = {
            data: schedules,
            time: Date.now(),
          };
          setMeetings(schedules);
        } else {
          setError(
            response?.errorMessage || "Unable to load meeting schedules",
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "StudentMeetingSchedule: Exception loading meetings",
            err,
          );
          setError(`Error loading meeting schedules: ${err.message}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMeetings();
    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (error) {
      showSnackbar(error, "warning");
    }
  }, [error, showSnackbar]);

  const cardSx = {
    ...panelCardSx,
    width: "100%",
    maxWidth: "100%",
    display: "block",
    boxSizing: "border-box",
  };

  const renderScheduleBody = () => (
      <Box className="meeting-grid" sx={{ width: "100%" }}>
            {meetings.map((meeting, index) => {
              const rowId =
                getProp(meeting, "RowID") || getProp(meeting, "RowId");
              const meetingURL =
                getProp(meeting, "MeetingURL") ||
                getProp(meeting, "MeetingUrl");
              const meetingDate = getProp(meeting, "MeetingDate");
              const meetingTime = getProp(meeting, "MeetingTime");
              const meetingID =
                getProp(meeting, "MeetingID") || getProp(meeting, "MeetingId");
              const passcode = getProp(meeting, "Passcode");
              const classDisplay = getMeetingClassDisplay(meeting, getProp);
              const section = getProp(meeting, "Section");

              return (
                <Box key={rowId || index} className="meeting-card">
                  <Box className="meeting-card-main">
                    {classDisplay && (
                      <Typography component="div" className="meeting-class">
                        {classDisplay}
                        {section ? ` - Section ${section}` : ""}
                      </Typography>
                    )}
                    {meetingDate && (
                      <Box className="meeting-datetime">
                        <AccessTimeIcon sx={{ fontSize: 15 }} />
                        <span>
                          {formatMeetingDateTime(meetingDate, meetingTime)}
                        </span>
                      </Box>
                    )}
                  </Box>

                  {(meetingID || passcode) && (
                    <Box className="meeting-meta">
                      {meetingID && (
                        <Box className="meeting-detail-row">
                          <MeetingRoomIcon sx={{ fontSize: 15, flexShrink: 0 }} />
                          <span className="meeting-detail-label">ID</span>
                          <span className="meeting-detail-value">{meetingID}</span>
                          <Tooltip
                            title={
                              copiedText === String(meetingID) ? "Copied" : "Copy"
                            }
                            open={
                              copiedText === String(meetingID) ? true : undefined
                            }
                            placement="top"
                          >
                            <Box
                              component="button"
                              type="button"
                              className="meeting-copy-icon"
                              onClick={() => handleCopy(String(meetingID))}
                            >
                              <ContentCopyIcon sx={{ fontSize: 11, display: "block" }} />
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                      {passcode && (
                        <Box className="meeting-detail-row">
                          <VpnKeyIcon sx={{ fontSize: 15, flexShrink: 0 }} />
                          <span className="meeting-detail-label">Passcode</span>
                          <span className="meeting-detail-value">{passcode}</span>
                          <Tooltip
                            title={
                              copiedText === String(passcode) ? "Copied" : "Copy"
                            }
                            open={
                              copiedText === String(passcode) ? true : undefined
                            }
                            placement="top"
                          >
                            <Box
                              component="button"
                              type="button"
                              className="meeting-copy-icon"
                              onClick={() => handleCopy(String(passcode))}
                            >
                              <ContentCopyIcon sx={{ fontSize: 11, display: "block" }} />
                            </Box>
                          </Tooltip>
                        </Box>
                      )}
                    </Box>
                  )}

                  {meetingURL && (
                    <Link
                      href={meetingURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="meeting-join-btn"
                      underline="none"
                    >
                      <ZoomIcon className="zoom-icon" />
                      Start meeting
                    </Link>
                  )}
                </Box>
              );
            })}
      </Box>
  );

  if (loading || meetings.length === 0) {
    return error ? <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} /> : null;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Card
        sx={cardSx}
        className="dashboard-messages-panel meeting-schedule-card"
      >
        <CardContent sx={dashboardMessagesPanelContentSx}>
          {renderSectionHeader(sectionTitleSx)}
          {renderScheduleBody()}
        </CardContent>
      </Card>
      <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </Box>
  );
};

export default StudentMeetingSchedule;
