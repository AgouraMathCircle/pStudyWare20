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
            // Check both claim types for role
            var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
            
            // Get all claims for debugging
            var allClaims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

            return Ok(new
            {
                UserId = userId,
                Email = email,
                Role = role,
                AllClaims = allClaims,
                IsInRoleStudent = User.IsInRole("Student")
            });
        }

        [HttpGet("validate-token")]
        [Authorize]
        public IActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid", user = User.Identity?.Name });
        }

        /// <summary>
        /// Forgot Password - Send password reset email to user
        /// </summary>
        /// <param name="request">Forgot password request with email</param>
        /// <returns>Forgot password response</returns>
        [HttpPost("forgot-password")]
        [AllowAnonymous] // Allow anonymous access for forgot password
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _authService.ForgotPasswordAsync(request);

                if (response.IsSuccess)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing forgot password request", error = ex.Message });
            }
        }

        [HttpPost("refresh-token")]
        public IActionResult RefreshToken([FromBody] RefreshTokenRequest request)
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

        /// <summary>
        /// Update Password - Change user password and send notification email
        /// </summary>
        /// <param name="request">Update password request with username and new password</param>
        /// <returns>Update password response</returns>
        [HttpPost("update-password")]
        [Authorize] // Require authentication to update password
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Verify that the authenticated user is updating their own password
                var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(userEmail) || !userEmail.Equals(request.Username, StringComparison.OrdinalIgnoreCase))
                {
                    return Forbid(); // User can only update their own password
                }

                var response = await _authService.UpdatePasswordAsync(request);

                if (response.IsSuccess)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating password", error = ex.Message });
            }
        }
    }
}