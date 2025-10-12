using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for special events registration business logic
    /// </summary>
    public interface ISpecialEventsRegistrationService
    {
        /// <summary>
        /// Get special events registration list
        /// </summary>
        /// <param name="request">Special events registration list request</param>
        /// <returns>Special events registration list response</returns>
        Task<SpecialEventsRegistrationListResponse> GetSpecialEventsRegistrationListAsync(SpecialEventsRegistrationListRequest request);

        /// <summary>
        /// Delete special events registration application
        /// </summary>
        /// <param name="request">Delete special events registration request</param>
        /// <returns>Delete special events registration response</returns>
        Task<DeleteSpecialEventsRegistrationResponse> DeleteSpecialEventsRegistrationAsync(DeleteSpecialEventsRegistrationRequest request);

        /// <summary>
        /// Export special events registration data to Excel
        /// </summary>
        /// <param name="request">Export Excel request</param>
        /// <returns>Export Excel response</returns>
        Task<ExportSpecialEventsRegistrationExcelResponse> ExportSpecialEventsRegistrationToExcelAsync(ExportSpecialEventsRegistrationExcelRequest request);

        /// <summary>
        /// Get special events registration dashboard data
        /// </summary>
        /// <param name="request">Dashboard request</param>
        /// <returns>Dashboard response</returns>
        Task<SpecialEventsRegistrationDashboardResponse> GetDashboardDataAsync(SpecialEventsRegistrationDashboardRequest request);

        /// <summary>
        /// Handle special events registration action (Delete)
        /// </summary>
        /// <param name="request">Special events registration action request</param>
        /// <returns>Special events registration action response</returns>
        Task<SpecialEventsRegistrationActionResponse> HandleSpecialEventsRegistrationActionAsync(SpecialEventsRegistrationActionRequest request);
    }
}
