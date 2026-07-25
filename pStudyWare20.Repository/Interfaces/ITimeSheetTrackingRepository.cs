using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for timesheet tracking data access operations
    /// </summary>
    public interface ITimeSheetTrackingRepository
    {
        /// <summary>
        /// Get timesheet tracking list for a user
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>DataTable with timesheet tracking entries</returns>
        Task<DataTable> GetTimeSheetTrackingListAsync(string username);

        /// <summary>
        /// Get timesheet entries for the signed-in member only (ignores admin chapter-wide SP branch).
        /// </summary>
        Task<DataTable> GetMyTimeSheetTrackingListAsync(string username);

        /// <summary>
        /// Get timesheet tracking entry by LogID for editing
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>DataTable with timesheet tracking entry details</returns>
        Task<DataTable> GetTimeSheetTrackingForEditAsync(string username);

        /// <summary>
        /// Delete timesheet tracking entry
        /// </summary>
        /// <param name="logId">Log ID</param>
        /// <returns>DataTable with result</returns>
        Task<DataTable> DeleteTimeSheetTrackingAsync(int logId);

        /// <summary>
        /// Add or update timesheet tracking entry
        /// </summary>
        /// <param name="request">Upsert timesheet tracking request</param>
        /// <returns>DataTable with result</returns>
        Task<DataTable> UpsertTimeSheetTrackingAsync(UpsertTimeSheetTrackingRequest request);
    }
}