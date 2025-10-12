using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for admin dashboard data access operations
    /// </summary>
    public interface IAdminRepository
    {
        /// <summary>
        /// Get student list for admin dashboard
        /// </summary>
        /// <param name="username">Admin username</param>
        /// <param name="mode">Mode parameter (D for dashboard)</param>
        /// <returns>Student list data</returns>
        Task<object> GetStudentListAsync(string username, string mode);

        /// <summary>
        /// Get user tracking summary for admin dashboard
        /// </summary>
        /// <returns>User tracking summary data</returns>
        Task<object> GetUserTrackingSummaryAsync();

        /// <summary>
        /// Get dashboard message with student counts
        /// </summary>
        /// <param name="mode">Mode parameter (A for admin)</param>
        /// <param name="username">Admin username</param>
        /// <returns>Dashboard message data with student counts</returns>
        Task<object> GetDashboardMessageAsync(string mode, string username);

        /// <summary>
        /// Send email notification to student group
        /// </summary>
        /// <param name="adminEmail">Admin email address</param>
        /// <param name="studentEmailGroup">Student email group</param>
        /// <param name="subject">Email subject</param>
        /// <param name="body">Email body</param>
        /// <returns>Email send result</returns>
        Task<bool> SendEmailNotificationAsync(string adminEmail, string studentEmailGroup, string subject, string body);

        /// <summary>
        /// Get student list for Excel export
        /// </summary>
        /// <param name="username">Admin username</param>
        /// <param name="mode">Mode parameter (D for dashboard)</param>
        /// <returns>Student list data for Excel export</returns>
        Task<object> GetStudentListForExportAsync(string username, string mode);
    }
}
