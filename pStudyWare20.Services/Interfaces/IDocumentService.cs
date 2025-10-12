using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for document business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IDocumentService
    {
        /// <summary>
        /// Get class materials
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Class materials result</returns>
        ResponseDetails GetClassMaterials(UserName userName);

        /// <summary>
        /// Publish document
        /// </summary>
        /// <param name="publishDocument">Document publish request</param>
        /// <returns>Publish result</returns>
        ResponseDetails PublishDocument(PublishDocument publishDocument);

        /// <summary>
        /// Get documents repository list
        /// </summary>
        /// <param name="request">Document repository list request</param>
        /// <returns>Document repository list result</returns>
        Task<DocumentRepositoryListResponse> GetDocumentsRepositoryListAsync(DocumentRepositoryListRequest request);

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
    }
}
