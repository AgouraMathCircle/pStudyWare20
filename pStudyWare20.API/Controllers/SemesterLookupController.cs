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
    [Authorize]
    public class SemesterLookupController : ControllerBase
    {
        private readonly ISemesterLookupService _semesterLookupService;
        private readonly ILogger<SemesterLookupController> _logger;

        public SemesterLookupController(ISemesterLookupService semesterLookupService, ILogger<SemesterLookupController> logger)
        {
            _semesterLookupService = semesterLookupService;
            _logger = logger;
        }

        private string? GetChapterId() =>
            User.FindFirst("chapterID")?.Value
            ?? User.FindFirst("ChapterID")?.Value
            ?? Request.Query["chapterID"].FirstOrDefault()
            ?? Request.Query["chapterId"].FirstOrDefault();

        /// <summary>
        /// Get current semester lookup (AMC_spSelectSemesterLookup). Any authenticated user (legacy: session required).
        /// </summary>
        [HttpGet("GetSemesterLookup")]
        public async Task<IActionResult> GetSemesterLookup([FromQuery] string? chapterID = null)
        {
            try
            {
                var chapter = chapterID ?? GetChapterId();
                var response = await _semesterLookupService.GetSemesterLookupAsync(chapter);
                if (!response.IsSuccess)
                    return StatusCode(500, new { message = response.ErrorMessage });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetSemesterLookup: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while loading semester lookup.", error = ex.Message });
            }
        }

        /// <summary>
        /// Update semester lookup (AMC_spUpdateSemesterLookup). ChapterID must be "1" (legacy system admin chapter).
        /// </summary>
        [HttpPost("UpdateSemesterLookup")]
        public async Task<IActionResult> UpdateSemesterLookup([FromBody] UpdateSemesterLookupRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)).ToList();
                    _logger.LogWarning("UpdateSemesterLookup validation failed: {Errors}", string.Join("; ", errors));
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = errors
                    });
                }

                request.ChapterID = request.ChapterID ?? GetChapterId() ?? "";

                var response = await _semesterLookupService.UpdateSemesterLookupAsync(request);
                if (!response.IsSuccess)
                {
                    if (response.ErrorMessage?.Contains("permission", StringComparison.OrdinalIgnoreCase) == true)
                        return StatusCode(403, response);
                    return BadRequest(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateSemesterLookup: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while updating semester lookup.", error = ex.Message });
            }
        }
    }
}
