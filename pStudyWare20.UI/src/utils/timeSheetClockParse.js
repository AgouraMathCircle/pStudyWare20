/** Legacy time-sheet minute dropdown (TimeSheetTracking.aspx). */
const LEGACY_MINUTE_OPTIONS = [0, 15, 30, 45];

export function pad2(v) {
  const s = String(v ?? "").trim();
  if (!s) return "00";
  return s.padStart(2, "0");
}

export function snapMinuteToLegacyOption(min) {
  const n = parseInt(min, 10);
  if (!Number.isFinite(n)) return "00";
  if (LEGACY_MINUTE_OPTIONS.includes(n)) return pad2(n);
  const closest = LEGACY_MINUTE_OPTIONS.reduce((best, value) =>
    Math.abs(value - n) < Math.abs(best - n) ? value : best,
  );
  return pad2(closest);
}

/**
 * Parse AMC_spSelectTimeTracking clock strings (e.g. "2:00PM", "9:00 AM", "14:30:00").
 */
export function parseClockTimeParts(clockStr) {
  if (clockStr == null || clockStr === "") return null;
  const s = String(clockStr).trim();

  let match = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    return {
      hour: pad2(match[1]),
      min: snapMinuteToLegacyOption(match[2]),
      type: match[3].toUpperCase(),
    };
  }

  match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    let hour = parseInt(match[1], 10);
    const min = snapMinuteToLegacyOption(match[2]);
    const type = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return { hour: pad2(hour), min, type };
  }

  const parsed = Date.parse(`1970-01-01 ${s}`);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    let hour = d.getHours();
    const type = hour >= 12 ? "PM" : "AM";
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return {
      hour: pad2(hour),
      min: snapMinuteToLegacyOption(d.getMinutes()),
      type,
    };
  }

  return null;
}

export function resolveTimeFieldsFromEntry(entry, kind) {
  const isStart = kind === "start";
  const hour = entry?.[isStart ? "startHour" : "endHour"] ?? entry?.[isStart ? "StartHour" : "EndHour"];
  const min = entry?.[isStart ? "startMin" : "endMin"] ?? entry?.[isStart ? "StartMin" : "EndMin"];
  const type = entry?.[isStart ? "startType" : "endType"] ?? entry?.[isStart ? "StartType" : "EndType"];

  if (hour != null && hour !== "" && min != null && min !== "" && type) {
    return {
      hour: pad2(hour),
      min: snapMinuteToLegacyOption(pad2(min)),
      type: String(type).toUpperCase(),
    };
  }

  const clock =
    entry?.[isStart ? "startTime" : "endTime"] ?? entry?.[isStart ? "StartTime" : "EndTime"];
  const parsed = parseClockTimeParts(clock);
  if (parsed) return parsed;

  return {
    hour: pad2(isStart ? "09" : "05"),
    min: "00",
    type: isStart ? "AM" : "PM",
  };
}
