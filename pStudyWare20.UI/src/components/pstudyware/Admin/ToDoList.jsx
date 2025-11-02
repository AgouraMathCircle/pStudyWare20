import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";

const ToDoList = ({
  trackingSummary,
  onPublishDocument,
  canPublishDocuments,
}) => {
  const [sendEmail, setSendEmail] = useState(false);

  const handlePublishClick = () => {
    if (onPublishDocument) {
      onPublishDocument(sendEmail);
    }
  };

  const handleCheckboxChange = (event) => {
    setSendEmail(event.target.checked);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardHeader
        avatar={<NotificationsIcon color="info" />}
        title={
          <Typography variant="subtitle1" component="div" sx={{ fontSize: '1rem' }}>
            To Do List
          </Typography>
        }
        sx={{
          backgroundColor: (theme) => theme.palette.info.light,
          color: (theme) => theme.palette.info.contrastText,
          padding: "3px 5px",
          "& .MuiCardHeader-avatar": {
            color: (theme) => theme.palette.info.contrastText,
          },
        }}
      />
      <CardContent sx={{ p: 2 }}>
        {/* Publish Documents Section */}
        {canPublishDocuments && (
          <Box sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PublishIcon />}
              onClick={handlePublishClick}
              fullWidth
              sx={{ mb: 1 }}
            >
              Publish Class Materials
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendEmail}
                  onChange={handleCheckboxChange}
                  size="small"
                />
              }
              label={<Typography variant="body2">Send Email</Typography>}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Quick Links */}
        <Box sx={{ mb: 2 }}>
          <Link
            href="../documents/AMC_Curriculam.pdf"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              display: "block",
              mb: 1,
              fontSize: "0.875rem",
            }}
          >
            Curriculum
          </Link>
          <Link
            href="../Pstudyware/UserTracking.aspx"
            underline="hover"
            sx={{
              display: "block",
              fontSize: "0.875rem",
            }}
          >
            User Tracking
          </Link>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* User Tracking Summary */}
        <Typography variant="subtitle2" gutterBottom>
          User Tracking Summary
        </Typography>
        <TableContainer sx={{ maxHeight: 200, overflowY: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: "0.75rem", padding: "3px 5px" }}>
                  <strong>Date</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem", padding: "3px 5px" }}>
                  <strong>Web#</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem", padding: "3px 5px" }}>
                  <strong>App#</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: "0.75rem", padding: "3px 5px" }}>
                  <strong>SRU#</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackingSummary && trackingSummary.length > 0 ? (
                trackingSummary.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": {
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "0.75rem", padding: "3px 5px" }}>
                      {formatDate(item.visitedDate || item.VisitedDate)}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.75rem", padding: "3px 5px" }}
                    >
                      {item.webCount || item.WebCount || 0}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.75rem", padding: "3px 5px" }}
                    >
                      {item.appCount || item.AppCount || 0}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ fontSize: "0.75rem", padding: "3px 5px" }}
                    >
                      {item.updateScoreCnt || item.UpdateScoreCnt || 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{ fontSize: "0.75rem", padding: "3px 5px" }}
                  >
                    No tracking data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ToDoList;
