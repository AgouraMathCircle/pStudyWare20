import React, { useState, useEffect, useRef } from "react";
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
  VpnKey as VpnKeyIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import meetingDetailsService from "../../../services/meetingDetailsService";

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
    <Card
      elevation={3}
      sx={{
        border: "1px solid #4caf50",
        borderRadius: "10px",
      }}
    >
      <CardHeader
        avatar={<VideoCallIcon sx={{ color: "#ff5722", fontSize: 30 }} />}
        title={
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "#ff5722",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            Meeting Schedule
          </Typography>
        }
        sx={{
          backgroundColor: "#f1f8f4",
          borderBottom: "2px solid #4caf50",
          padding: "12px 16px",
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

            return (
              <Box
                key={rowId || index}
                sx={{
                  border: "2px solid #4caf50",
                  borderRadius: "10px",
                  padding: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography
                  sx={{
                    color: "#333",
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  }}
                  component="div"
                >
                  {/* Sentence: "[Class] [Section] is on [Date]." */}
                  <Box component="span" sx={{ color: "#4caf50", fontWeight: 600 }}>
                    {chapterName || className}
                    {section ? ` Section ${section}` : ""}
                  </Box>
                  {" is on "}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {meetingDate}
                    {meetingTime ? ` at ${meetingTime} (PST)` : ""}.
                  </Box>
                  {" Join at "}
                  <Link
                    href={meetingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#1976d2",
                      fontWeight: 600,
                      textDecoration: "underline",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Launch meeting
                  </Link>
                  {meetingID && (
                    <>
                      {" Meeting ID: "}
                      <Box component="span" sx={{ color: "#4caf50", fontWeight: 500 }}>
                        {meetingID}
                      </Box>
                      {passcode ? ". " : "."}
                    </>
                  )}
                  {passcode && (
                    <>
                      {meetingID ? ". " : " "}
                      {"Passcode: "}
                      <Box component="span" sx={{ color: "#4caf50", fontWeight: 500 }}>
                        {passcode}
                      </Box>
                      .
                    </>
                  )}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentMeetingSchedule;
