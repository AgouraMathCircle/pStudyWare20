using pStudyWare20.Entity;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using pStudyWare20.Data.Models;

namespace pStudyWare20.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(IMemberRepository memberRepository, IJwtService jwtService, IHttpContextAccessor httpContextAccessor)
        {
            _memberRepository = memberRepository;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<LoginResponse?> AuthenticateAsync(LoginRequest request)
        {
            try
            {
                // Validate credentials using stored procedure (same as btnSubmit_Click logic)
                var user = await _memberRepository.ValidateUserWithStoredProcedureAsync(request.Email, request.Password);

                if (user == null)
                {
                    return null;
                }

                // Get IP address for user tracking
                var ipAddress = GetClientIpAddress();

                // Add user tracking (same as AddUserTracking method)
                await _memberRepository.AddUserTrackingAsync(
                    user.pMemberID.ToString(),
                    user.EmailID ?? user.UserName,
                    user.MemberType,
                    ipAddress
                );

                // Determine user role based on MemberType (same as original logic)
                string role = GetUserRole(user);

                // Generate JWT token
                var token = _jwtService.GenerateToken(user.pMemberID.ToString(), user.EmailID ?? user.UserName, role);

                return new LoginResponse
                {
                    Token = token,
                    UserId = user.pMemberID.ToString(),
                    Email = user.EmailID ?? user.UserName,
                    Username = user.UserName,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Role = role,
                    MemberType = user.MemberType,
                    ChapterID = user.ChapterID?.ToString(),
                    SystemAdmin = user.systemAdmin,
                    ExpiresAt = DateTime.UtcNow.AddMinutes(60)
                };
            }
            catch (Exception)
            {
                // Log the exception in production
                return null;
            }
        }

        private string GetUserRole(MemberMaster user)
        {
            // Same logic as original btnSubmit_Click method
            if (!string.IsNullOrEmpty(user.systemAdmin) && user.systemAdmin.Equals("Y", StringComparison.OrdinalIgnoreCase))
            {
                return "Admin";
            }
            else if (!string.IsNullOrEmpty(user.MemberType))
            {
                switch (user.MemberType.ToUpper())
                {
                    case "A":
                        return "Admin";
                    case "I":
                        return "Instructor";
                    case "S":
                        return "Student";
                    case "V":
                        return "Volunteer";
                    default:
                        return "User";
                }
            }

            return "User";
        }

        private string GetClientIpAddress()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.Request == null)
                return "Unknown";

            // Try to get the real IP address
            var forwardedHeader = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedHeader))
            {
                var ips = forwardedHeader.Split(',');
                return ips.Length > 0 ? ips[0].Trim() : "Unknown";
            }

            var remoteIpAddress = httpContext.Connection.RemoteIpAddress;
            return remoteIpAddress?.ToString() ?? "Unknown";
        }
        public Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var principal = _jwtService.ValidateToken(token);
                return Task.FromResult(principal != null);
            }
            catch
            {
                return Task.FromResult(false);
            }
        }
    }
}