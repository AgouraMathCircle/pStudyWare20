/**
 * Returns true when the path belongs to the authenticated portal (admin/student/etc.),
 * as opposed to the public marketing site.
 */
export function isPortalRoute(pathname) {
  if (!pathname) return false;

  if (pathname.startsWith("/pstudyware")) return true;
  if (pathname.startsWith("/UpdateProfile")) return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/student/")) return true;

  return false;
}

export function getPortalDashboardPath(user) {
  if (!user) return "/";

  const memberType = user.memberType?.toUpperCase();

  if (
    memberType === "A" ||
    user.role === "Admin" ||
    user.role === "SystemAdmin"
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

  const memberType = user.memberType?.toUpperCase();

  if (
    memberType === "A" ||
    user.role === "Admin" ||
    user.role === "SystemAdmin"
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
