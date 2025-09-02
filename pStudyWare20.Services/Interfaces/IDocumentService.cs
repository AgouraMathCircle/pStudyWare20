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
    }
}
