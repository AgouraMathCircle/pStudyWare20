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
import { getPublicDocumentUrl } from "../../../utils/config";
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
  adminDashboardWidgetCardContentFlushSx,
  adminDashboardWidgetTitleSx,
  adminDashboardWidgetTrackingHeaderCellSx,
  adminDashboardWidgetTrackingCellSx,
  adminDashboardWidgetTrackingTableSx,
  adminDashboardWidgetTableRowSx,
} from "../styles/applicationSurfaces";

const USER_TRACKING_PATH = "/pstudyware/admin/user-tracking";

const curriculumPdfUrl = getPublicDocumentUrl("AMC_Curriculam.pdf");

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
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
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
            flex: 1,
            minHeight: 0,
            maxHeight: 160,
            width: "100%",
            maxWidth: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            mt: 0.25,
          }}
        >
          <Table
            size="small"
            className="admin-dashboard-widget-table admin-dashboard-widget-tracking-table"
            sx={adminDashboardWidgetTrackingTableSx}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "38%" }}>
                  Date
                </TableCell>
                <TableCell align="center" sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "20%" }}>
                  Web#
                </TableCell>
                <TableCell align="center" sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "20%" }}>
                  App#
                </TableCell>
                <TableCell align="center" sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "22%" }}>
                  SRU#
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trackingSummary && trackingSummary.length > 0 ? (
                trackingSummary.map((item, index) => (
                  <TableRow key={index} sx={adminDashboardWidgetTableRowSx}>
                    <TableCell sx={adminDashboardWidgetTrackingCellSx}>
                      {formatDate(item.visitedDate || item.VisitedDate)}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTrackingCellSx}>
                      {item.webCount ?? item.WebCount ?? 0}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTrackingCellSx}>
                      {item.appCount ?? item.AppCount ?? 0}
                    </TableCell>
                    <TableCell align="center" sx={adminDashboardWidgetTrackingCellSx}>
                      {item.updateScoreCnt ?? item.UpdateScoreCnt ?? 0}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={adminDashboardWidgetTrackingCellSx}>
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
