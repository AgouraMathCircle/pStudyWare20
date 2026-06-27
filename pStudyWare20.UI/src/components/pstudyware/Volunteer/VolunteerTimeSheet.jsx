import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as BackIcon } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import { resolveTimeFieldsFromEntry } from "../../../utils/timeSheetClockParse";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const AMPM = ["AM", "PM"];

function toDateInputValue(isoOrDate) {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
}

const VolunteerTimeSheet = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logIdParam = searchParams.get("logId");
  const logId = logIdParam ? parseInt(logIdParam, 10) : null;
  const isEdit = Number.isFinite(logId) && logId > 0;

  const { user } = useAuth();
  const username = useMemo(() => user?.email || user?.username || "", [user?.email, user?.username]);

  const [loading, setLoading] = useState(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [taskName, setTaskName] = useState("");
  const [volunteerDate, setVolunteerDate] = useState(() => toDateInputValue(new Date()));
  const [startHour, setStartHour] = useState("9");
  const [startMin, setStartMin] = useState("00");
  const [startType, setStartType] = useState("AM");
  const [endHour, setEndHour] = useState("5");
  const [endMin, setEndMin] = useState("00");
  const [endType, setEndType] = useState("PM");
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    if (!isEdit || !username) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await timeSheetTrackingService.getTimeSheetForEdit(logId, username);
        const entry = res?.timeSheetEntry ?? res?.TimeSheetEntry;
        if (cancelled) return;
        if (!res?.isSuccess || !entry) {
          setError(res?.errorMessage || "Could not load this entry.");
          return;
        }
        setTaskName(entry.taskName ?? entry.TaskName ?? "");
        const volunteerRaw = entry.volunteerDate ?? entry.VolunteerDate;
        setVolunteerDate(
          toDateInputValue(volunteerRaw) ||
            (() => {
              const m = String(volunteerRaw ?? "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
              if (!m) return "";
              return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
            })() ||
            toDateInputValue(new Date()),
        );
        const startFields = resolveTimeFieldsFromEntry(entry, "start");
        const endFields = resolveTimeFieldsFromEntry(entry, "end");
        setStartHour(startFields.hour.replace(/^0/, "") || startFields.hour);
        setStartMin(startFields.min);
        setStartType(startFields.type);
        setEndHour(endFields.hour.replace(/^0/, "") || endFields.hour);
        setEndMin(endFields.min);
        setEndType(endFields.type);
        setTaskDescription(entry.taskDescription ?? entry.TaskDescription ?? "");
      } catch (e) {
        if (!cancelled) {
          setError(e?.response?.data?.message ?? e?.message ?? "Failed to load entry.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isEdit, logId, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError("You must be signed in.");
      return;
    }
    if (!volunteerDate) {
      setError("Please choose a date.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const parts = volunteerDate.split("-").map((x) => parseInt(x, 10));
      const volunteerDateObj =
        parts.length === 3 && parts.every((n) => Number.isFinite(n))
          ? new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0)
          : new Date(volunteerDate);
      const payload = {
        username,
        taskName: taskName.trim(),
        volunteerDate: volunteerDateObj.toISOString(),
        startHour,
        startMin,
        startType,
        endHour,
        endMin,
        endType,
        taskDescription: taskDescription.trim(),
        logID: isEdit ? logId : null,
      };
      const res = await timeSheetTrackingService.upsertTimeSheetTracking(payload);
      if (res?.isSuccess === false) {
        setError(res?.errorMessage || res?.message || "Save failed.");
        return;
      }
      navigate("/pstudyware/volunteer/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message ?? err?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2, pb: 4 }}>
      <Button
        component={RouterLink}
        to="/pstudyware/volunteer/dashboard"
        startIcon={<BackIcon />}
        sx={{ mb: 2 }}
      >
        Back to dashboard
      </Button>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Edit time sheet entry" : "Log volunteer hours"}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Task name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Volunteer date"
                  type="date"
                  value={volunteerDate}
                  onChange={(e) => setVolunteerDate(e.target.value)}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Start time
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Hour"
                      value={startHour}
                      onChange={(e) => setStartHour(e.target.value)}
                      fullWidth
                    >
                      {HOURS.map((h) => (
                        <MenuItem key={h} value={h}>
                          {h}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Min"
                      value={startMin}
                      onChange={(e) => setStartMin(e.target.value)}
                      fullWidth
                    >
                      {MINS.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label=""
                      value={startType}
                      onChange={(e) => setStartType(e.target.value)}
                      fullWidth
                    >
                      {AMPM.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  End time
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Hour"
                      value={endHour}
                      onChange={(e) => setEndHour(e.target.value)}
                      fullWidth
                    >
                      {HOURS.map((h) => (
                        <MenuItem key={h} value={h}>
                          {h}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label="Min"
                      value={endMin}
                      onChange={(e) => setEndMin(e.target.value)}
                      fullWidth
                    >
                      {MINS.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      select
                      label=""
                      value={endType}
                      onChange={(e) => setEndType(e.target.value)}
                      fullWidth
                    >
                      {AMPM.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="secondary" disabled={saving}>
                  {saving ? "Saving…" : isEdit ? "Update entry" : "Save entry"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VolunteerTimeSheet;
