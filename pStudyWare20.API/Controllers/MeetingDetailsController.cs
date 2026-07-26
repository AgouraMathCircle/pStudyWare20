using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;
using pStudyWare20.API.Helpers;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize] // Require authentication for all meeting details endpoints
    public class MeetingDetailsController : ControllerBase
    {
        private readonly IMeetingDetailsService _meetingDetailsService;

        public MeetingDetailsController(IMeetingDetailsService meetingDetailsService)
        {
            _meetingDetailsService = meetingDetailsService;
        }

        /// <summary>
        /// Get specific meeting schedule by ID (matches btnEdit_Click method)
        /// </summary>
        /// <param name="request">Get meeting schedule request</param>
        /// <returns>Get meeting schedule response</returns>
        [HttpPost("GetMeetingScheduleById")]
        public async Task<IActionResult> GetMeetingScheduleById([FromBody] GetMeetingScheduleRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _meetingDetailsService.GetMeetingScheduleByIdAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting meeting schedule", error = ex.Message });
            }
        }

        /// <summary>
        /// Insert or update meeting schedule (matches btnSubmit_Click method)
        /// </summary>
        /// <param name="request">Upsert meeting schedule request</param>
        /// <returns>Upsert meeting schedule response</returns>
        [HttpPost("UpsertMeetingSchedule")]
        public async Task<IActionResult> UpsertMeetingSchedule([FromBody] UpsertMeetingScheduleRequest request)
        {
            try
            {
                // Legacy MeetingDetails.aspx.cs — only SystemAdmin can submit (btnSubmit.Visible)
                var isSystemAdmin = User.FindFirst(ClaimTypes.Role)?.Value == "SystemAdmin"
                    || User.FindFirst("SystemAdmin")?.Value == "Y";
                if (!isSystemAdmin)
                {
                    return StatusCode(403, new UpsertMeetingScheduleResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Only system administrators can add or update meeting schedules."
                    });
                }

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _meetingDetailsService.UpsertMeetingScheduleAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while upserting meeting schedule", error = ex.Message });
            }
        }

        /// <summary>
        /// Get chapter locations (matches BindChapterLocation method)
        /// </summary>
        /// <param name="request">Chapter location request</param>
        /// <returns>Chapter location response</returns>
        [HttpPost("GetChapterLocations")]
        public async Task<IActionResult> GetChapterLocations([FromBody] GetChapterLocationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _meetingDetailsService.GetChapterLocationsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting chapter locations", error = ex.Message });
            }
        }

        /// <summary>
        /// Prepare new meeting form data (matches btnAdd_Click method)
        /// </summary>
        /// <param name="request">Prepare new meeting request</param>
        /// <returns>Prepare new meeting response</returns>
        [HttpPost("PrepareNewMeeting")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can add meetings
        public async Task<IActionResult> PrepareNewMeeting([FromBody] PrepareNewMeetingRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _meetingDetailsService.PrepareNewMeetingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while preparing new meeting form", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has meeting details privileges
        /// </summary>
        /// <returns>Meeting details privilege status</returns>
        [HttpGet("CheckMeetingDetailsPrivileges")]
        public IActionResult CheckMeetingDetailsPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isAdmin = userRole == "Admin" || memberType == "A";
                var isSystemAdmin = userRole == "SystemAdmin" || User.FindFirst("SystemAdmin")?.Value == "Y";

                return Ok(new MeetingDetailsPrivilegesResponse
                {
                    IsSuccess = true,
                    IsAdmin = isAdmin,
                    IsSystemAdmin = isSystemAdmin,
                    Role = userRole,
                    MemberType = memberType,
                    CanAddMeetings = isSystemAdmin,
                    CanEditMeetings = isAdmin || isSystemAdmin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking meeting details privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get meeting schedule by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="rowId">Row ID</param>
        /// <returns>Meeting schedule response</returns>
        [HttpGet("GetMeetingSchedule/{rowId}")]
        public async Task<IActionResult> GetMeetingSchedule(int rowId)
        {
            try
            {
                var request = new GetMeetingScheduleRequest
                {
                    RowId = rowId.ToString()
                };

                var response = await _meetingDetailsService.GetMeetingScheduleByIdAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting meeting schedule", error = ex.Message });
            }
        }

        /// <summary>
        /// Dashboard meeting schedules for the signed-in user via AMC_spMeetingSchedule_Select
        /// (matches legacy pStudyware_DashboardMessage.ascx.cs BingMeetingSchedule()).
        /// </summary>
        /// <param name="username">Portal username (MemberMaster.Username). JWT fallback when omitted.</param>
        /// <returns>Meeting schedule list response</returns>
        [HttpGet("GetAllMeetingSchedules")]
        public async Task<IActionResult> GetAllMeetingSchedules([FromQuery] string? username = null)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username))
                {
                    username = PortalClaimsHelper.GetMeetingScheduleUsername(User);
                }

                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new { message = "Username is required." });
                }

                var request = new MeetingScheduleListRequest
                {
                    RowId = "0",
                    UserName = username.Trim()
                };

                var response = await _meetingDetailsService.GetMeetingScheduleListAsync(request);

                // Remove admin credentials for non-admin users
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isAdmin = userRole == "Admin" || userRole == "SystemAdmin" || memberType == "A";

                if (!isAdmin && response.IsSuccess && response.MeetingSchedules != null)
                {
                    // Clear admin credentials for students/non-admins
                    if (response.MeetingSchedules is List<MeetingSchedule> scheduleList)
                    {
                        foreach (var schedule in scheduleList)
                        {
                            schedule.AdminLogin = "";
                            schedule.AdminPassCode = "";
                        }
                    }
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting all meeting schedules", error = ex.Message });
            }
        }

        /// <summary>
        /// SystemAdmin Meeting Details grid — all schedules (AMC_tblMeetingSchedule_Select).
        /// </summary>
        [HttpGet("GetMeetingScheduleGrid")]
        [Authorize(Roles = "Admin,SystemAdmin")]
        public async Task<IActionResult> GetMeetingScheduleGrid()
        {
            try
            {
                var request = new MeetingScheduleListRequest { RowId = "0" };
                var response = await _meetingDetailsService.GetMeetingScheduleGridListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting meeting schedule grid", error = ex.Message });
            }
        }

        /// <summary>
        /// Get chapter locations (GET endpoint for easier access)
        /// </summary>
        /// <param name="activeOnly">Active only flag (default: Y)</param>
        /// <returns>Chapter location response</returns>
        [HttpGet("GetChapterLocations")]
        public async Task<IActionResult> GetChapterLocations([FromQuery] string activeOnly = "Y")
        {
            try
            {
                var request = new GetChapterLocationRequest
                {
                    Mode = activeOnly
                };

                var response = await _meetingDetailsService.GetChapterLocationsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting chapter locations", error = ex.Message });
            }
        }
    }
}
