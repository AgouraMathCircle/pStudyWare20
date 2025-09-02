using pStudyWare20.Shared;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for student data access operations (matches legacy controller endpoints)
    /// </summary>
    public interface IStudentRepository
    {
        /// <summary>
        /// Register a new student using stored procedure
        /// </summary>
        /// <param name="request">Student registration details</param>
        /// <returns>Success status</returns>
        Task<bool> RegisterStudentAsync(RegistrationStudentModel request);

        /// <summary>
        /// Get students list using stored procedure
        /// </summary>
        /// <param name="request">Student list request</param>
        /// <returns>Students data as JSON string</returns>
        Task<string> GetStudentsListAsync(Studentlist request);

        /// <summary>
        /// Get student report card using stored procedure
        /// </summary>
        /// <param name="request">Username request</param>
        /// <returns>Report card data as JSON string</returns>
        Task<string> GetStudentsReportCardAsync(UserName request);

        /// <summary>
        /// Update student report card using stored procedure
        /// </summary>
        /// <param name="request">Report card update details</param>
        /// <returns>Success status</returns>
        Task<bool> UpdateStudentsReportCardAsync(StudentsReportCard request);

        /// <summary>
        /// Get meeting schedule using stored procedure
        /// </summary>
        /// <param name="request">Username request</param>
        /// <returns>Meeting schedule data as JSON string</returns>
        Task<string> GetMeetingScheduleAsync(UserName request);

        /// <summary>
        /// Get dashboard message using stored procedure
        /// </summary>
        /// <param name="request">Chapter ID request</param>
        /// <returns>Dashboard message data as JSON string</returns>
        Task<string> GetDashboardMessageAsync(Chapter request);

        /// <summary>
        /// Get student detail using stored procedure
        /// </summary>
        /// <param name="request">Student ID request</param>
        /// <returns>Student detail data as JSON string</returns>
        Task<string> GetStudentDetailAsync(StudentID request);

        /// <summary>
        /// Update student detail using stored procedure
        /// </summary>
        /// <param name="request">Student detail update</param>
        /// <returns>Success status</returns>
        Task<bool> UpdateStudentDetailAsync(StudentDetail request);

        /// <summary>
        /// Get report card with additional details using stored procedure
        /// </summary>
        /// <param name="request">Student list dropdown request</param>
        /// <returns>Report card details as JSON string</returns>
        Task<string> GetReportcardAsync(StudentlistDropdown request);
    }
}
