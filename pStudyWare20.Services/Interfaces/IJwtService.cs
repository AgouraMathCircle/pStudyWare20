using System.Security.Claims;

namespace pStudyWare20.Services.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(string userId, string email, string role);
        ClaimsPrincipal? ValidateToken(string token);
    }
} 