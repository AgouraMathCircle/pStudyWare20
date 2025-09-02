using Microsoft.Extensions.Configuration;
using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;

namespace pStudyWare20.Services.Implementations
{
    /// <summary>
    /// Implementation of timesheet business logic operations (matches legacy controller)
    /// </summary>
    public class TimesheetService : ITimesheetService
    {
        private readonly ITimesheetRepository _timesheetRepository;
        private readonly IConfiguration _configuration;

        public TimesheetService(ITimesheetRepository timesheetRepository, IConfiguration configuration)
        {
            _timesheetRepository = timesheetRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Remove timesheet entry (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails TimeSheetEntryRemove(TimeSheetID timeSheetID)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _timesheetRepository.TimeSheetEntryRemoveAsync(timeSheetID).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Get timesheet list (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails GetTimesheetList(UserName username)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _timesheetRepository.GetTimesheetListAsync(username).Result;

                responseDetails.isSuccess = true;
                responseDetails.ErrorMessage = "";
                responseDetails.Message = result;
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }

        /// <summary>
        /// Add timesheet entry (matches legacy controller exactly)
        /// </summary>
        public ResponseDetails TimeSheetEntry(TimeSheetEntry timeSheetEntry)
        {
            ResponseDetails responseDetails = new ResponseDetails();
            try
            {
                var result = _timesheetRepository.TimeSheetEntryAsync(timeSheetEntry).Result;

                if (result)
                {
                    responseDetails.isSuccess = true;
                    responseDetails.ErrorMessage = "";
                    responseDetails.Message = "Submitted";
                }
                else
                {
                    responseDetails.isSuccess = false;
                    responseDetails.ErrorMessage = "Failed to submit timesheet entry";
                    responseDetails.Message = "";
                }
            }
            catch (Exception ex)
            {
                responseDetails.isSuccess = false;
                responseDetails.ErrorMessage = ex.Message;
                responseDetails.Message = "";
            }

            return responseDetails;
        }
    }
}
