using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for timesheet tracking business logic
    /// </summary>
    public interface ITimeSheetTrackingService
    {
        /// <summary>
        /// Get timesheet tracking list for a user
        /// </summary>
        /// <param name="request">Timesheet tracking list request</param>
        /// <returns>Timesheet tracking list response</returns>
        Task<TimeSheetTrackingListResponse> GetTimeSheetTrackingListAsync(TimeSheetTrackingListRequest request);

        /// <summary>
        /// Get only the signed-in member's own timesheet entries (admin self-service).
        /// </summary>
        Task<TimeSheetTrackingListResponse> GetMyTimeSheetTrackingListAsync(TimeSheetTrackingListRequest request);

        /// <summary>
        /// Update timesheet tracking entry (get data for editing)
        /// </summary>
        /// <param name="request">Update timesheet tracking request</param>
        /// <returns>Update timesheet tracking response</returns>
        Task<UpdateTimeSheetTrackingResponse> UpdateTimeSheetTrackingAsync(UpdateTimeSheetTrackingRequest request);

        /// <summary>
        /// Load one own entry for edit (admin self-service).
        /// </summary>
        Task<UpdateTimeSheetTrackingResponse> GetMyTimeSheetTrackingForEditAsync(UpdateTimeSheetTrackingRequest request);

        /// <summary>
        /// Delete timesheet tracking entry
        /// </summary>
        /// <param name="request">Delete timesheet tracking request</param>
        /// <returns>Delete timesheet tracking response</returns>
        Task<DeleteTimeSheetTrackingResponse> DeleteTimeSheetTrackingAsync(DeleteTimeSheetTrackingRequest request);

        /// <summary>
        /// Add or update timesheet tracking entry
        /// </summary>
        /// <param name="request">Upsert timesheet tracking request</param>
        /// <returns>Upsert timesheet tracking response</returns>
        Task<UpsertTimeSheetTrackingResponse> UpsertTimeSheetTrackingAsync(UpsertTimeSheetTrackingRequest request);

        /// <summary>
        /// Get timesheet tracking dashboard data
        /// </summary>
        /// <param name="request">Timesheet tracking dashboard request</param>
        /// <returns>Timesheet tracking dashboard response</returns>
        Task<TimeSheetTrackingDashboardResponse> GetDashboardDataAsync(TimeSheetTrackingDashboardRequest request);

        /// <summary>
        /// Handle timesheet tracking action (Edit/Delete)
        /// </summary>
        /// <param name="request">Timesheet tracking action request</param>
        /// <returns>Timesheet tracking action response</returns>
        Task<TimeSheetTrackingActionResponse> HandleTimeSheetTrackingActionAsync(TimeSheetTrackingActionRequest request);

        /// <summary>
        /// Check if user has timesheet tracking privileges
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Timesheet tracking privileges response</returns>
        Task<TimeSheetTrackingPrivilegesResponse> CheckTimeSheetTrackingPrivilegesAsync(string username);
    }
}
