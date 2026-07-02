using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Online exam business logic (legacy OnlineExam.aspx / FinalExam.aspx).
    /// </summary>
    public interface IOnlineExamService
    {
        StudentListResponse GetStudentList(StudentListRequest request);
        ExamQuestionsResponse GetExamQuestions(ExamQuestionsRequest request);
        ScoreValidationResponse ValidateScoreUpdate(ScoreValidationRequest request);
        CurrentSessionResponse GetCurrentSession(CurrentSessionRequest request);
        StudentScoresResponse GetStudentScores(StudentScoresRequest request);
        SubmitExamResponse SubmitExam(SubmitExamRequest request);
    }
}
