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

const EnrolledStudents = ({ studentCounts }) => {
  // Define the groups to display
  const groups = [
    {
      key: "JB",
      label: "Junior Beginner",
      onsiteKey: "onstudentCntJB",
      onlineKey: "instudentCntJB",
    },
    {
      key: "JI",
      label: "Junior Intermediate",
      onsiteKey: "onstudentCntJI",
      onlineKey: "instudentCntJI",
    },
    {
      key: "JA",
      label: "Junior Advanced",
      onsiteKey: "onstudentCntJA",
      onlineKey: "instudentCntJA",
    },
    {
      key: "SB",
      label: "Senior Beginner",
      onsiteKey: "onstudentCntSB",
      onlineKey: "instudentCntSB",
    },
    {
      key: "SI",
      label: "Senior Intermediate",
      onsiteKey: "onstudentCntSI",
      onlineKey: "instudentCntSI",
    },
    {
      key: "SA",
      label: "Senior Advanced",
      onsiteKey: "onstudentCntSA",
      onlineKey: "instudentCntSA",
    },
    {
      key: "AT",
      label: "ACT Training",
      onsiteKey: "onstudentCntAT",
      onlineKey: "instudentCntAT",
    },
    {
      key: "ST",
      label: "PSAT Training",
      onsiteKey: "onstudentCntST",
      onlineKey: "instudentCntST",
    },
    {
      key: "AI",
      label: "Game Development",
      onsiteKey: "onstudentCntAI",
      onlineKey: "instudentCntAI",
    },
    {
      key: "DS",
      label: "Data Science",
      onsiteKey: "onstudentCntDS",
      onlineKey: "instudentCntDS",
    },
  ];

  // Get count value with fallback
  const getCount = (key) => {
    if (!studentCounts) return "0";
    const value = studentCounts[key];
    return value !== undefined && value !== null ? value.toString() : "0";
  };

  return (
    <Card elevation={3} className="admin-dashboard-widget-card" sx={adminDashboardWidgetCardSx}>
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
            className="admin-dashboard-widget-table admin-dashboard-widget-count-table"
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
              ))}            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default EnrolledStudents;
