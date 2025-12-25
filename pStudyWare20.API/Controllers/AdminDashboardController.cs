using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [EnableCors("AllowReactApp")]
    [Authorize] // Require authentication for all admin endpoints
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminDashboardController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        /// <summary>
        /// Get student list for admin dashboard (matches BindGridView method)
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list response</returns>
        [HttpPost("GetStudentList")]
        public async Task<IActionResult> GetStudentList([FromBody] AdminStudentListRequest request)
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

                var response = await _adminService.GetStudentListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user tracking summary for admin dashboard (matches BindGridViewdUserTrackingSummary method)
        /// </summary>
        /// <param name="request">User tracking summary request</param>
        /// <returns>User tracking summary response</returns>
        [HttpPost("GetUserTrackingSummary")]
        public async Task<IActionResult> GetUserTrackingSummary([FromBody] UserTrackingSummaryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _adminService.GetUserTrackingSummaryAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting user tracking summary", error = ex.Message });
            }
        }

        /// <summary>
        /// Get dashboard message with student counts (matches GetDashboardMessage method)
        /// </summary>
        /// <param name="request">Dashboard message request</param>
        /// <returns>Dashboard message response</returns>
        [HttpPost("GetDashboardMessage")]
        public async Task<IActionResult> GetDashboardMessage([FromBody] DashboardMessageRequest request)
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

                var response = await _adminService.GetDashboardMessageAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting dashboard message", error = ex.Message });
            }
        }

        /// <summary>
        /// Publish documents and send email notification (matches btnPublishDoc_Click method)
        /// </summary>
        /// <param name="request">Publish document request</param>
        /// <returns>Publish document response</returns>
        [HttpPost("PublishDocument")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can publish documents
        public async Task<IActionResult> PublishDocument([FromBody] PublishDocumentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _adminService.PublishDocumentAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while publishing documents", error = ex.Message });
            }
        }

        /// <summary>
        /// Export student list to Excel (matches btnExportExcel_Click and GridviewToExcel methods)
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Excel file response</returns>
        [HttpPost("ExportStudentListToExcel")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can export data
        public async Task<IActionResult> ExportStudentListToExcel([FromBody] ExportExcelRequest request)
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

                var response = await _adminService.ExportStudentListToExcelAsync(request);

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get admin dashboard data (combines multiple methods for efficiency)
        /// </summary>
        /// <param name="username">Admin username (optional, will use JWT token if not provided)</param>
        /// <returns>Combined dashboard data</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                // Get username from JWT token if not provided
                var adminUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(adminUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                // Get all dashboard data in parallel
                var studentListTask = _adminService.GetStudentListAsync(new AdminStudentListRequest
                {
                    Username = adminUsername,
                    Mode = "D"
                });

                var trackingSummaryTask = _adminService.GetUserTrackingSummaryAsync(new UserTrackingSummaryRequest());

                var dashboardMessageTask = _adminService.GetDashboardMessageAsync(new DashboardMessageRequest
                {
                    Username = adminUsername,
                    Mode = "A"
                });

                await Task.WhenAll(studentListTask, trackingSummaryTask, dashboardMessageTask);

                var result = new
                {
                    StudentList = await studentListTask,
                    UserTrackingSummary = await trackingSummaryTask,
                    DashboardMessage = await dashboardMessageTask
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has admin privileges
        /// </summary>
        /// <returns>Admin privilege status</returns>
        [HttpGet("CheckAdminPrivileges")]
        public IActionResult CheckAdminPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var isSystemAdmin = userRole == "SystemAdmin";
                var isAdmin = userRole == "Admin" || isSystemAdmin;

                return Ok(new
                {
                    IsAdmin = isAdmin,
                    IsSystemAdmin = isSystemAdmin,
                    Role = userRole,
                    CanPublishDocuments = isSystemAdmin,
                    CanExportData = isAdmin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking admin privileges", error = ex.Message });
            }
        }
    }
}
