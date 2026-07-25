import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
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

const formatTrackingDate = (dateString) => {
  if (!dateString) return "-";

  const dateOnly = String(dateString).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [year, month, day] = dateOnly.split("-");
    return `${month}/${day}/${year.slice(2)}`;
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  } catch {
    return dateString;
  }
};

const ToDoList = ({ trackingSummary }) => {
  return (
    <Card
      elevation={3}
      className="systemadmin-dashboard-widget-card"
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
        <TableContainer sx={{ width: "100%", maxWidth: "100%" }}>
          <Table
            size="small"
            className="systemadmin-dashboard-widget-table systemadmin-dashboard-widget-tracking-table"
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
                      {formatTrackingDate(item.visitedDate || item.VisitedDate)}
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
