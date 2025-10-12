using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for volunteer dashboard business logic
    /// </summary>
    public interface IVolunteerDashboardService
    {
        /// <summary>
        /// Get volunteer dashboard data (matches BindGridView method)
        /// </summary>
        /// <param name="request">Volunteer dashboard request</param>
        /// <returns>Volunteer dashboard response</returns>
        Task<VolunteerDashboardResponse> GetVolunteerDashboardDataAsync(VolunteerDashboardRequest request);

        /// <summary>
        /// Get volunteer dashboard summary with statistics
        /// </summary>
        /// <param name="request">Volunteer dashboard summary request</param>
        /// <returns>Volunteer dashboard summary response</returns>
        Task<VolunteerDashboardSummaryResponse> GetVolunteerDashboardSummaryAsync(VolunteerDashboardSummaryRequest request);

        /// <summary>
        /// Get volunteer dashboard statistics
        /// </summary>
        /// <param name="request">Volunteer dashboard stats request</param>
        /// <returns>Volunteer dashboard stats response</returns>
        Task<VolunteerDashboardStatsResponse> GetVolunteerDashboardStatsAsync(VolunteerDashboardStatsRequest request);

        /// <summary>
        /// Check if user has volunteer dashboard privileges
        /// </summary>
        /// <param name="request">Volunteer dashboard privileges request</param>
        /// <returns>Volunteer dashboard privileges response</returns>
        Task<VolunteerDashboardPrivilegesResponse> CheckVolunteerDashboardPrivilegesAsync(VolunteerDashboardPrivilegesRequest request);

        /// <summary>
        /// Get time tracking entries for volunteer dashboard
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>List of time tracking entries</returns>
        Task<List<VolunteerTimeTrackingEntry>> GetTimeTrackingEntriesAsync(string username);
    }
}
