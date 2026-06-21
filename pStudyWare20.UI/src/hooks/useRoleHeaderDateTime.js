import { useEffect, useState } from "react";

const ROLE_HEADER_DATE_TIME_OPTIONS = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

export const formatRoleHeaderDateTime = (date = new Date()) =>
  date.toLocaleString("en-US", ROLE_HEADER_DATE_TIME_OPTIONS);

/** Live date/time string for portal role header toolbars (refreshes every minute). */
export function useRoleHeaderDateTime(updateIntervalMs = 60000) {
  const [dateTime, setDateTime] = useState(() => formatRoleHeaderDateTime());

  useEffect(() => {
    const refresh = () => setDateTime(formatRoleHeaderDateTime());
    const id = window.setInterval(refresh, updateIntervalMs);
    return () => window.clearInterval(id);
  }, [updateIntervalMs]);

  return dateTime;
}
