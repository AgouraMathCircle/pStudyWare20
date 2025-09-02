using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for student business logic operations (matches legacy controller endpoints)
    /// </summary>
    public interface IStudentService
    {
        /// <summary>
        /// Register a new student
        /// </summary>
        /// <param name="studentDetails">Student registration details</param>
        /// <returns>Registration result</returns>
        ResponseDetails StudentRegistration(RegistrationStudentModel studentDetails);

        /// <summary>
        /// Get students list
        /// </summary>
        /// <param name="studentlist">Student list request</param>
        /// <returns>Students list result</returns>
        ResponseDetails GetStudentsList(Studentlist studentlist);

        /// <summary>
        /// Get student report card
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Report card result</returns>
        ResponseDetails GetStudentsReportCard(UserName userName);

        /// <summary>
        /// Update student report card
        /// </summary>
        /// <param name="studentsReportCard">Report card update details</param>
        /// <returns>Update result</returns>
        ResponseDetails UpdateStudentsReportCard(StudentsReportCard studentsReportCard);

        /// <summary>
        /// Get meeting schedule
        /// </summary>
        /// <param name="userName">Username request</param>
        /// <returns>Meeting schedule result</returns>
        ResponseDetails GetMeetingSchedule(UserName userName);

        /// <summary>
        /// Get dashboard message
        /// </summary>
        /// <param name="chapterID">Chapter ID request</param>
        /// <returns>Dashboard message result</returns>
        ResponseDetails GetDashboardMessage(Chapter chapterID);

        /// <summary>
        /// Get student detail
        /// </summary>
        /// <param name="studentID">Student ID request</param>
        /// <returns>Student detail result</returns>
        StudentDetailResponse GetStudentDetail(StudentID studentID);

        /// <summary>
        /// Update student detail
        /// </summary>
        /// <param name="studentDetail">Student detail update</param>
        /// <returns>Update result</returns>
        ResponseDetails UpdateStudentDetail(StudentDetail studentDetail);

        /// <summary>
        /// Get report card with additional details
        /// </summary>
        /// <param name="studentlist">Student list dropdown request</param>
        /// <returns>Report card details result</returns>
        ResponseReportCardDetails GetReportcard(StudentlistDropdown studentlist);
    }
}
