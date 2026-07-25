using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.API.Helpers;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize] // Require authentication for all admin endpoints
    public class AdminDashboardController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly ITimeSheetTrackingService _timeSheetTrackingService;

        public AdminDashboardController(
            IAdminService adminService,
            ITimeSheetTrackingService timeSheetTrackingService)
        {
            _adminService = adminService;
            _timeSheetTrackingService = timeSheetTrackingService;
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

                // Prefer portal Username claim (MemberMaster.UserName) for SP lookups.
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
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
        /// Get user tracking list (legacy UserTracking.aspx — AMC_spSelectUserTrackingList).
        /// </summary>
        [HttpPost("GetUserTrackingList")]
        [Authorize(Roles = "Admin,SystemAdmin")]
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

                var response = await _adminService.GetUserTrackingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting user tracking list", error = ex.Message });
            }
        }

        /// <summary>
        /// Publish documents and send email notification (matches btnPublishDoc_Click method)
        /// </summary>
        /// <param name="request">Publish document request</param>
        /// <returns>Publish document response</returns>
        [HttpPost("PublishDocument")]
        [Authorize(Roles = "Admin,SystemAdmin")]
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

                // Prefer portal Username claim (MemberMaster.UserName) for SP lookups.
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst("Username")?.Value
                        ?? User.FindFirst(ClaimTypes.Name)?.Value
                        ?? User.FindFirst(ClaimTypes.Email)?.Value
                        ?? "";
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
        /// Get Chapter Admin dashboard data (student list only).
        /// To Do / Enrolled / Waiting widgets are SystemAdmin-only via SystemAdminDashboard.
        /// </summary>
        /// <param name="username">Admin username (optional, will use JWT token if not provided)</param>
        /// <returns>Dashboard student list</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                // Prefer portal Username claim (MemberMaster.UserName) for SP lookups.
                var adminUsername = username
                    ?? User.FindFirst("Username")?.Value
                    ?? User.FindFirst(ClaimTypes.Name)?.Value
                    ?? User.FindFirst(ClaimTypes.Email)?.Value
                    ?? "";

                if (string.IsNullOrEmpty(adminUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var studentList = await _adminService.GetStudentListAsync(new AdminStudentListRequest
                {
                    Username = adminUsername,
                    Mode = "D"
                });

                return Ok(new { StudentList = studentList });
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
                var isSystemAdmin = HasSystemAdminPrivilege();
                var isAdmin = userRole == "Admin" || userRole == "SystemAdmin" || isSystemAdmin;

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

        /// <summary>
        /// Chapter Admin: form context for Volunteer Availability entry.
        /// </summary>
        [HttpPost("GetVolunteerAvailabilityFormContext")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetVolunteerAvailabilityFormContext()
        {
            try
            {
                var chapterId = User.FindFirst("ChapterID")?.Value
                                ?? User.FindFirst("chapterId")?.Value
                                ?? "";

                var response = await _adminService.GetVolunteerAvailabilityFormContextAsync(chapterId);
                return response.IsSuccess ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while getting volunteer availability form context",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: get signed-in admin's volunteer availability.
        /// </summary>
        [HttpPost("GetVolunteerAvailability")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetVolunteerAvailability([FromBody] VolunteerAvailabilitySelectRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    request.UserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                     ?? User.FindFirst(ClaimTypes.Name)?.Value
                                     ?? User.FindFirst(ClaimTypes.Email)?.Value
                                     ?? "";
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    return BadRequest(new { message = "UserID is required." });
                }

                var response = await _adminService.GetVolunteerAvailabilityAsync(request);
                return response.IsSuccess ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while getting volunteer availability",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: update signed-in admin's volunteer availability.
        /// </summary>
        [HttpPost("UpdateVolunteerAvailability")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateVolunteerAvailability([FromBody] VolunteerAvailabilityRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    request.UserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                     ?? User.FindFirst(ClaimTypes.Name)?.Value
                                     ?? User.FindFirst(ClaimTypes.Email)?.Value
                                     ?? "";
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    return BadRequest(new { message = "UserID is required." });
                }

                var response = await _adminService.UpdateVolunteerAvailabilityAsync(request);
                return response.IsSuccess ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while updating volunteer availability",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: Volunteers Availability List for upcoming class (authorized chapters).
        /// </summary>
        [HttpPost("GetVolunteerAvailabilitySummary")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetVolunteerAvailabilitySummary([FromBody] VolunteerAvailabilitySummaryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                // Always prefer JWT portal Username (MemberMaster.UserName). Never use email —
                // AMC_spVolunteerAvailability_Summary / GettingAuthorizedChapter key off Username.
                var portalUsername = PortalClaimsHelper.GetPortalUsername(User);
                if (!string.IsNullOrWhiteSpace(portalUsername))
                {
                    request.Username = portalUsername;
                }
                else if (string.IsNullOrWhiteSpace(request.Username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                var response = await _adminService.GetVolunteerAvailabilitySummaryAsync(request);
                return response.IsSuccess ? Ok(response) : BadRequest(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while getting volunteer availability summary",
                    error = ex.Message
                });
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

        private string GetAuthenticatedUsername()
        {
            return User.FindFirst("Username")?.Value
                ?? User.FindFirst(ClaimTypes.Name)?.Value
                ?? User.FindFirst(ClaimTypes.Email)?.Value
                ?? "";
        }

        /// <summary>
        /// Chapter Admin: list the signed-in admin's own time sheet entries.
        /// </summary>
        [HttpGet("GetMyTimeSheetEntries")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMyTimeSheetEntries()
        {
            try
            {
                var username = GetAuthenticatedUsername();
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                var request = new TimeSheetTrackingListRequest { Username = username };
                var response = await _timeSheetTrackingService.GetMyTimeSheetTrackingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while getting admin time sheet entries",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: load one own time sheet entry for editing.
        /// </summary>
        [HttpGet("GetMyTimeSheetForEdit/{logId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetMyTimeSheetForEdit(int logId)
        {
            try
            {
                var username = GetAuthenticatedUsername();
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                var request = new UpdateTimeSheetTrackingRequest
                {
                    Username = username,
                    LogID = logId
                };

                var response = await _timeSheetTrackingService.GetMyTimeSheetTrackingForEditAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while getting admin time sheet entry for edit",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: create or update the signed-in admin's own time sheet entry.
        /// </summary>
        [HttpPost("UpsertMyTimeSheet")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpsertMyTimeSheet([FromBody] UpsertTimeSheetTrackingRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var username = GetAuthenticatedUsername();
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                request.Username = username;
                var response = await _timeSheetTrackingService.UpsertTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while saving admin time sheet entry",
                    error = ex.Message
                });
            }
        }

        /// <summary>
        /// Chapter Admin: delete one of the signed-in admin's own time sheet entries.
        /// </summary>
        [HttpPost("DeleteMyTimeSheet")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMyTimeSheet([FromBody] DeleteTimeSheetTrackingRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                    });
                }

                var username = GetAuthenticatedUsername();
                if (string.IsNullOrEmpty(username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                var editRequest = new UpdateTimeSheetTrackingRequest
                {
                    Username = username,
                    LogID = request.LogID
                };
                var ownedEntry = await _timeSheetTrackingService.GetMyTimeSheetTrackingForEditAsync(editRequest);
                if (!ownedEntry.IsSuccess || ownedEntry.TimeSheetEntry == null)
                {
                    return BadRequest(new { message = "TimeSheet entry not found." });
                }

                var response = await _timeSheetTrackingService.DeleteTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "An error occurred while deleting admin time sheet entry",
                    error = ex.Message
                });
            }
        }
    }
}
