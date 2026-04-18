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
  Box,
} from "@mui/material";
import { School as SchoolIcon } from "@mui/icons-material";
import { adminPortalCardHeaderStripSx } from "../../../styles/applicationSurfaces";

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
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardHeader
        avatar={<SchoolIcon />}
        title={
          <Typography variant="subtitle1" component="div" sx={{ fontSize: '1rem' }}>
            Enrolled Students
          </Typography>
        }
        sx={adminPortalCardHeaderStripSx}
      />
      <CardContent sx={{ p: 2 }}>
        <TableContainer>
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

export default EnrolledStudents;
