import { pad2 } from "./timeSheetClockParse";

const VALID_AMPM = new Set(["AM", "PM"]);

function clockToMinutes(hour, min, type) {
  const h = parseInt(String(hour ?? "").trim(), 10);
  const m = parseInt(String(min ?? "").trim(), 10);
  const t = String(type ?? "").trim().toUpperCase();

  if (!Number.isFinite(h) || h < 1 || h > 12) {
    return { error: "Invalid hour (use 1–12)." };
  }
  if (!Number.isFinite(m) || m < 0 || m > 59) {
    return { error: "Invalid minutes (use 00–59)." };
  }
  if (!VALID_AMPM.has(t)) {
    return { error: "Invalid AM/PM value." };
  }

  const normalizedHour = h === 12 ? 0 : h;
  const offset = t === "PM" ? 12 * 60 : 0;
  return { minutes: normalizedHour * 60 + m + offset };
}

function parseVolunteerDate(volunteerDate) {
  if (!volunteerDate || typeof volunteerDate !== "string") {
    return { error: "Please enter a valid volunteer date." };
  }

  const parts = volunteerDate.split("-").map((x) => parseInt(x, 10));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return { error: "Please enter a valid volunteer date." };
  }

  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day, 12, 0, 0, 0);
  if (
    Number.isNaN(dateObj.getTime()) ||
    dateObj.getFullYear() !== year ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getDate() !== day
  ) {
    return { error: "Please enter a valid volunteer date." };
  }

  return { dateObj };
}

/**
 * Validates instructor/volunteer time sheet entry form.
 * Returns an error message string, or null when valid.
 */
export function validateTimeSheetForm({
  taskName,
  taskDescription,
  volunteerDate,
  startHour,
  startMin,
  startType,
  endHour,
  endMin,
  endType,
}) {
  if (!String(taskName ?? "").trim()) {
    return "Please select a task name.";
  }

  if (!String(taskDescription ?? "").trim()) {
    return "Description cannot be empty.";
  }

  const dateResult = parseVolunteerDate(volunteerDate);
  if (dateResult.error) {
    return dateResult.error;
  }

  if (!String(startHour ?? "").trim() || !String(startMin ?? "").trim() || !String(startType ?? "").trim()) {
    return "Please complete the start time.";
  }
  if (!String(endHour ?? "").trim() || !String(endMin ?? "").trim() || !String(endType ?? "").trim()) {
    return "Please complete the end time.";
  }

  const start = clockToMinutes(startHour, startMin, startType);
  if (start.error) {
    return `Start time: ${start.error}`;
  }

  const end = clockToMinutes(endHour, endMin, endType);
  if (end.error) {
    return `End time: ${end.error}`;
  }

  if (end.minutes <= start.minutes) {
    return "End time cannot be earlier than or equal to start time.";
  }

  return null;
}

/** Normalized payload fields for UpsertTimeSheetTracking API. */
export function buildTimeSheetUpsertPayload({
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
  logID,
}) {
  const dateResult = parseVolunteerDate(volunteerDate);
  if (dateResult.error) {
    throw new Error(dateResult.error);
  }

  return {
    username,
    taskName: String(taskName).trim(),
    volunteerDate: dateResult.dateObj.toISOString(),
    startHour: pad2(startHour),
    startMin: pad2(startMin),
    startType: String(startType).trim().toUpperCase(),
    endHour: pad2(endHour),
    endMin: pad2(endMin),
    endType: String(endType).trim().toUpperCase(),
    taskDescription: String(taskDescription).trim(),
    logID: logID && logID > 0 ? logID : null,
  };
}

export function isTimeSheetApiSuccess(res) {
  return res?.isSuccess === true || res?.IsSuccess === true;
}

/** Real AMC_tblTimeTracking.LogID — never use mLogID (display row number). */
export function resolveTimeSheetLogId(row) {
  const raw = row?.logID ?? row?.LogID;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function extractTimeSheetApiError(err, fallback = "Request failed.") {
  const data = err?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors.join(" ");
  }
  return (
    data?.errorMessage ??
    data?.ErrorMessage ??
    data?.message ??
    data?.Message ??
    err?.message ??
    fallback
  );
}
