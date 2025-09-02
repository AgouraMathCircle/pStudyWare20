using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableCors("AllowReactApp")]
    public class TimesheetController : ControllerBase
    {
        private readonly ITimesheetService _timesheetService;

        public TimesheetController(ITimesheetService timesheetService)
        {
            _timesheetService = timesheetService;
        }

        /// <summary>
        /// Remove timesheet entry (matches legacy controller exactly)
        /// </summary>
        /// <param name="timeSheetID">Timesheet ID request</param>
        /// <returns>Remove result</returns>
        [HttpPost]
        [Route("TimeSheetEntryRemove")]
        public object TimeSheetEntryRemove([FromBody] TimeSheetID timeSheetID)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _timesheetService.TimeSheetEntryRemove(timeSheetID);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while removing timesheet entry", error = ex.Message });
            }
        }

        /// <summary>
        /// Get timesheet list (matches legacy controller exactly)
        /// </summary>
        /// <param name="username">Username request</param>
        /// <returns>Timesheet list result</returns>
        [HttpPost]
        [Route("GetTimesheetList")]
        public object GetTimesheetList([FromBody] UserName username)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _timesheetService.GetTimesheetList(username);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while getting timesheet list", error = ex.Message });
            }
        }

        /// <summary>
        /// Add timesheet entry (matches legacy controller exactly)
        /// </summary>
        /// <param name="timeSheetEntry">Timesheet entry details</param>
        /// <returns>Add result</returns>
        [HttpPost]
        [Route("TimeSheetEntry")]
        public object TimeSheetEntry([FromBody] TimeSheetEntry timeSheetEntry)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid request data", errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage)) });
                }

                var response = _timesheetService.TimeSheetEntry(timeSheetEntry);
                return response;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding timesheet entry", error = ex.Message });
            }
        }
    }
}
