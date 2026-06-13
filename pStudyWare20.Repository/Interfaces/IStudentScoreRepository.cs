using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for student score data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IStudentScoreRepository
    {
        /// <summary>
        /// Get student list for score update (legacy: BindStudentList with DisplayMode "E").
        /// </summary>
        Task<string> GetStudentListAsync(OnlineExamStudentListRequest request);

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        /// <param name="request">Get student scores request</param>
        /// <returns>Student scores data as JSON string</returns>
        Task<string> GetStudentScoresAsync(GetStudentScoresRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        /// <param name="request">Get current session request</param>
        /// <returns>Current session data as JSON string</returns>
        Task<string> GetCurrentSessionAsync(GetCurrentSessionRequest request);

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        /// <param name="request">Validate score update request</param>
        /// <returns>Score validation data as JSON string</returns>
        Task<string> ValidateScoreUpdateAsync(ValidateScoreUpdateRequest request);

        /// <summary>
        /// Get due date using direct SQL
        /// </summary>
        /// <param name="request">Get due date request</param>
        /// <returns>Due date data as JSON string</returns>
        Task<string> GetDueDateAsync(GetDueDateRequest request);

        /// <summary>
        /// Add student score using stored procedure
        /// </summary>
        /// <param name="request">Add student score request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> AddStudentScoreAsync(AddStudentScoreRequest request);

        /// <summary>
        /// Update student score using stored procedure
        /// </summary>
        /// <param name="request">Update student score request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> UpdateStudentScoreAsync(UpdateStudentScoreRequest request);
    }
}

