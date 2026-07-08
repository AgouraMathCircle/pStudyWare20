using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class VolunteersRequestController : ControllerBase
    {
        private readonly IVolunteersRequestService _service;
        private readonly ILogger<VolunteersRequestController> _logger;

        public VolunteersRequestController(IVolunteersRequestService service, ILogger<VolunteersRequestController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpPost("GetVolunteersRequest")]
        public async Task<ActionResult<GetVolunteersRequestResponse>> GetVolunteersRequest([FromBody] GetVolunteersRequestRequest request)
        {
            if (request == null)
                return BadRequest(new GetVolunteersRequestResponse { IsSuccess = false, ErrorMessage = "Request body is required." });
            if (string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new GetVolunteersRequestResponse { IsSuccess = false, ErrorMessage = "Username is required." });

            try
            {
                var response = await _service.GetVolunteersRequestAsync(request);
                if (!response.IsSuccess && !string.IsNullOrEmpty(response.ErrorMessage))
                    _logger.LogWarning("GetVolunteersRequest failed: {Message}", response.ErrorMessage);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetVolunteersRequest error: {Message}", ex.Message);
                return StatusCode(500, new GetVolunteersRequestResponse { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        [HttpPost("UpdateVolunteerStatus")]
        public async Task<ActionResult<OperationResponse>> UpdateVolunteerStatus([FromBody] UpdateVolunteerStatusRequest request)
        {
            if (request == null)
                return BadRequest(new OperationResponse { IsSuccess = false, ErrorMessage = "Request body is required." });
            try
            {
                var response = await _service.UpdateVolunteerStatusAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        [HttpPost("DeleteVolunteerRequest")]
        public async Task<ActionResult<OperationResponse>> DeleteVolunteerRequest([FromBody] DeleteVolunteerRequestRequest request)
        {
            if (request == null)
                return BadRequest(new OperationResponse { IsSuccess = false, ErrorMessage = "Request body is required." });
            try
            {
                var response = await _service.DeleteVolunteerRequestAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        /// <summary>
        /// Chapter dropdown for Update Volunteer Request Status.
        /// Source: AMC_ChapterMaster (Name, Location, City). Label format: Name - Location - City.
        /// </summary>
        [HttpGet("GetChapterLocations")]
        public async Task<ActionResult<GetVolunteerChapterLocationsResponse>> GetChapterLocations()
        {
            try
            {
                var response = await _service.GetChapterLocationsAsync();
                if (!response.IsSuccess && !string.IsNullOrEmpty(response.ErrorMessage))
                    _logger.LogWarning("GetChapterLocations failed: {Message}", response.ErrorMessage);
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetChapterLocations error: {Message}", ex.Message);
                return StatusCode(500, new GetVolunteerChapterLocationsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        [HttpPost("ExportToExcel")]
        public async Task<IActionResult> ExportToExcel([FromBody] ExportExcelRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });
            try
            {
                var response = await _service.ExportToExcelAsync(request);
                if (!response.IsSuccess)
                    return BadRequest(new { message = response.ErrorMessage });

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ExportToExcel error: {Message}", ex.Message);
                return StatusCode(500, new { message = "An error occurred while exporting to Excel", error = ex.Message });
            }
        }
    }
}
