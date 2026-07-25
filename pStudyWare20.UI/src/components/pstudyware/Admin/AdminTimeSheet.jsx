import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AppSnackbar from "../Common/AppSnackbar";
import { useAppSnackbar } from "../Common/useAppSnackbar";
import { useAuth } from "../../../contexts/AuthContext";
import adminTimeSheetService from "../../../services/adminTimeSheetService";
import VolunteerTimeSheetGrid from "../Volunteer/VolunteerTimeSheetGrid";
import { resolveTimeFieldsFromEntry } from "../../../utils/timeSheetClockParse";
import {
  buildTimeSheetUpsertPayload,
  extractTimeSheetApiError,
  isTimeSheetApiSuccess,
  validateTimeSheetForm,
} from "../../../utils/timeSheetFormValidation";
import { ADMIN_TIME_SHEET_PATH } from "../../../utils/timeSheetPortalPaths";
import AdminHeader, { AdminRoleHeaderSpacer } from "./AdminHeader";
import {
  adminSessionListPanelCardSx,
  adminSessionListPanelContentSx,
  adminSessionListTitleSx,
  instructorPortalContentContainerProps,
} from "../styles/applicationSurfaces";
import "../../../styles/InstructorTimeSheet.css";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const AMPM = ["AM", "PM"];

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

const AdminTimeSheet = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logIdParam = searchParams.get("logId");
  const logId = logIdParam ? parseInt(logIdParam, 10) : null;
  const isEdit = Number.isFinite(logId) && logId > 0;

  const { user } = useAuth();
  const username = useMemo(
    () => user?.username || user?.email || "",
    [user?.username, user?.email],
  );

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
      const res = await adminTimeSheetService.getAllTimeSheetTrackingEntries(username);
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
        const res = await adminTimeSheetService.getTimeSheetForEdit(logId, username);
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
  }, [isEdit, logId, username, showSnackbar]);

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
      const res = await adminTimeSheetService.upsertTimeSheetTracking(payload);
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
        navigate(ADMIN_TIME_SHEET_PATH, { replace: true });
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

  const renderEntryForm = () => {
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

  return (
    <Box className="instructor-time-sheet" sx={{ flex: 1, minHeight: 0, width: "100%" }}>
      <AdminHeader user={user} />
      <AdminRoleHeaderSpacer />

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

                {renderEntryForm()}

                <VolunteerTimeSheetGrid
                  rows={entries}
                  loading={listLoading}
                  error={listError}
                  onEntriesChanged={loadEntries}
                  usePortalStyle
                  hideTitle
                  editPath={ADMIN_TIME_SHEET_PATH}
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
};

export default AdminTimeSheet;
