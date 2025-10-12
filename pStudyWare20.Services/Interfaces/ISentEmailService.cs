using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for sent email business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface ISentEmailService
    {
        /// <summary>
        /// Get sent messages
        /// </summary>
        /// <param name="request">Get sent messages request</param>
        /// <returns>Sent messages list result</returns>
        SentMessagesListResponse GetSentMessages(GetSentMessagesRequest request);

        /// <summary>
        /// Get message
        /// </summary>
        /// <param name="request">Get message request</param>
        /// <returns>Message detail result</returns>
        MessageDetailResponse GetMessage(GetMessageRequest request);

        /// <summary>
        /// View email (combines sent messages and message details)
        /// </summary>
        /// <param name="request">View email request</param>
        /// <returns>View email result</returns>
        ViewEmailResponse ViewEmail(ViewEmailRequest request);
    }
}
