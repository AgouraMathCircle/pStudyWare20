using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// Admin donor details — legacy DonorDetails.aspx.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize]
    public class DonorDetailsController : ControllerBase
    {
        private readonly IDonorDetailsService _donorDetailsService;
        private readonly ILogger<DonorDetailsController> _logger;

        public DonorDetailsController(
            IDonorDetailsService donorDetailsService,
            ILogger<DonorDetailsController> logger)
        {
            _donorDetailsService = donorDetailsService;
            _logger = logger;
        }

        /// <summary>
        /// Check privileges (legacy: MemberType A; SystemAdmin for add/submit).
        /// </summary>
        [HttpGet("CheckPrivileges")]
        public IActionResult CheckPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isAdmin = userRole is "Admin" or "SystemAdmin" || memberType == "A";
                var isSystemAdmin = userRole == "SystemAdmin"
                    || User.FindFirst("SystemAdmin")?.Value == "Y";

                return Ok(new DonorDetailsPrivilegesResponse
                {
                    IsSuccess = true,
                    IsAdmin = isAdmin,
                    IsSystemAdmin = isSystemAdmin,
                    CanEditDonors = isAdmin,
                    CanAddDonors = isSystemAdmin,
                    CanSubmitDonors = isSystemAdmin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CheckPrivileges: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while checking donor details privileges.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all donors (AMC_spGetAllDonors @RowID = 0).
        /// </summary>
        [HttpGet("GetAllDonors")]
        [Authorize(Roles = "Admin,SystemAdmin")]
        public async Task<IActionResult> GetAllDonors()
        {
            try
            {
                var response = await _donorDetailsService.GetAllDonorsAsync("0");
                if (!response.IsSuccess)
                    return StatusCode(500, response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetAllDonors: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while loading donors.", error = ex.Message });
            }
        }

        /// <summary>
        /// Get donor by ID (AMC_spGetAllDonors @RowID).
        /// </summary>
        [HttpGet("GetDonor/{rowId}")]
        [Authorize(Roles = "Admin,SystemAdmin")]
        public async Task<IActionResult> GetDonor(string rowId)
        {
            try
            {
                var response = await _donorDetailsService.GetDonorByIdAsync(rowId);
                if (!response.IsSuccess)
                {
                    if (response.ErrorMessage?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true)
                        return NotFound(response);

                    return BadRequest(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetDonor: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while loading donor.", error = ex.Message });
            }
        }

        /// <summary>
        /// Insert or update donor (AMC_spDonors_Insert). SystemAdmin only — legacy btnSubmit.
        /// </summary>
        [HttpPost("UpsertDonor")]
        [Authorize(Roles = "Admin,SystemAdmin")]
        public async Task<IActionResult> UpsertDonor([FromBody] UpsertAdminDonorRequest request)
        {
            try
            {
                var isSystemAdmin = User.FindFirst(ClaimTypes.Role)?.Value == "SystemAdmin"
                    || User.FindFirst("SystemAdmin")?.Value == "Y";
                if (!isSystemAdmin)
                {
                    return StatusCode(403, new UpsertAdminDonorResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = "Only system administrators can add or update donor details."
                    });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                        .ToList();
                    return BadRequest(new { message = "Invalid request data", errors });
                }

                var response = await _donorDetailsService.UpsertDonorAsync(request);
                if (!response.IsSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpsertDonor: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while saving donor.", error = ex.Message });
            }
        }
    }
}
