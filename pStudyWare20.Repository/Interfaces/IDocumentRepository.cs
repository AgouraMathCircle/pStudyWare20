using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for document data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IDocumentRepository
    {
        /// <summary>
        /// Get class materials using stored procedure
        /// </summary>
        /// <param name="request">Username request</param>
        /// <returns>Class materials data as JSON string</returns>
        Task<string> GetClassMaterialsAsync(UserName request);

        /// <summary>
        /// Publish document using stored procedure
        /// </summary>
        /// <param name="request">Document publish request</param>
        /// <returns>Publish result data as JSON string</returns>
        Task<string> PublishDocumentAsync(PublishDocument request);

        /// <summary>
        /// Get documents repository list using stored procedure
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository list data as JSON string</returns>
        Task<string> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request);

        /// <summary>
        /// Get documents repository using stored procedure AMC_spDocumentsRepository
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository data as JSON string</returns>
        Task<string> GetDocumentsRepositoryAsync(DocumentRepositoryListRequest request);

        /// <summary>
        /// Add document to repository using stored procedure
        /// </summary>
        /// <param name="request">Document upload request</param>
        /// <returns>Document upload result data as JSON string</returns>
        Task<string> AddDocumentAsync(DocumentUploadRequest request);

        /// <summary>
        /// Delete document from repository using stored procedure
        /// </summary>
        /// <param name="request">Document delete request</param>
        /// <returns>Document delete result data as JSON string</returns>
        Task<string> DeleteDocumentAsync(DocumentDeleteRequest request);

        // Student Documents methods
        /// <summary>
        /// Get student documents using stored procedure
        /// </summary>
        /// <param name="request">Get student documents request</param>
        /// <returns>Student documents data as JSON string</returns>
        Task<string> GetStudentDocumentsAsync(GetStudentDocumentsRequest request);

        /// <summary>
        /// Add student document using stored procedure
        /// </summary>
        /// <param name="request">Upload document request</param>
        /// <returns>Upload result data as JSON string</returns>
        Task<string> AddStudentDocumentAsync(UploadDocumentRequest request);

        /// <summary>
        /// Delete student document using stored procedure
        /// </summary>
        /// <param name="request">Delete document request</param>
        /// <returns>Delete result data as JSON string</returns>
        Task<string> DeleteStudentDocumentAsync(DeleteDocumentRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        /// <param name="request">Get current session request</param>
        /// <returns>Current session data as JSON string</returns>
        Task<string> GetCurrentSessionAsync(GetCurrentSessionRequest request);

        /// <summary>
        /// Get schedule lookup using stored procedure
        /// </summary>
        /// <param name="request">Get schedule lookup request</param>
        /// <returns>Schedule lookup data as JSON string</returns>
        Task<string> GetScheduleLookupAsync(GetScheduleLookupRequest request);

        /// <summary>
        /// Update message center using stored procedure
        /// </summary>
        /// <param name="request">Update message center request</param>
        /// <returns>Update result data as JSON string</returns>
        Task<string> UpdateMessageCenterAsync(UpdateMessageCenterRequest request);
    }
}
