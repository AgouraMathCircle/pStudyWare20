using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for final exam data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IFinalExamRepository
    {
        /// <summary>
        /// Get student list using stored procedure
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list data as JSON string</returns>
        Task<string> GetStudentListAsync(StudentListRequest request);

        /// <summary>
        /// Get exam questions using stored procedure
        /// </summary>
        /// <param name="request">Exam questions request</param>
        /// <returns>Exam questions data as JSON string</returns>
        Task<string> GetExamQuestionsAsync(ExamQuestionsRequest request);

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation data as JSON string</returns>
        Task<string> ValidateScoreUpdateAsync(ScoreValidationRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        /// <param name="request">Current session request</param>
        /// <returns>Current session data as JSON string</returns>
        Task<string> GetCurrentSessionAsync(CurrentSessionRequest request);

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores data as JSON string</returns>
        Task<string> GetStudentScoresAsync(StudentScoresRequest request);

        /// <summary>
        /// Submit exam answers using stored procedure
        /// </summary>
        /// <param name="request">Submit exam request</param>
        /// <returns>Submit exam result data as JSON string</returns>
        Task<string> SubmitExamAsync(SubmitExamRequest request);
    }
}
