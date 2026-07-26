using System.Security.Claims;

namespace pStudyWare20.API.Helpers
{
    public static class PortalClaimsHelper
    {
        public static string GetPortalUsername(ClaimsPrincipal user)
        {
            return user.FindFirst("Username")?.Value?.Trim()
                ?? string.Empty;
        }

        public static string GetPortalEmail(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Email)?.Value?.Trim()
                ?? user.FindFirst(ClaimTypes.Name)?.Value?.Trim()
                ?? string.Empty;
        }

        /// <summary>
        /// AMC_spMeetingSchedule_Select @UserName: students by parent email; other roles by MemberMaster.Username.
        /// </summary>
        public static string GetMeetingScheduleUsername(ClaimsPrincipal user)
        {
            var memberType = user.FindFirst("MemberType")?.Value?.Trim() ?? "";
            var role = user.FindFirst(ClaimTypes.Role)?.Value?.Trim() ?? "";
            var isStudent = memberType.Equals("S", StringComparison.OrdinalIgnoreCase)
                || role.Equals("Student", StringComparison.OrdinalIgnoreCase);

            if (isStudent)
            {
                var portalUsername = GetPortalUsername(user);
                if (!string.IsNullOrEmpty(portalUsername))
                {
                    return portalUsername;
                }

                return GetPortalEmail(user);
            }

            var username = GetPortalUsername(user);
            return username;
        }
    }
}
