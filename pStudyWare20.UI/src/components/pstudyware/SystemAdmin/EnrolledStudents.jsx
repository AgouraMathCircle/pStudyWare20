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
import {
  adminPortalCardHeaderStripSx,
  adminDashboardWidgetCardSx,
  adminDashboardWidgetCardContentSx,
  adminDashboardWidgetTitleSx,
  adminDashboardWidgetTrackingHeaderCellSx,
  adminDashboardWidgetTrackingCellSx,
  adminDashboardWidgetTrackingTableSx,
  adminDashboardWidgetTableRowSx,
} from "../styles/applicationSurfaces";
import { School as SchoolIcon } from "@mui/icons-material";
import {
  DASHBOARD_CLASS_GROUPS,
  getEnrolledCountKeys,
} from "./dashboardClassGroups";

const EnrolledStudents = ({ studentCounts }) => {
  const groups = DASHBOARD_CLASS_GROUPS.map(({ key, label }) => ({
    key,
    label,
    ...getEnrolledCountKeys(key),
  }));

  const getCount = (key) => {
    if (!studentCounts) return "0";
    const value = studentCounts[key];
    return value !== undefined && value !== null ? value.toString() : "0";
  };

  return (
    <Card elevation={3} className="systemadmin-dashboard-widget-card" sx={adminDashboardWidgetCardSx}>
      <CardHeader
        avatar={<SchoolIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={adminDashboardWidgetTitleSx}>
            Enrolled Students
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentSx}>
        <TableContainer sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          <Table
            size="small"
            className="systemadmin-dashboard-widget-table systemadmin-dashboard-widget-count-table"
            sx={adminDashboardWidgetTrackingTableSx}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "52%" }}>
                  Group
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "24%" }}
                >
                  OnSite
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...adminDashboardWidgetTrackingHeaderCellSx, width: "24%" }}
                >
                  Online
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.key} sx={adminDashboardWidgetTableRowSx}>
                  <TableCell component="th" scope="row" sx={adminDashboardWidgetTrackingCellSx}>
                    {group.label}
                  </TableCell>
                  <TableCell align="center" sx={adminDashboardWidgetTrackingCellSx}>
                    {getCount(group.onsiteKey)}
                  </TableCell>
                  <TableCell align="center" sx={adminDashboardWidgetTrackingCellSx}>
                    {getCount(group.onlineKey)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default EnrolledStudents;
