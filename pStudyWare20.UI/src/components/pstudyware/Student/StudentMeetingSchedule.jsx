import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  CircularProgress,
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
  ...portalCardAntiLiftSx,
};

const panelContentSx = {
  px: 1,
  pt: 1,
  pb: 0,
  "&:last-child": { pb: 0 },
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

const getActiveMeetings = (response) => {
  if (!response?.isSuccess) return null;
  const schedules = response.meetingSchedules || [];
  return schedules.filter(
    (meeting) =>
      meeting.active === true ||
      meeting.Active === true ||
      meeting.active === "1" ||
      meeting.Active === "1" ||
      meeting.active === "True" ||
      meeting.Active === "True"
  );
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

        const activeMeetings = getActiveMeetings(response);
        if (activeMeetings != null) {
          meetingSchedulesCacheByUser[username] = {
            data: activeMeetings,
            time: Date.now(),
          };
          setMeetings(activeMeetings);
        } else {
          setError(
            response?.errorMessage || "Unable to load meeting schedules"
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "StudentMeetingSchedule: Exception loading meetings",
            err
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

  const cardSx = { ...panelCardSx };

  if (loading) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={panelContentSx}>
          {renderSectionHeader(sectionTitleSx)}
          <Box display="flex" justifyContent="center" alignItems="center" p={1.5}>
            <CircularProgress size={28} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <>
        <Card sx={cardSx}>
          <CardContent sx={panelContentSx}>
            {renderSectionHeader(sectionTitleSx)}
          </CardContent>
        </Card>
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </>
    );
  }

  if (meetings.length === 0) {
    return null;
  }

  return (
    <>
    <Card sx={cardSx} className="meeting-schedule-card">
      <CardContent sx={panelContentSx}>
        {renderSectionHeader(sectionTitleSx)}
        <Box className="meeting-grid">
          {meetings.map((meeting, index) => {
            const rowId =
              getProp(meeting, "RowID") || getProp(meeting, "RowId");
            const meetingURL =
              getProp(meeting, "MeetingURL") || getProp(meeting, "MeetingUrl");
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

                {meetingURL && (
                  <Link
                    href={meetingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="meeting-url"
                    underline="hover"
                  >
                    {meetingURL}
                  </Link>
                )}

                {(meetingID || passcode) && (
                  <Box className="meeting-meta">
                    {meetingID && (
                      <Box
                        className="meeting-detail-row"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <MeetingRoomIcon sx={{ fontSize: 15, mr: 0.5 }} />
                        <span
                          className="meeting-detail-label"
                          style={{ marginRight: "4px" }}
                        >
                          ID
                        </span>
                        <span className="meeting-detail-value">{meetingID}</span>
                        <Tooltip
                          title={
                            copiedText === String(meetingID)
                              ? "Copied!"
                              : "Copy ID"
                          }
                          placement="top"
                        >
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleCopy(String(meetingID))}
                            sx={{
                              border: "none",
                              background: "none",
                              p: 0,
                              ml: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0,
                              color: "#2e7d32",
                              cursor: "pointer",
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 11 }} />
                            <Typography component="span" className="meeting-copy-label">
                              copy
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>
                    )}
                    {passcode && (
                      <Box
                        className="meeting-detail-row"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <VpnKeyIcon sx={{ fontSize: 15, mr: 0.5 }} />
                        <span
                          className="meeting-detail-label"
                          style={{ marginRight: "4px" }}
                        >
                          Passcode
                        </span>
                        <span className="meeting-detail-value">{passcode}</span>
                        <Tooltip
                          title={
                            copiedText === String(passcode)
                              ? "Copied!"
                              : "Copy Passcode"
                          }
                          placement="top"
                        >
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleCopy(String(passcode))}
                            sx={{
                              border: "none",
                              background: "none",
                              p: 0,
                              ml: 0,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0,
                              color: "#2e7d32",
                              cursor: "pointer",
                            }}
                          >
                            <ContentCopyIcon sx={{ fontSize: 11 }} />
                            <Typography component="span" className="meeting-copy-label">
                              copy
                            </Typography>
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
                    Launch
                  </Link>
                )}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
    <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </>
  );
};

export default StudentMeetingSchedule;
