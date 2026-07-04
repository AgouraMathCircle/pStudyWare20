using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for final exam data access operations (matches legacy FinalExam.aspx.cs)
    /// </summary>
    public interface IFinalExamRepository
    {
        /// <summary>
        /// Get student list using stored procedure
        /// </summary>
        Task<string> GetStudentListAsync(StudentListRequest request);

        /// <summary>
        /// Get exam questions using stored procedure
        /// </summary>
        Task<string> GetExamQuestionsAsync(ExamQuestionsRequest request);

        /// <summary>
        /// Validate score update using stored procedure
        /// </summary>
        Task<string> ValidateScoreUpdateAsync(ScoreValidationRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        Task<string> GetCurrentSessionAsync(CurrentSessionRequest request);

        /// <summary>
        /// Get student scores using stored procedure
        /// </summary>
        Task<string> GetStudentScoresAsync(StudentScoresRequest request);

        /// <summary>
        /// Submit final exam answers using stored procedure
        /// </summary>
        Task<string> SubmitExamAsync(SubmitExamRequest request);
    }
}
