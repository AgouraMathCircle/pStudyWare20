using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for timesheet business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface ITimesheetService
    {
        /// <summary>
        /// Remove timesheet entry
        /// </summary>
        /// <param name="timeSheetID">Timesheet ID request</param>
        /// <returns>Remove result</returns>
        ResponseDetails TimeSheetEntryRemove(TimeSheetID timeSheetID);

        /// <summary>
        /// Get timesheet list
        /// </summary>
        /// <param name="username">Username request</param>
        /// <returns>Timesheet list result</returns>
        ResponseDetails GetTimesheetList(UserName username);

        /// <summary>
        /// Add timesheet entry
        /// </summary>
        /// <param name="timeSheetEntry">Timesheet entry details</param>
        /// <returns>Add result</returns>
        ResponseDetails TimeSheetEntry(TimeSheetEntry timeSheetEntry);
    }
}
