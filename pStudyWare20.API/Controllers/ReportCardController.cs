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
    [Authorize] // Require authentication for all report card endpoints
    public class ReportCardController : ControllerBase
    {
        private readonly IReportCardService _reportCardService;

        public ReportCardController(IReportCardService reportCardService)
        {
            _reportCardService = reportCardService;
        }

        /// <summary>
        /// Get report card list (matches BindGridView method)
        /// </summary>
        /// <param name="request">Report card list request</param>
        /// <returns>Report card list response</returns>
        [HttpPost("GetReportCardList")]
        public async Task<IActionResult> GetReportCardList([FromBody] ReportCardListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _reportCardService.GetReportCardListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting report card list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get score details for editing (matches EditScore method)
        /// </summary>
        /// <param name="request">Get score details request</param>
        /// <returns>Get score details response</returns>
        [HttpPost("GetScoreDetails")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can edit scores
        public async Task<IActionResult> GetScoreDetails([FromBody] GetScoreDetailsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.GetScoreDetailsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting score details", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete student score (matches DeleteScore method)
        /// </summary>
        /// <param name="request">Delete score request</param>
        /// <returns>Delete score response</returns>
        [HttpPost("DeleteStudentScore")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can delete scores
        public async Task<IActionResult> DeleteStudentScore([FromBody] DeleteScoreRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.DeleteStudentScoreAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student score", error = ex.Message });
            }
        }

        /// <summary>
        /// Add student score (matches btnSubmit_Click method for new scores)
        /// </summary>
        /// <param name="request">Add student score request</param>
        /// <returns>Student score response</returns>
        [HttpPost("AddStudentScore")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can add scores
        public async Task<IActionResult> AddStudentScore([FromBody] AddStudentScoreRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.AddStudentScoreAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding student score", error = ex.Message });
            }
        }

        /// <summary>
        /// Update student score (matches btnSubmit_Click method for existing scores)
        /// </summary>
        /// <param name="request">Update student score request</param>
        /// <returns>Student score response</returns>
        [HttpPost("UpdateStudentScore")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can update scores
        public async Task<IActionResult> UpdateStudentScore([FromBody] UpdateStudentScoreRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.UpdateStudentScoreAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student score", error = ex.Message });
            }
        }

        /// <summary>
        /// View report (summary or semester) (matches btnViewReport_Click method)
        /// </summary>
        /// <param name="request">View report request</param>
        /// <returns>View report response</returns>
        [HttpPost("ViewReport")]
        public async Task<IActionResult> ViewReport([FromBody] ViewReportRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _reportCardService.ViewReportAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while viewing report", error = ex.Message });
            }
        }

        /// <summary>
        /// Send email notification (matches btnSendEmail_Click method)
        /// </summary>
        /// <param name="request">Send email request</param>
        /// <returns>Send email response</returns>
        [HttpPost("SendEmail")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can send emails
        public async Task<IActionResult> SendEmail([FromBody] SendEmailRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.From))
                {
                    request.From = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _reportCardService.SendEmailAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending email", error = ex.Message });
            }
        }

        /// <summary>
        /// Import scores from Excel (matches btnSubmitExcel_Click method)
        /// </summary>
        /// <param name="request">Excel import request</param>
        /// <returns>Excel import response</returns>
        [HttpPost("ImportScoresFromExcel")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can import scores
        public async Task<IActionResult> ImportScoresFromExcel([FromBody] ExcelImportRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.ImportScoresFromExcelAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while importing scores from Excel", error = ex.Message });
            }
        }

        /// <summary>
        /// Export data to Excel (matches btnExportExcel_Click method)
        /// </summary>
        /// <param name="request">Excel export request</param>
        /// <returns>Excel file response</returns>
        [HttpPost("ExportToExcel")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can export data
        public async Task<IActionResult> ExportToExcel([FromBody] ExcelExportRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _reportCardService.ExportToExcelAsync(request);

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting to Excel", error = ex.Message });
            }
        }

        /// <summary>
        /// Send student report card email (matches SendEmailStudentReport method)
        /// </summary>
        /// <param name="request">Send student report email request</param>
        /// <returns>Send student report email response</returns>
        [HttpPost("SendStudentReportEmail")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can send report emails
        public async Task<IActionResult> SendStudentReportEmail([FromBody] SendStudentReportEmailRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                // Get username from JWT token if not provided in request
                if (string.IsNullOrEmpty(request.Username))
                {
                    request.Username = User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";
                }

                var response = await _reportCardService.SendStudentReportEmailAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while sending student report email", error = ex.Message });
            }
        }

        /// <summary>
        /// Get report card dashboard data (combines multiple data sources for efficiency)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Report card dashboard response</returns>
        [HttpGet("GetDashboardData")]
        public async Task<IActionResult> GetDashboardData([FromQuery] string? username = null)
        {
            try
            {
                // Get username from JWT token if not provided
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new ReportCardDashboardRequest
                {
                    Username = userUsername
                };

                var response = await _reportCardService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting report card dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has report card privileges
        /// </summary>
        /// <returns>Report card privilege status</returns>
        [HttpGet("CheckReportCardPrivileges")]
        public IActionResult CheckReportCardPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isStudent = memberType == "S";
                var isAdmin = userRole == "Admin" || memberType == "A";
                var isInstructor = userRole == "Instructor" || memberType == "I";

                return Ok(new ReportCardPrivilegesResponse
                {
                    IsSuccess = true,
                    IsStudent = isStudent,
                    Role = userRole,
                    MemberType = memberType,
                    CanUpdateScores = isAdmin || isInstructor,
                    CanDeleteScores = isAdmin || isInstructor,
                    CanImportExcel = isAdmin || isInstructor,
                    CanExportData = isAdmin || isInstructor,
                    CanSendEmails = isAdmin || isInstructor
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking report card privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Handle score action (Edit, Delete) (matches Page_Load action handling)
        /// </summary>
        /// <param name="request">Score action request</param>
        /// <returns>Score action response</returns>
        [HttpPost("HandleScoreAction")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can perform score actions
        public async Task<IActionResult> HandleScoreAction([FromBody] ScoreActionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _reportCardService.HandleScoreActionAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while handling score action", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all report cards (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Report card list response</returns>
        [HttpGet("GetAllReportCards")]
        public async Task<IActionResult> GetAllReportCards([FromQuery] string? username = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new ReportCardListRequest
                {
                    Username = userUsername
                };

                var response = await _reportCardService.GetReportCardListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting all report cards", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete score by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="scoreId">Score ID</param>
        /// <returns>Delete score response</returns>
        [HttpDelete("DeleteScore/{scoreId}")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can delete scores
        public async Task<IActionResult> DeleteScore(string scoreId)
        {
            try
            {
                var request = new DeleteScoreRequest
                {
                    ReportCardId = scoreId
                };

                var response = await _reportCardService.DeleteStudentScoreAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting score", error = ex.Message });
            }
        }

        /// <summary>
        /// Get score details by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="scoreId">Score ID</param>
        /// <returns>Get score details response</returns>
        [HttpGet("GetScoreDetails/{scoreId}")]
        [Authorize(Roles = "Admin,SystemAdmin,Instructor")] // Only admins and instructors can view score details
        public async Task<IActionResult> GetScoreDetails(string scoreId)
        {
            try
            {
                var request = new GetScoreDetailsRequest
                {
                    ReportCardId = scoreId
                };

                var response = await _reportCardService.GetScoreDetailsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting score details", error = ex.Message });
            }
        }
    }
}
