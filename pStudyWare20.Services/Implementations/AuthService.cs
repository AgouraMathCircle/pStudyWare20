using pStudyWare20.Entity;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using pStudyWare20.Data.Models;
using Microsoft.Extensions.Configuration;

namespace pStudyWare20.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IJwtService _jwtService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEmailUtility _emailUtility;

        public AuthService(IMemberRepository memberRepository, IJwtService jwtService, IHttpContextAccessor httpContextAccessor, IEmailUtility emailUtility)
        {
            _memberRepository = memberRepository;
            _jwtService = jwtService;
            _httpContextAccessor = httpContextAccessor;
            _emailUtility = emailUtility;
        }

        //HP
        public async Task<LoginResponse?> AuthenticateAsync(LoginRequest request)
        {
            try
            {
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
                var token = _jwtService.GenerateToken(
                    user.pMemberID.ToString(),
                    user.EmailID ?? user.UserName,
                    role,
                    user.systemAdmin,
                    user.ChapterID?.ToString());

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

        public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            try
            {
                // Get user by email using the same stored procedure as the original
                // The original code uses mode="GetPassword" to get the password
                var user = await _memberRepository.GetUserPasswordByEmailAsync(request.Email);

                if (user == null)
                {
                    return new ForgotPasswordResponse
                    {
                        IsSuccess = false,
                        Message = "Email Address not found.",
                        ErrorMessage = "User not found with the provided email address."
                    };
                }

                // Send password reset email using EmailUtility
                var emailResult = _emailUtility.SendForgotPasswordEmail(user);

                if (emailResult.Contains("Error"))
                {
                    return new ForgotPasswordResponse
                    {
                        IsSuccess = false,
                        Message = "Sorry, there was an error sending the email.",
                        ErrorMessage = emailResult
                    };
                }

                return new ForgotPasswordResponse
                {
                    IsSuccess = true,
                    Message = "Your password has been sent to your email address."
                };
            }
            catch (Exception ex)
            {
                return new ForgotPasswordResponse
                {
                    IsSuccess = false,
                    Message = "Email Address not found.",
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<UpdatePasswordResponse> UpdatePasswordAsync(string authenticatedUserEmail, UpdatePasswordRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(authenticatedUserEmail))
                {
                    return new UpdatePasswordResponse
                    {
                        IsSuccess = false,
                        Message = "Unable to identify the signed-in user."
                    };
                }

                var member = await _memberRepository.GetUserPasswordByEmailAsync(authenticatedUserEmail.Trim());
                if (member == null)
                {
                    return new UpdatePasswordResponse
                    {
                        IsSuccess = false,
                        Message = "We could not verify your account. Please sign in again or contact support."
                    };
                }

                if (!string.Equals(member.Password, request.CurrentPassword?.Trim() ?? string.Empty, StringComparison.Ordinal))
                {
                    return new UpdatePasswordResponse
                    {
                        IsSuccess = false,
                        Message = "Current password is not correct."
                    };
                }

                var newPassword = request.Password.Trim();
                var updateResult = await _memberRepository.UpdatePasswordAsync(member.UserName, newPassword);

                if (!updateResult)
                {
                    return new UpdatePasswordResponse
                    {
                        IsSuccess = false,
                        Message = "Your password could not be updated. Please try again.",
                        Username = member.UserName
                    };
                }

                var notifyEmail = string.IsNullOrWhiteSpace(member.EmailID) ? authenticatedUserEmail.Trim() : member.EmailID.Trim();
                var emailResult = _emailUtility.SendPasswordChangedEmail(notifyEmail, newPassword);

                if (emailResult.Contains("Error"))
                {
                    return new UpdatePasswordResponse
                    {
                        IsSuccess = true,
                        Message = "You have changed your password successfully, but the email notification failed to send.",
                        Username = member.UserName
                    };
                }

                return new UpdatePasswordResponse
                {
                    IsSuccess = true,
                    Message = "You have changed your password successfully",
                    Username = member.UserName
                };
            }
            catch (Exception ex)
            {
                return new UpdatePasswordResponse
                {
                    IsSuccess = false,
                    Message = $"An error occurred while updating password: {ex.Message}"
                };
            }
        }
    }
}
