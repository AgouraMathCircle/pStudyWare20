using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for special events registration data access operations
    /// </summary>
    public interface ISpecialEventsRegistrationRepository
    {
        /// <summary>
        /// Get special events registration list
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Special events registration list data</returns>
        Task<object> GetSpecialEventsRegistrationListAsync(string username);

        /// <summary>
        /// Delete special events registration application
        /// </summary>
        /// <param name="requestId">Request ID</param>
        /// <returns>Delete result</returns>
        Task<object> DeleteSpecialEventsRegistrationAsync(string requestId);

        /// <summary>
        /// Get special events registration list for Excel export
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Special events registration list data for export</returns>
        Task<object> GetSpecialEventsRegistrationListForExportAsync(string username);
    }
}
