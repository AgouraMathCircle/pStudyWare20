import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import PortalDialog from "./PortalDialog";
import PortalModalSelect from "./PortalModalSelect";
import {
  portalModalLegacySubmitButtonSx,
  portalModalFieldSx,
} from "./portalModalStyles";
import "../../../styles/AdminMeetingDetails.css";

const YES_NO_OPTIONS = [
  { value: "0", label: "No" },
  { value: "1", label: "Yes" },
];

const CLASS_OPTIONS = [
  { value: "JB", label: "Junior Beginner" },
  { value: "JI", label: "Junior Intermediate" },
  { value: "JA", label: "Junior Advanced" },
  { value: "SB", label: "Senior Beginner" },
  { value: "SI", label: "Senior Intermediate" },
  { value: "SA", label: "Senior Advanced" },
  { value: "DS", label: "Data Science" },
  { value: "AI", label: "Artificial Intelligence" },
  { value: "GD", label: "Game Development" },
  { value: "AD", label: "App Development" },
  { value: "DM", label: "Data Management" },
  { value: "ST", label: "PSAT" },
  { value: "AT", label: "ACT" },
  { value: "ED", label: "Engineering Design" },
];

const SECTION_OPTIONS = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

const MINUTE_OPTIONS = [
  { value: "00", label: "00" },
  { value: "15", label: "15" },
  { value: "30", label: "30" },
  { value: "45", label: "45" },
];

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: hour, label: hour };
});

const meetingFormRowSx = {
  width: "100%",
  mb: 0.5,
};

const FormFieldError = ({ error }) =>
  error ? (
    <Typography
      variant="caption"
      sx={{ display: "block", mt: 0.25, color: "#64748b", fontSize: "0.7rem" }}
    >
      {error}
    </Typography>
  ) : null;

const meetingFormStackSx = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
};

const meetingFormInputHeight = 28;

