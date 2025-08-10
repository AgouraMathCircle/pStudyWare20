using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Entity;
using pStudyWare20.Services.Interfaces;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class StudentRegistrationController : ControllerBase
    {
        private readonly IStudentRegistrationService _service;

        public StudentRegistrationController(IStudentRegistrationService service)
        {
            _service = service;
        }

        /// <summary>
        /// Register a new student
        /// </summary>
        /// <param name="request">Student registration request</param>
        /// <returns>Registration response</returns>
        [HttpPost]
        public async Task<ActionResult<StudentRegistrationResponse>> RegisterStudent([FromBody] StudentRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var response = await _service.RegisterStudentAsync(request);
                
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
                return StatusCode(500, new StudentRegistrationResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Get registration by ID
        /// </summary>
        /// <param name="id">Registration ID</param>
        /// <returns>Registration details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentRegistration>> GetRegistration(int id)
        {
            try
            {
                var registration = await _service.GetRegistrationByIdAsync(id);
                
                if (registration == null)
                {
                    return NotFound();
                }

                return Ok(registration);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get all registrations
        /// </summary>
        /// <returns>List of all registrations</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentRegistration>>> GetAllRegistrations()
        {
            try
            {
                var registrations = await _service.GetAllRegistrationsAsync();
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Update registration
        /// </summary>
        /// <param name="id">Registration ID</param>
        /// <param name="request">Updated registration data</param>
        /// <returns>Updated registration</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<StudentRegistration>> UpdateRegistration(int id, [FromBody] StudentRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var registration = await _service.UpdateRegistrationAsync(id, request);
                
                if (registration == null)
                {
                    return NotFound();
                }

                return Ok(registration);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Delete registration
        /// </summary>
        /// <param name="id">Registration ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteRegistration(int id)
        {
            try
            {
                var success = await _service.DeleteRegistrationAsync(id);
                
                if (!success)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get registrations by parent email
        /// </summary>
        /// <param name="email">Parent email</param>
        /// <returns>List of registrations</returns>
        [HttpGet("parent/{email}")]
        public async Task<ActionResult<IEnumerable<StudentRegistration>>> GetRegistrationsByParentEmail(string email)
        {
            try
            {
                var registrations = await _service.GetRegistrationsByParentEmailAsync(email);
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get registrations by student email
        /// </summary>
        /// <param name="email">Student email</param>
        /// <returns>List of registrations</returns>
        [HttpGet("student/{email}")]
        public async Task<ActionResult<IEnumerable<StudentRegistration>>> GetRegistrationsByStudentEmail(string email)
        {
            try
            {
                var registrations = await _service.GetRegistrationsByStudentEmailAsync(email);
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get registrations by session
        /// </summary>
        /// <param name="session">Session name</param>
        /// <returns>List of registrations</returns>
        [HttpGet("session/{session}")]
        public async Task<ActionResult<IEnumerable<StudentRegistration>>> GetRegistrationsBySession(string session)
        {
            try
            {
                var registrations = await _service.GetRegistrationsBySessionAsync(session);
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        /// <summary>
        /// Get registrations by location
        /// </summary>
        /// <param name="location">Location ID</param>
        /// <returns>List of registrations</returns>
        [HttpGet("location/{location}")]
        public async Task<ActionResult<IEnumerable<StudentRegistration>>> GetRegistrationsByLocation(int location)
        {
            try
            {
                var registrations = await _service.GetRegistrationsByLocationAsync(location);
                return Ok(registrations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
} 