using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class OnlineExamController : ControllerBase
    {
        private readonly IOnlineExamService _onlineExamService;

        public OnlineExamController(IOnlineExamService onlineExamService)
        {
            _onlineExamService = onlineExamService;
        }

        /// <summary>
        /// Get student list (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list result</returns>
        [HttpPost]
        [Route("GetStudentList")]
        public object GetStudentList([FromBody] OnlineExamStudentListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.GetStudentList(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get online exam questions (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Online exam questions request</param>
        /// <returns>Online exam questions result</returns>
        [HttpPost]
        [Route("GetOnlineExamQuestions")]
        public object GetOnlineExamQuestions([FromBody] OnlineExamQuestionsRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.GetOnlineExamQuestions(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting online exam questions", error = ex.Message });
            }
        }

        /// <summary>
        /// Validate score update (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation result</returns>
        [HttpPost]
        [Route("ValidateScoreUpdate")]
        public object ValidateScoreUpdate([FromBody] OnlineExamScoreValidationRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.ValidateScoreUpdate(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while validating score update", error = ex.Message });
            }
        }

        /// <summary>
        /// Get current session (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Current session request</param>
        /// <returns>Current session result</returns>
        [HttpPost]
        [Route("GetCurrentSession")]
        public object GetCurrentSession([FromBody] OnlineExamCurrentSessionRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.GetCurrentSession(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting current session", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student scores (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores result</returns>
        [HttpPost]
        [Route("GetStudentScores")]
        public object GetStudentScores([FromBody] OnlineExamStudentScoresRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.GetStudentScores(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student scores", error = ex.Message });
            }
        }

        /// <summary>
        /// Submit online exam (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Submit online exam request</param>
        /// <returns>Submit online exam result</returns>
        [HttpPost]
        [Route("SubmitOnlineExam")]
        public object SubmitOnlineExam([FromBody] SubmitOnlineExamRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _onlineExamService.SubmitOnlineExam(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting online exam", error = ex.Message });
            }
        }
    }
}
