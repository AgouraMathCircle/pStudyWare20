using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for post message business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IPostMessageService
    {
        /// <summary>
        /// Get alert list
        /// </summary>
        /// <param name="request">Get alert list request</param>
        /// <returns>Alert list result</returns>
        PostMessageListResponse GetAlertList(GetAlertListRequest request);

        /// <summary>
        /// Insert or update post message
        /// </summary>
        /// <param name="request">Post message request</param>
        /// <returns>Post message operation result</returns>
        PostMessageOperationResponse InsertOrUpdatePostMessage(PostMessageRequest request);

        /// <summary>
        /// Delete post message
        /// </summary>
        /// <param name="request">Delete post message request</param>
        /// <returns>Post message operation result</returns>
        PostMessageOperationResponse DeletePostMessage(DeletePostMessageRequest request);
    }
}
