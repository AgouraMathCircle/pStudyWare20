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
    }
}
