import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import {
  ArrowBack as BackIcon,
  AccessTime as TimeIcon,
  AssignmentTurnedIn as TaskIcon,
  CalendarMonth as CalendarIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import timeSheetTrackingService from "../../../services/timeSheetTrackingService";
import VolunteerTimeSheetGrid from "./VolunteerTimeSheetGrid";
import { resolveTimeFieldsFromEntry } from "../../../utils/timeSheetClockParse";
import {
  buildTimeSheetUpsertPayload,
  extractTimeSheetApiError,
  isTimeSheetApiSuccess,
  validateTimeSheetForm,
} from "../../../utils/timeSheetFormValidation";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListTitleSx,
  instructorPortalContentContainerProps,
  portalHeaderActionButtonSx,
} from "../styles/applicationSurfaces";
import "../../../styles/InstructorTimeSheet.css";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const AMPM = ["AM", "PM"];

/** Legacy TimeSheetTracking.aspx — ddlTaskName */
const TASK_OPTIONS = [
  "Administrative Work",
  "Document Preparation",
  "Tutoring",
  "Class Coordinator",
  "Facility Inspection",
  "Grading",
  "Yard Duty",
  "Operational Support",
  "Miscellaneous Work",
];

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

function toMinutes(hour, min, type) {
  const h = parseInt(hour, 10);
  const m = parseInt(min, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const normalizedHour = h === 12 ? 0 : h;
  const offset = type === "PM" ? 12 * 60 : 0;
  return normalizedHour * 60 + m + offset;
}

const VolunteerTimeSheet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isInstructorView = location.pathname.includes("/pstudyware/instructor/");
  const logIdParam = searchParams.get("logId");
  const logId = logIdParam ? parseInt(logIdParam, 10) : null;
  const isEdit = Number.isFinite(logId) && logId > 0;

  const { user } = useAuth();
  const username = useMemo(() => user?.email || user?.username || "", [user?.email, user?.username]);

  const [loading, setLoading] = useState(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [taskName, setTaskName] = useState("");
  const { snackbar, showSnackbar, closeSnackbar } = useAppSnackbar("error");
  const [volunteerDate, setVolunteerDate] = useState(() => toDateInputValue(new Date()));
  const [startHour, setStartHour] = useState("9");
  const [startMin, setStartMin] = useState("00");
  const [startType, setStartType] = useState("AM");
  const [endHour, setEndHour] = useState("5");
  const [endMin, setEndMin] = useState("00");
  const [endType, setEndType] = useState("PM");
  const [taskDescription, setTaskDescription] = useState("");

  const totalHoursPreview = useMemo(() => {
    const start = toMinutes(startHour, startMin, startType);
    const end = toMinutes(endHour, endMin, endType);
    if (start === null || end === null) return null;
    const diff = end - start;
    if (diff <= 0) return null;
    return diff / 60;
  }, [startHour, startMin, startType, endHour, endMin, endType]);

  const taskNameOptions = useMemo(() => {
    const trimmed = taskName.trim();
    if (trimmed && !TASK_OPTIONS.includes(trimmed)) {
      return [trimmed, ...TASK_OPTIONS];
    }
    return TASK_OPTIONS;
  }, [taskName]);

  const [entries, setEntries] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState(null);

  const loadEntries = React.useCallback(async () => {
    if (!username) return;
    setListError(null);
    setListLoading(true);
    try {
      const res = await timeSheetTrackingService.getAllTimeSheetTrackingEntries(username);
      const list =
        res?.timeSheetTrackingList ??
        res?.TimeSheetTrackingList ??
        res?.timeTrackingEntries ??
        res?.TimeTrackingEntries ??
        [];
      if (isTimeSheetApiSuccess(res) || (res?.isSuccess !== false && Array.isArray(list))) {
        setEntries(Array.isArray(list) ? list : []);
      } else {
        setEntries([]);
        const message =
          res?.errorMessage ?? res?.ErrorMessage ?? res?.message ?? "Could not load time sheet.";
        setListError(message);
        showSnackbar(message, "error");
      }
    } catch (e) {
      const message = extractTimeSheetApiError(e, "Failed to load time sheet.");
      setListError(message);
      showSnackbar(message, "error");
      setEntries([]);
    } finally {
      setListLoading(false);
    }
  }, [username, showSnackbar]);

  useEffect(() => {
    if (username) {
      loadEntries();
    }
  }, [username, loadEntries]);

  useEffect(() => {
    if (!isEdit || !username) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await timeSheetTrackingService.getTimeSheetForEdit(logId, username);
        const entry = res?.timeSheetEntry ?? res?.TimeSheetEntry;
        if (cancelled) return;
        if (!isTimeSheetApiSuccess(res) || !entry) {
          showSnackbar(
            res?.errorMessage ?? res?.ErrorMessage ?? "Could not load this entry.",
            "error",
          );
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
          showSnackbar(extractTimeSheetApiError(e, "Failed to load entry."), "error");
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
      showSnackbar("You must be signed in.", "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const validationError = validateTimeSheetForm({
      taskName,
      taskDescription,
      volunteerDate,
      startHour,
      startMin,
      startType,
      endHour,
      endMin,
      endType,
    });
    if (validationError) {
      showSnackbar(validationError, "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    try {
      const payload = buildTimeSheetUpsertPayload({
        username,
        taskName,
        taskDescription,
        volunteerDate,
        startHour,
        startMin,
        startType,
        endHour,
        endMin,
        endType,
        logID: isEdit ? logId : null,
      });
      const res = await timeSheetTrackingService.upsertTimeSheetTracking(payload);
      if (!isTimeSheetApiSuccess(res)) {
        showSnackbar(
          res?.errorMessage ?? res?.ErrorMessage ?? res?.message ?? res?.Message ?? "Save failed.",
          "error",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      showSnackbar(
        res?.message ?? res?.Message ?? "Your entry was successfully saved.",
        "success",
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      loadEntries();

      if (isEdit) {
        const addModePath = user?.role === "Volunteer"
          ? "/pstudyware/volunteer/time-sheet"
          : "/pstudyware/instructor/time-sheet";
        navigate(addModePath, { replace: true });
      } else {
        setTaskName("");
        setTaskDescription("");
        setStartHour("9");
        setStartMin("00");
        setStartType("AM");
        setEndHour("5");
        setEndMin("00");
        setEndType("PM");
      }
    } catch (err) {
      showSnackbar(extractTimeSheetApiError(err, "Save failed."), "error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#ffffff",
      borderRadius: 1.5,
    },
  };

  const sectionCardSx = {
    p: { xs: 2, sm: 2.5 },
    height: "100%",
    border: "1px solid #dfe9df",
    borderRadius: 2,
    bgcolor: "#fbfffb",
    boxShadow: "none",
  };

  const compactFieldSx = {
    ...fieldSx,
    "& .MuiOutlinedInput-root": {
      bgcolor: "#ffffff",
      borderRadius: 1.25,
      minHeight: 44,
    },
    "& .MuiSelect-select, & .MuiInputBase-input": {
      py: 1.1,
      fontSize: "0.95rem",
    },
  };

  const timePanelSx = {
    p: 1.5,
    height: "100%",
    border: "1px solid #dfe9df",
    borderRadius: 2,
    bgcolor: "#ffffff",
    boxSizing: "border-box",
  };

  const timeFieldLabelSx = {
    display: "block",
    mb: 0.5,
    color: "text.secondary",
    fontSize: "0.72rem",
    fontWeight: 800,
    lineHeight: 1,
  };

  const dashboardPath = user?.role === "Volunteer"
    ? "/pstudyware/volunteer/dashboard"
    : "/pstudyware/instructor/dashboard";

  const renderTimeFields = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(180px, 0.8fr) minmax(0, 1fr) minmax(0, 1fr)",
        },
        gap: 1.5,
        alignItems: "stretch",
      }}
    >
      <Box sx={timePanelSx}>
        <Typography sx={timeFieldLabelSx}>Volunteer date</Typography>
        <TextField
          type="date"
          value={volunteerDate}
          onChange={(e) => setVolunteerDate(e.target.value)}
          fullWidth
          required
          inputProps={{ "aria-label": "Volunteer date" }}
          sx={compactFieldSx}
        />
      </Box>

      <Box sx={timePanelSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
          <TimeIcon fontSize="small" sx={{ color: "#43a047" }} />
          <Typography variant="subtitle2" sx={{ color: "#1b5e20", fontWeight: 800 }}>
            Start time
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.15fr", gap: 1 }}>
          <Box>
            <Typography sx={timeFieldLabelSx}>Hour</Typography>
            <TextField
              select
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "Start hour" }}
              sx={compactFieldSx}
            >
              {HOURS.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={timeFieldLabelSx}>Min</Typography>
            <TextField
              select
              value={startMin}
              onChange={(e) => setStartMin(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "Start minute" }}
              sx={compactFieldSx}
            >
              {MINS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={timeFieldLabelSx}>AM/PM</Typography>
            <TextField
              select
              value={startType}
              onChange={(e) => setStartType(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "Start AM or PM" }}
              sx={compactFieldSx}
            >
              {AMPM.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Box>

      <Box sx={timePanelSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
          <TimeIcon fontSize="small" sx={{ color: "#43a047" }} />
          <Typography variant="subtitle2" sx={{ color: "#1b5e20", fontWeight: 800 }}>
            End time
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.15fr", gap: 1 }}>
          <Box>
            <Typography sx={timeFieldLabelSx}>Hour</Typography>
            <TextField
              select
              value={endHour}
              onChange={(e) => setEndHour(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "End hour" }}
              sx={compactFieldSx}
            >
              {HOURS.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={timeFieldLabelSx}>Min</Typography>
            <TextField
              select
              value={endMin}
              onChange={(e) => setEndMin(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "End minute" }}
              sx={compactFieldSx}
            >
              {MINS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <Typography sx={timeFieldLabelSx}>AM/PM</Typography>
            <TextField
              select
              value={endType}
              onChange={(e) => setEndType(e.target.value)}
              fullWidth
              inputProps={{ "aria-label": "End AM or PM" }}
              sx={compactFieldSx}
            >
              {AMPM.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderPortalTimeSelects = (prefix, hour, setHour, min, setMin, type, setType) => (
    <Box className="instructor-time-sheet-time-controls">
      <FormControl size="small" className="instructor-time-sheet-time-field">
        <Select
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": `${prefix} hour` }}
        >
          {HOURS.map((h) => (
            <MenuItem key={h} value={h}>
              {h}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography component="span" className="instructor-time-sheet-time-separator">
        :
      </Typography>
      <FormControl size="small" className="instructor-time-sheet-time-field">
        <Select
          value={min}
          onChange={(e) => setMin(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": `${prefix} minute` }}
        >
          {MINS.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" className="instructor-time-sheet-time-field">
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          inputProps={{ "aria-label": `${prefix} AM or PM` }}
        >
          {AMPM.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderPortalEntryForm = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    const dateLabel = "Volunteer / Coordinator Date";
    const totalHoursDisplay =
      totalHoursPreview === null ? "—" : totalHoursPreview.toFixed(2);

    return (
      <Box component="form" className="instructor-time-sheet-entry-form" onSubmit={handleSubmit}>
        <div className="instructor-time-sheet-table-wrap">
          <table className="instructor-time-sheet-form-table">
            <tbody>
              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  Task Name:
                </th>
                <td className="instructor-time-sheet-input-cell">
                  <FormControl size="small" required className="instructor-time-sheet-field">
                    <Select
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      displayEmpty
                      inputProps={{ "aria-label": "Task Name" }}
                    >
                      <MenuItem value="">
                        <em>Select task</em>
                      </MenuItem>
                      {taskNameOptions.map((task) => (
                        <MenuItem key={task} value={task}>
                          {task}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
              </tr>

              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  Description:
                </th>
                <td className="instructor-time-sheet-input-cell">
                  <TextField
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    multiline
                    minRows={3}
                    placeholder="Enter task details"
                    size="small"
                    className="instructor-time-sheet-field-wide"
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  {dateLabel}:
                </th>
                <td className="instructor-time-sheet-input-cell">
                  <TextField
                    type="date"
                    value={volunteerDate}
                    onChange={(e) => setVolunteerDate(e.target.value)}
                    required
                    size="small"
                    className="instructor-time-sheet-field"
                    inputProps={{ "aria-label": dateLabel }}
                  />
                </td>
              </tr>

              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  Start Time:
                </th>
                <td className="instructor-time-sheet-input-cell">
                  {renderPortalTimeSelects(
                    "Start",
                    startHour,
                    setStartHour,
                    startMin,
                    setStartMin,
                    startType,
                    setStartType,
                  )}
                </td>
              </tr>

              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  End Time:
                </th>
                <td className="instructor-time-sheet-input-cell">
                  {renderPortalTimeSelects(
                    "End",
                    endHour,
                    setEndHour,
                    endMin,
                    setEndMin,
                    endType,
                    setEndType,
                  )}
                </td>
              </tr>

              <tr>
                <th scope="row" className="instructor-time-sheet-label-cell">
                  Total Hours:
                </th>
                <td className="instructor-time-sheet-value-cell">
                  <span className="instructor-time-sheet-total-hours-value">
                    {totalHoursDisplay}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="instructor-time-sheet-submit-row">
          <div className="instructor-time-sheet-submit-spacer" aria-hidden="true" />
          <div className="instructor-time-sheet-submit-cell">
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={saving}
              className="instructor-time-sheet-submit-btn"
            >
              {saving ? "Saving..." : isEdit ? "Update Entry" : "Save Entry"}
            </Button>
          </div>
        </div>
      </Box>
    );
  };

  const renderEntryForm = (portalStyle = false) => {
    if (portalStyle) {
      return renderPortalEntryForm();
    }

    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Box className={portalStyle ? "instructor-time-sheet-form-panel" : undefined} sx={portalStyle ? undefined : sectionCardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <TaskIcon sx={{ color: "#2e7d32" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1b5e20" }}>
                  Work details
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Task name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    fullWidth
                    required
                    size={portalStyle ? "small" : "medium"}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    fullWidth
                    multiline
                    minRows={portalStyle ? 4 : 5}
                    placeholder="Add notes about what you worked on."
                    size={portalStyle ? "small" : "medium"}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box className={portalStyle ? "instructor-time-sheet-form-panel" : undefined} sx={portalStyle ? undefined : sectionCardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <CalendarIcon sx={{ color: "#2e7d32" }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#1b5e20" }}>
                  Date and time
                </Typography>
              </Box>
              {renderTimeFields()}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              sx={
                portalStyle
                  ? {
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      pt: 0.5,
                    }
                  : {
                      p: 2,
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      border: "1px solid #dfe9df",
                      borderRadius: 2,
                      bgcolor: "#ffffff",
                      boxShadow: "none",
                    }
              }
            >
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#1b5e20", fontWeight: 800 }}>
                  {portalStyle ? "Total hours" : "Ready to save?"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {totalHoursPreview === null
                    ? "Choose a valid end time after the start time."
                    : portalStyle
                      ? `${totalHoursPreview.toFixed(2)} hours for this entry`
                      : `This entry will record ${totalHoursPreview.toFixed(2)} volunteer hours.`}
                </Typography>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                disabled={saving}
                sx={
                  portalStyle
                    ? portalHeaderActionButtonSx
                    : {
                        bgcolor: "#43a047",
                        fontWeight: 800,
                        textTransform: "none",
                        borderRadius: 1.5,
                        px: 2.5,
                        py: 1,
                        minWidth: { xs: "100%", sm: 170 },
                        "&:hover": { bgcolor: "#2e7d32" },
                      }
                }
              >
                {saving ? "Saving..." : isEdit ? "Update entry" : "Save entry"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  if (isInstructorView) {
    return (
      <Box className="instructor-time-sheet">
        <Container {...instructorPortalContentContainerProps} sx={{ mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={adminSessionListPanelCardSx}>
                <CardContent
                  sx={{
                    ...adminSessionListPanelContentSx,
                    pt: 1,
                    "&:last-child": { pb: 1.5 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="h1"
                    className="instructor-time-sheet-form-title"
                    sx={adminSessionListTitleSx}
                  >
                    My Time Sheet
                  </Typography>

                  {renderPortalEntryForm()}

                  <VolunteerTimeSheetGrid
                    rows={entries}
                    loading={listLoading}
                    error={listError}
                    onEntriesChanged={loadEntries}
                    usePortalStyle
                    hideTitle
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        <AppSnackbar
          snackbar={snackbar}
          onClose={closeSnackbar}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          sx={{ mt: 8 }}
        />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2, pb: 4, zoom: "65%" }}>
      <Button
        component={RouterLink}
        to={dashboardPath}
        startIcon={<BackIcon />}
        sx={{
          mb: 2,
          color: "#1b5e20",
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to dashboard
      </Button>
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          borderRadius: 2,
          borderTop: "4px solid #43a047",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #dcebdc",
            bgcolor: "#f2f9f2",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Chip
              label={isEdit ? "Update entry" : "New entry"}
              size="small"
              sx={{
                mb: 0.75,
                bgcolor: "#e8f5e9",
                color: "#1b5e20",
                fontWeight: 700,
              }}
            />
            <Typography variant="h5" component="h1" sx={{ color: "#1b5e20", fontWeight: 800 }}>
              {isEdit ? "Edit time sheet entry" : "Log volunteer hours"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Record the date, task, and start/end time for your volunteer work.
            </Typography>
          </Box>
          <Paper
            sx={{
              p: 1.5,
              minWidth: { xs: "100%", sm: 190 },
              border: "1px solid #dfe9df",
              borderRadius: 2,
              boxShadow: "none",
              bgcolor: "#f5faf5",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
              Total hours
            </Typography>
            <Typography variant="h5" sx={{ color: "#1b5e20", fontWeight: 800 }}>
              {totalHoursPreview === null ? "--" : totalHoursPreview.toFixed(2)}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>{renderEntryForm(false)}</Box>
      </Paper>

      <Box sx={{ mt: 3 }}>
        <VolunteerTimeSheetGrid
          rows={entries}
          loading={listLoading}
          error={listError}
          onEntriesChanged={loadEntries}
        />
      </Box>

      <AppSnackbar
        snackbar={snackbar}
        onClose={closeSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 8 }}
      />
    </Container>
  );
};

export default VolunteerTimeSheet;
