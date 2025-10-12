using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class SentEmailController : ControllerBase
    {
        private readonly ISentEmailService _sentEmailService;

        public SentEmailController(ISentEmailService sentEmailService)
        {
            _sentEmailService = sentEmailService;
        }

        /// <summary>
        /// Get sent messages (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Get sent messages request</param>
        /// <returns>Sent messages list result</returns>
        [HttpPost]
        [Route("GetSentMessages")]
        public object GetSentMessages([FromBody] GetSentMessagesRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _sentEmailService.GetSentMessages(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting sent messages", error = ex.Message });
            }
        }

        /// <summary>
        /// Get message (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Get message request</param>
        /// <returns>Message detail result</returns>
        [HttpPost]
        [Route("GetMessage")]
        public object GetMessage([FromBody] GetMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _sentEmailService.GetMessage(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting message", error = ex.Message });
            }
        }

        /// <summary>
        /// View email (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">View email request</param>
        /// <returns>View email result</returns>
        [HttpPost]
        [Route("ViewEmail")]
        public object ViewEmail([FromBody] ViewEmailRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _sentEmailService.ViewEmail(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while viewing email", error = ex.Message });
            }
        }
    }
}
