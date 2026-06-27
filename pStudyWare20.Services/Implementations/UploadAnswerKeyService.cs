using pStudyWare20.Repository.Interfaces;
using pStudyWare20.Services.Interfaces;
using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Services.Implementations
{
    public class UploadAnswerKeyService : IUploadAnswerKeyService
    {
        private readonly IUploadAnswerKeyRepository _repository;

        public UploadAnswerKeyService(IUploadAnswerKeyRepository repository)
        {
            _repository = repository;
        }

        private static bool CanUpload(string? chapterId) =>
            string.Equals(chapterId?.Trim(), "1", StringComparison.Ordinal);

        public async Task<ExamMasterListResponse> GetExamMasterListAsync(
            GetExamMasterListRequest request,
            string? chapterId)
        {
            var response = new ExamMasterListResponse();
            try
            {
                var questions = await _repository.GetExamMasterListAsync(request.Username);
                await EnrichQuestionPapersAsync(questions);
                response.Questions = questions;
                response.CanUpload = CanUpload(chapterId);
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public async Task<ExamMasterOperationResponse> DeleteExamQuestionAsync(DeleteExamQuestionRequest request)
        {
            var response = new ExamMasterOperationResponse();
            try
            {
                if (string.IsNullOrWhiteSpace(request.QuestionID))
                    throw new InvalidOperationException("Question ID is required.");

                await _repository.DeleteExamQuestionAsync(request.QuestionID);
                response.IsSuccess = true;
                response.Message = "Question has been deleted successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public async Task<ExamMasterOperationResponse> UploadAnswerKeyAsync(UploadAnswerKeyRequest request)
        {
            var response = new ExamMasterOperationResponse();
            try
            {
                if (!CanUpload(request.ChapterID))
                    throw new InvalidOperationException("You do not have permission to upload answer keys.");

                if (string.IsNullOrWhiteSpace(request.Class))
                    throw new InvalidOperationException("Class is required.");
                if (string.IsNullOrWhiteSpace(request.Session))
                    throw new InvalidOperationException("Session is required.");
                if (string.IsNullOrWhiteSpace(request.ExamType))
                    throw new InvalidOperationException("Description is required.");
                if (string.IsNullOrWhiteSpace(request.AnswerType))
                    throw new InvalidOperationException("Answer Type is required.");

                var dataTable = UploadAnswerKeyImportParser.Parse(request.FileContent, request.FileName);
                var createdBy = string.IsNullOrWhiteSpace(request.CreatedBy)
                    ? request.Username
                    : request.CreatedBy;
                var imported = 0;

                foreach (DataRow row in dataTable.Rows)
                {
                    var question = UploadAnswerKeyImportParser.GetCellValue(row, "Question");
                    if (string.IsNullOrWhiteSpace(question))
                        continue;

                    await _repository.InsertExamMasterRowAsync(
                        request.Class,
                        request.Session,
                        request.ExamType,
                        request.AnswerType,
                        createdBy,
                        question,
                        UploadAnswerKeyImportParser.GetCellValue(row, "AnswerKey"),
                        UploadAnswerKeyImportParser.GetCellValue(row, "Points"),
                        UploadAnswerKeyImportParser.GetCellValue(row, "Category"));
                    imported++;
                }

                if (imported == 0)
                    throw new InvalidOperationException("No valid question rows were found in the uploaded file.");

                response.IsSuccess = true;
                response.RowsImported = imported;
                response.Message = "You have uploaded the Answer Key successfully.";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessage = ex.Message;
            }

            return response;
        }

        public byte[] GetExcelTemplateBytes() => UploadAnswerKeyTemplateExporter.CreateTemplateBytes();

        /// <summary>
        /// Legacy UploadAnswerkey.aspx maps QuestionPaper from AMC_tblDocuments via
        /// Class + ExamType + Session + Semester (not per QuestionID).
        /// </summary>
        private async Task EnrichQuestionPapersAsync(List<ExamMasterQuestion> questions)
        {
            var cache = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var group in questions.GroupBy(q => new
            {
                q.Class,
                q.ExamType,
                q.Session,
                q.Semester,
            }))
            {
                var key = $"{group.Key.Class}|{group.Key.ExamType}|{group.Key.Session}|{group.Key.Semester}";
                if (!cache.TryGetValue(key, out var resolvedPaper))
                {
                    var existingPaper = group
                        .Select(q => q.QuestionPaper?.Trim())
                        .FirstOrDefault(name => !string.IsNullOrWhiteSpace(name));

                    resolvedPaper = !string.IsNullOrWhiteSpace(existingPaper)
                        ? existingPaper!
                        : await _repository.LookupQuestionPaperAsync(
                            group.Key.Class,
                            group.Key.ExamType,
                            group.Key.Session,
                            group.Key.Semester);

                    cache[key] = resolvedPaper ?? string.Empty;
                }

                foreach (var question in group)
                {
                    question.QuestionPaper = resolvedPaper;
                }
            }
        }
    }
}
