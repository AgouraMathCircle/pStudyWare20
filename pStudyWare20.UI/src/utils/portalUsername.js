/**
 * Legacy message-center stored procedures expect MemberMaster.UserName
 * (Session["Username"]), not the login email.
 */
export const getPortalUsername = (user) =>
  user?.username || user?.userName || user?.Username || "";

/** Parent login email (AMC_tblUsers.coluserEmail) for student-scoped SP lookups. */
export const getPortalEmail = (user) =>
  user?.email || user?.Email || user?.emailID || user?.EmailID || "";

/** Prefer portal username; fall back to login email for student parent accounts. */
export const getPortalLoginIdentifier = (user) =>
  getPortalUsername(user) || getPortalEmail(user) || "";
