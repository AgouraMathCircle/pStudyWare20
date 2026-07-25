export const ADMIN_TIME_SHEET_PATH = "/pstudyware/admin/time-sheet";
export const INSTRUCTOR_TIME_SHEET_PATH = "/pstudyware/instructor/time-sheet";
export const VOLUNTEER_TIME_SHEET_PATH = "/pstudyware/volunteer/time-sheet";

/** Self-service time sheet edit/list route for the signed-in portal user. */
export function resolveSelfServiceTimeSheetPath(user, overridePath) {
  if (overridePath) return overridePath;
  if (user?.role === "Volunteer") return VOLUNTEER_TIME_SHEET_PATH;
  if (user?.role === "Admin") return ADMIN_TIME_SHEET_PATH;
  return INSTRUCTOR_TIME_SHEET_PATH;
}
