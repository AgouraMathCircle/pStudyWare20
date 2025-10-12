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
    [Authorize] // Require authentication for all registered student list endpoints
    public class RegisteredStudentListController : ControllerBase
    {
        private readonly IRegisteredStudentListService _registeredStudentListService;

        public RegisteredStudentListController(IRegisteredStudentListService registeredStudentListService)
        {
            _registeredStudentListService = registeredStudentListService;
        }

        /// <summary>
        /// Get registered student list (matches BindGridView method)
        /// </summary>
        /// <param name="request">Registered student list request</param>
        /// <returns>Registered student list response</returns>
        [HttpPost("GetRegisteredStudentList")]
        public async Task<IActionResult> GetRegisteredStudentList([FromBody] RegisteredStudentListRequest request)
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

                var response = await _registeredStudentListService.GetRegisteredStudentListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting registered student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Update student class information (matches btnSubmit_Click method)
        /// </summary>
        /// <param name="request">Update student class request</param>
        /// <returns>Update student class response</returns>
        [HttpPost("UpdateStudentClass")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can update student classes
        public async Task<IActionResult> UpdateStudentClass([FromBody] UpdateStudentClassRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _registeredStudentListService.UpdateStudentClassAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student class", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete student registration (matches DeleteStudent method)
        /// </summary>
        /// <param name="request">Delete student request</param>
        /// <returns>Delete student response</returns>
        [HttpPost("DeleteStudent")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can delete students
        public async Task<IActionResult> DeleteStudent([FromBody] DeleteStudentRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _registeredStudentListService.DeleteStudentAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student details for update (matches UpdateClass method)
        /// </summary>
        /// <param name="request">Get student for update request</param>
        /// <returns>Get student for update response</returns>
        [HttpPost("GetStudentForUpdate")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can update students
        public async Task<IActionResult> GetStudentForUpdate([FromBody] GetStudentForUpdateRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _registeredStudentListService.GetStudentForUpdateAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student for update", error = ex.Message });
            }
        }

        /// <summary>
        /// Get chapter locations (matches BindChapterLocation method)
        /// </summary>
        /// <param name="request">Chapter location request</param>
        /// <returns>Chapter location response</returns>
        [HttpPost("GetChapterLocations")]
        public async Task<IActionResult> GetChapterLocations([FromBody] GetChapterLocationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _registeredStudentListService.GetChapterLocationsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting chapter locations", error = ex.Message });
            }
        }

        /// <summary>
        /// Export student list to Excel (matches btnExportExcel_Click and GridviewToExcel methods)
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Excel file response</returns>
        [HttpPost("ExportStudentListToExcel")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can export data
        public async Task<IActionResult> ExportStudentListToExcel([FromBody] ExportStudentListExcelRequest request)
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

                var response = await _registeredStudentListService.ExportStudentListToExcelAsync(request);

                if (!response.IsSuccess)
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }

                return File(response.FileContent, response.ContentType, response.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Handle student action (Edit, Delete) (matches Page_Load action handling)
        /// </summary>
        /// <param name="request">Student action request</param>
        /// <returns>Student action response</returns>
        [HttpPost("HandleStudentAction")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can perform student actions
        public async Task<IActionResult> HandleStudentAction([FromBody] StudentActionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = await _registeredStudentListService.HandleStudentActionAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while handling student action", error = ex.Message });
            }
        }

        /// <summary>
        /// Get registered student list dashboard data (combines multiple data sources for efficiency)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <returns>Registered student list dashboard response</returns>
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

                var request = new RegisteredStudentListDashboardRequest
                {
                    Username = userUsername
                };

                var response = await _registeredStudentListService.GetDashboardDataAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting registered student list dashboard data", error = ex.Message });
            }
        }

        /// <summary>
        /// Check if user has registered student list privileges
        /// </summary>
        /// <returns>Registered student list privilege status</returns>
        [HttpGet("CheckRegisteredStudentListPrivileges")]
        public IActionResult CheckRegisteredStudentListPrivileges()
        {
            try
            {
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value ?? "";
                var memberType = User.FindFirst("MemberType")?.Value ?? "";
                var isAdmin = userRole == "Admin" || memberType == "A";

                return Ok(new RegisteredStudentListPrivilegesResponse
                {
                    IsSuccess = true,
                    IsAdmin = isAdmin,
                    Role = userRole,
                    MemberType = memberType,
                    CanUpdateStudents = isAdmin,
                    CanDeleteStudents = isAdmin,
                    CanExportData = isAdmin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking registered student list privileges", error = ex.Message });
            }
        }

        /// <summary>
        /// Get all registered students (GET endpoint for easier access)
        /// </summary>
        /// <param name="username">Username (optional, will use JWT token if not provided)</param>
        /// <param name="mode">Mode parameter (optional)</param>
        /// <returns>Registered student list response</returns>
        [HttpGet("GetAllRegisteredStudents")]
        public async Task<IActionResult> GetAllRegisteredStudents([FromQuery] string? username = null, [FromQuery] string? mode = null)
        {
            try
            {
                var userUsername = username ?? User.FindFirst(ClaimTypes.Name)?.Value ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "";

                if (string.IsNullOrEmpty(userUsername))
                {
                    return BadRequest(new { message = "Username is required" });
                }

                var request = new RegisteredStudentListRequest
                {
                    Username = userUsername,
                    Mode = mode ?? ""
                };

                var response = await _registeredStudentListService.GetRegisteredStudentListAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting all registered students", error = ex.Message });
            }
        }

        /// <summary>
        /// Get chapter locations (GET endpoint for easier access)
        /// </summary>
        /// <param name="activeOnly">Active only flag (default: N)</param>
        /// <returns>Chapter location response</returns>
        [HttpGet("GetChapterLocations")]
        public async Task<IActionResult> GetChapterLocations([FromQuery] string activeOnly = "N")
        {
            try
            {
                var request = new GetChapterLocationRequest
                {
                    Mode = activeOnly
                };

                var response = await _registeredStudentListService.GetChapterLocationsAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting chapter locations", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete student by ID (GET endpoint for easier access)
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <returns>Delete student response</returns>
        [HttpDelete("DeleteStudent/{studentId}")]
        [Authorize(Roles = "Admin,SystemAdmin")] // Only admins can delete students
        public async Task<IActionResult> DeleteStudent(string studentId)
        {
            try
            {
                var request = new DeleteStudentRequest
                {
                    StudentId = studentId
                };

                var response = await _registeredStudentListService.DeleteStudentAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student", error = ex.Message });
            }
        }
    }
}
