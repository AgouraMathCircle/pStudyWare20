using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for sent email data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface ISentEmailRepository
    {
        /// <summary>
        /// Get sent messages using stored procedure
        /// </summary>
        /// <param name="request">Get sent messages request</param>
        /// <returns>Sent messages data as JSON string</returns>
        Task<string> GetSentMessagesAsync(GetSentMessagesRequest request);

        /// <summary>
        /// Get message using stored procedure
        /// </summary>
        /// <param name="request">Get message request</param>
        /// <returns>Message data as JSON string</returns>
        Task<string> GetMessageAsync(GetMessageRequest request);
    }
}
