using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for final exam business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IFinalExamService
    {
        /// <summary>
        /// Get student list
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Student list result</returns>
        StudentListResponse GetStudentList(StudentListRequest request);

        /// <summary>
        /// Get exam questions
        /// </summary>
        /// <param name="request">Exam questions request</param>
        /// <returns>Exam questions result</returns>
        ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request);

        /// <summary>
        /// Validate score update
        /// </summary>
        /// <param name="request">Score validation request</param>
        /// <returns>Score validation result</returns>
        ScoreValidationResponse ValidateScoreUpdate(ScoreValidationRequest request);

        /// <summary>
        /// Get current session
        /// </summary>
        /// <param name="request">Current session request</param>
        /// <returns>Current session result</returns>
        CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request);

        /// <summary>
        /// Get student scores
        /// </summary>
        /// <param name="request">Student scores request</param>
        /// <returns>Student scores result</returns>
        StudentScoresResponse GetStudentScores(StudentScoresRequest request);

        /// <summary>
        /// Submit exam
        /// </summary>
        /// <param name="request">Submit exam request</param>
        /// <returns>Submit exam result</returns>
        SubmitExamResponse SubmitExam(SubmitExamRequest request);
    }
}
