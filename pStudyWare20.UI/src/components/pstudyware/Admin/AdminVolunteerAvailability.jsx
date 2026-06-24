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
import volunteerAvailabilityService from "../../../services/volunteerAvailabilityService";
import InstructorVolunteerAvailabilityGrid from "../Instructor/InstructorVolunteerAvailabilityGrid";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListHeaderBarSx,
  adminSessionListTitleSx,
} from "../styles/applicationSurfaces";

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

  const username = user?.email || user?.username || "";

  const loadList = useCallback(async () => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await volunteerAvailabilityService.getAvailabilitySummary({
        username: username,
      });
      if (res?.isSuccess) {
        setRows(res.summaryData || []);
      } else {
        setRows([]);
        setError(res?.errorMessage || "Could not load volunteer availability.");
      }
    } catch (err) {
      console.error("Error loading volunteer availability:", err);
      const msg = err?.message || "Error loading list.";
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadList();
  }, [loadList]);

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

  const exportToolbarButtonSx = {
    backgroundColor: "#1b4d3e",
    color: "white",
    flexShrink: 0,
    px: 1.5,
    textTransform: "none",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#143a2e" },
  };

  return (
    <Box className="volunteer-availability-list" sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
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
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport("excel")}
                      sx={exportToolbarButtonSx}
                    >
                      Export Excel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport("csv")}
                      sx={exportToolbarButtonSx}
                    >
                      Export CSV
                    </Button>
                  </Box>
                </Box>

                <InstructorVolunteerAvailabilityGrid
                  rows={rows}
                  loading={loading}
                  error={error}
                  hideTitle={true}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
