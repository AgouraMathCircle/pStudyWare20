/**
 * Admin portal path helpers — /pstudyware/admin only.
 * (SystemAdmin portal uses systemAdminPortalPaths.js)
 */

export function getAdminPortalBase() {
  return "/pstudyware/admin";
}

/** Map a portal-relative path onto /pstudyware/admin. */
export function toAdminPortalPath(_userOrPathname, adminPath) {
  const base = getAdminPortalBase();
  const suffix = String(adminPath || "")
    .replace(/^\/pstudyware\/(?:admin|systemadmin|sysadmin|superadmin)/i, "")
    .replace(/^\//, "");
  return suffix ? `${base}/${suffix}` : base;
}
