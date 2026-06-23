import { useEffect, useState } from "react";

const PORTAL_LOGIN_DATE_TIME_OPTIONS = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

export const formatPortalLoginDateTime = (date = new Date()) =>
  date.toLocaleString("en-US", PORTAL_LOGIN_DATE_TIME_OPTIONS);

/** Live date/time for the portal login toolbar (refreshes every second). */
export function usePortalLoginDateTime(updateIntervalMs = 1000) {
  const [dateTime, setDateTime] = useState(() => formatPortalLoginDateTime());

  useEffect(() => {
    const refresh = () => setDateTime(formatPortalLoginDateTime());
    const id = window.setInterval(refresh, updateIntervalMs);
    return () => window.clearInterval(id);
  }, [updateIntervalMs]);

  return dateTime;
}
