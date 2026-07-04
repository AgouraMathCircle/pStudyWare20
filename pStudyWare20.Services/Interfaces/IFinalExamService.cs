using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for final exam business logic operations (matches legacy FinalExam.aspx.cs)
    /// </summary>
    public interface IFinalExamService
    {
        StudentListResponse GetStudentList(StudentListRequest request);

        ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request);

        ScoreValidationResponse ValidateScoreUpdate(ScoreValidationRequest request);

        CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request);

        StudentScoresResponse GetStudentScores(StudentScoresRequest request);

        FinalExamAvailabilityResponse GetExamAvailability(string portalUsername);

        SubmitExamResponse SubmitExam(SubmitExamRequest request);
    }
}
