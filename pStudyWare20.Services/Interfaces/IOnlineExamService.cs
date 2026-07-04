using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for online exam business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IOnlineExamService
    {
        /// <summary>
        /// Get student list
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list result</returns>
        OnlineExamStudentListResponse GetStudentList(OnlineExamStudentListRequest request);

        /// <summary>
        /// Get online exam questions
        /// </summary>
        /// <param name="request">Online exam questions request</param>
        /// <returns>Online exam questions result</returns>
        OnlineExamQuestionsResponse GetOnlineExamQuestions(OnlineExamQuestionsRequest request);

        /// <summary>
        /// Validate score update
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation result</returns>
        OnlineExamScoreValidationResponse ValidateScoreUpdate(OnlineExamScoreValidationRequest request);

        /// <summary>
        /// Get current session
        /// </summary>
        /// <param name="request">Current session request</param>
        /// <returns>Current session result</returns>
        OnlineExamCurrentSessionResponse GetCurrentSession(OnlineExamCurrentSessionRequest request);

        /// <summary>
        /// Get student scores
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores result</returns>
        OnlineExamStudentScoresResponse GetStudentScores(OnlineExamStudentScoresRequest request);

        /// <summary>
        /// Submit online exam
        /// </summary>
        /// <param name="request">Submit online exam request</param>
        /// <returns>Submit online exam result</returns>
        SubmitOnlineExamResponse SubmitOnlineExam(SubmitOnlineExamRequest request);
    }
}
