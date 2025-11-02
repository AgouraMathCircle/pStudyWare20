import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const MeetingList = ({ meetings, onEdit, canEdit }) => {
  // Helper to get property value (handles both camelCase and PascalCase)
  const getProp = (obj, propName) => {
    // Try PascalCase first
    if (obj[propName] !== undefined) return obj[propName];
    // Try camelCase
    const camelCase = propName.charAt(0).toLowerCase() + propName.slice(1);
    if (obj[camelCase] !== undefined) return obj[camelCase];
    return "";
  };

  const formatMeetingTime = (time) => {
    if (!time) return "";
    // Format time from HH:mm to readable format
    return time;
  };

  const formatMeetingDate = (date) => {
    if (!date) return "";
    return date;
  };

  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table sx={{ minWidth: 950 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              {canEdit && (
                <TableCell
                  sx={{
                    fontWeight: 600,
                    borderRight: "1px solid #ddd",
                    fontSize: "0.5rem",
                    padding: "8px 4px",
                    textAlign: "center",
                  }}
                >
                  Edit
                </TableCell>
              )}
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Row #
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Chapter Name
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Section
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Meeting Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Meeting Time (PST)
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Meeting URL
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Meeting ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Admin Login
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  borderRight: "1px solid #ddd",
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Include Section
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  padding: "8px 4px",
                }}
              >
                Active
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!meetings || meetings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canEdit ? 12 : 11}
                  align="center"
                  sx={{ fontSize: "0.75rem", padding: "16px" }}
                >
                  No meeting schedules found
                </TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting, index) => {
                const rowId =
                  getProp(meeting, "RowID") || getProp(meeting, "RowId");
                const className = getProp(meeting, "Class");
                const chapterName = getProp(meeting, "ChapterName");
                const section = getProp(meeting, "Section");
                const meetingDate = getProp(meeting, "MeetingDate");
                const meetingTime = getProp(meeting, "MeetingTime");
                const meetingURL =
                  getProp(meeting, "MeetingURL") ||
                  getProp(meeting, "MeetingUrl");
                const meetingID =
                  getProp(meeting, "MeetingID") ||
                  getProp(meeting, "MeetingId");
                const adminLogin = getProp(meeting, "AdminLogin");
                const includeSection = getProp(meeting, "IncludeSection");
                const active = getProp(meeting, "Active");

                return (
                  <TableRow
                    key={rowId || index}
                    sx={{
                      "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    {canEdit && (
                      <TableCell
                        sx={{
                          borderRight: "1px solid #ddd",
                          fontSize: "0.5rem",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(rowId)}
                          title="Edit Meeting"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {rowId}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {className}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {chapterName}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {section}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {formatMeetingDate(meetingDate)}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {formatMeetingTime(meetingTime)}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {meetingURL && (
                        <a
                          href={meetingURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#1976d2" }}
                        >
                          {meetingURL}
                        </a>
                      )}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {meetingID}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {adminLogin}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ddd",
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {formatBoolean(includeSection)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "0.5rem",
                        padding: "4px 8px",
                      }}
                    >
                      {formatBoolean(active)}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MeetingList;
