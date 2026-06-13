/**
 * Legacy message-center stored procedures expect MemberMaster.UserName
 * (Session["Username"]), not the login email.
 */
export const getPortalUsername = (user) =>
  user?.username || user?.userName || user?.Username || "";
