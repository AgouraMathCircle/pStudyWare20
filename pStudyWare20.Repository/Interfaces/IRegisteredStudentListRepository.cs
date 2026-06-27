using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for registered student list data access operations
    /// </summary>
    public interface IRegisteredStudentListRepository
    {
        /// <summary>
        /// Get registered student list
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="mode">Mode parameter</param>
        /// <returns>Student list data</returns>
        Task<object> GetRegisteredStudentListAsync(string username, string mode);

        /// <summary>
        /// Update student class information
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <param name="class">Class</param>
        /// <param name="section">Section</param>
        /// <param name="chapterId">Chapter ID</param>
        /// <param name="location">Location</param>
        /// <param name="session">Session</param>
        /// <returns>Update result</returns>
        Task<object> UpdateStudentClassAsync(string studentId, string @class, string section, string chapterId, string location, string session);

        /// <summary>
        /// Delete student registration
        /// </summary>
        /// <param name="studentId">Student ID</param>
        /// <returns>Delete result</returns>
        Task<object> DeleteStudentAsync(string studentId);

        /// <summary>
        /// Get chapter locations
        /// </summary>
        /// <param name="activeOnly">Active only flag (Y/N)</param>
        /// <returns>Chapter locations data</returns>
        Task<object> GetChapterLocationsAsync(string activeOnly);

        /// <summary>
        /// Get student list for Excel export
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="mode">Mode parameter</param>
        /// <returns>Student list data for export</returns>
        Task<object> GetStudentListForExportAsync(string username, string mode);

        /// <summary>
        /// Get active semester session codes for update-class dialog.
        /// </summary>
        Task<List<RegisteredStudentSessionOption>> GetActiveSessionOptionsAsync();
    }
}
