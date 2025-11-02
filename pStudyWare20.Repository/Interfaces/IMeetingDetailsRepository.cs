using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for meeting details data access operations
    /// </summary>
    public interface IMeetingDetailsRepository
    {
        /// <summary>
        /// Get meeting schedule list
        /// </summary>
        /// <param name="rowId">Row ID ("0" for all records)</param>
        /// <returns>Meeting schedule data</returns>
        Task<object> GetMeetingScheduleListAsync(string rowId);

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
