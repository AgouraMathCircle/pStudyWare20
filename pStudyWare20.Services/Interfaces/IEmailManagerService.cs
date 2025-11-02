using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for Email Manager service
    /// </summary>
    public interface IEmailManagerService
    {
        /// <summary>
        /// Get messages for a user (inbox)
        /// </summary>
        /// <param name="request">Get messages request</param>
        /// <returns>Get messages response</returns>
        Task<GetMessagesResponse> GetMessagesAsync(GetMessagesRequest request);

        /// <summary>
        /// Get a specific message by ID
        /// </summary>
        /// <param name="request">Get message request</param>
        /// <returns>Get message response</returns>
        Task<GetMessageResponse> GetMessageAsync(GetMessageRequest request);

        /// <summary>
        /// Send a new message or reply to a message
        /// </summary>
        /// <param name="request">Send message request</param>
        /// <returns>Send message response</returns>
        Task<SendMessageResponse> SendMessageAsync(SendMessageRequest request);

        /// <summary>
        /// Update message status (mark as viewed, delete, etc.)
        /// </summary>
        /// <param name="request">Update message status request</param>
        /// <returns>Update message status response</returns>
        Task<UpdateMessageStatusResponse> UpdateMessageStatusAsync(UpdateMessageStatusRequest request);

        /// <summary>
        /// Get instructor email groups
        /// </summary>
        /// <param name="request">Get instructor email groups request</param>
        /// <returns>Get instructor email groups response</returns>
        Task<GetInstructorEmailGroupsResponse> GetInstructorEmailGroupsAsync(GetInstructorEmailGroupsRequest request);

        /// <summary>
        /// Get student list for email
        /// </summary>
        /// <param name="request">Get student list for email request</param>
        /// <returns>Get student list for email response</returns>
        Task<GetStudentListForEmailResponse> GetStudentListForEmailAsync(GetStudentListForEmailRequest request);

        /// <summary>
        /// Export messages to Excel
        /// </summary>
        /// <param name="request">Export messages request</param>
        /// <returns>Export messages response</returns>
        Task<ExportMessagesResponse> ExportMessagesToExcelAsync(ExportMessagesRequest request);
    }
}

