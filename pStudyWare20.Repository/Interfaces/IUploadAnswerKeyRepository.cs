using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    public interface IUploadAnswerKeyRepository
    {
        Task<List<ExamMasterQuestion>> GetExamMasterListAsync(string username);
        Task<string> LookupQuestionPaperAsync(
            string classCode,
            string examType,
            string session,
            string semester);
        Task DeleteExamQuestionAsync(string questionId);
        Task InsertExamMasterRowAsync(
            string classCode,
            string session,
            string examType,
            string answerType,
            string createdBy,
            string question,
            string answerKey,
            string points,
            string category);
    }
}
