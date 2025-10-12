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
    [Authorize] // Require authentication for all special events registration endpoints
    public class SpecialEventsRegistrationController : ControllerBase
    {
        private readonly ISpecialEventsRegistrationService _specialEventsRegistrationService;

        public SpecialEventsRegistrationController(ISpecialEventsRegistrationService specialEventsRegistrationService)
        {
            _specialEventsRegistrationService = specialEventsRegistrationService;
        }

        /// <summary>
        /// Get special events registration list (matches BindGridView method)
        /// </summary>
        /// <param name="request">Special events registration list request</param>
        /// <returns>Special events registration list response</returns>
        [HttpPost("GetSpecialEventsRegistrationList")]
        public async Task<IActionResult> GetSpecialEventsRegistrationList([FromBody] SpecialEventsRegistrationListRequest request)
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

                var response = await _specialEventsRegistrationService.GetSpecialEventsRegistrationListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting special events registration list", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete special events registration application (matches DeleteApplicaiton method)
        /// </summary>
        /// <param name="request">Delete special events registration request</param>
        /// <returns>Delete special events registration response</returns>
        [HttpPost("DeleteSpecialEventsRegistration")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can delete applications
        public async Task<IActionResult> DeleteSpecialEventsRegistration([FromBody] DeleteSpecialEventsRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _specialEventsRegistrationService.DeleteSpecialEventsRegistrationAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting special events registration", error = ex.Message });
            }
        }

        /// <summary>
        /// Export special events registration data to Excel (matches btnExportExcel_Click and GridviewToExcel methods)
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Excel file response</returns>
        [HttpPost("ExportSpecialEventsRegistrationToExcel")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can export data
        public async Task<IActionResult> ExportSpecialEventsRegistrationToExcel([FromBody] ExportSpecialEventsRegistrationExcelRequest request)
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

                var response = await _specialEventsRegistrationService.ExportSpecialEventsRegistrationToExcelAsync(request);

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting special events registration to Excel", error = ex.Message });
            }
        }

        /// <summary>
        /// Handle special events registration action (Delete) (matches Page_Load action handling)
        /// </summary>
        /// <param name="request">Special events registration action request</param>
        /// <returns>Special events registration action response</returns>
        [HttpPost("HandleSpecialEventsRegistrationAction")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can perform special events registration actions
        public async Task<IActionResult> HandleSpecialEventsRegistrationAction([FromBody] SpecialEventsRegistrationActionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _specialEventsRegistrationService.HandleSpecialEventsRegistrationActionAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while handling special events registration action", error = ex.Message });
            }
        }

        /// <summary>
        /// Get special events registration dashboard data (combines multiple data sources for efficiency)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Special events registration dashboard response</returns>
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

                var request = new SpecialEventsRegistrationDashboardRequest
                {
                    Username = userUsername
                };

                var response = await _specialEventsRegistrationService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting special events registration dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has special events registration privileges
        /// </summary>
        /// <returns>Special events registration privilege status</returns>
        [HttpGet("CheckSpecialEventsRegistrationPrivileges")]
        public IActionResult CheckSpecialEventsRegistrationPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isAdmin = userRole == "Admin" || memberType == "A";

                return Ok(new SpecialEventsRegistrationPrivilegesResponse
                {
                    IsSuccess = true,
                    Role = userRole,
                    MemberType = memberType,
                    CanDeleteApplications = isAdmin,
                    CanExportData = isAdmin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking special events registration privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all special events registrations (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Special events registration list response</returns>
        [HttpGet("GetAllSpecialEventsRegistrations")]
        public async Task<IActionResult> GetAllSpecialEventsRegistrations([FromQuery] string? username = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new SpecialEventsRegistrationListRequest
                {
                    Username = userUsername
                };

                var response = await _specialEventsRegistrationService.GetSpecialEventsRegistrationListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting all special events registrations", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete special events registration by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="requestId">Request ID</param>
        /// <returns>Delete special events registration response</returns>
        [HttpDelete("DeleteSpecialEventsRegistration/{requestId}")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can delete applications
        public async Task<IActionResult> DeleteSpecialEventsRegistration(string requestId)
        {
            try
            {
                var request = new DeleteSpecialEventsRegistrationRequest
                {
                    RequestId = requestId
                };

                var response = await _specialEventsRegistrationService.DeleteSpecialEventsRegistrationAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting special events registration", error = ex.Message });
            }
        }
    }
}
