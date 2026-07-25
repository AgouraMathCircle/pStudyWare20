/**
 * Portal path helpers after login.
 *
 * Roles (new app — not the same as legacy UI naming):
 * - SystemAdmin: MemberType=A + systemAdmin=Y → /pstudyware/systemadmin
 * - Admin:       MemberType=A + systemAdmin=N → /pstudyware/admin
 *
 * SuperUser is a DB flag for chapter scope only (GettingAuthorizedChapter);
 * it is not used for portal/login role.
 */

export function isPortalRoute(pathname) {
  if (!pathname) return false;

  if (pathname.startsWith("/pstudyware")) return true;
  if (pathname.startsWith("/UpdateProfile")) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/student/")) return true;

  return false;
}

/** True when user should use the SystemAdmin portal. */
export function isSystemAdminUser(user) {
  if (!user) return false;
  if (user.role === "SystemAdmin") return true;

  const memberType = String(user.memberType ?? "").trim().toUpperCase();
  const systemAdmin = String(user.systemAdmin ?? user.SystemAdmin ?? "")
    .trim()
    .toUpperCase();

  return memberType === "A" && systemAdmin === "Y";
}

export function getPortalDashboardPath(user) {
  if (!user) return "/";

  if (isSystemAdminUser(user)) {
    return "/pstudyware/systemadmin/dashboard";
  }

  const memberType = user.memberType?.toUpperCase();
  const systemAdmin = String(user.systemAdmin ?? user.SystemAdmin ?? "")
    .trim()
    .toUpperCase();

  if (
    user.role === "Admin" ||
    (memberType === "A" && systemAdmin === "N")
  ) {
    return "/pstudyware/admin/dashboard";
  }

  if (memberType === "I" || memberType === "C" || user.role === "Instructor") {
    return "/pstudyware/instructor/dashboard";
  }

  if (memberType === "V" || user.role === "Volunteer") {
    return "/pstudyware/volunteer/dashboard";
  }

  if (memberType === "S" || user.role === "Student") {
    return "/pstudyware/student/dashboard";
  }

  return "/";
}

export function getMessageCenterPath(user) {
  if (!user) return "/login";

  if (isSystemAdminUser(user)) {
    return "/pstudyware/systemadmin/message-center";
  }

  const memberType = user.memberType?.toUpperCase();
  const systemAdmin = String(user.systemAdmin ?? user.SystemAdmin ?? "")
    .trim()
    .toUpperCase();

  if (
    user.role === "Admin" ||
    (memberType === "A" && systemAdmin === "N")
  ) {
    return "/pstudyware/admin/message-center";
  }

  if (memberType === "I" || memberType === "C" || user.role === "Instructor") {
    return "/pstudyware/instructor/message-center";
  }

  if (memberType === "V" || user.role === "Volunteer") {
    return "/pstudyware/volunteer/message-center";
  }

  if (memberType === "S" || user.role === "Student") {
    return "/pstudyware/student/message-center";
  }

  return "/login";
}
