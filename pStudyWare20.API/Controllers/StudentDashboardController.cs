using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// Controller for Student Dashboard operations
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowSpecificOrigins")]
    [Authorize(Roles = "Student")]
    public class StudentDashboardController : ControllerBase
    {
        private readonly IStudentDashboardService _studentDashboardService;

        public StudentDashboardController(IStudentDashboardService studentDashboardService)
        {
            _studentDashboardService = studentDashboardService ?? throw new ArgumentNullException(nameof(studentDashboardService));
        }

        /// <summary>
        /// Gets complete dashboard data for student
        /// </summary>
        /// <param name="username">Student username</param>
        /// <param name="chapterId">Chapter ID</param>
        /// <returns>Complete dashboard data</returns>
        [HttpGet("GetDashboardData/{username}/{chapterId}")]
        public async Task<ActionResult<GetDashboardMessageResponse>> GetDashboardData(string username, int chapterId)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new GetDashboardMessageResponse
                    {
                        IsSuccess = false,
                        Message = "Username is required"
                    });
                }

                if (chapterId <= 0)
                {
                    return BadRequest(new GetDashboardMessageResponse
                    {
                        IsSuccess = false,
                        Message = "Valid Chapter ID is required"
                    });
                }

                var request = new GetDashboardMessageRequest
                {
                    Username = username.Trim(),
                    ChapterID = chapterId
                };

                var response = await _studentDashboardService.GetDashboardMessageAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetDashboardMessageResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets student profile by username and chapter ID (GET endpoint)
        /// </summary>
        /// <param name="username">Student username</param>
        /// <param name="chapterId">Chapter ID</param>
        /// <returns>Student profile information</returns>
        [HttpGet("GetStudentProfile/{username}/{chapterId}")]
        public async Task<ActionResult<GetStudentProfileResponse>> GetStudentProfile(string username, int chapterId)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new GetStudentProfileResponse
                    {
                        IsSuccess = false,
                        Message = "Username is required"
                    });
                }

                if (chapterId <= 0)
                {
                    return BadRequest(new GetStudentProfileResponse
                    {
                        IsSuccess = false,
                        Message = "Valid Chapter ID is required"
                    });
                }

                var request = new GetStudentProfileRequest
                {
                    Username = username.Trim(),
                    ChapterID = chapterId
                };

                var response = await _studentDashboardService.GetStudentProfileAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetStudentProfileResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets student profile by student ID (GET endpoint)
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <returns>Student profile information</returns>
        [HttpGet("GetStudentProfileById/{studentId}")]
        public async Task<ActionResult<GetStudentProfileResponse>> GetStudentProfileById(int studentId)
        {
            try
            {
                // Validate input parameters
                if (studentId <= 0)
                {
                    return BadRequest(new GetStudentProfileResponse
                    {
                        IsSuccess = false,
                        Message = "Valid Student ID is required"
                    });
                }

                var response = await _studentDashboardService.GetStudentProfileByIdAsync(studentId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetStudentProfileResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets multiple student profiles by username and chapter ID (GET endpoint)
        /// </summary>
        /// <param name="username">Student username</param>
        /// <param name="chapterId">Chapter ID</param>
        /// <returns>Multiple student profiles information</returns>
        [HttpGet("GetStudentProfiles/{username}/{chapterId}")]
        public async Task<ActionResult<GetStudentProfilesResponse>> GetStudentProfiles(string username, int chapterId)
        {
            try
            {
                Console.WriteLine($"GetStudentProfiles API called: username={username}, chapterId={chapterId}");

                // Validate input parameters
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new GetStudentProfilesResponse
                    {
                        IsSuccess = false,
                        Message = "Username is required"
                    });
                }

                if (chapterId <= 0)
                {
                    return BadRequest(new GetStudentProfilesResponse
                    {
                        IsSuccess = false,
                        Message = "Valid Chapter ID is required"
                    });
                }

                var request = new GetStudentProfilesRequest
                {
                    Username = username.Trim(),
                    ChapterID = chapterId
                };

                var response = await _studentDashboardService.GetStudentProfilesAsync(request);

                Console.WriteLine($"GetStudentProfiles API response: IsSuccess={response.IsSuccess}, ProfileCount={response.StudentProfiles.Count}, Message={response.Message}");

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetStudentProfiles API error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new GetStudentProfilesResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets student report card/grades
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Report card information</returns>
        [HttpPost("GetReportCard")]
        public async Task<ActionResult<GetReportCardResponse>> GetReportCard([FromBody] GetReportCardRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new GetReportCardResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid request data"
                    });
                }

                var response = await _studentDashboardService.GetReportCardAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetReportCardResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets registration status for student
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Registration status information</returns>
        [HttpPost("GetRegistrationStatus")]
        public async Task<ActionResult<GetRegistrationStatusResponse>> GetRegistrationStatus([FromBody] GetRegistrationStatusRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new GetRegistrationStatusResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid request data"
                    });
                }

                var response = await _studentDashboardService.GetRegistrationStatusAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetRegistrationStatusResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Submits student registration
        /// </summary>
        /// <param name="request">Request containing student ID and username</param>
        /// <returns>Registration submission result</returns>
        [HttpPost("SubmitRegistration")]
        public async Task<ActionResult<SubmitRegistrationResponse>> SubmitRegistration([FromBody] SubmitRegistrationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new SubmitRegistrationResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid request data"
                    });
                }

                var response = await _studentDashboardService.SubmitRegistrationAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new SubmitRegistrationResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets registration information for email notifications
        /// </summary>
        /// <param name="request">Request containing student ID</param>
        /// <returns>Registration information</returns>
        [HttpPost("GetRegistrationInfo")]
        public async Task<ActionResult<GetRegistrationInfoResponse>> GetRegistrationInfo([FromBody] GetRegistrationInfoRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new GetRegistrationInfoResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid request data"
                    });
                }

                var response = await _studentDashboardService.GetRegistrationInfoAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetRegistrationInfoResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }



        /// <summary>
        /// Checks if student is eligible for registration
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Registration eligibility information</returns>
        [HttpPost("CheckRegistrationEligibility")]
        public async Task<ActionResult<CheckRegistrationEligibilityResponse>> CheckRegistrationEligibility([FromBody] CheckRegistrationEligibilityRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new CheckRegistrationEligibilityResponse
                    {
                        IsSuccess = false,
                        Message = "Invalid request data"
                    });
                }

                var response = await _studentDashboardService.CheckRegistrationEligibilityAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new CheckRegistrationEligibilityResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets report card by username (GET endpoint)
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>Report card information</returns>
        [HttpGet("GetReportCard/{username}")]
        public async Task<ActionResult<GetReportCardResponse>> GetReportCardByUsername(string username)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new GetReportCardResponse
                    {
                        IsSuccess = false,
                        Message = "Username is required"
                    });
                }

                var request = new GetReportCardRequest
                {
                    Username = username.Trim()
                };

                var response = await _studentDashboardService.GetReportCardAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetReportCardResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }

        /// <summary>
        /// Gets registration status by username (GET endpoint)
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>Registration status information</returns>
        [HttpGet("GetRegistrationStatus/{username}")]
        public async Task<ActionResult<GetRegistrationStatusResponse>> GetRegistrationStatusByUsername(string username)
        {
            try
            {
                // Validate input parameters
                if (string.IsNullOrWhiteSpace(username))
                {
                    return BadRequest(new GetRegistrationStatusResponse
                    {
                        IsSuccess = false,
                        Message = "Username is required"
                    });
                }

                var request = new GetRegistrationStatusRequest
                {
                    Username = username.Trim()
                };

                var response = await _studentDashboardService.GetRegistrationStatusAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GetRegistrationStatusResponse
                {
                    IsSuccess = false,
                    Message = $"Internal server error: {ex.Message}"
                });
            }
        }
    }
}
