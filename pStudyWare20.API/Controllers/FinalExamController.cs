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
    [Authorize]
    public class FinalExamController : ControllerBase
    {
        private readonly IFinalExamService _finalExamService;

        public FinalExamController(IFinalExamService finalExamService)
        {
            _finalExamService = finalExamService;
        }

        private string GetPortalUsername()
        {
            return User.FindFirst("Username")?.Value
                ?? User.FindFirst(ClaimTypes.Email)?.Value
                ?? User.FindFirst(ClaimTypes.Name)?.Value
                ?? string.Empty;
        }

        [HttpPost]
        [Route("GetStudentList")]
        public object GetStudentList([FromBody] StudentListRequest? request)
        {
            try
            {
                request ??= new StudentListRequest();
                request.Username = GetPortalUsername();

                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.GetStudentList(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetExamQuestions")]
        public object GetExamQuestions([FromBody] ExamQuestionsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                request.PortalUsername = GetPortalUsername();
                if (string.IsNullOrWhiteSpace(request.PortalUsername))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.GetExamQuestions(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting exam questions", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("ValidateScoreUpdate")]
        public object ValidateScoreUpdate([FromBody] ScoreValidationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                request.PortalUsername = GetPortalUsername();
                if (string.IsNullOrWhiteSpace(request.PortalUsername))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.ValidateScoreUpdate(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while validating score update", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetCurrentSession")]
        public object GetCurrentSession([FromBody] CurrentSessionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _finalExamService.GetCurrentSession(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting current session", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetStudentScores")]
        public object GetStudentScores([FromBody] StudentScoresRequest? request)
        {
            try
            {
                request ??= new StudentScoresRequest();
                request.Username = GetPortalUsername();

                if (string.IsNullOrWhiteSpace(request.Username))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.GetStudentScores(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student scores", error = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetExamAvailability")]
        public object GetExamAvailability()
        {
            try
            {
                var username = GetPortalUsername();
                if (string.IsNullOrWhiteSpace(username))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.GetExamAvailability(username);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking final exam availability", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("SubmitExam")]
        public object SubmitExam([FromBody] SubmitExamRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                request.PortalUsername = GetPortalUsername();
                if (string.IsNullOrWhiteSpace(request.PortalUsername))
                {
                    return Unauthorized(new { message = "Unable to resolve portal username from token." });
                }

                var response = _finalExamService.SubmitExam(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting exam", error = ex.Message });
            }
        }
    }
}
