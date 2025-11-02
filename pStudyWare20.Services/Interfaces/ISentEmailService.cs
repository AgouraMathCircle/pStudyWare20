using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Service interface for sent email business logic
    /// </summary>
    public interface ISentEmailService
    {
        /// <summary>
        /// Get sent messages for a user
        /// </summary>
        /// <param name="request">Get sent messages request</param>
        /// <returns>Sent messages response</returns>
        Task<GetSentMessagesResponse> GetSentMessagesAsync(GetSentMessagesRequest request);

        /// <summary>
        /// Get specific message details
        /// </summary>
        /// <param name="request">Get message details request</param>
        /// <returns>Message details response</returns>
        Task<GetMessageDetailsResponse> GetMessageDetailsAsync(GetMessageDetailsRequest request);
    }
}
