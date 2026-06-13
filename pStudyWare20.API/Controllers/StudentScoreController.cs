using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class StudentScoreController : ControllerBase
    {
        private readonly IStudentScoreService _studentScoreService;

        public StudentScoreController(IStudentScoreService studentScoreService)
        {
            _studentScoreService = studentScoreService;
        }

        [HttpPost("GetStudentList")]
        public object GetStudentList([FromBody] OnlineExamStudentListRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Username))
                {
                    return BadRequest(new { isSuccess = false, errorMessage = "Username is required." });
                }

                return _studentScoreService.GetStudentList(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        [HttpPost("GetCurrentSession")]
        public object GetCurrentSession([FromBody] GetCurrentSessionRequest request)
        {
            try
            {
                return _studentScoreService.GetCurrentSession(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting current session", error = ex.Message });
            }
        }

        [HttpPost("ValidateScoreUpdate")]
        public object ValidateScoreUpdate([FromBody] ValidateScoreUpdateRequest request)
        {
            try
            {
                return _studentScoreService.ValidateScoreUpdate(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while validating score update", error = ex.Message });
            }
        }

        [HttpPost("GetDueDate")]
        public object GetDueDate([FromBody] GetDueDateRequest request)
        {
            try
            {
                return _studentScoreService.GetDueDate(request ?? new GetDueDateRequest());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting due date", error = ex.Message });
            }
        }

        [HttpPost("GetStudentScores")]
        public object GetStudentScores([FromBody] GetStudentScoresRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Username))
                {
                    return BadRequest(new { isSuccess = false, errorMessage = "Username is required." });
                }

                return _studentScoreService.GetStudentScores(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student scores", error = ex.Message });
            }
        }

        [HttpPost("AddStudentScore")]
        public object AddStudentScore([FromBody] AddStudentScoreRequest request)
        {
            try
            {
                if (request == null)
                {
                    return BadRequest(new { isSuccess = false, errorMessage = "Request body is required." });
                }

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .Where(message => !string.IsNullOrWhiteSpace(message));

                    return BadRequest(new
                    {
                        isSuccess = false,
                        errorMessage = string.Join(" ", errors),
                    });
                }

                return _studentScoreService.AddStudentScore(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding student score", error = ex.Message });
            }
        }

        [HttpPost("UpdateStudentScore")]
        public object UpdateStudentScore([FromBody] UpdateStudentScoreRequest request)
        {
            try
            {
                return _studentScoreService.UpdateStudentScore(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student score", error = ex.Message });
            }
        }
    }
}
