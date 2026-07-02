using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Online exam data access (legacy OnlineExam.aspx stored procedures).
    /// </summary>
    public interface IOnlineExamRepository
    {
        Task<string> GetStudentListAsync(StudentListRequest request);
        Task<string> GetExamQuestionsAsync(ExamQuestionsRequest request);
        Task<string> ValidateScoreUpdateAsync(ScoreValidationRequest request);
        Task<string> GetCurrentSessionAsync(CurrentSessionRequest request);
        Task<string> GetStudentScoresAsync(StudentScoresRequest request);
        Task<string> SubmitExamAsync(SubmitExamRequest request);
    }
}
