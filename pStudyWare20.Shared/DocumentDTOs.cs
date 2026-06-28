using System.ComponentModel.DataAnnotations;

namespace pStudyWare20.Shared
{
    /// <summary>
    /// Model for publishing document (matches PublishDocument from reference)
    /// </summary>
    public class PublishDocument
    {
        [Display(Name = "Document ID")]
        public int docID { get; set; }

        /// <summary>1 = publish (Active=1), 0 = unpublish (Active=0). Defaults to publish for legacy callers.</summary>
        [Display(Name = "Active")]
        public int active { get; set; } = 1;

        /// <summary>Used to resolve table mDocID when legacy grid returns DocumentID=0 for published rows.</summary>
        [Display(Name = "Document Name")]
        public string docName { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string session { get; set; } = string.Empty;

        [Display(Name = "Description")]
        public string description { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for class material (matches ClassMaterial from reference)
    /// </summary>
    public class ClassMaterial
    {
        [Display(Name = "Topic")]
        public string Topic { get; set; } = string.Empty;

        [Display(Name = "Status")]
        public string Status { get; set; } = string.Empty;

        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Document ID")]
        public string DocumentId { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Display(Name = "Posted Date")]
        public DateTime PostedDate { get; set; }

        [Display(Name = "PDF Link")]
        public string pdfLink { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for document repository list request
    /// </summary>
    public class DocumentRepositoryListRequest
    {
        [Display(Name = "Username")]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for document upload request
    /// </summary>
    public class DocumentUploadRequest
    {
        [Display(Name = "Topics")]
        [Required(ErrorMessage = "Topics is required")]
        public string Topics { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        [Required(ErrorMessage = "Document name is required")]
        public string DocName { get; set; } = string.Empty;

        [Display(Name = "Description")]
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Publish")]
        [Required(ErrorMessage = "Publish status is required")]
        public string Publish { get; set; } = string.Empty;

        [Display(Name = "Video URL")]
        public string VideoURL { get; set; } = string.Empty;

        [Display(Name = "Doc Type")]
        public string DocType { get; set; } = "W";

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        [Display(Name = "Content Type")]
        public string ContentType { get; set; } = string.Empty;
    }

    /// <summary>
    /// Upload request for Docs Repository (Word/Excel/PowerPoint) — legacy DocumentsRepository.aspx.
    /// </summary>
    public class DocumentRepositoryUploadRequest
    {
        [Display(Name = "Topics")]
        public string Topics { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        [Required(ErrorMessage = "Document name is required")]
        public string DocName { get; set; } = string.Empty;

        [Display(Name = "Description")]
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Class")]
        [Required(ErrorMessage = "Class is required")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Session")]
        [Required(ErrorMessage = "Session is required")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Publish")]
        public string Publish { get; set; } = "0";

        [Display(Name = "File Content")]
        public byte[] FileContent { get; set; } = Array.Empty<byte>();

        /// <summary>Fallback when JSON sends base64 as a string property.</summary>
        [Display(Name = "File Content Base64")]
        public string? FileContentBase64 { get; set; }
    }

    /// <summary>
    /// Model for document delete request
    /// </summary>
    public class DocumentDeleteRequest
    {
        [Display(Name = "Document ID")]
        [Required(ErrorMessage = "Document ID is required")]
        public string DocID { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        [Required(ErrorMessage = "Document name is required")]
        public string DocName { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for document repository item
    /// </summary>
    public class DocumentRepositoryItem
    {
        [Display(Name = "Document ID")]
        public int DocID { get; set; }

        /// <summary>
        /// Real table key (mDocID) for AMC_spDeleteDocuments / AMC_spPublishDocuments.
        /// Display row number is <see cref="DocID"/> (row number from AMC_spDocuments).
        /// </summary>
        [Display(Name = "Repository Document ID")]
        public int DocumentID { get; set; }

        [Display(Name = "Topics")]
        public string Topics { get; set; } = string.Empty;

        [Display(Name = "Document Name")]
        public string DocName { get; set; } = string.Empty;

        [Display(Name = "Description")]
        public string Description { get; set; } = string.Empty;

        [Display(Name = "Class")]
        public string Class { get; set; } = string.Empty;

        [Display(Name = "Session")]
        public string Session { get; set; } = string.Empty;

        [Display(Name = "Publish")]
        public string Publish { get; set; } = string.Empty;

        [Display(Name = "Video URL")]
        public string VideoURL { get; set; } = string.Empty;

        [Display(Name = "Doc Type")]
        public string DocType { get; set; } = string.Empty;

        [Display(Name = "Uploaded Date")]
        public DateTime UploadedDate { get; set; }

        [Display(Name = "Uploaded By")]
        public string UploadedBy { get; set; } = string.Empty;

        [Display(Name = "File Path")]
        public string FilePath { get; set; } = string.Empty;

        [Display(Name = "File Size")]
        public long FileSize { get; set; }
    }

    /// <summary>
    /// Model for document repository list response
    /// </summary>
    public class DocumentRepositoryListResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Documents")]
        public List<DocumentRepositoryItem> Documents { get; set; } = new List<DocumentRepositoryItem>();
    }

    /// <summary>
    /// Model for document upload response
    /// </summary>
    public class DocumentUploadResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;

        [Display(Name = "Document ID")]
        public int DocumentId { get; set; }

        [Display(Name = "File Path")]
        public string FilePath { get; set; } = string.Empty;
    }

    /// <summary>
    /// Model for document delete response
    /// </summary>
    public class DocumentDeleteResponse
    {
        [Display(Name = "Is Success")]
        public bool IsSuccess { get; set; }

        [Display(Name = "Message")]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Error Message")]
        public string ErrorMessage { get; set; } = string.Empty;
    }
}
