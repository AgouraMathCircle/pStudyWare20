/**
 * SystemAdmin portal path helpers — /pstudyware/systemadmin only.
 */

export function getSystemAdminPortalBase() {
  return "/pstudyware/systemadmin";
}

/** Map a portal-relative path onto /pstudyware/systemadmin. */
export function toSystemAdminPortalPath(_userOrPathname, relativePath) {
  const base = getSystemAdminPortalBase();
  const suffix = String(relativePath || "")
    .replace(/^\/pstudyware\/(?:admin|sysadmin|systemadmin)/i, "")
    .replace(/^\//, "");
  return suffix ? `${base}/${suffix}` : base;
}
