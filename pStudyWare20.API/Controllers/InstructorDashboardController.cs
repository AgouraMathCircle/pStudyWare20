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
    [Authorize] // Require authentication for all instructor dashboard endpoints
    public class InstructorDashboardController : ControllerBase
    {
        private readonly IInstructorDashboardService _instructorDashboardService;

        public InstructorDashboardController(IInstructorDashboardService instructorDashboardService)
        {
            _instructorDashboardService = instructorDashboardService;
        }

        /// <summary>
        /// Get student list for instructor dashboard (matches BindGridView method)
        /// </summary>
        /// <param name="request">Instructor student list request</param>
        /// <returns>Instructor student list response</returns>
        [HttpPost("GetStudentList")]
        public async Task<IActionResult> GetStudentList([FromBody] InstructorStudentListRequest request)
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

                var response = await _instructorDashboardService.GetStudentListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get instructor dashboard data (combines multiple data sources for efficiency)
        /// </summary>
        /// <param name="username">Instructor username (optional, will use JWT token if not provided)</param>
        /// <returns>Instructor dashboard data response</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                // Get username from JWT token if not provided
                var instructorUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(instructorUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new InstructorDashboardDataRequest
                {
                    Username = instructorUsername
                };

                var response = await _instructorDashboardService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting instructor dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has instructor privileges
        /// </summary>
        /// <returns>Instructor privilege status</returns>
        [HttpGet("CheckInstructorPrivileges")]
        public IActionResult CheckInstructorPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isInstructor = userRole == "Instructor" || memberType == "I";

                return Ok(new InstructorPrivilegesResponse
                {
                    IsSuccess = true,
                    IsInstructor = isInstructor,
                    Role = userRole,
                    MemberType = memberType,
                    CanViewStudents = isInstructor
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking instructor privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get instructor dashboard summary (lightweight endpoint for quick data)
        /// </summary>
        /// <param name="username">Instructor username (optional, will use JWT token if not provided)</param>
        /// <returns>Dashboard summary</returns>
        [HttpGet("GetDashboardSummary")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery] string? username = null)
        {
            try
            {
                // Get username from JWT token if not provided
                var instructorUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(instructorUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new InstructorStudentListRequest
                {
                    Username = instructorUsername
                };

                var response = await _instructorDashboardService.GetStudentListAsync(request);
                
                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                // Create a lightweight summary
                var summary = new
                {
                    InstructorUsername = instructorUsername,
                    StudentCount = GetStudentCountFromResponse(response.StudentList),
                    LastUpdated = DateTime.UtcNow,
                    Status = "Active"
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting instructor dashboard summary", error = ex.Message });
            }
        }

        /// <summary>
        /// Helper method to get student count from response data
        /// </summary>
        private static int GetStudentCountFromResponse(object studentList)
        {
            try
            {
                if (studentList is System.Data.DataTable dataTable)
                    return dataTable.Rows.Count;
                if (studentList is System.Collections.ICollection coll)
                    return coll.Count;
                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}