const meetingFormInputSx = {
  ...portalModalFieldSx,
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  "& .MuiOutlinedInput-root": {
    height: meetingFormInputHeight,
    minHeight: meetingFormInputHeight,
    maxHeight: meetingFormInputHeight,
    width: "100%",
    maxWidth: "100%",
  },
  "& .MuiInputBase-input": {
    height: `${meetingFormInputHeight}px !important`,
    minHeight: `${meetingFormInputHeight}px !important`,
    maxHeight: `${meetingFormInputHeight}px !important`,
    fontSize: "0.8125rem",
    boxSizing: "border-box",
    py: "0 !important",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiSelect-select": {
    height: `${meetingFormInputHeight}px !important`,
    minHeight: `${meetingFormInputHeight}px !important`,
    maxHeight: `${meetingFormInputHeight}px !important`,
    fontSize: "0.8125rem",
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
    py: "0 !important",
    overflow: "hidden !important",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

const meetingFormCompactFieldSx = {
  ...meetingFormInputSx,
  maxWidth: 168,
};

const meetingFormTimeFieldSx = {
  ...meetingFormInputSx,
  flex: "1 1 0",
  minWidth: 0,
  maxWidth: 96,
};

const parseLegacyBoolField = (value) => {
  if (value === true || value === 1 || value === "1") return "1";
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  if (text === "true" || text === "yes") return "1";
  return "0";
};

const toSelectValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

/** Read API/legacy values (camelCase, PascalCase, and legacy suffixes). */
const pickField = (obj, ...keys) => {
  if (!obj) return "";
  for (const key of keys) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return "";
};

const pickChapterId = (obj) =>
  toSelectValue(
    pickField(obj, "chapterID", "chapterId", "ChapterID", "ChapterId"),
  );

const pickChapterName = (obj) =>
  toSelectValue(pickField(obj, "chapterName", "ChapterName", "name", "Name"));

const resolveChapterName = (chapters, chapterId) => {
  const id = toSelectValue(chapterId);
  if (!id) return "";
  const match = (chapters ?? []).find((chapter) => pickChapterId(chapter) === id);
  return pickChapterName(match) || id;
};

const normalizeMinuteValue = (minute) => {
  const normalized = toSelectValue(minute).padStart(2, "0");
  if (MINUTE_OPTIONS.some((option) => option.value === normalized)) {
    return normalized;
  }
  return "00";
};

const normalizeHourValue = (hour) => {
  const normalized = toSelectValue(hour).padStart(2, "0");
  if (HOUR_OPTIONS.some((option) => option.value === normalized)) {
    return normalized;
  }
  return "00";
};

const formatMeetingDateForForm = (value) => {
  const raw = toSelectValue(value);
  if (!raw) return "";

  const mmddyyyy =
    /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
  if (mmddyyyy.test(raw)) return raw;

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const month = String(parsed.getMonth() + 1).padStart(2, "0");
    const day = String(parsed.getDate()).padStart(2, "0");
    const year = parsed.getFullYear();
    return `${month}/${day}/${year}`;
  }

  return raw;
};

const buildFormDataFromMeeting = (meeting) => {
  const meetingTime =
    pickField(meeting, "meetingTime", "MeetingTime") || "00:00";
  const [hour = "00", minute = "00"] = String(meetingTime).split(":");

  return {
    rowId: toSelectValue(pickField(meeting, "rowId", "RowId", "RowID") || "0"),
    chapterId: pickChapterId(meeting),
    class: toSelectValue(pickField(meeting, "class", "Class") || "JB"),
    section: toSelectValue(pickField(meeting, "section", "Section") || "A"),
    meetingProviderUrl: toSelectValue(
      pickField(
        meeting,
        "meetingProviderUrl",
        "MeetingProviderUrl",
        "MeetingProviderURL",
      ),
    ),
    meetingUrl: toSelectValue(
      pickField(meeting, "meetingUrl", "MeetingUrl", "MeetingURL"),
    ),
    meetingId: toSelectValue(
      pickField(meeting, "meetingId", "MeetingId", "MeetingID"),
    ),
    passcode: toSelectValue(pickField(meeting, "passcode", "Passcode")),
    adminLogin: toSelectValue(pickField(meeting, "adminLogin", "AdminLogin")),
    adminPassCode: toSelectValue(
      pickField(meeting, "adminPassCode", "AdminPassCode"),
    ),
    includeSection: parseLegacyBoolField(
      pickField(meeting, "includeSection", "IncludeSection"),
    ),
    active: parseLegacyBoolField(pickField(meeting, "active", "Active")),
    meetingDate: formatMeetingDateForForm(
      pickField(meeting, "meetingDate", "MeetingDate"),
    ),
    meetingHour: normalizeHourValue(hour),
    meetingMinute: normalizeMinuteValue(minute),
  };
};

const MeetingFormField = ({ children, error }) => (
  <Box className="meeting-form-field" sx={meetingFormRowSx}>
    {children}
    <FormFieldError error={error} />
  </Box>
);

const MeetingForm = ({
  open,
  onClose,
  meeting,
  chapters,
  onSubmit,
  isSystemAdmin,
  loading = false,
  submitting = false,
}) => {
  const chapterOptions = useMemo(
    () =>
      (chapters ?? [])
        .map((chapter) => {
          const value = pickChapterId(chapter);
          if (!value) return null;

          const label = pickChapterName(chapter) || value;

          return { value, label };
        })
        .filter(Boolean),
    [chapters],
  );

  const [formData, setFormData] = useState({
    rowId: "0",
    chapterId: "",
    class: "JB",
    section: "A",
    meetingProviderUrl: "",
    meetingUrl: "",
    meetingId: "",
    passcode: "",
    adminLogin: "",
    adminPassCode: "",
    includeSection: "0",
    active: "0",
    meetingDate: "",
    meetingHour: "00",
    meetingMinute: "00",
  });

  const ensureSelectOptions = (options, currentValue, fallbackLabel) => {
    const value = toSelectValue(currentValue);
    if (!value) return options;
    if (options.some((option) => option.value === value)) return options;
    return [{ value, label: fallbackLabel || value }, ...options];
  };

  const chapterSelectOptions = useMemo(() => {
    const base = chapterOptions.length
      ? chapterOptions
      : [{ value: "", label: "No chapters available" }];
    const value = toSelectValue(formData.chapterId);
    if (!value || base.some((option) => option.value === value)) {
      return base;
    }
    const chapterName =
      pickChapterName(meeting) || resolveChapterName(chapters, value);
    return [{ value, label: chapterName || value }, ...base];
  }, [chapterOptions, formData.chapterId, meeting, chapters]);

  const classSelectOptions = useMemo(
    () => ensureSelectOptions(CLASS_OPTIONS, formData.class, formData.class),
    [formData.class],
  );

  const sectionSelectOptions = useMemo(
    () =>
      ensureSelectOptions(SECTION_OPTIONS, formData.section, formData.section),
    [formData.section],
  );

  const [errors, setErrors] = useState({});
  const readOnly = !isSystemAdmin;

  const getDefaultChapterId = () => chapterOptions[0]?.value ?? "";

  useEffect(() => {
    if (!open) return;
    if (loading) return;

    if (meeting) {
      setFormData(buildFormDataFromMeeting(meeting));
    } else {
      setFormData({
        rowId: "0",
        chapterId: getDefaultChapterId(),
        class: "JB",
        section: "A",
        meetingProviderUrl: "",
        meetingUrl: "",
        meetingId: "",
        passcode: "",
        adminLogin: "",
        adminPassCode: "",
        includeSection: "0",
        active: "0",
        meetingDate: "",
        meetingHour: "00",
        meetingMinute: "00",
      });
    }
    setErrors({});
  }, [meeting, open, chapterOptions, loading]);

  const handleChange = (field, value) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.chapterId) {
      newErrors.chapterId = "Chapter is required";
    }

    if (!formData.meetingDate) {
      newErrors.meetingDate = "Meeting Date is required";
    } else {
      const dateRegex =
        /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/;
      if (!dateRegex.test(formData.meetingDate)) {
        newErrors.meetingDate = "Please enter (mm/dd/yyyy) format";
      }
    }

    if (!formData.meetingProviderUrl) {
      newErrors.meetingProviderUrl = "Meeting Provider URL is required";
    }

    if (!formData.meetingUrl) {
      newErrors.meetingUrl = "Meeting URL is required";
    }

    if (!formData.meetingId) {
      newErrors.meetingId = "Meeting ID is required";
    }

    if (!formData.passcode) {
      newErrors.passcode = "Passcode is required";
    }

    if (!formData.adminLogin) {
      newErrors.adminLogin = "Admin Login is required";
    }

    if (!formData.adminPassCode) {
      newErrors.adminPassCode = "Admin PassCode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!isSystemAdmin || !validateForm()) {
      return;
    }

    const meetingTime = `${formData.meetingHour}:${formData.meetingMinute}`;

    onSubmit({
      rowId: formData.rowId,
      chapterId: formData.chapterId,
      class: formData.class,
      section: formData.section,
      meetingProviderUrl: formData.meetingProviderUrl,
      meetingUrl: formData.meetingUrl,
      meetingId: formData.meetingId,
      passcode: formData.passcode,
      adminLogin: formData.adminLogin,
      adminPassCode: formData.adminPassCode,
      includeSection: formData.includeSection,
      active: formData.active,
      meetingTime,
      meetingDate: formData.meetingDate,
    });
  };

  const handleClose = () => {
    if (submitting) return;
    onClose?.();
  };

  const renderSelect = (
    field,
    value,
    options,
    { label, disabled = readOnly, required = false } = {},
  ) => {
    const labelId = `meeting-form-${field}-label`;
    return (
      <FormControl
        fullWidth
        size="small"
        required={required}
        sx={meetingFormInputSx}
        disabled={disabled}
      >
        <InputLabel id={labelId} shrink>
          {label}
        </InputLabel>
        <PortalModalSelect
          labelId={labelId}
          label={label}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          renderValue={(selected) => {
            const match = options.find((option) => option.value === selected);
            return match?.label ?? selected;
          }}
          inputProps={{ "aria-label": label }}
        >
          {options.map((option) => (
            <MenuItem key={`${field}-${option.value}`} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </PortalModalSelect>
      </FormControl>
    );
  };

  const isEdit = Boolean(meeting);

  return (
    <PortalDialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      disableClose={submitting}
      ariaLabelledby="meeting-form-dialog-title"
      contentSx={{ px: 2, pt: "16px !important", pb: 1.5 }}
      title={isEdit ? "Update Meeting Schedule" : "Add Meeting Schedule"}
      icon={
        isEdit ? (
          <EditIcon sx={{ fontSize: 20 }} />
        ) : (
          <AddIcon sx={{ fontSize: 20 }} />
        )
      }
      hideActions={!isSystemAdmin}
      actions={
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || submitting}
            startIcon={
              submitting ? <CircularProgress size={16} color="inherit" /> : null
            }
            sx={portalModalLegacySubmitButtonSx}
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </Box>
      }
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className="admin-meeting-details-form" sx={meetingFormStackSx}>
          <MeetingFormField error={errors.chapterId}>
            {renderSelect(
              "chapterId",
              formData.chapterId,
              chapterSelectOptions,
              {
                label: "Chapter Name",
                required: true,
                disabled: readOnly || chapterOptions.length === 0,
              },
            )}
          </MeetingFormField>

          <MeetingFormField>
            {renderSelect("class", formData.class, classSelectOptions, {
              label: "Class",
            })}
          </MeetingFormField>

          <MeetingFormField>
            {renderSelect("section", formData.section, sectionSelectOptions, {
              label: "Section",
            })}
          </MeetingFormField>

          <MeetingFormField error={errors.meetingDate}>
            <TextField
              fullWidth
              size="small"
              label="Meeting Date (MM/DD/YYYY)"
              required
              placeholder="MM/DD/YYYY"
              value={formData.meetingDate}
              onChange={(e) => handleChange("meetingDate", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Meeting Date" }}
              sx={meetingFormCompactFieldSx}
            />
          </MeetingFormField>

          <MeetingFormField>
            <Box
              className="meeting-form-time-row"
              sx={{ display: "flex", gap: 0.75, width: "100%", maxWidth: 204 }}
            >
              <FormControl
                fullWidth
                size="small"
                sx={meetingFormTimeFieldSx}
                disabled={readOnly}
              >
                <InputLabel id="meeting-form-hour-label" shrink>
                  Hour
                </InputLabel>
                <PortalModalSelect
                  labelId="meeting-form-hour-label"
                  label="Hour"
                  value={formData.meetingHour}
                  onChange={(e) => handleChange("meetingHour", e.target.value)}
                  inputProps={{ "aria-label": "Meeting hour" }}
                >
                  {HOUR_OPTIONS.map((option) => (
                    <MenuItem key={`hour-${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
              <FormControl
                fullWidth
                size="small"
                sx={meetingFormTimeFieldSx}
                disabled={readOnly}
              >
                <InputLabel id="meeting-form-minute-label" shrink>
                  Minute
                </InputLabel>
                <PortalModalSelect
                  labelId="meeting-form-minute-label"
                  label="Minute"
                  value={formData.meetingMinute}
                  onChange={(e) => handleChange("meetingMinute", e.target.value)}
                  inputProps={{ "aria-label": "Meeting minute" }}
                >
                  {MINUTE_OPTIONS.map((option) => (
                    <MenuItem key={`minute-${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </PortalModalSelect>
              </FormControl>
            </Box>
          </MeetingFormField>

          <MeetingFormField error={errors.meetingProviderUrl}>
            <TextField
              fullWidth
              size="small"
              label="Meeting Provider URL"
              required
              value={formData.meetingProviderUrl}
              onChange={(e) =>
                handleChange("meetingProviderUrl", e.target.value)
              }
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Meeting Provider URL" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField error={errors.meetingUrl}>
            <TextField
              fullWidth
              size="small"
              label="Meeting URL"
              required
              value={formData.meetingUrl}
              onChange={(e) => handleChange("meetingUrl", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Meeting URL" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField error={errors.meetingId}>
            <TextField
              fullWidth
              size="small"
              label="Meeting ID"
              required
              value={formData.meetingId}
              onChange={(e) => handleChange("meetingId", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Meeting ID" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField error={errors.passcode}>
            <TextField
              fullWidth
              size="small"
              label="Passcode"
              required
              value={formData.passcode}
              onChange={(e) => handleChange("passcode", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Passcode" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField error={errors.adminLogin}>
            <TextField
              fullWidth
              size="small"
              label="Admin Login"
              required
              value={formData.adminLogin}
              onChange={(e) => handleChange("adminLogin", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Admin Login" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField error={errors.adminPassCode}>
            <TextField
              fullWidth
              size="small"
              label="Admin PassCode"
              required
              value={formData.adminPassCode}
              onChange={(e) => handleChange("adminPassCode", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly }}
              inputProps={{ "aria-label": "Admin PassCode" }}
              sx={meetingFormInputSx}
            />
          </MeetingFormField>

          <MeetingFormField>
            {renderSelect(
              "includeSection",
              formData.includeSection,
              YES_NO_OPTIONS,
              { label: "Include Section" },
            )}
          </MeetingFormField>

          <MeetingFormField>
            {renderSelect("active", formData.active, YES_NO_OPTIONS, {
              label: "Active",
            })}
          </MeetingFormField>

          <Typography variant="caption" sx={{ color: "#64748b", mt: 0.25, fontSize: "0.7rem" }}>
            * Required Fields
          </Typography>
        </Box>
      )}
    </PortalDialog>
  );
};

export default MeetingForm;
