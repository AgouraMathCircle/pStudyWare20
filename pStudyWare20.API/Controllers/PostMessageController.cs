using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class PostMessageController : ControllerBase
    {
        private readonly IPostMessageService _postMessageService;

        public PostMessageController(IPostMessageService postMessageService)
        {
            _postMessageService = postMessageService;
        }

        /// <summary>
        /// Get alert list (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Get alert list request</param>
        /// <returns>Alert list result</returns>
        [HttpPost]
        [Route("GetAlertList")]
        public object GetAlertList([FromBody] GetAlertListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _postMessageService.GetAlertList(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting alert list", error = ex.Message });
            }
        }

        /// <summary>
        /// Insert or update post message (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Post message request</param>
        /// <returns>Post message operation result</returns>
        [HttpPost]
        [Route("InsertOrUpdatePostMessage")]
        public object InsertOrUpdatePostMessage([FromBody] PostMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _postMessageService.InsertOrUpdatePostMessage(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while saving post message", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete post message (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Delete post message request</param>
        /// <returns>Post message operation result</returns>
        [HttpPost]
        [Route("DeletePostMessage")]
        public object DeletePostMessage([FromBody] DeletePostMessageRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _postMessageService.DeletePostMessage(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting post message", error = ex.Message });
            }
        }
    }
}
