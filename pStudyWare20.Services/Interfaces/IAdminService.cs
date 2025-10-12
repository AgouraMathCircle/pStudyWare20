using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for admin dashboard business logic
    /// </summary>
    public interface IAdminService
    {
        /// <summary>
        /// Get student list for admin dashboard
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list response</returns>
        Task<AdminStudentListResponse> GetStudentListAsync(AdminStudentListRequest request);

        /// <summary>
        /// Get user tracking summary for admin dashboard
        /// </summary>
        /// <param name="request">User tracking summary request</param>
        /// <returns>User tracking summary response</returns>
        Task<UserTrackingSummaryResponse> GetUserTrackingSummaryAsync(UserTrackingSummaryRequest request);

        /// <summary>
        /// Get dashboard message with student counts
        /// </summary>
        /// <param name="request">Dashboard message request</param>
        /// <returns>Dashboard message response</returns>
        Task<DashboardMessageResponse> GetDashboardMessageAsync(DashboardMessageRequest request);

        /// <summary>
        /// Publish documents and send email notification
        /// </summary>
        /// <param name="request">Publish document request</param>
        /// <returns>Publish document response</returns>
        Task<PublishDocumentResponse> PublishDocumentAsync(PublishDocumentRequest request);

        /// <summary>
        /// Export student list to Excel
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Export Excel response</returns>
        Task<ExportExcelResponse> ExportStudentListToExcelAsync(ExportExcelRequest request);
    }
}
