using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    [AllowAnonymous]
    public class RegistrationLookupController : ControllerBase
    {
        private readonly IRegistrationLookupService _registrationLookupService;

        public RegistrationLookupController(IRegistrationLookupService registrationLookupService)
        {
            _registrationLookupService = registrationLookupService;
        }

        /// <summary>
        /// Semester options for Register For dropdown (AMC_tblLookupSemester Semester + LastSemester).
        /// </summary>
        [HttpGet("semesters")]
        public async Task<IActionResult> GetSemesters()
        {
            var response = await _registrationLookupService.GetRegistrationSemesterOptionsAsync();
            if (!response.IsSuccess)
            {
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Active course/location options for Course/Location dropdown (AMC_ChapterMaster).
        /// </summary>
        [HttpGet("locations")]
        public async Task<IActionResult> GetLocations()
        {
            var response = await _registrationLookupService.GetRegistrationLocationOptionsAsync();
            if (!response.IsSuccess)
            {
                return StatusCode(500, response);
            }

            return Ok(response);
        }
    }
}
