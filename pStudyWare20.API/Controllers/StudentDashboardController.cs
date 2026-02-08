using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    /// <summary>
    /// Controller for Student Dashboard operations.
    /// Mirrors logic from Student_Dashboard.aspx.cs: BindGridView, BindGridViewReportCard,
    /// BindRegistrationGridView, CheckRegistration, AddRegistration, InformMe.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    //[Authorize(Roles = "Student,User")]
    public class StudentDashboardController : ControllerBase
    {
        private readonly IStudentDashboardService _studentDashboardService;

        public StudentDashboardController(IStudentDashboardService studentDashboardService)
        {
            _studentDashboardService = studentDashboardService ?? throw new ArgumentNullException(nameof(studentDashboardService));
        }

        /// <summary>
        /// Gets dashboard messages (Important Notice, Announcement, etc.).
        /// </summary>
        [HttpGet("GetDashboardData/{username}/{chapterId}")]
        public async Task<ActionResult<GetDashboardMessageResponse>> GetDashboardData(string username, int chapterId)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new GetDashboardMessageResponse { IsSuccess = false, Message = "Username is required" });
            if (chapterId <= 0)
                return BadRequest(new GetDashboardMessageResponse { IsSuccess = false, Message = "Valid Chapter ID is required" });

            var request = new GetDashboardMessageRequest { Username = username.Trim(), ChapterID = chapterId };
            var response = await _studentDashboardService.GetDashboardMessageAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets single student profile by username and chapter (BindGridView uses same SP for list).
        /// </summary>
        [HttpGet("GetStudentProfile/{username}/{chapterId}")]
        public async Task<ActionResult<GetStudentProfileResponse>> GetStudentProfile(string username, int chapterId)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new GetStudentProfileResponse { IsSuccess = false, Message = "Username is required" });
            if (chapterId <= 0)
                return BadRequest(new GetStudentProfileResponse { IsSuccess = false, Message = "Valid Chapter ID is required" });

            var request = new GetStudentProfileRequest { Username = username.Trim(), ChapterID = chapterId };
            var response = await _studentDashboardService.GetStudentProfileAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets student profile by student ID.
        /// </summary>
        [HttpGet("GetStudentProfileById/{studentId}")]
        public async Task<ActionResult<GetStudentProfileResponse>> GetStudentProfileById(int studentId)
        {
            if (studentId <= 0)
                return BadRequest(new GetStudentProfileResponse { IsSuccess = false, Message = "Valid Student ID is required" });

            var response = await _studentDashboardService.GetStudentProfileByIdAsync(studentId);
            return Ok(response);
        }

        /// <summary>
        /// Gets student list for username and chapter (BindGridView - AMC_spSelectStudentList).
        /// </summary>
        [HttpGet("GetStudentProfiles/{username}/{chapterId}")]
        public async Task<ActionResult<GetStudentProfilesResponse>> GetStudentProfiles(string username, int chapterId)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new GetStudentProfilesResponse { IsSuccess = false, Message = "Username is required" });
            if (chapterId <= 0)
                return BadRequest(new GetStudentProfilesResponse { IsSuccess = false, Message = "Valid Chapter ID is required" });

            var request = new GetStudentProfilesRequest { Username = username.Trim(), ChapterID = chapterId };
            var response = await _studentDashboardService.GetStudentProfilesAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets report card for student (BindGridViewReportCard - AMC_spReportCard_StudentDashboard).
        /// </summary>
        [HttpPost("GetReportCard")]
        public async Task<ActionResult<GetReportCardResponse>> GetReportCard([FromBody] GetReportCardRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new GetReportCardResponse { IsSuccess = false, Message = "Username is required" });

            var response = await _studentDashboardService.GetReportCardAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets report card by username (GET).
        /// </summary>
        [HttpGet("GetReportCard/{username}")]
        public async Task<ActionResult<GetReportCardResponse>> GetReportCardByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new GetReportCardResponse { IsSuccess = false, Message = "Username is required" });

            var request = new GetReportCardRequest { Username = username.Trim() };
            var response = await _studentDashboardService.GetReportCardAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets registration status / eligibility (CheckRegistration, BindRegistrationGridView - AMC_spRegisterExistingUserCheck).
        /// </summary>
        [HttpPost("GetRegistrationStatus")]
        public async Task<ActionResult<GetRegistrationStatusResponse>> GetRegistrationStatus([FromBody] GetRegistrationStatusRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new GetRegistrationStatusResponse { IsSuccess = false, Message = "Username is required" });

            var response = await _studentDashboardService.GetRegistrationStatusAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets registration status by username (GET).
        /// </summary>
        [HttpGet("GetRegistrationStatus/{username}")]
        public async Task<ActionResult<GetRegistrationStatusResponse>> GetRegistrationStatusByUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                return BadRequest(new GetRegistrationStatusResponse { IsSuccess = false, Message = "Username is required" });

            var request = new GetRegistrationStatusRequest { Username = username.Trim() };
            var response = await _studentDashboardService.GetRegistrationStatusAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Submits registration for a student (AddRegistration + InformMe - AMC_spRegisterExistingUser, AMC_spRegisterednfo, then emails).
        /// </summary>
        [HttpPost("SubmitRegistration")]
        public async Task<ActionResult<SubmitRegistrationResponse>> SubmitRegistration([FromBody] SubmitRegistrationRequest request)
        {
            if (request == null || request.StudentID <= 0)
                return BadRequest(new SubmitRegistrationResponse { IsSuccess = false, Message = "Valid Student ID is required" });
            if (string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new SubmitRegistrationResponse { IsSuccess = false, Message = "Username is required" });

            var response = await _studentDashboardService.SubmitRegistrationAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Gets registration info for a student (used by InformMe - AMC_spRegisterednfo).
        /// </summary>
        [HttpPost("GetRegistrationInfo")]
        public async Task<ActionResult<GetRegistrationInfoResponse>> GetRegistrationInfo([FromBody] GetRegistrationInfoRequest request)
        {
            if (request == null || request.StudentID <= 0)
                return BadRequest(new GetRegistrationInfoResponse { IsSuccess = false, Message = "Valid Student ID is required" });

            var response = await _studentDashboardService.GetRegistrationInfoAsync(request);
            return Ok(response);
        }

        /// <summary>
        /// Checks if student is eligible for registration (same as GetRegistrationStatus - AMC_spRegisterExistingUserCheck).
        /// </summary>
        [HttpPost("CheckRegistrationEligibility")]
        public async Task<ActionResult<CheckRegistrationEligibilityResponse>> CheckRegistrationEligibility([FromBody] CheckRegistrationEligibilityRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username))
                return BadRequest(new CheckRegistrationEligibilityResponse { IsSuccess = false, Message = "Username is required" });

            var response = await _studentDashboardService.CheckRegistrationEligibilityAsync(request);
            return Ok(response);
        }
    }
}
