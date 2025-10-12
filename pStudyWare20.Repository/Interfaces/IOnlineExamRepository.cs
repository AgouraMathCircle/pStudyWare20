using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for online exam data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IOnlineExamRepository
    {
        /// <summary>
        /// Get student list using stored procedure
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list data as JSON string</returns>
        Task<string> GetStudentListAsync(OnlineExamStudentListRequest request);

        /// <summary>
        /// Get online exam questions using stored procedure
        /// </summary>
        /// <param name="request">Online exam questions request</param>
        /// <returns>Online exam questions data as JSON string</returns>
        Task<string> GetOnlineExamQuestionsAsync(OnlineExamQuestionsRequest request);

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation data as JSON string</returns>
        Task<string> ValidateScoreUpdateAsync(OnlineExamScoreValidationRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        /// <param name="request">Current session request</param>
        /// <returns>Current session data as JSON string</returns>
        Task<string> GetCurrentSessionAsync(OnlineExamCurrentSessionRequest request);

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores data as JSON string</returns>
        Task<string> GetStudentScoresAsync(OnlineExamStudentScoresRequest request);

        /// <summary>
        /// Submit online exam answers using stored procedure
        /// </summary>
        /// <param name="request">Submit online exam request</param>
        /// <returns>Submit online exam result data as JSON string</returns>
        Task<string> SubmitOnlineExamAsync(SubmitOnlineExamRequest request);
    }
}
