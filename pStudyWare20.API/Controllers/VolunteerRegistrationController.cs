using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class VolunteerRegistrationController : ControllerBase
    {
        private readonly IVolunteerService _volunteerService;

        public VolunteerRegistrationController(IVolunteerService volunteerService)
        {
            _volunteerService = volunteerService;
        }

        /// <summary>
        /// Register a new volunteer (matches reference controller exactly)
        /// </summary>
        /// <param name="volunteerDetails">Volunteer registration details</param>
        /// <returns>Registration result</returns>
        [HttpPost]
        [Route("VolunteerRegistration")]
        public object VolunteerRegistration([FromBody] RegistrationVolunteerModel volunteerDetails)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _volunteerService.VolunteerRegistration(volunteerDetails);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during volunteer registration", error = ex.Message });
            }
        }
    }
}
