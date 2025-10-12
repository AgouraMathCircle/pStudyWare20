using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for instructor dashboard data access operations
    /// </summary>
    public interface IInstructorDashboardRepository
    {
        /// <summary>
        /// Get student list for instructor dashboard
        /// </summary>
        /// <param name="username">Instructor username</param>
        /// <returns>Student list data</returns>
        Task<object> GetStudentListForInstructorAsync(string username);
    }
}
