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
import { Refresh as RefreshIcon, Download as DownloadIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader from "./AdminHeader";
import specialEventsRegistrationService from "../../../services/specialEventsRegistrationService";

const SpecialEventsRegistration = () => {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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
      const res = await specialEventsRegistrationService.getSpecialEventsRegistrationList({
        Username: username,
      });
      const raw =
        res?.specialEventsRegistrationList ??
        res?.SpecialEventsRegistrationList;
      let data = [];
      if (Array.isArray(raw)) data = raw;
      else if (raw && (raw.Table || raw.Rows || raw.rows)) data = raw.Table || raw.Rows || raw.rows || [];
      else if (raw && typeof raw === "object" && raw.length >= 0) data = raw;
      if (res?.isSuccess !== false) {
        setList(Array.isArray(data) ? data : []);
      } else if (res?.errorMessage) {
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
      console.error("Error loading special events registration:", err);
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        err?.message ??
        "Error loading list.";
      setSnackbar({ open: true, message: msg, severity: "error" });
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!username) return;
    setExporting(true);
    try {
      const response = await specialEventsRegistrationService.exportToExcel({
        Username: username,
      });
      const blob =
        response?.data instanceof Blob
          ? response.data
          : new Blob([response?.data ?? ""]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response?.headers?.["content-disposition"]?.match(/filename="?([^"]+)"?/)?.[1] ??
        "SpecialEventsRegistration.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      setSnackbar({
        open: true,
        message: "Export downloaded.",
        severity: "success",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.error ??
        err?.message ??
        "Export failed.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (username) loadList();
    else setLoading(false);
  }, [username]);

  const rows = Array.isArray(list) ? list : [];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminHeader />
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Special Events Registration List
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
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            disabled={loading || exporting}
          >
            Export Excel
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
                  <TableCell>Event / Applicant</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No registrations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, idx) => (
                    <TableRow
                      key={row.requestId ?? row.RequestId ?? idx}
                      sx={{
                        bgcolor: idx % 2 === 0 ? "transparent" : "action.hover",
                      }}
                    >
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        {typeof row === "object"
                          ? row.eventName ??
                            row.EventName ??
                            row.name ??
                            row.Name ??
                            JSON.stringify(row).slice(0, 60)
                          : String(row)}
                      </TableCell>
                      <TableCell>
                        {typeof row === "object"
                          ? Object.entries(row)
                              .filter(
                                ([k, v]) =>
                                  v != null &&
                                  v !== "" &&
                                  !["eventName", "EventName", "name", "Name"].includes(k)
                              )
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")
                          : ""}
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

export default SpecialEventsRegistration;
