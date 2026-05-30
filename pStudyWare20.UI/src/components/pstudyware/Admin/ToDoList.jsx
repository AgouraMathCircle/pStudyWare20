import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Publish as PublishIcon,
} from "@mui/icons-material";
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
  adminDashboardWidgetCardContentFlushSx,
  adminDashboardWidgetTitleSx,
  adminDashboardWidgetTableCellSx,
  adminDashboardWidgetTrackingHeaderCellSx,
  adminDashboardWidgetTableRowSx,
  adminDashboardWidgetTableScrollSx,
} from "../../../styles/applicationSurfaces";

const USER_TRACKING_PATH = "/pstudyware/admin/user-tracking";

const curriculumPdfUrl = `${(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")}documents/AMC_Curriculam.pdf`;

const quickLinkSx = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 400,
  color: "#0000ee",
  textDecoration: "underline",
  cursor: "pointer",
  m: 0,
  p: 0,
  lineHeight: 1.15,
  background: "none",
  border: "none",
  borderRadius: 0,
  boxShadow: "none",
  textTransform: "none",
  minHeight: "unset",
  minWidth: "unset",
  "&:visited": { color: "#551a8b" },
  "&:hover": {
    color: "#551a8b",
    textDecoration: "underline",
    background: "none",
  },
};

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
    <Card
      elevation={3}
      className="admin-dashboard-widget-card"
      sx={{
        ...adminDashboardWidgetCardSx,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <CardHeader
        avatar={<NotificationsIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={adminDashboardWidgetTitleSx}>
            To Do List
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentFlushSx}>
        {canPublishDocuments && (
          <Box sx={{ width: "100%" }}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={<PublishIcon />}
              onClick={handlePublishClick}
              sx={{
                textTransform: "none",
                width: "100%",
                py: 0.75,
                mb: 0,
                backgroundColor: "#174a10",
                color: "#FFFFFF",
                "&:hover": {
                  backgroundColor: "#1f5e14",
                },
              }}
            >
              Publish Class Materials
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography sx={{ fontSize: "0.75rem", color: "text.primary" }}>
                  Send Email
                </Typography>
              }
              sx={{
                m: 0,
                mt: 0,
                ml: 0,
                alignItems: "center",
                "& .MuiFormControlLabel-label": { mt: 0 },
              }}
            />
          </Box>
        )}

        <Box
          sx={{
            mt: 0,
            mb: 0,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          <Box
            component="a"
            href={curriculumPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={quickLinkSx}
          >
            Curriculam
          </Box>
          <Box component={RouterLink} to={USER_TRACKING_PATH} sx={quickLinkSx}>
            UserTracking
          </Box>
        </Box>

        <TableContainer
          sx={{
            ...adminDashboardWidgetTableScrollSx,
            flex: 1,
            minHeight: 0,
            maxHeight: { xs: 280, sm: 240, md: 220 },
            overflowY: "auto",
            mt: 0.25,
          }}
        >
          <Table
            size="small"
            className="admin-dashboard-widget-table admin-dashboard-widget-tracking-table"
            sx={{
              width: "100%",
              minWidth: { xs: 220, sm: "100%" },
              tableLayout: { xs: "auto", sm: "fixed" },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={adminDashboardWidgetTrackingHeaderCellSx}>Date</TableCell>
                <TableCell align="center" sx={adminDashboardWidgetTrackingHeaderCellSx}>
                  Web#
                </TableCell>
                <TableCell align="center" sx={adminDashboardWidgetTrackingHeaderCellSx}>
                  App#
                </TableCell>
                <TableCell align="center" sx={adminDashboardWidgetTrackingHeaderCellSx}>
                  SRU#
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackingSummary && trackingSummary.length > 0 ? (
                trackingSummary.map((item, index) => (
                  <TableRow key={index} sx={adminDashboardWidgetTableRowSx}>
                    <TableCell sx={adminDashboardWidgetTableCellSx}>
                      {formatDate(item.visitedDate || item.VisitedDate)}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTableCellSx}>
                      {item.webCount ?? item.WebCount ?? 0}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTableCellSx}>
                      {item.appCount ?? item.AppCount ?? 0}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTableCellSx}>
                      {item.updateScoreCnt ?? item.UpdateScoreCnt ?? 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={adminDashboardWidgetTableCellSx}>
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
