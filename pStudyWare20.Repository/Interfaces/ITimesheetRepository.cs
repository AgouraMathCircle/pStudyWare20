using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for timesheet data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface ITimesheetRepository
    {
        /// <summary>
        /// Remove timesheet entry using stored procedure
        /// </summary>
        /// <param name="request">Timesheet ID request</param>
        /// <returns>Remove result data as JSON string</returns>
        Task<string> TimeSheetEntryRemoveAsync(TimeSheetID request);

        /// <summary>
        /// Get timesheet list using stored procedure
        /// </summary>
        /// <param name="request">Username request</param>
        /// <returns>Timesheet list data as JSON string</returns>
        Task<string> GetTimesheetListAsync(UserName request);

        /// <summary>
        /// Add timesheet entry using stored procedure
        /// </summary>
        /// <param name="request">Timesheet entry details</param>
        /// <returns>Success status</returns>
        Task<bool> TimeSheetEntryAsync(TimeSheetEntry request);
    }
}
