using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Repository interface for report card data access operations
    /// </summary>
    public interface IReportCardRepository
    {
        /// <summary>
        /// Resolve login identifier to legacy MemberMaster.UserName for stored procedures.
        /// </summary>
        Task<string> ResolvePortalUsernameAsync(string? identifier);

        /// <summary>
        /// Get report card list
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Report card list data</returns>
        Task<object> GetReportCardListAsync(string username);

        /// <summary>
        /// Get score details by report card ID
        /// </summary>
        /// <param name="reportCardId">Report card ID</param>
        /// <returns>Score details data</returns>
        Task<object> GetScoreDetailsAsync(string reportCardId);

        /// <summary>
        /// Delete student score
        /// </summary>
        /// <param name="reportCardId">Report card ID</param>
        /// <returns>Delete result</returns>
        Task<object> DeleteStudentScoreAsync(string reportCardId);

        /// <summary>
        /// Add student score
        /// </summary>
        /// <param name="request">Add student score request</param>
        /// <returns>Add result</returns>
        Task<object> AddStudentScoreAsync(AddStudentScoreRequest request);

        /// <summary>
        /// Update student score
        /// </summary>
        /// <param name="request">Update student score request</param>
        /// <returns>Update result</returns>
        Task<object> UpdateStudentScoreAsync(UpdateStudentScoreRequest request);

        /// <summary>
        /// Get semester report
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="class">Class</param>
        /// <returns>Semester report data</returns>
        Task<object> GetSemesterReportAsync(string username, string @class);

        /// <summary>
        /// Get summary report
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="reportDate">Report date</param>
        /// <param name="class">Class</param>
        /// <returns>Summary report data</returns>
        Task<object> GetSummaryReportAsync(string username, string reportDate, string @class);

        /// <summary>
        /// Get class list by instructor
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Class list data</returns>
        Task<object> GetClassListByInstructorAsync(string username);

        /// <summary>
        /// Get student list for dropdown
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Student list data</returns>
        Task<object> GetStudentListAsync(string username);

        /// <summary>
        /// Get class list for dropdown
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Class list data</returns>
        Task<object> GetClassListAsync(string username);

        /// <summary>
        /// Get report date list
        /// </summary>
        /// <param name="username">Username</param>
        /// <returns>Report date list data</returns>
        Task<object> GetReportDateListAsync(string username);

        /// <summary>
        /// Get class schedule (exam dates)
        /// </summary>
        /// <param name="username">Username</param>
        /// <param name="type">Type (date)</param>
        /// <returns>Class schedule data</returns>
        Task<object> GetClassScheduleAsync(string username, string type);
    }
}
