using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// Controller for StudentWaitingList operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentWaitingListController : ControllerBase
    {
        private readonly IStudentWaitingListService _service;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="service">IStudentWaitingListService</param>
        public StudentWaitingListController(IStudentWaitingListService service)
        {
            _service = service;
        }

        /// <summary>
        /// Get student waiting list
        /// </summary>
        /// <param name="request">GetStudentWaitingListRequest</param>
        /// <returns>StudentWaitingListResponse</returns>
        [HttpPost("GetStudentWaitingList")]
        public async Task<ActionResult<StudentWaitingListResponse>> GetStudentWaitingList([FromBody] GetStudentWaitingListRequest request)
        {
            if (request == null)
            {
                return BadRequest(new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Request body is required."
                });
            }
            if (string.IsNullOrWhiteSpace(request.Username))
            {
                return BadRequest(new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = "Username is required."
                });
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.GetStudentWaitingListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new StudentWaitingListResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Update student waiting list status
        /// </summary>
        /// <param name="request">UpdateStudentWaitingListStatusRequest</param>
        /// <returns>OperationResponse</returns>
        [HttpPost("UpdateStudentWaitingListStatus")]
        public async Task<ActionResult<OperationResponse>> UpdateStudentWaitingListStatus([FromBody] UpdateStudentWaitingListStatusRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.UpdateStudentWaitingListStatusAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Delete student
        /// </summary>
        /// <param name="request">DeleteStudentRequest</param>
        /// <returns>OperationResponse</returns>
        [HttpPost("DeleteStudent")]
        public async Task<ActionResult<OperationResponse>> DeleteStudent([FromBody] DeleteStudentRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.DeleteStudentAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new OperationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Get chapter locations from AMC_ChapterMaster (Name, Location, City).
        /// </summary>
        /// <param name="request">GetChapterLocationRequest</param>
        /// <returns>ChapterLocationResponse</returns>
        [HttpPost("GetChapterLocation")]
        public async Task<ActionResult<ChapterLocationResponse>> GetChapterLocation([FromBody] GetChapterLocationRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.GetChapterLocationAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ChapterLocationResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Active session options from AMC_tblLookupSemester (Semester, LastSemester, NextSemester).
        /// </summary>
        [HttpGet("GetActiveSessionOptions")]
        public async Task<ActionResult<StudentWaitingListSessionOptionsResponse>> GetActiveSessionOptions()
        {
            try
            {
                var response = await _service.GetActiveSessionOptionsAsync();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new StudentWaitingListSessionOptionsResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Get password
        /// </summary>
        /// <param name="request">GetPasswordRequest</param>
        /// <returns>PasswordResponse</returns>
        [HttpPost("GetPassword")]
        public async Task<ActionResult<PasswordResponse>> GetPassword([FromBody] GetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var response = await _service.GetPasswordAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new PasswordResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }

        /// <summary>
        /// Export to excel
        /// </summary>
        /// <param name="request">ExportExcelRequest</param>
        /// <returns>ExportExcelResponse</returns>
        [HttpPost("ExportToExcel")]
        public async Task<IActionResult> ExportToExcel([FromBody] ExportExcelRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            try
            {
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _service.ExportToExcelAsync(request);
                if (!response.IsSuccess)
                    return BadRequest(new { message = response.ErrorMessage });

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting to Excel", error = ex.Message });
            }
        }

        /// <summary>
        /// Export waiting list to CSV (legacy StudentWaitingList export dataset).
        /// </summary>
        /// <param name="request">ExportExcelRequest</param>
        /// <returns>CSV file download</returns>
        [HttpPost("ExportToCsv")]
        public async Task<IActionResult> ExportToCsv([FromBody] ExportExcelRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
            }

            try
            {
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _service.ExportToCsvAsync(request);
                if (!response.IsSuccess)
                    return BadRequest(new { message = response.ErrorMessage });

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting to CSV", error = ex.Message });
            }
        }
    }
}
