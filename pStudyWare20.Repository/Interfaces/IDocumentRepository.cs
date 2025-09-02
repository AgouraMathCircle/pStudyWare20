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
    }
}
