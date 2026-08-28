import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import { adminVolunteerAvailabilityApi } from "../../../services/adminDashboardService";
import { getPortalUsername } from "../../../utils/portalUsername";
import AdminVolunteerAvailabilityGrid from "./AdminVolunteerAvailabilityGrid";
import { exportVolunteerAvailability } from "../../../utils/volunteerAvailabilityExport";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import "../../../styles/AdminVolunteerAvailability.css";

const adminVolunteerAvailabilityPageSx = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

const AdminVolunteerAvailability = () => {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const portalUsername = getPortalUsername(user);

  const loadList = useCallback(async () => {
    if (!portalUsername) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await adminVolunteerAvailabilityApi.getAvailabilitySummary({
        username: portalUsername,
      });
      if (res?.isSuccess !== false) {
        setRows(res.summaryData || []);
      } else {
        setRows([]);
        setError(res?.errorMessage || "Could not load volunteer availability.");
      }
    } catch (err) {
      console.error("Error loading volunteer availability:", err);
      setError(err?.message || "Error loading list.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [portalUsername]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const handleExport = async (type) => {
    if (rows.length === 0) {
      setSnackbar({
        open: true,
        message: "No data available to export.",
        severity: "warning",
      });
      return;
    }

    try {
      await exportVolunteerAvailability(rows, type);
      setSnackbar({
        open: true,
        message: `Exported to ${type === "excel" ? "Excel" : "CSV"} successfully.`,
        severity: "success",
      });
    } catch (err) {
      console.error("Error exporting volunteer availability:", err);
      setSnackbar({
        open: true,
        message: "Error exporting the list.",
        severity: "error",
      });
    }
  };

  return (
    <Box
      className="admin-volunteer-availability"
      sx={{ ...adminVolunteerAvailabilityPageSx, minHeight: "100vh", bgcolor: "background.default" }}
    >
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />
      <Container maxWidth="xl" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={adminSessionListTitleSx}
                  >
                    Volunteers Availability List
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport("excel")}
                      sx={portalHeaderActionButtonSx}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport("csv")}
                      sx={portalHeaderActionButtonSx}
                    >
                      Export CSV
                    </Button>
                  </Box>
                </Box>

                <AdminVolunteerAvailabilityGrid
                  rows={rows}
                  loading={loading}
                  error={error}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminVolunteerAvailability;
