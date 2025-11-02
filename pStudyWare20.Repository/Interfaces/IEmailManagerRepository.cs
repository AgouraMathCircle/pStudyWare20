using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for Email Manager data access operations
    /// </summary>
    public interface IEmailManagerRepository
    {
        /// <summary>
        /// Get messages for a user (inbox) using AMC_spGetMessageCenter
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="mode">Mode (null for normal, 'C' for count)</param>
        /// <returns>DataTable with messages</returns>
        Task<DataTable> GetMessagesAsync(string username, string? mode = null);

        /// <summary>
        /// Get a specific message by ID using AMC_spGetMessageCenter_Message
        /// </summary>
        /// <param name="emailId">Email ID</param>
        /// <returns>DataSet with message details</returns>
        Task<DataSet> GetMessageByIdAsync(int emailId);

        /// <summary>
        /// Send a new message or reply using AMC_spAddEmailTracking
        /// </summary>
        /// <param name="sendTo">Send to email</param>
        /// <param name="sendFrom">Send from email</param>
        /// <param name="subject">Subject</param>
        /// <param name="message">Message body</param>
        /// <param name="sendBy">Send by email</param>
        /// <param name="id">Email ID (0 for new, existing ID for reply)</param>
        /// <param name="mode">Mode (N = New, R = Reply)</param>
        /// <param name="chapterId">Chapter ID</param>
        /// <returns>DataSet with result</returns>
        Task<DataSet> SendMessageAsync(string sendTo, string sendFrom, string subject, string message,
            string sendBy, int id, string mode, string chapterId);

        /// <summary>
        /// Update message status using AMC_spUpdateAddEmailTracking
        /// </summary>
        /// <param name="mode">Mode (T = Trash, V = Viewed)</param>
        /// <param name="trackingId">Tracking ID</param>
        /// <param name="sendTo">Send to email</param>
        /// <returns>DataSet with result</returns>
        Task<DataSet> UpdateMessageStatusAsync(string mode, string trackingId, string sendTo);

        /// <summary>
        /// Get instructor email groups using AMC_spSelectEmailGroupbyUserName
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>DataSet with email groups</returns>
        Task<DataSet> GetInstructorEmailGroupsAsync(string username);

        /// <summary>
        /// Get student list for email using AMC_spSelectStudentListbyUserName
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="mode">Mode (I for instructor email mode)</param>
        /// <returns>DataSet with student list</returns>
        Task<DataSet> GetStudentListForEmailAsync(string username, string mode);
    }
}

