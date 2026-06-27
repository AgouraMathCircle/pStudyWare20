using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Security.Claims;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize]
    public class UploadAnswerKeyController : ControllerBase
    {
        private readonly IUploadAnswerKeyService _uploadAnswerKeyService;
        private readonly ILogger<UploadAnswerKeyController> _logger;

        public UploadAnswerKeyController(
            IUploadAnswerKeyService uploadAnswerKeyService,
            ILogger<UploadAnswerKeyController> logger)
        {
            _uploadAnswerKeyService = uploadAnswerKeyService;
            _logger = logger;
        }

        private string? GetChapterId() =>
            User.FindFirst("chapterID")?.Value
            ?? User.FindFirst("ChapterID")?.Value
            ?? Request.Query["chapterID"].FirstOrDefault()
            ?? Request.Query["chapterId"].FirstOrDefault();

        /// <summary>
        /// Get exam master list (AMC_spExamMaster_Select).
        /// </summary>
        [HttpPost("GetExamMasterList")]
        public async Task<IActionResult> GetExamMasterList([FromBody] GetExamMasterListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)),
                    });
                }

                var response = await _uploadAnswerKeyService.GetExamMasterListAsync(request, GetChapterId());
                if (!response.IsSuccess)
                    return StatusCode(500, response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetExamMasterList: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while loading answer keys.", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete exam question (AMC_spExamMaster_Delete).
        /// </summary>
        [HttpPost("DeleteExamQuestion")]
        public async Task<IActionResult> DeleteExamQuestion([FromBody] DeleteExamQuestionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)),
                    });
                }

                var response = await _uploadAnswerKeyService.DeleteExamQuestionAsync(request);
                if (!response.IsSuccess)
                    return BadRequest(response);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteExamQuestion: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while deleting the question.", error = ex.Message });
            }
        }

        /// <summary>
        /// Upload answer key from Excel (AMC_spExamMaster_Insert per row). ChapterID must be "1".
        /// </summary>
        [HttpPost("UploadAnswerKey")]
        public async Task<IActionResult> UploadAnswerKey([FromBody] UploadAnswerKeyRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        message = "Invalid request data",
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)),
                    });
                }

                request.ChapterID = request.ChapterID ?? GetChapterId() ?? "";
                if (string.IsNullOrWhiteSpace(request.CreatedBy))
                {
                    request.CreatedBy = User.FindFirst(ClaimTypes.GivenName)?.Value
                        ?? User.FindFirst("firstName")?.Value
                        ?? request.Username;
                }

                var response = await _uploadAnswerKeyService.UploadAnswerKeyAsync(request);
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
                _logger.LogError(ex, "UploadAnswerKey: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while uploading the answer key.", error = ex.Message });
            }
        }

        /// <summary>
        /// Download Excel upload template (legacy: /pStudyWare/AMC_Template/UpLoadAnswerKey.xlsx).
        /// </summary>
        [HttpGet("DownloadExcelTemplate")]
        public IActionResult DownloadExcelTemplate()
        {
            try
            {
                var bytes = _uploadAnswerKeyService.GetExcelTemplateBytes();
                return File(
                    bytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "UpLoadAnswerKey.xlsx");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DownloadExcelTemplate: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while downloading the template.", error = ex.Message });
            }
        }
    }
}
