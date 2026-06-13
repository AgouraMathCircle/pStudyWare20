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
} from "../styles/applicationSurfaces";
import { HourglassEmpty as HourglassIcon } from "@mui/icons-material";

const WaitingList = ({ waitingListCounts }) => {
  // Define the groups to display
  const groups = [
    {
      key: "JB",
      label: "Junior Beginner",
      onsiteKey: "owaitingListCntJB",
      onlineKey: "iwaitingListCntJB",
    },
    {
      key: "JI",
      label: "Junior Intermediate",
      onsiteKey: "owaitingListCntJI",
      onlineKey: "iwaitingListCntJI",
    },
    {
      key: "JA",
      label: "Junior Advanced",
      onsiteKey: "owaitingListCntJA",
      onlineKey: "iwaitingListCntJA",
    },
    {
      key: "SB",
      label: "Senior Beginner",
      onsiteKey: "owaitingListCntSB",
      onlineKey: "iwaitingListCntSB",
    },
    {
      key: "SI",
      label: "Senior Intermediate",
      onsiteKey: "owaitingListCntSI",
      onlineKey: "iwaitingListCntSI",
    },
    {
      key: "SA",
      label: "Senior Advanced",
      onsiteKey: "owaitingListCntSA",
      onlineKey: "iwaitingListCntSA",
    },
    {
      key: "AT",
      label: "ACT Training",
      onsiteKey: "owaitingListCntAT",
      onlineKey: "iwaitingListCntAC", // Note: original uses AC for online ACT waiting list
    },
    {
      key: "ST",
      label: "PSAT Training",
      onsiteKey: "owaitingListCntST",
      onlineKey: "iwaitingListCntST",
    },
    {
      key: "AI",
      label: "Game Development",
      onsiteKey: "owaitingListCntAI",
      onlineKey: "iwaitingListCntAI",
    },
    {
      key: "DS",
      label: "Data Science",
      onsiteKey: "owaitingListCntDS",
      onlineKey: "iwaitingListCntDS",
    },
  ];

  // Get count value with fallback
  const getCount = (key) => {
    if (!waitingListCounts) return "0";
    const value = waitingListCounts[key];
    return value !== undefined && value !== null ? value.toString() : "0";
  };

  return (
    <Card elevation={3} sx={adminDashboardWidgetCardSx}>
      <CardHeader
        avatar={<HourglassIcon fontSize="small" />}
        title={
          <Typography variant="subtitle1" component="div" sx={{ fontSize: "0.9375rem" }}>
            Waiting List
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={adminDashboardWidgetCardContentSx}>
        <TableContainer sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <Table size="small" sx={{ minWidth: 250 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                  <strong>Group</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                  <strong>OnSite</strong>
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                  <strong>Online</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.map((group) => (
                <TableRow
                  key={group.key}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      backgroundColor: (theme) => theme.palette.action.selected,
                    },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                    {group.label}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
                    {getCount(group.onsiteKey)}
                  </TableCell>
                  <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '3px 5px' }}>
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

export default WaitingList;
