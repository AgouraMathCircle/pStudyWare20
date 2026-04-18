import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import { APPLICATION_ADMIN_TITLE_COLOR } from "../../../styles/applicationSurfaces";

const TimeSheetTracking = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const username = user?.email || user?.username || "";

  const loadList = async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await timeSheetTrackingService.getTimeSheetTrackingList({
        Username: username,
      });
      const data =
        res?.timeSheetTrackingList ?? res?.TimeSheetTrackingList ?? [];
      if (res?.isSuccess !== false && Array.isArray(data)) {
        setList(data);
      } else if (res?.isSuccess === false && res?.errorMessage) {
        setSnackbar({
          open: true,
          message: res.errorMessage,
          severity: "error",
        });
        setList([]);
      } else {
        setList([]);
      }
    } catch (err) {
      console.error("Error loading time sheet tracking:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading time sheet.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) loadList();
    else setLoading(false);
  }, [username]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: APPLICATION_ADMIN_TITLE_COLOR }}
        >
          Time Sheet Tracking
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={loadList}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#e8f5e8" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Task Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No entries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((row, idx) => (
                    <TableRow
                      key={row.logID ?? row.LogID ?? idx}
                      sx={{
                        bgcolor: idx % 2 === 0 ? "transparent" : "action.hover",
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {row.taskName ?? row.TaskName ?? ""}
                      </TableCell>
                      <TableCell>
                        {row.volunteerDate ?? row.VolunteerDate
                          ? new Date(
                              row.volunteerDate ?? row.VolunteerDate
                            ).toLocaleDateString()
                          : ""}
                      </TableCell>
                      <TableCell>
                        {(row.startHour ?? row.StartHour ?? "")}:
                        {(row.startMin ?? row.StartMin ?? "")}{" "}
                        {row.startType ?? row.StartType ?? ""}
                      </TableCell>
                      <TableCell>
                        {(row.endHour ?? row.EndHour ?? "")}:
                        {(row.endMin ?? row.EndMin ?? "")}{" "}
                        {row.endType ?? row.EndType ?? ""}
                      </TableCell>
                      <TableCell>
                        {row.taskDescription ?? row.TaskDescription ?? ""}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TimeSheetTracking;
