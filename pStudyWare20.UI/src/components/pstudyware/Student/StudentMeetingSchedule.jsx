import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Link,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  VideoCall as VideoCallIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Person as PersonIcon,
  VpnKey as VpnKeyIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import meetingDetailsService from "../../../services/meetingDetailsService";

// Class code -> full name (matches the mapping used across the app, e.g. DocumentList)
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

// Module-level cache per username so GetAllMeetingSchedules is only called once per user per TTL
const MEETING_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
const meetingSchedulesCacheByUser = {}; // { [username]: { data: [...], time: number } }

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

const StudentMeetingSchedule = ({ username }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get property value (handles both camelCase and PascalCase)
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
    const cacheValid = cached && cached.data && now - cached.time < MEETING_CACHE_TTL_MS;

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

        const response = await meetingDetailsService.getAllMeetingSchedules(username);

        if (cancelled) return;

        const activeMeetings = getActiveMeetings(response);
        if (activeMeetings != null) {
          meetingSchedulesCacheByUser[username] = {
            data: activeMeetings,
            time: Date.now(),
          };
          setMeetings(activeMeetings);
        } else {
          const errorMsg =
            response?.errorMessage || "Unable to load meeting schedules";
          setError(errorMsg);
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

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={3}>
            <CircularProgress size={40} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Alert severity="warning">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (meetings.length === 0) {
    return null; // Don't show section if no meetings
  }

  return (
    <Card elevation={0} className="meeting-schedule-card">
      <CardHeader
        avatar={
          <Box className="meeting-header-badge">
            <VideoCallIcon sx={{ fontSize: 22 }} />
          </Box>
        }
        title={
          <Typography variant="h5" component="div" className="meeting-header-title">
            Meeting Schedule
          </Typography>
        }
        className="meeting-schedule-header"
      />
      <CardContent className="meeting-schedule-content">
        <Box className="meeting-grid">
          {meetings.map((meeting, index) => {
            // Extract properties with fallback for camelCase/PascalCase
            const rowId =
              getProp(meeting, "RowID") || getProp(meeting, "RowId");
            const chapterName = getProp(meeting, "ChapterName");
            const className = getProp(meeting, "Class");
            const section = getProp(meeting, "Section");
            const meetingURL =
              getProp(meeting, "MeetingURL") || getProp(meeting, "MeetingUrl");
            const meetingDate = getProp(meeting, "MeetingDate");
            const meetingTime = getProp(meeting, "MeetingTime");
            const meetingID =
              getProp(meeting, "MeetingID") || getProp(meeting, "MeetingId");
            const passcode = getProp(meeting, "Passcode");
            const firstName =
              getProp(meeting, "FirstName") || getProp(meeting, "StudentFirstName");
            const lastName =
              getProp(meeting, "LastName") || getProp(meeting, "StudentLastName");
            const studentName =
              getProp(meeting, "StudentName") ||
              getProp(meeting, "Name") ||
              [firstName, lastName].filter(Boolean).join(" ");

            return (
              <Box key={rowId || index} className="meeting-card">
                {/* Accent ribbon */}
                <Box className="meeting-card-accent" />

                {/* Head: badge + class + date/time */}
                <Box className="meeting-card-head">
                  <Box className="meeting-badge">
                    <EventIcon sx={{ fontSize: 22 }} />
                  </Box>
                  <Box className="meeting-info">
                    <Typography component="div" className="meeting-title">
                      {getClassLabel(chapterName || className)}
                      {section ? ` · Section ${section}` : ""}
                    </Typography>
                    {studentName && (
                      <Box className="meeting-student-name">
                        <PersonIcon sx={{ fontSize: 15 }} />
                        <span>{studentName}</span>
                      </Box>
                    )}
                    {meetingDate && (
                      <Box className="meeting-datetime">
                        <AccessTimeIcon sx={{ fontSize: 15 }} />
                        <span>
                          {meetingDate}
                          {meetingTime ? ` · ${meetingTime} PST` : ""}
                        </span>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Details: meeting id + passcode */}
                {(meetingID || passcode) && (
                  <Box className="meeting-meta">
                    {meetingID && (
                      <Box className="meeting-detail-row">
                        <MeetingRoomIcon sx={{ fontSize: 16 }} />
                        <span className="meeting-detail-label">Meeting ID</span>
                        <span className="meeting-detail-value">{meetingID}</span>
                      </Box>
                    )}
                    {passcode && (
                      <Box className="meeting-detail-row">
                        <VpnKeyIcon sx={{ fontSize: 16 }} />
                        <span className="meeting-detail-label">Passcode</span>
                        <span className="meeting-detail-value">{passcode}</span>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Full-width Join button */}
                <Link
                  href={meetingURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-join-btn"
                >
                  <VideoCallIcon sx={{ fontSize: 18 }} />
                  Launch meeting
                </Link>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentMeetingSchedule;
