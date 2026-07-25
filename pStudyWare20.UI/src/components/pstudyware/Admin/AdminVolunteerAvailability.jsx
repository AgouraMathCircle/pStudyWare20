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
import {
  adminVolunteerAvailabilityApi,
} from "../../../services/adminDashboardService";
import { getPortalUsername } from "../../../utils/portalUsername";
import { applyVolunteerAvailabilityRefresh } from "../../../utils/volunteerAvailabilityGridMerge";
import VolunteerAvailability from "../Common/VolunteerAvailability";
import AdminVolunteerAvailabilityGrid from "./AdminVolunteerAvailabilityGrid";
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

  const loadList = useCallback(async ({ silent = false } = {}) => {
    if (!portalUsername) {
      setLoading(false);
      return;
    }
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const res = await adminVolunteerAvailabilityApi.getAvailabilitySummary({
        username: portalUsername,
      });
      if (res?.isSuccess !== false) {
        const nextRows = res.summaryData || [];
        if (nextRows.length > 0 || !silent) {
          setRows(nextRows);
          setError(null);
        }
      } else if (!silent) {
        setRows([]);
        setError(res?.errorMessage || "Could not load volunteer availability.");
      }
    } catch (err) {
      console.error("Error loading volunteer availability:", err);
      if (!silent) {
        setError(err?.message || "Error loading list.");
        setRows([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [portalUsername]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const refreshListAfterSave = useCallback((payload) => {
    setRows((prev) => applyVolunteerAvailabilityRefresh(prev, payload));
    setError(null);
  }, []);

  const handleExport = (type) => {
    if (rows.length === 0) {
      setSnackbar({
        open: true,
        message: "No data available to export.",
        severity: "warning",
      });
      return;
    }

    const headers = [
      "Instructor #",
      "First Name",
      "Last Name",
      "Chapter",
      "Session",
      "Class",
      "Type",
      "Availability",
      "Comments",
      "ResponseDate",
    ];

    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const r of rows) {
      const values = [
        r.InstructorID ?? r.instructorID ?? "",
        `"${(r.FirstName ?? r.firstName ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.LastName ?? r.lastName ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.ChapterName ?? r.chapterName ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.Session ?? r.session ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.Class ?? r.class ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.InstructorType ?? r.instructorType ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.Availability ?? r.availability ?? "").toString().replace(/"/g, '""')}"`,
        `"${(r.Comments ?? r.comments ?? "").toString().replace(/"/g, '""')}"`,
        r.ResponseDate ?? r.responseDate ?? "",
      ];
      csvRows.push(values.join(","));
    }

    const csvContent = "\uFEFF" + csvRows.join("\r\n");
    const mimeType = type === "excel" ? "application/vnd.ms-excel" : "text/csv";
    const extension = type === "excel" ? "xls" : "csv";
    const blob = new Blob([csvContent], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `VolunteerAvailabilityList.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbar({
      open: true,
      message: `Exported to ${type === "excel" ? "Excel" : "CSV"} successfully.`,
      severity: "success",
    });
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
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Card
              sx={{ ...adminSessionListPanelCardSx, width: "100%" }}
              className="admin-volunteer-availability-entry-panel"
            >
              <CardContent
                sx={{ ...adminSessionListPanelContentSx, width: "100%" }}
              >
                <VolunteerAvailability
                  embedded
                  alwaysVisible
                  availabilityService={adminVolunteerAvailabilityApi}
                  onSaved={refreshListAfterSave}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={adminSessionListPanelCardSx}>
              <CardContent sx={adminSessionListPanelContentSx}>
                <Box sx={adminSessionListHeaderBarSx}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={adminSessionListTitleSx}
                  >
                    Volunteers Availability List for upcoming class
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
