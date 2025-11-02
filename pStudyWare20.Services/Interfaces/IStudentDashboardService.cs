using pStudyWare20.Shared;

namespace pStudyWare20.Services.Interfaces
{
    /// <summary>
    /// Interface for Student Dashboard service operations
    /// </summary>
    public interface IStudentDashboardService
    {
        /// <summary>
        /// Gets student profile information
        /// </summary>
        /// <param name="request">Request containing username and chapter ID</param>
        /// <returns>Student profile response</returns>
        Task<GetStudentProfileResponse> GetStudentProfileAsync(GetStudentProfileRequest request);

        /// <summary>
        /// Gets student profile information by StudentID
        /// </summary>
        /// <param name="studentID">Student ID</param>
        /// <returns>Student profile response</returns>
        Task<GetStudentProfileResponse> GetStudentProfileByIdAsync(int studentID);

        /// <summary>
        /// Gets multiple student profiles for a given username and chapter
        /// </summary>
        /// <param name="request">Request containing username and chapter ID</param>
        /// <returns>Multiple student profiles response</returns>
        Task<GetStudentProfilesResponse> GetStudentProfilesAsync(GetStudentProfilesRequest request);

        /// <summary>
        /// Gets student report card/grades
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Report card response</returns>
        Task<GetReportCardResponse> GetReportCardAsync(GetReportCardRequest request);

        /// <summary>
        /// Gets registration status for student
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Registration status response</returns>
        Task<GetRegistrationStatusResponse> GetRegistrationStatusAsync(GetRegistrationStatusRequest request);

        /// <summary>
        /// Submits student registration
        /// </summary>
        /// <param name="request">Request containing student ID and username</param>
        /// <returns>Registration submission response</returns>
        Task<SubmitRegistrationResponse> SubmitRegistrationAsync(SubmitRegistrationRequest request);

        /// <summary>
        /// Gets registration information for email notifications
        /// </summary>
        /// <param name="request">Request containing student ID</param>
        /// <returns>Registration info response</returns>
        Task<GetRegistrationInfoResponse> GetRegistrationInfoAsync(GetRegistrationInfoRequest request);

        /// <summary>
        /// Gets complete dashboard data for student
        /// </summary>
        /// <param name="request">Request containing username and chapter ID</param>
        /// <returns>Complete dashboard data response</returns>
        Task<GetDashboardMessageResponse> GetDashboardMessageAsync(GetDashboardMessageRequest request);

        /// <summary>
        /// Checks if student is eligible for registration
        /// </summary>
        /// <param name="request">Request containing username</param>
        /// <returns>Registration eligibility response</returns>
        Task<CheckRegistrationEligibilityResponse> CheckRegistrationEligibilityAsync(CheckRegistrationEligibilityRequest request);
    }
}