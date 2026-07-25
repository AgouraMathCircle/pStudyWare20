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
    [Authorize] // Require authentication for all timesheet tracking endpoints
    public class TimeSheetTrackingController : ControllerBase
    {
        private readonly ITimeSheetTrackingService _timeSheetTrackingService;
        private readonly ILogger<TimeSheetTrackingController> _logger;

        public TimeSheetTrackingController(ITimeSheetTrackingService timeSheetTrackingService, ILogger<TimeSheetTrackingController> logger)
        {
            _timeSheetTrackingService = timeSheetTrackingService;
            _logger = logger;
        }

        private string ResolvePortalUsername(string? username = null)
        {
            return username
                ?? User.FindFirst("Username")?.Value
                ?? User.FindFirst(ClaimTypes.Name)?.Value
                ?? User.FindFirst(ClaimTypes.Email)?.Value
                ?? "";
        }

        /// <summary>
        /// Get timesheet tracking list (matches BindGridView method)
        /// </summary>
        /// <param name="request">Timesheet tracking list request</param>
        /// <returns>Timesheet tracking list response</returns>
        [HttpPost("GetTimeSheetTrackingList")]
        public async Task<IActionResult> GetTimeSheetTrackingList([FromBody] TimeSheetTrackingListRequest request)
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
                    request.Username = ResolvePortalUsername();
                }

                var response = await _timeSheetTrackingService.GetTimeSheetTrackingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetTimeSheetTrackingList error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while getting timesheet tracking list", error = ex.Message });
            }
        }

        /// <summary>
        /// Update timesheet tracking entry (matches UpdateTimeTracking method)
        /// </summary>
        /// <param name="request">Update timesheet tracking request</param>
        /// <returns>Update timesheet tracking response</returns>
        [HttpPost("UpdateTimeSheetTracking")]
        public async Task<IActionResult> UpdateTimeSheetTracking([FromBody] UpdateTimeSheetTrackingRequest request)
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
                    request.Username = ResolvePortalUsername();
                }

                var response = await _timeSheetTrackingService.UpdateTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateTimeSheetTracking error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while updating timesheet tracking", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete timesheet tracking entry (matches DeleteTimeTracking method)
        /// </summary>
        /// <param name="request">Delete timesheet tracking request</param>
        /// <returns>Delete timesheet tracking response</returns>
        [HttpPost("DeleteTimeSheetTracking")]
        public async Task<IActionResult> DeleteTimeSheetTracking([FromBody] DeleteTimeSheetTrackingRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _timeSheetTrackingService.DeleteTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteTimeSheetTracking error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while deleting timesheet tracking", error = ex.Message });
            }
        }

        /// <summary>
        /// Add or update timesheet tracking entry (matches btnSubmit_Click method)
        /// </summary>
        /// <param name="request">Upsert timesheet tracking request</param>
        /// <returns>Upsert timesheet tracking response</returns>
        [HttpPost("UpsertTimeSheetTracking")]
        public async Task<IActionResult> UpsertTimeSheetTracking([FromBody] UpsertTimeSheetTrackingRequest request)
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
                    request.Username = ResolvePortalUsername();
                }

                var response = await _timeSheetTrackingService.UpsertTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpsertTimeSheetTracking error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while saving timesheet tracking", error = ex.Message });
            }
        }

        /// <summary>
        /// Handle timesheet tracking action (matches Page_Load action handling)
        /// </summary>
        /// <param name="request">Timesheet tracking action request</param>
        /// <returns>Timesheet tracking action response</returns>
        [HttpPost("HandleTimeSheetTrackingAction")]
        public async Task<IActionResult> HandleTimeSheetTrackingAction([FromBody] TimeSheetTrackingActionRequest request)
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
                    request.Username = ResolvePortalUsername();
                }

                var response = await _timeSheetTrackingService.HandleTimeSheetTrackingActionAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HandleTimeSheetTrackingAction error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while handling timesheet tracking action", error = ex.Message });
            }
        }

        /// <summary>
        /// Get timesheet tracking dashboard data (combines multiple data sources for efficiency)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Timesheet tracking dashboard response</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                // Get username from JWT token if not provided
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new TimeSheetTrackingDashboardRequest
                {
                    Username = userUsername
                };

                var response = await _timeSheetTrackingService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDashboardData error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while getting timesheet tracking dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has timesheet tracking privileges
        /// </summary>
        /// <returns>Timesheet tracking privilege status</returns>
        [HttpGet("CheckTimeSheetTrackingPrivileges")]
        public async Task<IActionResult> CheckTimeSheetTrackingPrivileges()
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";

                var response = await _timeSheetTrackingService.CheckTimeSheetTrackingPrivilegesAsync(username);
                response.Role = userRole;
                response.MemberType = memberType;

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CheckTimeSheetTrackingPrivileges error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while checking timesheet tracking privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all timesheet tracking entries (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Timesheet tracking list response</returns>
        [HttpGet("GetAllTimeSheetTrackingEntries")]
        public async Task<IActionResult> GetAllTimeSheetTrackingEntries(
            [FromQuery] string? username = null,
            [FromQuery] bool selfOnly = false)
        {
            try
            {
                var userUsername = ResolvePortalUsername(username);

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new TimeSheetTrackingListRequest
                {
                    Username = userUsername
                };

                var response = selfOnly
                    ? await _timeSheetTrackingService.GetMyTimeSheetTrackingListAsync(request)
                    : await _timeSheetTrackingService.GetTimeSheetTrackingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAllTimeSheetTrackingEntries error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while getting all timesheet tracking entries", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete timesheet tracking entry by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="logId">Log ID</param>
        /// <returns>Delete timesheet tracking response</returns>
        [HttpDelete("DeleteTimeSheetTracking/{logId}")]
        public async Task<IActionResult> DeleteTimeSheetTracking(int logId)
        {
            try
            {
                var request = new DeleteTimeSheetTrackingRequest
                {
                    LogID = logId
                };

                var response = await _timeSheetTrackingService.DeleteTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteTimeSheetTracking by id error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while deleting timesheet tracking", error = ex.Message });
            }
        }

        /// <summary>
        /// Get timesheet tracking entry for editing by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="logId">Log ID</param>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Update timesheet tracking response</returns>
        [HttpGet("GetTimeSheetTrackingForEdit/{logId}")]
        public async Task<IActionResult> GetTimeSheetTrackingForEdit(
            int logId,
            [FromQuery] string? username = null,
            [FromQuery] bool selfOnly = false)
        {
            try
            {
                var userUsername = ResolvePortalUsername(username);

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new UpdateTimeSheetTrackingRequest
                {
                    Username = userUsername,
                    LogID = logId
                };

                var response = selfOnly
                    ? await _timeSheetTrackingService.GetMyTimeSheetTrackingForEditAsync(request)
                    : await _timeSheetTrackingService.UpdateTimeSheetTrackingAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetTimeSheetTrackingForEdit error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while getting timesheet tracking for edit", error = ex.Message });
            }
        }
    }
}
