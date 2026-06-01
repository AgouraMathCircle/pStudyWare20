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
    [Authorize] // Require authorization for volunteer availability endpoints
    public class VolunteerAvailabilityController : ControllerBase
    {
        private readonly IVolunteerAvailabilityService _volunteerAvailabilityService;

        public VolunteerAvailabilityController(IVolunteerAvailabilityService volunteerAvailabilityService)
        {
            _volunteerAvailabilityService = volunteerAvailabilityService;
        }

        /// <summary>
        /// Updates the volunteer availability
        /// </summary>
        /// <param name="request">Volunteer availability request data</param>
        /// <returns>Result of the update operation</returns>
        [HttpPost("UpdateAvailability")]
        public async Task<IActionResult> UpdateAvailability([FromBody] VolunteerAvailabilityRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new 
                    { 
                        message = "Invalid request data", 
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });
                }

                // If UserID is not provided in request body, retrieve it from the authenticated user claims
                if (string.IsNullOrEmpty(request.UserID))
                {
                    request.UserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                     ?? User.FindFirst(ClaimTypes.Name)?.Value 
                                     ?? User.FindFirst(ClaimTypes.Email)?.Value 
                                     ?? "";
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    return BadRequest(new { message = "UserID is required." });
                }

                var response = await _volunteerAvailabilityService.UpdateVolunteerAvailabilityAsync(request);
                
                if (response.IsSuccess)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "An error occurred while updating volunteer availability", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>
        /// Gets the volunteer availability
        /// </summary>
        /// <param name="request">Volunteer availability select request data</param>
        /// <returns>Result of the select operation</returns>
        [HttpPost("GetAvailability")]
        public async Task<IActionResult> GetAvailability([FromBody] VolunteerAvailabilitySelectRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new 
                    { 
                        message = "Invalid request data", 
                        errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) 
                    });
                }

                // If UserID is not provided in request body, retrieve it from the authenticated user claims
                if (string.IsNullOrEmpty(request.UserID))
                {
                    request.UserID = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                                     ?? User.FindFirst(ClaimTypes.Name)?.Value 
                                     ?? User.FindFirst(ClaimTypes.Email)?.Value 
                                     ?? "";
                }

                if (string.IsNullOrEmpty(request.UserID))
                {
                    return BadRequest(new { message = "UserID is required." });
                }

                var response = await _volunteerAvailabilityService.GetVolunteerAvailabilityAsync(request);
                
                if (response.IsSuccess)
                {
                    return Ok(response);
                }
                else
                {
                    return BadRequest(response);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "An error occurred while getting volunteer availability", 
                    error = ex.Message 
                });
            }
        }
    }
}
