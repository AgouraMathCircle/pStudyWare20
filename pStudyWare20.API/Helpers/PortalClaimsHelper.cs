using System.Security.Claims;

namespace pStudyWare20.API.Helpers
{
    public static class PortalClaimsHelper
    {
        public static string GetPortalUsername(ClaimsPrincipal user)
        {
            return user.FindFirst("Username")?.Value
                ?? user.FindFirst(ClaimTypes.Name)?.Value
                ?? user.FindFirst(ClaimTypes.Email)?.Value
                ?? string.Empty;
        }
    }
}
