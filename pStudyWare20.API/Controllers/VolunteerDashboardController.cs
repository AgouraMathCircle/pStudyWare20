using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize] // Require authentication for all volunteer dashboard endpoints
    public class VolunteerDashboardController : ControllerBase
    {
        private readonly IVolunteerDashboardService _volunteerDashboardService;

        public VolunteerDashboardController(IVolunteerDashboardService volunteerDashboardService)
        {
            _volunteerDashboardService = volunteerDashboardService;
        }

        /// <summary>
        /// Get volunteer dashboard data (matches BindGridView method)
        /// </summary>
        /// <param name="request">Volunteer dashboard request</param>
        /// <returns>Volunteer dashboard response</returns>
        [HttpPost("GetVolunteerDashboardData")]
        public async Task<IActionResult> GetVolunteerDashboardData([FromBody] VolunteerDashboardRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _volunteerDashboardService.GetVolunteerDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Get volunteer dashboard summary with statistics
        /// </summary>
        /// <param name="request">Volunteer dashboard summary request</param>
        /// <returns>Volunteer dashboard summary response</returns>
        [HttpPost("GetVolunteerDashboardSummary")]
        public async Task<IActionResult> GetVolunteerDashboardSummary([FromBody] VolunteerDashboardSummaryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _volunteerDashboardService.GetVolunteerDashboardSummaryAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard summary", error = ex.Message });
            }
        }

        /// <summary>
        /// Get volunteer dashboard statistics
        /// </summary>
        /// <param name="request">Volunteer dashboard stats request</param>
        /// <returns>Volunteer dashboard stats response</returns>
        [HttpPost("GetVolunteerDashboardStats")]
        public async Task<IActionResult> GetVolunteerDashboardStats([FromBody] VolunteerDashboardStatsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _volunteerDashboardService.GetVolunteerDashboardStatsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard statistics", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has volunteer dashboard privileges
        /// </summary>
        /// <returns>Volunteer dashboard privilege status</returns>
        [HttpGet("CheckVolunteerDashboardPrivileges")]
        public async Task<IActionResult> CheckVolunteerDashboardPrivileges()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";

                var request = new VolunteerDashboardPrivilegesRequest
                {
                    Username = username
                };

                var response = await _volunteerDashboardService.CheckVolunteerDashboardPrivilegesAsync(request);
                response.Role = userRole;
                response.MemberType = memberType;

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking volunteer dashboard privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get time tracking entries for volunteer dashboard (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>List of time tracking entries</returns>
        [HttpGet("GetTimeTrackingEntries")]
        public async Task<IActionResult> GetTimeTrackingEntries([FromQuery] string? username = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var entries = await _volunteerDashboardService.GetTimeTrackingEntriesAsync(userUsername);
                return Ok(new { IsSuccess = true, TimeTrackingEntries = entries });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting time tracking entries", error = ex.Message });
            }
        }

        /// <summary>
        /// Get volunteer dashboard data (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Volunteer dashboard response</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new VolunteerDashboardRequest
                {
                    Username = userUsername
                };

                var response = await _volunteerDashboardService.GetVolunteerDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Get volunteer dashboard summary (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <param name="startDate">Start date filter (optional)</param>
        /// <param name="endDate">End date filter (optional)</param>
        /// <returns>Volunteer dashboard summary response</returns>
        [HttpGet("GetDashboardSummary")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery] string? username = null, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new VolunteerDashboardSummaryRequest
                {
                    Username = userUsername,
                    StartDate = startDate,
                    EndDate = endDate
                };

                var response = await _volunteerDashboardService.GetVolunteerDashboardSummaryAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard summary", error = ex.Message });
            }
        }

        /// <summary>
        /// Get volunteer dashboard statistics (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <param name="year">Year filter (optional)</param>
        /// <param name="month">Month filter (optional)</param>
        /// <returns>Volunteer dashboard stats response</returns>
        [HttpGet("GetDashboardStats")]
        public async Task<IActionResult> GetDashboardStats([FromQuery] string? username = null, [FromQuery] int? year = null, [FromQuery] int? month = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new VolunteerDashboardStatsRequest
                {
                    Username = userUsername,
                    Year = year,
                    Month = month
                };

                var response = await _volunteerDashboardService.GetVolunteerDashboardStatsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting volunteer dashboard statistics", error = ex.Message });
            }
        }
    }
}
