using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    public interface IUploadAnswerKeyService
    {
        Task<ExamMasterListResponse> GetExamMasterListAsync(GetExamMasterListRequest request, string? chapterId);
        Task<ExamMasterOperationResponse> DeleteExamQuestionAsync(DeleteExamQuestionRequest request);
        Task<ExamMasterOperationResponse> UploadAnswerKeyAsync(UploadAnswerKeyRequest request);
        byte[] GetExcelTemplateBytes();
    }
}
