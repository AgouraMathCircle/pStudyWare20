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
  VpnKey as VpnKeyIcon,
  MeetingRoom as MeetingRoomIcon,
} from "@mui/icons-material";
import meetingDetailsService from "../../../services/meetingDetailsService";

const StudentMeetingSchedule = ({ username }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to get property value (handles both camelCase and PascalCase)
  const getProp = (obj, propName) => {
    // Try PascalCase first
    if (obj[propName] !== undefined) return obj[propName];
    // Try camelCase
    const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
    if (obj[camelCase] !== undefined) return obj[camelCase];
    return "";
  };

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        setLoading(true);
        console.log("StudentMeetingSchedule: Loading meetings for", username);

        // Get all meetings using the GetAllMeetingSchedules endpoint
        const response = await meetingDetailsService.getAllMeetingSchedules();

        console.log("StudentMeetingSchedule: Response received", response);

        if (response && response.isSuccess) {
          const schedules = response.meetingSchedules || [];
          console.log(
            "StudentMeetingSchedule: Meetings found",
            schedules.length
          );

          // Filter active meetings only (check both lowercase and PascalCase)
          const activeMeetings = schedules.filter(
            (meeting) =>
              meeting.active === true ||
              meeting.Active === true ||
              meeting.active === "1" ||
              meeting.Active === "1" ||
              meeting.active === "True" ||
              meeting.Active === "True"
          );

          console.log(
            "StudentMeetingSchedule: Active meetings",
            activeMeetings.length
          );
          setMeetings(activeMeetings);
        } else {
          const errorMsg =
            response?.errorMessage || "Unable to load meeting schedules";
          console.error("StudentMeetingSchedule: Error", errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        console.error(
          "StudentMeetingSchedule: Exception loading meetings",
          err
        );
        setError(`Error loading meeting schedules: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      loadMeetings();
    }
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
                {/* Class and Section Header - Medium font, Green, Underlined */}
                <Typography
                  sx={{
                    color: "#4caf50",
                    fontWeight: 700,
                    textDecoration: "underline",
                    mb: 1,
                    fontSize: "1rem",
                  }}
                >
                  {chapterName || className}
                  {section && ` - Section ${section}`}
                </Typography>

                {/* Meeting URL - Small font, Wraps to 2 lines */}
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", mb: 0.5 }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      mr: 1,
                      minWidth: "90px",
                      fontSize: "0.75rem",
                      color: "#000000",
                      flexShrink: 0,
                    }}
                  >
                    URL:
                  </Typography>
                  <Link
                    href={meetingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: "#1976d2",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      textDecoration: "underline",
                      fontSize: "0.75rem",
                      lineHeight: 1.4,
                      display: "inline-block",
                      maxWidth: "calc(100% - 100px)",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {meetingURL}
                  </Link>
                </Box>

                {/* Date/Time - Small font, Green values */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      mr: 1,
                      minWidth: "90px",
                      fontSize: "0.75rem",
                      color: "#000000",
                    }}
                  >
                    Date/Time:
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontSize: "0.75rem",
                    }}
                  >
                    {meetingDate} {meetingTime} (PST)
                  </Typography>
                </Box>

                {/* Meeting ID - Small font, Green value */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: 700,
                      mr: 1,
                      minWidth: "90px",
                      fontSize: "0.75rem",
                      color: "#000000",
                    }}
                  >
                    Meeting ID:
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      color: "#4caf50",
                      fontSize: "0.75rem",
                    }}
                  >
                    {meetingID}
                  </Typography>
                </Box>

                {/* Passcode - Small font, Green value */}
                {passcode && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography
                      component="span"
                      sx={{
                        fontWeight: 700,
                        mr: 1,
                        minWidth: "90px",
                        fontSize: "0.75rem",
                        color: "#000000",
                      }}
                    >
                      Passcode:
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        color: "#4caf50",
                        fontSize: "0.75rem",
                      }}
                    >
                      {passcode}
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentMeetingSchedule;
