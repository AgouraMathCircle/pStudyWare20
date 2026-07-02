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

                var response = _onlineExamService.GetStudentList(request);
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

                var response = _onlineExamService.GetExamQuestions(request);
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

                var response = _onlineExamService.ValidateScoreUpdate(request);
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

                var response = _onlineExamService.GetCurrentSession(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting current session", error = ex.Message });
            }
        }

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

                var response = _onlineExamService.GetStudentScores(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student scores", error = ex.Message });
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

                var response = _onlineExamService.SubmitExam(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while submitting exam", error = ex.Message });
            }
        }
    }
}
