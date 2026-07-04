using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        /// <summary>
        /// Submit a contact enquiry (matches ContactUs.aspx btnSubmit_Click).
        /// </summary>
        [HttpPost]
        public ActionResult<ContactEnquiryResponse> SubmitEnquiry([FromBody] ContactEnquiryRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new ContactEnquiryResponse
                    {
                        IsSuccess = false,
                        ErrorMessage = string.Join(
                            " ",
                            ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)))
                    });
                }

                var response = _contactService.SubmitEnquiry(request);
                if (!response.IsSuccess)
                {
                    return StatusCode(500, response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ContactEnquiryResponse
                {
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                });
            }
        }
    }
}
