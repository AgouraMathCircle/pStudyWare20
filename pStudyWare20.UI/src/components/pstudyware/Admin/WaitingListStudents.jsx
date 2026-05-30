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
  adminDashboardWidgetTableCellSx,
  adminDashboardWidgetTableHeaderCellSx,
  adminDashboardWidgetTableRowSx,
  adminDashboardWidgetBorderedTableSx,
  adminDashboardWidgetTableScrollSx,
} from "../../../styles/applicationSurfaces";
import { HourglassEmpty as WaitingIcon } from "@mui/icons-material";

/**
 * Waiting list counts by group — matches legacy Admin_Dashboard.aspx third column
 * (OnSite / Online from AMC_spSelectPostMessage WaitingOTotal / WaitingITotal).
 */
const WaitingListStudents = ({ waitingListCounts }) => {
  const groups = [
    {
      key: "JB",
      label: "Junior Beginner",
      onsiteKey: "onwaitingCntJB",
      onlineKey: "inwaitingCntJB",
    },
    {
      key: "JI",
      label: "Junior Intermediate",
      onsiteKey: "onwaitingCntJI",
      onlineKey: "inwaitingCntJI",
    },
    {
      key: "JA",
      label: "Junior Advanced",
      onsiteKey: "onwaitingCntJA",
      onlineKey: "inwaitingCntJA",
    },
    {
      key: "SB",
      label: "Senior Beginner",
      onsiteKey: "onwaitingCntSB",
      onlineKey: "inwaitingCntSB",
    },
    {
      key: "SI",
      label: "Senior Intermediate",
      onsiteKey: "onwaitingCntSI",
      onlineKey: "inwaitingCntSI",
    },
    {
      key: "SA",
      label: "Senior Advanced",
      onsiteKey: "onwaitingCntSA",
      onlineKey: "inwaitingCntSA",
    },
    {
      key: "AT",
      label: "ACT Training",
      onsiteKey: "onwaitingCntAT",
      onlineKey: "inwaitingCntAT",
    },
    {
      key: "ST",
      label: "PSAT Training",
      onsiteKey: "onwaitingCntST",
      onlineKey: "inwaitingCntST",
    },
    {
      key: "AI",
      label: "Game Development",
      onsiteKey: "onwaitingCntAI",
      onlineKey: "inwaitingCntAI",
    },
    {
      key: "DS",
      label: "Data Science",
      onsiteKey: "onwaitingCntDS",
      onlineKey: "inwaitingCntDS",
    },
  ];

  const getCount = (key) => {
    if (!waitingListCounts) return "0";
    const value = waitingListCounts[key];
    return value !== undefined && value !== null ? value.toString() : "0";
  };

  return (
    <Card elevation={3} className="admin-dashboard-widget-card" sx={adminDashboardWidgetCardSx}>
      <CardHeader
        avatar={<WaitingIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={{ fontSize: "0.9375rem" }}>
            Waiting List
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentSx}>
        <TableContainer
          sx={{
            ...adminDashboardWidgetTableScrollSx,
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          <Table
            size="small"
            className="admin-dashboard-widget-table admin-dashboard-widget-bordered-table"
            sx={adminDashboardWidgetBorderedTableSx}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={adminDashboardWidgetTableHeaderCellSx}>Group</TableCell>
                <TableCell align="center" sx={adminDashboardWidgetTableHeaderCellSx}>
                  OnSite
                </TableCell>
                <TableCell align="center" sx={adminDashboardWidgetTableHeaderCellSx}>
                  Online
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow key={group.key} sx={adminDashboardWidgetTableRowSx}>
                  <TableCell component="th" scope="row" sx={adminDashboardWidgetTableCellSx}>
                    {group.label}
                  </TableCell>
                  <TableCell align="center" sx={adminDashboardWidgetTableCellSx}>
                    {getCount(group.onsiteKey)}
                  </TableCell>
                  <TableCell align="center" sx={adminDashboardWidgetTableCellSx}>
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

export default WaitingListStudents;
