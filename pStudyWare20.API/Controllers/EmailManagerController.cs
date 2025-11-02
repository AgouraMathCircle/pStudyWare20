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
    [Authorize] // Require authentication for all email manager endpoints
    public class EmailManagerController : ControllerBase
    {
        private readonly IEmailManagerService _emailManagerService;

        public EmailManagerController(IEmailManagerService emailManagerService)
        {
            _emailManagerService = emailManagerService;
        }

        /// <summary>
        /// Get messages for a user (inbox)
        /// </summary>
        /// <param name="request">Get messages request</param>
        /// <returns>Get messages response</returns>
        [HttpPost("GetMessages")]
        public async Task<IActionResult> GetMessages([FromBody] GetMessagesRequest request)
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

                var response = await _emailManagerService.GetMessagesAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting messages", error = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific message by ID
        /// </summary>
        /// <param name="request">Get message request</param>
        /// <returns>Get message response</returns>
        [HttpPost("GetMessage")]
        public async Task<IActionResult> GetMessage([FromBody] GetMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _emailManagerService.GetMessageAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting message", error = ex.Message });
            }
        }

        /// <summary>
        /// Send a new message or reply to a message
        /// </summary>
        /// <param name="request">Send message request</param>
        /// <returns>Send message response</returns>
        [HttpPost("SendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.SendFrom))
                {
                    request.SendFrom = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _emailManagerService.SendMessageAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending message", error = ex.Message });
            }
        }

        /// <summary>
        /// Update message status (mark as viewed, delete, etc.)
        /// </summary>
        /// <param name="request">Update message status request</param>
        /// <returns>Update message status response</returns>
        [HttpPost("UpdateMessageStatus")]
        public async Task<IActionResult> UpdateMessageStatus([FromBody] UpdateMessageStatusRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.SendTo))
                {
                    request.SendTo = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _emailManagerService.UpdateMessageStatusAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating message status", error = ex.Message });
            }
        }

        /// <summary>
        /// Get instructor email groups
        /// </summary>
        /// <param name="request">Get instructor email groups request</param>
        /// <returns>Get instructor email groups response</returns>
        [HttpPost("GetInstructorEmailGroups")]
        public async Task<IActionResult> GetInstructorEmailGroups([FromBody] GetInstructorEmailGroupsRequest request)
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

                var response = await _emailManagerService.GetInstructorEmailGroupsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting instructor email groups", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student list for email
        /// </summary>
        /// <param name="request">Get student list for email request</param>
        /// <returns>Get student list for email response</returns>
        [HttpPost("GetStudentListForEmail")]
        public async Task<IActionResult> GetStudentListForEmail([FromBody] GetStudentListForEmailRequest request)
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

                var response = await _emailManagerService.GetStudentListForEmailAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list for email", error = ex.Message });
            }
        }

        /// <summary>
        /// Export messages to Excel
        /// </summary>
        /// <param name="request">Export messages request</param>
        /// <returns>Excel file</returns>
        [HttpPost("ExportMessagesToExcel")]
        public async Task<IActionResult> ExportMessagesToExcel([FromBody] ExportMessagesRequest request)
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

                var response = await _emailManagerService.ExportMessagesToExcelAsync(request);

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting messages to Excel", error = ex.Message });
            }
        }
    }
}

