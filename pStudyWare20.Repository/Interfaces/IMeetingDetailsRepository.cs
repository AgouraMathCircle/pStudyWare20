using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for meeting details data access operations
    /// </summary>
    public interface IMeetingDetailsRepository
    {
        /// <summary>
        /// Get meeting schedule list (all records via AMC_tblMeetingSchedule_Select)
        /// </summary>
        /// <param name="rowId">Row ID ("0" for all records)</param>
        /// <returns>Meeting schedule data</returns>
        Task<object> GetMeetingScheduleListAsync(string rowId);

        /// <summary>
        /// Get meeting schedule list for a specific user (student/instructor/volunteer) via AMC_spMeetingSchedule_Select.
        /// Matches legacy pStudyware_DashboardMessage.ascx.cs BingMeetingSchedule().
        /// </summary>
        /// <param name="username">User name (e.g. student email)</param>
        /// <returns>Meeting schedule data filtered for that user</returns>
        Task<object> GetMeetingScheduleListByUserAsync(string username);

        /// <summary>
        /// Get specific meeting schedule by Row ID
        /// </summary>
        /// <param name="rowId">Row ID</param>
        /// <returns>Meeting schedule data</returns>
        Task<object> GetMeetingScheduleByIdAsync(string rowId);

        /// <summary>
        /// Insert or update meeting schedule
        /// </summary>
        /// <param name="meetingSchedule">Meeting schedule data</param>
        /// <returns>Operation result</returns>
        Task<object> UpsertMeetingScheduleAsync(MeetingSchedule meetingSchedule);

        /// <summary>
        /// Get chapter locations
        /// </summary>
        /// <param name="activeOnly">Active only flag (Y/N)</param>
        /// <returns>Chapter locations data</returns>
        Task<object> GetChapterLocationsAsync(string activeOnly);
    }
}
