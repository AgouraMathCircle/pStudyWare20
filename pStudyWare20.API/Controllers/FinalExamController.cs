using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class FinalExamController : ControllerBase
    {
        private readonly IFinalExamService _finalExamService;

        public FinalExamController(IFinalExamService finalExamService)
        {
            _finalExamService = finalExamService;
        }

        /// <summary>
        /// Get student list (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list result</returns>
        [HttpPost]
        [Route("GetStudentList")]
        public object GetStudentList([FromBody] StudentListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _finalExamService.GetStudentList(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get exam questions (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Exam questions request</param>
        /// <returns>Exam questions result</returns>
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

                var response = _finalExamService.GetExamQuestions(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting exam questions", error = ex.Message });
            }
        }

        /// <summary>
        /// Validate score update (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation result</returns>
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

                var response = _finalExamService.ValidateScoreUpdate(request);
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

        /// <summary>
        /// Get student scores (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores result</returns>
        [HttpPost]
        [Route("GetStudentScores")]
        public object GetStudentScores([FromBody] StudentScoresRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _finalExamService.GetStudentScores(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student scores", error = ex.Message });
            }
        }

        /// <summary>
        /// Submit exam (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Submit exam request</param>
        /// <returns>Submit exam result</returns>
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
