using System.Security.Claims;

namespace pStudyWare20.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(string userId, string email, string role, string? systemAdmin = null, string? chapterId = null, string? portalUsername = null, string? memberType = null);
        ClaimsPrincipal? ValidateToken(string token);
    }
} 