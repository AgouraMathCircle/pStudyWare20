using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for instructor dashboard business logic
    /// </summary>
    public interface IInstructorDashboardService
    {
        /// <summary>
        /// Get student list for instructor dashboard
        /// </summary>
        /// <param name="request">Instructor student list request</param>
        /// <returns>Instructor student list response</returns>
        Task<InstructorStudentListResponse> GetStudentListAsync(InstructorStudentListRequest request);

        /// <summary>
        /// Get instructor dashboard data (combines multiple data sources)
        /// </summary>
        /// <param name="request">Instructor dashboard data request</param>
        /// <returns>Instructor dashboard data response</returns>
        Task<InstructorDashboardDataResponse> GetDashboardDataAsync(InstructorDashboardDataRequest request);
    }
}
