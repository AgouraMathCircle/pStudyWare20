using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Student score business logic — mirrors legacy StudentScore.aspx.cs.
    /// </summary>
    public interface IStudentScoreService
    {
        OnlineExamStudentListResponse GetStudentList(OnlineExamStudentListRequest request);
        CurrentSessionResponse GetCurrentSession(GetCurrentSessionRequest request);
        ScoreValidationResponse ValidateScoreUpdate(ValidateScoreUpdateRequest request);
        DueDateResponse GetDueDate(GetDueDateRequest request);
        StudentScoresListResponse GetStudentScores(GetStudentScoresRequest request);
        ScoreOperationResponse AddStudentScore(AddStudentScoreRequest request);
        ScoreOperationResponse UpdateStudentScore(UpdateStudentScoreRequest request);
    }
}
