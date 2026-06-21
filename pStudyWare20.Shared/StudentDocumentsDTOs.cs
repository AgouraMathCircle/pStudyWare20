using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for student document (matches StudentDocuments from legacy system)
    /// </summary>
    public class StudentDocument
    {
        [Display(Name = "Document ID")]
        public int DocumentID { get; set; }

        [Display(Name = "Doc ID")]
        public int DocID { get; set; }

        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Type")]
        public string Type { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        public string DocumentName { get; set; } = string.Empty;

        [Display(Name = "Insert Date")]
        public DateTime InsertDate { get; set; }

        [Display(Name = "Student ID")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Username")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for current session (matches StudentDocuments from legacy system)
    /// </summary>
    public class CurrentSession
    {
        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get student documents request
    /// </summary>
    public class GetStudentDocumentsRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get current session request
    /// </summary>
    public class GetCurrentSessionRequest
    {
        [Display(Name = "Chapter ID")]
        [Required(ErrorMessage = "Chapter ID is required")]
        public string ChapterID { get; set; } = "3";
    }

    /// <summary>
    /// Model for delete document request
    /// </summary>
    public class DeleteDocumentRequest
    {
        [Display(Name = "Document ID")]
        [Required(ErrorMessage = "Document ID is required")]
        public string DocumentID { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        [Required(ErrorMessage = "Document Name is required")]
        public string DocumentName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for upload document request
    /// </summary>
    public class UploadDocumentRequest
    {
        [Display(Name = "Student ID")]
        [Required(ErrorMessage = "Student ID is required")]
        public string StudentID { get; set; } = string.Empty;

        [Display(Name = "Student Name")]
        public string StudentName { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Type")]
        [Required(ErrorMessage = "Type is required")]
        public string Type { get; set; } = string.Empty;

        [Display(Name = "File Name")]
        [Required(ErrorMessage = "File Name is required")]
        public string FileName { get; set; } = string.Empty;

        [Display(Name = "File Content")]
        [Required(ErrorMessage = "File Content is required")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for update message center request
    /// </summary>
    public class UpdateMessageCenterRequest
    {
        [Display(Name = "Send To")]
        [Required(ErrorMessage = "Send To is required")]
        public string SendTo { get; set; } = string.Empty;

        [Display(Name = "Send From")]
        [Required(ErrorMessage = "Send From is required")]
        public string SendFrom { get; set; } = string.Empty;

        [Display(Name = "Subject")]
        [Required(ErrorMessage = "Subject is required")]
        public string Subject { get; set; } = string.Empty;

        [Display(Name = "Message")]
        [Required(ErrorMessage = "Message is required")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Send By")]
        [Required(ErrorMessage = "Send By is required")]
        public string SendBy { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for get schedule lookup request
    /// </summary>
    public class GetScheduleLookupRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for student documents list response
    /// </summary>
    public class StudentDocumentsListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Student Documents")]
        public List<StudentDocument> StudentDocuments { get; set; } = new List<StudentDocument>();
    }


    /// <summary>
    /// Model for schedule lookup response
    /// </summary>
    public class ScheduleLookupResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Sessions")]
        public List<CurrentSession> Sessions { get; set; } = new List<CurrentSession>();
    }

    /// <summary>
    /// Model for document operation response
    /// </summary>
    public class DocumentOperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Student document file payload for view/download endpoints.
    /// </summary>
    public class StudentDocumentFileResponse
    {
        public bool IsSuccess { get; set; }

        public string ErrorMessage { get; set; } = string.Empty;

        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        public string ContentType { get; set; } = "application/pdf";

        public string FileName { get; set; } = string.Empty;

        /// <summary>Absolute path on disk when resolved (for diagnostics/logging).</summary>
        public string FilePath { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for message center operation response
    /// </summary>
    public class MessageCenterOperationResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;
    }
}
