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
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can add/edit meetings
        public async Task<IActionResult> UpsertMeetingSchedule([FromBody] UpsertMeetingScheduleRequest request)
        {
            try
            {
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
        /// Get all meeting schedules (GET endpoint for easier access)
        /// </summary>
        /// <returns>Meeting schedule list response</returns>
        [HttpGet("GetAllMeetingSchedules")]
        public async Task<IActionResult> GetAllMeetingSchedules()
        {
            try
            {
                var request = new MeetingScheduleListRequest
                {
                    RowId = "0"
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
