using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.API.Helpers;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [Authorize] // Require authentication for all endpoints
    public class SentEmailController : ControllerBase
    {
        private readonly ISentEmailService _sentEmailService;

        public SentEmailController(ISentEmailService sentEmailService)
        {
            _sentEmailService = sentEmailService;
        }

        /// <summary>
        /// Get sent messages for the current user
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>List of sent messages</returns>
        [HttpGet("GetSentMessages")]
        public async Task<IActionResult> GetSentMessages([FromQuery] string? username = null)
        {
            try
            {
                var userUsername = string.IsNullOrWhiteSpace(username)
                    ? PortalClaimsHelper.GetPortalUsername(User)
                    : username;

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var response = await _sentEmailService.GetSentMessagesAsync(new GetSentMessagesRequest
                {
                    Username = userUsername
                });

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting sent messages", error = ex.Message });
            }
        }

        /// <summary>
        /// Get specific message details by email ID
        /// </summary>
        /// <param name="emailId">Email ID</param>
        /// <returns>Message details</returns>
        [HttpGet("GetMessageDetails/{emailId}")]
        public async Task<IActionResult> GetMessageDetails(int emailId)
        {
            try
            {
                var response = await _sentEmailService.GetMessageDetailsAsync(new GetMessageDetailsRequest
                {
                    EmailID = emailId
                });

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting message details", error = ex.Message });
            }
        }
    }
}
