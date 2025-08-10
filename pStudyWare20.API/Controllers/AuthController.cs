using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Entity;
using pStudyWare20.Services.Interfaces;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.AuthenticateAsync(request);

                if (response == null)
                {
                    return Unauthorized(new { message = "Invalid credentials" });
                }

                return Ok(response);
            }
            catch
            {
                // Log the exception in production
                return StatusCode(500, new { message = "An error occurred during authentication" });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                UserId = userId,
                Email = email,
                Role = role
            });
        }

        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid", user = User.Identity?.Name });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                // For now, just return a success message
                // In a real implementation, you would send an email with reset instructions
                return Ok(new { message = "Password reset email sent successfully" });
            }
            catch
            {
                return StatusCode(500, new { message = "An error occurred while processing the request" });
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                // For now, just return a success message
                // In a real implementation, you would validate the refresh token and issue a new access token
                return Ok(new { message = "Token refreshed successfully" });
            }
            catch
            {
                return StatusCode(500, new { message = "An error occurred while refreshing the token" });
            }
        }
    }
}