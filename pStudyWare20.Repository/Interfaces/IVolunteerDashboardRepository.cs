using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for volunteer dashboard data access operations
    /// </summary>
    public interface IVolunteerDashboardRepository
    {
        /// <summary>
        /// Get time tracking list for volunteer dashboard
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>DataTable with time tracking entries</returns>
        Task<DataTable> GetTimeTrackingListAsync(string username);

        /// <summary>
        /// Get time tracking list with date range filter
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="startDate">Start date filter (optional)</param>
        /// <param name="endDate">End date filter (optional)</param>
        /// <returns>DataTable with filtered time tracking entries</returns>
        Task<DataTable> GetTimeTrackingListWithDateRangeAsync(string username, DateTime? startDate = null, DateTime? endDate = null);

        /// <summary>
        /// Get time tracking statistics for volunteer dashboard
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="year">Year filter (optional)</param>
        /// <param name="month">Month filter (optional)</param>
        /// <returns>DataTable with time tracking statistics</returns>
        Task<DataTable> GetTimeTrackingStatsAsync(string username, int? year = null, int? month = null);
    }
}
