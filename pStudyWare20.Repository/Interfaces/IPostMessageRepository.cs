using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for post message data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IPostMessageRepository
    {
        /// <summary>
        /// Get alert list using stored procedure
        /// </summary>
        /// <param name="request">Get alert list request</param>
        /// <returns>Alert list data as JSON string</returns>
        Task<string> GetAlertListAsync(GetAlertListRequest request);

        /// <summary>
        /// Insert or update post message using stored procedure
        /// </summary>
        /// <param name="request">Post message request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> InsertOrUpdatePostMessageAsync(PostMessageRequest request);

        /// <summary>
        /// Delete post message using direct SQL
        /// </summary>
        /// <param name="request">Delete post message request</param>
        /// <returns>Operation result as JSON string</returns>
        Task<string> DeletePostMessageAsync(DeletePostMessageRequest request);
    }
}
