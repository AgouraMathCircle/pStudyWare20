using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorService _instructorService;

        public InstructorController(IInstructorService instructorService)
        {
            _instructorService = instructorService;
        }

        /// <summary>
        /// Get instructor list (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Instructor list result</returns>
        [HttpPost]
        [Route("GetInstructorList")]
        public object GetInstructorList([FromBody] InstructorListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _instructorService.GetInstructorList(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting instructor list", error = ex.Message });
            }
        }

        /// <summary>
        /// Add or update instructor (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Instructor request</param>
        /// <returns>Operation result</returns>
        [HttpPost]
        [Route("AddOrUpdateInstructor")]
        public object AddOrUpdateInstructor([FromBody] InstructorRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _instructorService.AddOrUpdateInstructor(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding or updating instructor", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete instructor (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Instructor delete request</param>
        /// <returns>Operation result</returns>
        [HttpPost]
        [Route("DeleteInstructor")]
        public object DeleteInstructor([FromBody] InstructorDeleteRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _instructorService.DeleteInstructor(request);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting instructor", error = ex.Message });
            }
        }

        /// <summary>
        /// Export instructor list to Excel (matches legacy controller exactly)
        /// </summary>
        /// <param name="request">Instructor list request</param>
        /// <returns>Excel file</returns>
        [HttpPost]
        [Route("ExportInstructorListToExcel")]
        public IActionResult ExportInstructorListToExcel([FromBody] InstructorListRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _instructorService.ExportInstructorListToExcel(request);
                
                if (response.IsSuccess)
                {
                    return File(response.FileContent, response.ContentType, response.FileName);
                }
                else
                {
                    return BadRequest(new { message = response.ErrorMessage });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while exporting instructor list", error = ex.Message });
            }
        }
    }
}
