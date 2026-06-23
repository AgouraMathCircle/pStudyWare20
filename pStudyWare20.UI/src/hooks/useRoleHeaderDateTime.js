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

const ROLE_HEADER_LOGIN_TIME_OPTIONS = {
  hour: "numeric",
  minute: "2-digit",
};

const ROLE_HEADER_LOGIN_DATE_OPTIONS = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
};

/** Date (today) + static login time for role header toolbars. */
export const formatRoleHeaderLoginDateTime = (loginAt) => {
  const loginTime = loginAt ? new Date(loginAt) : null;
  if (!loginTime || Number.isNaN(loginTime.getTime())) {
    return formatRoleHeaderDateTime();
  }

  const datePart = new Date().toLocaleDateString(
    "en-US",
    ROLE_HEADER_LOGIN_DATE_OPTIONS,
  );
  const timePart = loginTime.toLocaleTimeString(
    "en-US",
    ROLE_HEADER_LOGIN_TIME_OPTIONS,
  );

  return `${datePart}, ${timePart}`;
};

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
