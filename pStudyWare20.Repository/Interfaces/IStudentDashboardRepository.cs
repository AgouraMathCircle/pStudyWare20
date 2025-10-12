using pStudyWare20.Shared;
using System.Data;

namespace pStudyWare20.Repository.Interfaces
{
    /// <summary>
    /// Interface for Student Dashboard repository operations
    /// </summary>
    public interface IStudentDashboardRepository
    {
        /// <summary>
        /// Gets dashboard messages for student (Important Notice, Announcement, Competitions, Todo List)
        /// </summary>
        /// <param name="username">Student username</param>
        /// <param name="chapterID">Chapter ID (not used in stored procedure but kept for interface consistency)</param>
        /// <returns>DataTable containing dashboard messages</returns>
        Task<DataTable> GetDashboardMessageAsync(string username, int chapterID);
        /// <summary>
        /// Gets student profile information
        /// </summary>
        /// <param name="username">Student username</param>
        /// <param name="chapterID">Chapter ID</param>
        /// <returns>DataTable containing student profile information</returns>
        Task<DataTable> GetStudentProfileAsync(string username, int chapterID);

        /// <summary>
        /// Gets student profile information by StudentID
        /// </summary>
        /// <param name="studentID">Student ID</param>
        /// <returns>DataTable containing student profile information</returns>
        Task<DataTable> GetStudentProfileByIdAsync(int studentID);

        /// <summary>
        /// Gets student report card/grades
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>DataTable containing report card entries</returns>
        Task<DataTable> GetReportCardAsync(string username);

        /// <summary>
        /// Gets registration status for student
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>DataSet containing registration status information</returns>
        Task<DataSet> GetRegistrationStatusAsync(string username);

        /// <summary>
        /// Submits student registration
        /// </summary>
        /// <param name="studentID">Student ID to register</param>
        /// <returns>True if registration was successful</returns>
        Task<bool> SubmitRegistrationAsync(int studentID);

        /// <summary>
        /// Gets registration information for email notifications
        /// </summary>
        /// <param name="studentID">Student ID</param>
        /// <returns>DataSet containing registration information</returns>
        Task<DataSet> GetRegistrationInfoAsync(int studentID);

        /// <summary>
        /// Checks if student is eligible for registration
        /// </summary>
        /// <param name="username">Student username</param>
        /// <returns>DataSet containing eligibility information</returns>
        Task<DataSet> CheckRegistrationEligibilityAsync(string username);

    }
}