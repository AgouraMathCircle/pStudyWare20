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
  const cellPadding = "0 8px";
  const baseHeaderSx = {
    fontWeight: 600,
    borderRight: "1px solid #4caf50",
    fontSize: "0.75rem",
    padding: cellPadding,
    whiteSpace: "nowrap",
  };
  const baseCellSx = {
    borderRight: "1px solid #4caf50",
    fontSize: "0.75rem",
    fontWeight: 400,
    padding: cellPadding,
  };
  const urlColumnSx = {
    maxWidth: 200,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

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
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table
          sx={{
            width: "100%",
            tableLayout: "auto",
            "& .MuiTableCell-root": { paddingTop: 0, paddingBottom: 0 },
          }}
          size="small"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "#e8f5e8" }}>
              {canEdit && (
                <TableCell
                  sx={{
                    ...baseHeaderSx,
                    textAlign: "center",
                  }}
                >
                  Edit
                </TableCell>
              )}
              <TableCell sx={baseHeaderSx}>Row #</TableCell>
              <TableCell sx={baseHeaderSx}>Class</TableCell>
              <TableCell sx={baseHeaderSx}>Chapter Name</TableCell>
              <TableCell sx={baseHeaderSx}>Section</TableCell>
              <TableCell sx={baseHeaderSx}>Meeting Date</TableCell>
              <TableCell sx={baseHeaderSx}>Meeting Time (PST)</TableCell>
              <TableCell sx={{ ...baseHeaderSx, ...urlColumnSx }}>Meeting URL</TableCell>
              <TableCell sx={baseHeaderSx}>Meeting ID</TableCell>
              <TableCell sx={baseHeaderSx}>Admin Login</TableCell>
              <TableCell sx={baseHeaderSx}>Include Section</TableCell>
              <TableCell sx={{ ...baseHeaderSx, borderRight: "none" }}>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!meetings || meetings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={canEdit ? 12 : 11}
                  align="center"
                  sx={{ fontSize: "0.75rem", fontWeight: 400, padding: cellPadding, py: 3 }}
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
                          ...baseCellSx,
                          textAlign: "center",
                          verticalAlign: "middle",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(rowId)}
                          title="Edit Meeting"
                          sx={{ padding: "2px" }}
                        >
                          <EditIcon sx={{ fontSize: "1rem" }} />
                        </IconButton>
                      </TableCell>
                    )}
                    <TableCell sx={baseCellSx}>{rowId}</TableCell>
                    <TableCell sx={baseCellSx}>{className}</TableCell>
                    <TableCell sx={baseCellSx}>{chapterName}</TableCell>
                    <TableCell sx={baseCellSx}>{section}</TableCell>
                    <TableCell sx={baseCellSx}>{formatMeetingDate(meetingDate)}</TableCell>
                    <TableCell sx={baseCellSx}>{formatMeetingTime(meetingTime)}</TableCell>
                    <TableCell
                      sx={{
                        ...baseCellSx,
                        ...urlColumnSx,
                      }}
                    >
                      {meetingURL || ""}
                    </TableCell>
                    <TableCell sx={baseCellSx}>{meetingID}</TableCell>
                    <TableCell sx={baseCellSx}>{adminLogin}</TableCell>
                    <TableCell sx={baseCellSx}>{formatBoolean(includeSection)}</TableCell>
                    <TableCell sx={{ ...baseCellSx, borderRight: "none" }}>{formatBoolean(active)}</TableCell>
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
