using pStudyWare20.Entity;

namespace pStudyWare20.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse?> AuthenticateAsync(LoginRequest request);
        Task<bool> ValidateTokenAsync(string token);
    }
} 