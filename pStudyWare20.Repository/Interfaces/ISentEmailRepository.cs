using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for sent email operations
    /// </summary>
    public interface ISentEmailRepository
    {
        /// <summary>
        /// Get sent messages for a user
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>DataTable with sent messages</returns>
        Task<DataTable> GetSentMessagesAsync(string username);

        /// <summary>
        /// Get specific message details by email ID
        /// </summary>
        /// <param name="emailId">Email ID</param>
        /// <returns>DataTable with message details</returns>
        Task<DataTable> GetMessageDetailsAsync(int emailId);
    }
}
