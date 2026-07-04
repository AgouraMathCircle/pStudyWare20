using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class NewsletterController : ControllerBase
    {
        private readonly INewsletterService _newsletterService;

        public NewsletterController(INewsletterService newsletterService)
        {
            _newsletterService = newsletterService;
        }

        /// <summary>
        /// Subscribe an email to the newsletter (legacy footer subscribe form).
        /// </summary>
        [HttpPost]
        public ActionResult<NewsletterSubscribeResponse> Subscribe([FromBody] NewsletterSubscribeRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new NewsletterSubscribeResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = string.Join(
                            " ",
                            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)))
                    });
                }

                var response = _newsletterService.Subscribe(request);
                if (!response.IsSuccess)
                {
                    return StatusCode(500, response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new NewsletterSubscribeResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }
    }
}
