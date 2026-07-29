import config from "./config";

/**
 * Legacy message-center stored procedures expect MemberMaster.UserName
 * (Session["Username"]), not the login email.
 */
const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

const getJwtPayload = () => {
  try {
    const rawUser = localStorage.getItem(config.auth.userDataKey);
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      if (parsed?.token) {
        return parseJwtPayload(parsed.token);
      }
    }

    const token = localStorage.getItem(config.auth.tokenKey);
    return token ? parseJwtPayload(token) : null;
  } catch {
    return null;
  }
};

const getJwtClaim = (...claimNames) => {
  const payload = getJwtPayload();
  if (!payload) {
    return "";
  }

  for (const name of claimNames) {
    const value = payload[name];
    if (value != null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }

  return "";
};

export const getPortalUsername = (user) => {
  const fromUser =
    user?.username || user?.userName || user?.Username || "";
  if (fromUser) {
    return String(fromUser).trim();
  }

  // Only the explicit portal Username claim — not Name/email claims.
  return getJwtClaim("Username", "username");
};

/** Parent login email (AMC_tblUsers.coluserEmail) for student-scoped SP lookups. */
export const getPortalEmail = (user) =>
  user?.email || user?.Email || user?.emailID || user?.EmailID || "";

/** Prefer portal username; fall back to login email for student parent accounts. */
export const getPortalLoginIdentifier = (user) =>
  getPortalUsername(user) || getPortalEmail(user) || "";

/**
 * Username for AMC_spMeetingSchedule_Select (@UserName).
 * Legacy Session["Username"]: students match coluserEmail; all other roles use MemberMaster.Username.
 */
export const getMeetingScheduleUsername = (user) => {
  if (!user) {
    return "";
  }

  const memberType = String(user?.memberType ?? user?.MemberType ?? "")
    .trim()
    .toUpperCase();
  const role = String(user?.role ?? user?.Role ?? "").trim();

  // Legacy Session["Username"] is MemberMaster.Username (SP resolves UserType there first).
  if (memberType === "S" || role === "Student") {
    return getPortalUsername(user) || getPortalEmail(user) || "";
  }

  return getPortalUsername(user) || "";
};

/** JWT / login chapter scope for chapter-admin dashboards. */
export const getPortalChapterId = (user) => {
  const fromUser =
    user?.chapterID ||
    user?.chapterId ||
    user?.ChapterID ||
    "";
  if (fromUser) {
    return String(fromUser).trim();
  }

  return getJwtClaim("ChapterID", "chapterId", "chapterID");
};
