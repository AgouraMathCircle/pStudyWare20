using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// SystemAdmin dashboard business logic (independent of IAdminService).
    /// </summary>
    public interface ISystemAdminService
    {
        Task<SystemAdminStudentListResponse> GetStudentListAsync(SystemAdminStudentListRequest request);

        Task<UserTrackingSummaryResponse> GetUserTrackingSummaryAsync(UserTrackingSummaryRequest request);

        Task<UserTrackingListResponse> GetUserTrackingListAsync(UserTrackingListRequest request);

        Task<DashboardMessageResponse> GetDashboardMessageAsync(DashboardMessageRequest request);

        Task<PublishDocumentResponse> PublishDocumentAsync(PublishDocumentRequest request);

        Task<ExportExcelResponse> ExportStudentListToExcelAsync(ExportExcelRequest request);
    }
}
