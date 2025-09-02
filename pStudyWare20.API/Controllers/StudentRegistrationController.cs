using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class StudentRegistrationController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentRegistrationController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        /// <summary>
        /// Register a new student (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentDetails">Student registration details</param>
        /// <returns>Registration result</returns>
        [HttpPost]        
        public object StudentRegistration([FromBody] RegistrationStudentModel studentDetails)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.StudentRegistration(studentDetails);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during student registration", error = ex.Message });
            }
        }

        /// <summary>
        /// Get students list (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentlist">Student list request</param>
        /// <returns>Students list result</returns>
        [HttpPost]
        [Route("GetStudentsList")]
        public object GetStudentsList([FromBody] Studentlist studentlist)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetStudentsList(studentlist);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting students list", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student report card (matches legacy controller exactly)
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Report card result</returns>
        [HttpPost]
        [Route("GetStudentsReportCard")]
        public object GetStudentsReportCard([FromBody] UserName userName)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetStudentsReportCard(userName);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student report card", error = ex.Message });
            }
        }

        /// <summary>
        /// Update student report card (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentsReportCard">Report card update details</param>
        /// <returns>Update result</returns>
        [HttpPost]
        [Route("UpdateStudentsReportCard")]
        public object UpdateStudentsReportCard([FromBody] StudentsReportCard studentsReportCard)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.UpdateStudentsReportCard(studentsReportCard);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student report card", error = ex.Message });
            }
        }

        /// <summary>
        /// Get meeting schedule (matches legacy controller exactly)
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Meeting schedule result</returns>
        [HttpPost]
        [Route("GetMeetingSchedule")]
        public object GetMeetingSchedule([FromBody] UserName userName)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetMeetingSchedule(userName);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting meeting schedule", error = ex.Message });
            }
        }

        /// <summary>
        /// Get dashboard message (matches legacy controller exactly)
        /// </summary>
        /// <param name="chapterID">Chapter ID request</param>
        /// <returns>Dashboard message result</returns>
        [HttpPost]
        [Route("GetDashboardMessage")]
        public object GetDashboardMessage([FromBody] Chapter chapterID)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetDashboardMessage(chapterID);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting dashboard message", error = ex.Message });
            }
        }

        /// <summary>
        /// Get student detail (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentID">Student ID request</param>
        /// <returns>Student detail result</returns>
        [HttpPost]
        [Route("GetStudentDetail")]
        public object GetStudentDetail([FromBody] StudentID studentID)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetStudentDetail(studentID);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting student detail", error = ex.Message });
            }
        }

        /// <summary>
        /// Update student detail (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentDetail">Student detail update</param>
        /// <returns>Update result</returns>
        [HttpPost]
        [Route("UpdateStudentDetail")]
        public object UpdateStudentDetail([FromBody] StudentDetail studentDetail)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.UpdateStudentDetail(studentDetail);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student detail", error = ex.Message });
            }
        }

        /// <summary>
        /// Get report card with additional details (matches legacy controller exactly)
        /// </summary>
        /// <param name="studentlist">Student list dropdown request</param>
        /// <returns>Report card details result</returns>
        [HttpPost]
        [Route("GetReportcard")]
        public object GetReportcard([FromBody] StudentlistDropdown studentlist)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _studentService.GetReportcard(studentlist);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting report card", error = ex.Message });
            }
        }
    }
}
