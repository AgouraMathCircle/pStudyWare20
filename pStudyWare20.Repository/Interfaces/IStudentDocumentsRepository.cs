using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for student documents data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IStudentDocumentsRepository
    {
        /// <summary>
        /// Get student documents using stored procedure
        /// </summary>
        /// <param name="request">Get student documents request</param>
        /// <returns>Student documents data as JSON string</returns>
        Task<string> GetStudentDocumentsAsync(GetStudentDocumentsRequest request);

        /// <summary>
        /// Get current session using stored procedure
        /// </summary>
        /// <param name="request">Get current session request</param>
        /// <returns>Current session data as JSON string</returns>
        Task<string> GetCurrentSessionAsync(GetCurrentSessionRequest request);

        /// <summary>
        /// Delete document using stored procedure
        /// </summary>
        /// <param name="request">Delete document request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> DeleteDocumentAsync(DeleteDocumentRequest request);

        /// <summary>
        /// Add student document using stored procedure
        /// </summary>
        /// <param name="request">Upload document request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> AddStudentDocumentAsync(UploadDocumentRequest request);

        /// <summary>
        /// Update message center using stored procedure
        /// </summary>
        /// <param name="request">Update message center request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> UpdateMessageCenterAsync(UpdateMessageCenterRequest request);

        /// <summary>
        /// Get schedule lookup using stored procedure
        /// </summary>
        /// <param name="request">Get schedule lookup request</param>
        /// <returns>Schedule lookup data as JSON string</returns>
        Task<string> GetScheduleLookupAsync(GetScheduleLookupRequest request);
    }
}
