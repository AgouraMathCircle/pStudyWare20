using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    public class ExamMasterQuestion
    {
        public int QuestionID { get; set; }
        public string Class { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public string Question { get; set; } = string.Empty;
        public string AnswerKey { get; set; } = string.Empty;
        public int Points { get; set; }
        public string Session { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string QuestionPaper { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
    }

    public class GetExamMasterListRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;
    }

    public class DeleteExamQuestionRequest
    {
        [Required]
        public string QuestionID { get; set; } = string.Empty;
    }

    public class UploadAnswerKeyRequest
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Class { get; set; } = string.Empty;

        [Required]
        public string Session { get; set; } = string.Empty;

        [Required]
        public string ExamType { get; set; } = string.Empty;

        [Required]
        public string AnswerType { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        public string FileName { get; set; } = string.Empty;

        public string ChapterID { get; set; } = string.Empty;
    }

    public class ExamMasterListResponse
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public bool CanUpload { get; set; }
        public List<ExamMasterQuestion> Questions { get; set; } = new();
    }

    public class ExamMasterOperationResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public int RowsImported { get; set; }
    }
}
