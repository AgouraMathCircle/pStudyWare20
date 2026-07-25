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
    [Authorize(Roles = "SystemAdmin")]
    public class SystemAdminDashboardController : ControllerBase
    {
        private readonly ISystemAdminService _systemAdminService;

        public SystemAdminDashboardController(ISystemAdminService systemAdminService)
        {
            _systemAdminService = systemAdminService;
        }

        [HttpPost("GetStudentList")]
        public async Task<IActionResult> GetStudentList([FromBody] SystemAdminStudentListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
                }

                var response = await _systemAdminService.GetStudentListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        [HttpPost("GetUserTrackingSummary")]
        public async Task<IActionResult> GetUserTrackingSummary([FromBody] UserTrackingSummaryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _systemAdminService.GetUserTrackingSummaryAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting user tracking summary", error = ex.Message });
            }
        }

        [HttpPost("GetUserTrackingList")]
        public async Task<IActionResult> GetUserTrackingList([FromBody] UserTrackingListRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
                }

                var response = await _systemAdminService.GetUserTrackingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting user tracking list", error = ex.Message });
            }
        }

        [HttpPost("GetDashboardMessage")]
        public async Task<IActionResult> GetDashboardMessage([FromBody] DashboardMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
                }

                var response = await _systemAdminService.GetDashboardMessageAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting dashboard message", error = ex.Message });
            }
        }

        [HttpPost("PublishDocument")]
        public async Task<IActionResult> PublishDocument([FromBody] PublishDocumentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                if (!HasSystemAdminPrivilege())
                {
                    return Forbid();
                }

                var response = await _systemAdminService.PublishDocumentAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while publishing documents", error = ex.Message });
            }
        }

        [HttpPost("ExportStudentListToExcel")]
        public async Task<IActionResult> ExportStudentListToExcel([FromBody] ExportExcelRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
                }

                var response = await _systemAdminService.ExportStudentListToExcelAsync(request);

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

        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                var portalUsername = username
                    ?? User.FindFirst("Username")?.Value
                    ?? User.FindFirst(ClaimTypes.Name)?.Value
                    ?? User.FindFirst(ClaimTypes.Email)?.Value
                    ?? "";

                if (string.IsNullOrEmpty(portalUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var studentListTask = _systemAdminService.GetStudentListAsync(new SystemAdminStudentListRequest
                {
                    Username = portalUsername,
                    Mode = "D"
                });

                var trackingSummaryTask = _systemAdminService.GetUserTrackingSummaryAsync(new UserTrackingSummaryRequest());

                var dashboardMessageTask = _systemAdminService.GetDashboardMessageAsync(new DashboardMessageRequest
                {
                    Username = portalUsername,
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

        [HttpGet("CheckSystemAdminPrivileges")]
        public IActionResult CheckSystemAdminPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var isSystemAdmin = HasSystemAdminPrivilege();
                var isSystemAdminRole = userRole == "SystemAdmin" || isSystemAdmin;

                return Ok(new
                {
                    IsAdmin = isSystemAdminRole,
                    IsSystemAdmin = isSystemAdmin,
                    Role = userRole,
                    CanPublishDocuments = isSystemAdmin,
                    CanExportData = isSystemAdminRole
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking SystemAdmin privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Elevated privilege: JWT role SystemAdmin or claim SystemAdmin=Y (MemberMaster.systemAdmin).
        /// </summary>
        private bool HasSystemAdminPrivilege()
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
            var systemAdmin = User.FindFirst("SystemAdmin")?.Value ?? "";
            return userRole.Equals("SystemAdmin", StringComparison.OrdinalIgnoreCase)
                || systemAdmin.Equals("Y", StringComparison.OrdinalIgnoreCase);
        }
    }
}
