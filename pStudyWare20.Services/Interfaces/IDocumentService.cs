using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for document business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IDocumentService
    {
        /// <summary>
        /// Get class materials (legacy: student class material list; SP AMC_spGetClassMaterials).
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Class materials result</returns>
        Task<ResponseDetails> GetClassMaterialsAsync(UserName userName);

        /// <summary>
        /// Publish document (legacy Documents.aspx Action=P; SP AMC_spPublishDocuments).
        /// </summary>
        /// <param name="publishDocument">Document publish request</param>
        /// <returns>Publish result</returns>
        Task<ResponseDetails> PublishDocumentAsync(PublishDocument publishDocument);

        /// <summary>
        /// Get documents repository list
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository list result</returns>
        Task<DocumentRepositoryListResponse> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request);

        /// <summary>
        /// Get documents repository (using AMC_spDocumentsRepository)
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository list result</returns>
        Task<DocumentRepositoryListResponse> GetDocumentsRepositoryAsync(DocumentRepositoryListRequest request);

        /// <summary>
        /// Upload document to repository
        /// </summary>
        /// <param name="request">Document upload request</param>
        /// <returns>Document upload result</returns>
        Task<DocumentUploadResponse> UploadDocumentAsync(DocumentUploadRequest request);

        /// <summary>
        /// Delete document from repository
        /// </summary>
        /// <param name="request">Document delete request</param>
        /// <returns>Document delete result</returns>
        Task<DocumentDeleteResponse> DeleteDocumentAsync(DocumentDeleteRequest request);

        // Student Documents methods
        /// <summary>
        /// Get student documents
        /// </summary>
        /// <param name="request">Get student documents request</param>
        /// <returns>Student documents list response</returns>
        Task<StudentDocumentsListResponse> GetStudentDocumentsAsync(GetStudentDocumentsRequest request);

        /// <summary>
        /// Add student document
        /// </summary>
        /// <param name="request">Upload document request</param>
        /// <returns>Document operation response</returns>
        Task<DocumentOperationResponse> AddStudentDocumentAsync(UploadDocumentRequest request);

        /// <summary>
        /// Delete student document
        /// </summary>
        /// <param name="request">Delete document request</param>
        /// <returns>Document operation response</returns>
        Task<DocumentOperationResponse> DeleteStudentDocumentAsync(DeleteDocumentRequest request);

        /// <summary>
        /// Get current session
        /// </summary>
        /// <param name="request">Get current session request</param>
        /// <returns>Schedule lookup response</returns>
        Task<ScheduleLookupResponse> GetCurrentSessionAsync(GetCurrentSessionRequest request);

        /// <summary>
        /// Get schedule lookup
        /// </summary>
        /// <param name="request">Get schedule lookup request</param>
        /// <returns>Schedule lookup response</returns>
        Task<ScheduleLookupResponse> GetScheduleLookupAsync(GetScheduleLookupRequest request);

        /// <summary>
        /// Update message center
        /// </summary>
        /// <param name="request">Update message center request</param>
        /// <returns>Message center operation response</returns>
        Task<MessageCenterOperationResponse> UpdateMessageCenterAsync(UpdateMessageCenterRequest request);
    }
}
