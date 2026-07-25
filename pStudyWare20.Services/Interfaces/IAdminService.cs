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
        /// Get user tracking list (legacy UserTracking.aspx).
        /// </summary>
        Task<UserTrackingListResponse> GetUserTrackingListAsync(UserTrackingListRequest request);

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

        /// <summary>
        /// Chapter Admin: update volunteer availability for the signed-in admin.
        /// </summary>
        Task<VolunteerAvailabilityResponse> UpdateVolunteerAvailabilityAsync(VolunteerAvailabilityRequest request);

        /// <summary>
        /// Chapter Admin: get volunteer availability for the signed-in admin.
        /// </summary>
        Task<VolunteerAvailabilitySelectResponse> GetVolunteerAvailabilityAsync(VolunteerAvailabilitySelectRequest request);

        /// <summary>
        /// Chapter Admin: form context (target session + prompt) for volunteer availability entry.
        /// </summary>
        Task<VolunteerAvailabilityFormContextResponse> GetVolunteerAvailabilityFormContextAsync(string chapterId);

        /// <summary>
        /// Chapter Admin: volunteers availability list for upcoming class (authorized chapters).
        /// </summary>
        Task<VolunteerAvailabilitySummaryResponse> GetVolunteerAvailabilitySummaryAsync(VolunteerAvailabilitySummaryRequest request);
    }
}
